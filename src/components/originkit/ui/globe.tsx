"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    MeshBasicMaterial,
    Color,
    Mesh,
    Group,
    InstancedMesh,
    Matrix4,
    Vector3,
    TubeGeometry,
    CatmullRomCurve3,
    CanvasTexture,
    BufferGeometry,
    BufferAttribute,
    type Material,
} from "three";
import { geoEquirectangular, geoPath } from "d3-geo";

/* ------------------------------------------------------------------ *
 * Land data loading (cached once per page session)
 * ------------------------------------------------------------------ */

// Drop a copy of ne_50m_land.json into your public folder as
// /public/geo/ne_50m_land.json for the fastest first paint.
// If it isn't there we transparently fall back to the GitHub copy.
const LOCAL_LAND_URL = "/geo/ne_50m_land.json";
const REMOTE_LAND_URL =
    "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json";

let landDataPromise: Promise<any> | null = null;

function loadLandData(): Promise<any> {
    if (landDataPromise) return landDataPromise;

    landDataPromise = (async () => {
        try {
            const local = await fetch(LOCAL_LAND_URL);
            if (local.ok) {
                const json = await local.json();
                if (json && Array.isArray(json.features)) return json;
            }
        } catch {
            /* fall through to the remote copy */
        }
        const remote = await fetch(REMOTE_LAND_URL);
        if (!remote.ok) throw new Error("Failed to load land data");
        return remote.json();
    })();

    // Don't poison the cache permanently on a transient network failure.
    landDataPromise.catch(() => {
        landDataPromise = null;
    });

    return landDataPromise;
}

// Kick the download off the moment this module is imported, instead of
// waiting for the component to mount and run its effect.
if (typeof window !== "undefined") {
    const prefetch = () => {
        loadLandData().catch(() => {});
    };
    if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(prefetch, { timeout: 1500 });
    } else {
        setTimeout(prefetch, 0);
    }
}

/* ------------------------------------------------------------------ *
 * Build caches - the expensive geometry is computed once per page load
 * ------------------------------------------------------------------ */

export type BuiltGlobe = {
    outlinePositions: Float32Array | null;
    outlineIndex: Uint16Array | Uint32Array | null;
    dotPositions: Float32Array | null;
};

// Land mask: only the red channel is kept (2 MB instead of 8 MB).
let landMaskCache: Uint8Array | null = null;
const builtCache = new Map<string, BuiltGlobe>();

/* ------------------------------------------------------------------ *
 * Persistent build cache (IndexedDB)
 * ------------------------------------------------------------------ *
 * The finished vertex buffers are stored on disk, so after the very first
 * visit the globe skips the download, the d3 projection, the tube
 * generation and the raster entirely - it just uploads buffers and draws.
 */

const IDB_NAME = "globe-build-cache";
const IDB_STORE = "builds";

function openIdb(): Promise<IDBDatabase | null> {
    return new Promise((resolve) => {
        if (typeof indexedDB === "undefined") return resolve(null);
        try {
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) {
                    db.createObjectStore(IDB_STORE);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
}

async function idbGetBuild(key: string): Promise<BuiltGlobe | null> {
    const db = await openIdb();
    if (!db) return null;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(IDB_STORE, "readonly");
            const req = tx.objectStore(IDB_STORE).get(key);
            req.onsuccess = () => resolve((req.result as BuiltGlobe) ?? null);
            req.onerror = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
}

async function idbPutBuild(key: string, value: BuiltGlobe): Promise<void> {
    const db = await openIdb();
    if (!db) return;
    try {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(value, key);
    } catch {
        /* quota or private mode - the in-memory cache still applies */
    }
}

/* ------------------------------------------------------------------ *
 * Yielding to the main thread WITHOUT setTimeout's 4ms clamp
 * ------------------------------------------------------------------ */

// setTimeout(fn, 0) is clamped to ~4ms by every browser, and nested timeouts
// are clamped harder. Yielding every 8ms of work therefore spent roughly a
// third of the total build just waiting. MessageChannel has no clamp.
let yieldChannel: MessageChannel | null = null;
const yieldQueue: Array<() => void> = [];

function yieldToMain(): Promise<void> {
    return new Promise<void>((resolve) => {
        if (typeof MessageChannel === "undefined") {
            setTimeout(resolve, 0);
            return;
        }
        if (!yieldChannel) {
            yieldChannel = new MessageChannel();
            yieldChannel.port1.onmessage = () => {
                const cb = yieldQueue.shift();
                if (cb) cb();
            };
            yieldChannel.port1.start();
        }
        yieldQueue.push(resolve);
        yieldChannel.port2.postMessage(null);
    });
}

/* ------------------------------------------------------------------ *
 * Geometry merging - draw call reduction, pixel identical output
 * ------------------------------------------------------------------ */

function mergeGeometries(geoms: BufferGeometry[]): BufferGeometry | null {
    if (geoms.length === 0) return null;

    let vertexCount = 0;
    let indexCount = 0;
    for (const g of geoms) {
        vertexCount += g.attributes.position.count;
        indexCount += g.index ? g.index.count : g.attributes.position.count;
    }

    // MeshBasicMaterial with no map/envMap reads neither normals nor UVs, so
    // we drop them. That is 5 of every 8 floats never allocated, never merged
    // and never uploaded to the GPU.
    const positions = new Float32Array(vertexCount * 3);
    const indices =
        vertexCount > 65535
            ? new Uint32Array(indexCount)
            : new Uint16Array(indexCount);

    let vOff = 0;
    let iOff = 0;
    for (const g of geoms) {
        const pos = g.attributes.position;

        positions.set(pos.array as unknown as ArrayLike<number>, vOff * 3);

        if (g.index) {
            const src = g.index.array;
            for (let i = 0; i < src.length; i++) indices[iOff + i] = src[i] + vOff;
            iOff += src.length;
        } else {
            const c = pos.count;
            for (let i = 0; i < c; i++) indices[iOff + i] = i + vOff;
            iOff += c;
        }

        vOff += pos.count;
        g.dispose();
    }

    const merged = new BufferGeometry();
    merged.setAttribute("position", new BufferAttribute(positions, 3));
    merged.setIndex(new BufferAttribute(indices, 1));
    return merged;
}

/* ------------------------------------------------------------------ *
 * Colour + mapping helpers (unchanged from the original)
 * ------------------------------------------------------------------ */

type Rgba = { r: number; g: number; b: number; a: number };

function parseColorToRgba(input: string): Rgba {
    if (!input || input.trim() === "") return { r: 0, g: 0, b: 0, a: 0 };
    const str = input.trim();
    const rgbaMatch = str.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i
    );
    if (rgbaMatch) {
        const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
        const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
        const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
        const a =
            rgbaMatch[4] !== undefined
                ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4])))
                : 1;
        return { r, g, b, a };
    }
    const hex = str.replace(/^#/, "");
    if (hex.length === 8) {
        return {
            r: parseInt(hex.slice(0, 2), 16) / 255,
            g: parseInt(hex.slice(2, 4), 16) / 255,
            b: parseInt(hex.slice(4, 6), 16) / 255,
            a: parseInt(hex.slice(6, 8), 16) / 255,
        };
    }
    if (hex.length === 6) {
        return {
            r: parseInt(hex.slice(0, 2), 16) / 255,
            g: parseInt(hex.slice(2, 4), 16) / 255,
            b: parseInt(hex.slice(4, 6), 16) / 255,
            a: 1,
        };
    }
    if (hex.length === 4) {
        return {
            r: parseInt(hex[0] + hex[0], 16) / 255,
            g: parseInt(hex[1] + hex[1], 16) / 255,
            b: parseInt(hex[2] + hex[2], 16) / 255,
            a: parseInt(hex[3] + hex[3], 16) / 255,
        };
    }
    if (hex.length === 3) {
        return {
            r: parseInt(hex[0] + hex[0], 16) / 255,
            g: parseInt(hex[1] + hex[1], 16) / 255,
            b: parseInt(hex[2] + hex[2], 16) / 255,
            a: 1,
        };
    }
    return { r: 0, g: 0, b: 0, a: 1 };
}

function mapLinear(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    if (inMax === inMin) return outMin;
    const t = (value - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
}

function mapSpeedUiToInternal(ui: number): number {
    if (ui === 0) return 0;
    const clamped = Math.max(0, Math.min(10, ui));
    return mapLinear(clamped, 0, 10, 0, 0.9);
}
function mapDensityUiToSpacing(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 24, 8);
}
function mapScaleUiToMultiplier(ui: number): number {
    const clamped = Math.max(1, Math.min(20, ui));
    return mapLinear(clamped, 1, 20, 0.2, 2);
}
function mapDotSizeUiToMultiplier(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 0.1, 0.5);
}
function mapMarkerDotSizeUiToMultiplier(ui: number): number {
    const clamped = Math.max(0, Math.min(100, ui));
    return mapLinear(clamped, 0, 100, 0.1, 2.5);
}
function normalizeSmoothing(ui: number): number {
    return Math.max(0, Math.min(1, ui / 10));
}
function mapDragSpeedUiToSensitivity(ui: number): number {
    return mapLinear(Math.max(0, Math.min(10, ui)), 0, 10, 0.001, 0.02);
}
function mapDetailToStepSize(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 10, 1);
}

function simplifyRing(ring: number[][], detail: number): number[][] {
    if (ring.length < 2) return ring;
    if (detail >= 10) return ring;
    const stepSize = Math.max(1, Math.floor(mapDetailToStepSize(detail)));
    const simplified: number[][] = [];
    simplified.push(ring[0]);
    for (let i = stepSize; i < ring.length - 1; i += stepSize) {
        const idx = Math.min(i, ring.length - 1);
        simplified.push(ring[idx]);
    }
    const lastPoint = ring[ring.length - 1];
    const firstPoint = ring[0];
    const isClosed =
        Math.abs(lastPoint[0] - firstPoint[0]) < 1e-4 &&
        Math.abs(lastPoint[1] - firstPoint[1]) < 1e-4;
    if (!isClosed) {
        simplified.push(lastPoint);
    }
    return simplified.length >= 2 ? simplified : ring;
}

function latLngToPosition(
    lat: number,
    lng: number
): { x: number; y: number; z: number } {
    const latRad = lat * (Math.PI / 180);
    const lngRad = lng * (Math.PI / 180);
    const x = Math.cos(latRad) * Math.sin(lngRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.cos(lngRad);
    return { x, y, z };
}

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

interface Marker {
    lat: number;
    lng: number;
}
interface MarkerConfig {
    markers: Marker[];
    color: string;
    size: number;
}
interface DotsConfig {
    color: string;
    size: number;
    density: number;
    allDots: boolean;
}
/** A ring of dots orbiting OUTSIDE the globe, in the plane of the screen. */
interface OrbitRingConfig {
    /** Off by default so existing usages are unaffected. */
    enabled?: boolean;
    /** How many dots go around the ring. */
    count?: number;
    color?: string;
    /** Dot size, 1-10. */
    size?: number;
    /** Ring radius as a multiple of the globe radius. 1 = touching the globe. */
    radius?: number;
    /** Orbit speed, 0-10. 0 freezes the ring. */
    speed?: number;
    direction?: "left" | "right";
}

interface GlobeProps {
    speed?: number;
    smoothing?: number;
    dots?: DotsConfig;
    fill?: "dots" | "solid";
    fillColor?: string;
    scale?: number;
    stopOnHover?: boolean;
    markerConfig?: MarkerConfig;
    direction?: "left" | "right";
    initialLatitude?: number;
    initialLongitude?: number;
    oceanColor?: string;
    outlineColor?: string;
    showOutline?: boolean;
    graticuleColor?: string;
    showGrid?: boolean;
    outlineWidth?: number;
    dragSpeed?: number;
    detail?: number;
    /** When true the sphere + grid appear first and the coastlines/dots fade
     *  in afterwards. Default false: nothing is shown until the globe is
     *  fully built, so it never appears half-finished. */
    revealImmediately?: boolean;
    /** Logs a per-phase timing breakdown to the console. */
    debug?: boolean;
    /** Animated ring of dots around the outside of the globe. */
    orbitRing?: OrbitRingConfig;
    style?: CSSProperties;
}

export default function Globe({
    speed = 2,
    smoothing = 8,
    dots = { color: "#ffffff", size: 5, density: 8, allDots: false },
    fill = "dots",
    fillColor = "#ffffff",
    scale = 8,
    stopOnHover = true,
    markerConfig = { markers: [], color: "#00f7ff", size: 40 },
    direction = "left",
    initialLatitude = 23,
    initialLongitude = -23,
    oceanColor = "#000000",
    outlineColor = "#ffffff",
    showOutline = true,
    graticuleColor = "#D4D4D4",
    showGrid = true,
    outlineWidth = 1,
    dragSpeed = 5,
    detail = 5,
    revealImmediately = false,
    debug = false,
    orbitRing,
    style,
}: GlobeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    const dotColor = dots.color;
    const dotSize = dots.size;
    const density = dots.density;
    const allDots = dots.allDots;
    const gridWidth = 1;
    const smoothingN = normalizeSmoothing(smoothing);

    const baseRotationSpeed = mapSpeedUiToInternal(speed);
    const rotationSpeed =
        direction === "left" ? -baseRotationSpeed : baseRotationSpeed;
    const dotSpacing = mapDensityUiToSpacing(density);
    const dotSizeMultiplier = mapDotSizeUiToMultiplier(dotSize);
    const markerRadiusMultiplier = mapMarkerDotSizeUiToMultiplier(
        markerConfig.size
    );
    const scaleMultiplier = mapScaleUiToMultiplier(scale);

    // Marker config is flattened to primitives so an inline object literal in
    // the parent can never re-trigger the (very expensive) build effect.
    // Flattened to primitives so an inline orbitRing={{...}} in the parent
    // cannot retrigger the build effect.
    const ringEnabled = orbitRing?.enabled ?? false;
    const ringCount = orbitRing?.count ?? 60;
    const ringColor = orbitRing?.color ?? "#3B82F6";
    const ringSizeUi = orbitRing?.size ?? 5;
    const ringRadiusFactor = orbitRing?.radius ?? 1.13;
    const ringSpeedUi = orbitRing?.speed ?? 3;
    const ringDirection = orbitRing?.direction ?? "right";

    const markerColor = markerConfig.color;
    const markersKey = useMemo(
        () => JSON.stringify(markerConfig.markers ?? []),
        [markerConfig.markers]
    );

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Guards React 18 StrictMode double-invoke and fast unmounts.
        let cancelled = false;

        const containerWidth =
            container.clientWidth || container.offsetWidth || 800;
        const containerHeight =
            container.clientHeight || container.offsetHeight || 600;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
            50,
            containerWidth / containerHeight,
            0.1,
            1e3
        );
        const baseRadius = 1;
        const globeRadius = baseRadius * scaleMultiplier;
        const cameraDistance = 2.5 / scaleMultiplier;
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = "srgb";
        const canvas = renderer.domElement;
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.style.opacity = "0";
        canvas.style.visibility = "hidden";
        canvas.style.transition = "opacity 350ms ease";
        container.appendChild(canvas);

        // Everything we create is tracked so it can actually be freed later.
        const disposables: { dispose: () => void }[] = [];
        const track = <T extends { dispose: () => void }>(o: T): T => {
            disposables.push(o);
            return o;
        };

        const resolvedOceanColor = oceanColor;
        const resolvedOutlineColor = outlineColor;
        const resolvedDotColor = dotColor;
        const resolvedMarkerColor = markerColor;
        const resolvedGraticuleColor = graticuleColor;
        const resolvedFillColor = fillColor;
        const oceanRgba = parseColorToRgba(resolvedOceanColor);
        const outlineRgba = parseColorToRgba(resolvedOutlineColor);
        const dotRgba = parseColorToRgba(resolvedDotColor);
        const graticuleRgba = parseColorToRgba(resolvedGraticuleColor);
        const fillRgba = parseColorToRgba(resolvedFillColor);

        /* ---------- rotation state ---------- */
        const initialLongitudeRad = (initialLongitude * Math.PI) / 180;
        const initialLatitudeRad = (initialLatitude * Math.PI) / 180;
        const rotation = { x: initialLongitudeRad, y: initialLatitudeRad };
        const targetRotation = { x: initialLongitudeRad, y: initialLatitudeRad };
        const velocity = { x: 0, y: 0 };
        let isDragging = false;
        let isHovering = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let animationFrameId: number | null = null;

        // Paused whenever the globe scrolls out of view or the tab is hidden.
        // This is what stops it stealing frames from the rest of the site.
        let inView = true;
        let tabVisible = !document.hidden;

        const lerpFactor =
            smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);
        const velocityDecay = mapLinear(smoothingN, 0, 1, 0.7, 0.96);

        const globeGroup = new Group();
        globeGroup.rotation.y = initialLongitudeRad;
        globeGroup.rotation.x = initialLatitudeRad;
        scene.add(globeGroup);

        /* ---------- ocean sphere ---------- */
        const oceanGeometry = track(new SphereGeometry(globeRadius, 64, 64));
        const oceanColorObj = resolvedOceanColor
            ? new Color(resolvedOceanColor)
            : new Color(0, 0, 0);
        const oceanMaterial = track(
            new MeshBasicMaterial({
                color: oceanColorObj,
                transparent: oceanRgba.a < 1 || oceanRgba.a === 0,
                opacity: oceanRgba.a,
            })
        );
        const oceanMesh = new Mesh(oceanGeometry, oceanMaterial);
        globeGroup.add(oceanMesh);

        /* ---------- graticule: built exactly as before, merged into ONE mesh ---------- */
        if (showGrid && resolvedGraticuleColor && graticuleRgba.a > 0) {
            const graticuleColorObj = new Color(resolvedGraticuleColor);
            const graticuleMaterial = track(
                new MeshBasicMaterial({
                    color: graticuleColorObj,
                    transparent: graticuleRgba.a < 1 || graticuleRgba.a === 0,
                    opacity: graticuleRgba.a,
                })
            );
            const gridSpacing = 15;
            const tubeRadius = (gridWidth / 10) * 0.01;
            const gratGeoms: BufferGeometry[] = [];

            const buildLine = (points: Vector3[]) => {
                if (points.length < 2) return;
                const curve = new CatmullRomCurve3(points);
                gratGeoms.push(
                    new TubeGeometry(curve, points.length * 2, tubeRadius, 8, false)
                );
            };

            for (let lat = -90; lat <= 90; lat += gridSpacing) {
                const points: Vector3[] = [];
                const segments = 64;
                for (let i = 0; i <= segments; i++) {
                    const lng = (i / segments) * 360 - 180;
                    const pos = latLngToPosition(lat, lng);
                    points.push(
                        new Vector3(
                            pos.x * globeRadius,
                            pos.y * globeRadius,
                            pos.z * globeRadius
                        )
                    );
                }
                buildLine(points);
            }
            for (let lng = -180; lng < 180; lng += gridSpacing) {
                const points: Vector3[] = [];
                const segments = 64;
                for (let i = 0; i <= segments; i++) {
                    const lat = (i / segments) * 180 - 90;
                    const pos = latLngToPosition(lat, lng);
                    points.push(
                        new Vector3(
                            pos.x * globeRadius,
                            pos.y * globeRadius,
                            pos.z * globeRadius
                        )
                    );
                }
                buildLine(points);
            }

            const mergedGrat = mergeGeometries(gratGeoms);
            if (mergedGrat) {
                track(mergedGrat);
                const gratMesh = new Mesh(mergedGrat, graticuleMaterial);
                gratMesh.renderOrder = 0;
                globeGroup.add(gratMesh);
            }
        }

        /* ---------- orbiting dot ring (outside the globe) ----------
         * Lives in the z = 0 plane and spins about the screen normal, so the
         * dots trace a true circle around the globe's silhouette and always
         * face the camera. It sits in its own group attached to the scene, not
         * to globeGroup, so dragging the globe never moves the ring. */
        let ringGroup: Group | null = null;
        const ringRgba = parseColorToRgba(ringColor);
        const ringSpin =
            ringSpeedUi === 0
                ? 0
                : mapLinear(Math.max(0, Math.min(10, ringSpeedUi)), 0, 10, 0, 0.012) *
                  (ringDirection === "left" ? -1 : 1);

        if (ringEnabled && ringCount > 0 && ringRgba.a > 0) {
            const ringDotRadius = 0.0025 * Math.max(1, Math.min(10, ringSizeUi));
            const ringGeometry = track(new SphereGeometry(ringDotRadius, 6, 6));
            const ringMaterial = track(
                new MeshBasicMaterial({
                    color: new Color(ringColor),
                    transparent: ringRgba.a < 1,
                    opacity: ringRgba.a,
                })
            );
            const ringInstances = new InstancedMesh(
                ringGeometry,
                ringMaterial,
                ringCount
            );
            const ringMatrix = new Matrix4();
            const orbitRadius = globeRadius * ringRadiusFactor;
            for (let i = 0; i < ringCount; i++) {
                const angle = (i / ringCount) * Math.PI * 2;
                ringMatrix.makeScale(1, 1, 1);
                ringMatrix.setPosition(
                    Math.cos(angle) * orbitRadius,
                    Math.sin(angle) * orbitRadius,
                    0
                );
                ringInstances.setMatrixAt(i, ringMatrix);
            }
            ringInstances.instanceMatrix.needsUpdate = true;
            ringGroup = new Group();
            ringGroup.add(ringInstances);
            scene.add(ringGroup);
        }

        /* ---------- first paint: sphere + grid go up immediately ---------- */
        const reveal = () => {
            if (cancelled) return;
            canvas.style.visibility = "visible";
            canvas.style.opacity = "1";
        };
        renderer.render(scene, camera);
        if (revealImmediately) reveal();

        /* ---------- markers ---------- */
        let markerMeshes: Mesh[] = [];
        const updateMarkers = () => {
            markerMeshes.forEach((mesh) => globeGroup.remove(mesh));
            markerMeshes = [];
            const markers: Marker[] = JSON.parse(markersKey);
            if (markers.length === 0) return;

            const markerSize = 0.01 * markerRadiusMultiplier;
            const markerGeometry = track(new SphereGeometry(markerSize, 16, 16));
            const markerColorObj = resolvedMarkerColor
                ? new Color(resolvedMarkerColor)
                : new Color(1, 1, 1);
            const markerMaterial = track(
                new MeshBasicMaterial({ color: markerColorObj })
            );
            markers.forEach((marker) => {
                if (
                    !marker ||
                    typeof marker.lat !== "number" ||
                    typeof marker.lng !== "number"
                )
                    return;
                const pos = latLngToPosition(marker.lat, marker.lng);
                const markerMesh = new Mesh(markerGeometry, markerMaterial);
                markerMesh.position.set(
                    pos.x * globeRadius,
                    pos.y * globeRadius,
                    pos.z * globeRadius
                );
                globeGroup.add(markerMesh);
                markerMeshes.push(markerMesh);
            });
        };

        /* ---------- heavy build, time sliced so the page stays responsive ---------- */
        const FRAME_BUDGET_MS = 12;
        let sliceStart = performance.now();
        const breathe = async () => {
            if (performance.now() - sliceStart < FRAME_BUDGET_MS) return;
            await yieldToMain();
            sliceStart = performance.now();
        };
        const mark = (label: string, from: number) => {
            if (debug) {
                // eslint-disable-next-line no-console
                console.log(
                    `[Globe] ${label}: ${(performance.now() - from).toFixed(0)}ms`
                );
            }
        };

        const buildKey =
            `v2|${detail}|${outlineWidth}|${globeRadius}|` +
            `${dotSpacing}|${allDots}|${showOutline}`;

        /* Turn finished vertex buffers into scene objects. Cheap: the typed
         * arrays are wrapped, not copied. */
        const applyBuilt = (built: BuiltGlobe) => {
            if (
                built.outlinePositions &&
                built.outlineIndex &&
                showOutline &&
                outlineColor &&
                outlineRgba.a > 0
            ) {
                const outlineMaterial = track(
                    new MeshBasicMaterial({
                        color: new Color(resolvedOutlineColor),
                        transparent: outlineRgba.a < 1,
                        opacity: outlineRgba.a,
                        depthTest: true,
                        depthWrite: true,
                    })
                );
                const geom = track(new BufferGeometry());
                geom.setAttribute(
                    "position",
                    new BufferAttribute(built.outlinePositions, 3)
                );
                geom.setIndex(new BufferAttribute(built.outlineIndex, 1));
                const outlineMesh = new Mesh(geom, outlineMaterial);
                outlineMesh.renderOrder = 0;
                globeGroup.add(outlineMesh);
            }

            if (built.dotPositions && built.dotPositions.length > 0) {
                const dotGeometry = track(
                    new SphereGeometry(0.01 * dotSizeMultiplier, 4, 4)
                );
                const dotMaterial = track(
                    new MeshBasicMaterial({
                        color: resolvedDotColor
                            ? new Color(resolvedDotColor)
                            : new Color(0.6, 0.6, 0.6),
                        transparent: dotRgba.a < 1 || dotRgba.a === 0,
                        opacity: dotRgba.a,
                    })
                );
                const dotCount = built.dotPositions.length / 3;
                const instanced = new InstancedMesh(
                    dotGeometry,
                    dotMaterial,
                    dotCount
                );
                const matrix = new Matrix4();
                for (let i = 0; i < dotCount; i++) {
                    matrix.makeScale(1, 1, 1);
                    matrix.setPosition(
                        built.dotPositions[i * 3],
                        built.dotPositions[i * 3 + 1],
                        built.dotPositions[i * 3 + 2]
                    );
                    instanced.setMatrixAt(i, matrix);
                }
                instanced.instanceMatrix.needsUpdate = true;
                globeGroup.add(instanced);
            }

            updateMarkers();
            renderer.render(scene, camera);
            reveal();
        };

        /* Full build from the raw GeoJSON. Only ever runs on a cache miss. */
        const buildFromGeoJson = async (): Promise<BuiltGlobe | null> => {
            const tFetch = performance.now();
            const landFeatures = await loadLandData();
            if (cancelled) return null;
            mark("land data", tFetch);

            /* ----- coastlines, merged into ONE geometry ----- */
            let outlinePositions: Float32Array | null = null;
            let outlineIndex: Uint16Array | Uint32Array | null = null;

            if (showOutline && outlineColor && outlineRgba.a > 0) {
                const tOutline = performance.now();
                const tubeRadius = (outlineWidth / 10) * 0.01;
                const outlineGeoms: BufferGeometry[] = [];

                const processRing = (ring: number[][]) => {
                    if (ring.length < 2) return;
                    const simplifiedRing = simplifyRing(ring, detail);
                    const points: Vector3[] = [];
                    for (const coord of simplifiedRing) {
                        const [lng, lat] = coord;
                        const pos = latLngToPosition(lat, lng);
                        points.push(
                            new Vector3(
                                pos.x * globeRadius,
                                pos.y * globeRadius,
                                pos.z * globeRadius
                            )
                        );
                    }
                    if (points.length < 2) return;
                    if (points[0].distanceTo(points[points.length - 1]) > 0.001) {
                        points.push(points[0].clone());
                    }
                    if (points.length < 2) return;
                    const curve = new CatmullRomCurve3(points);
                    outlineGeoms.push(
                        new TubeGeometry(
                            curve,
                            points.length * 2,
                            tubeRadius,
                            8,
                            false
                        )
                    );
                };

                for (const feature of landFeatures.features as any[]) {
                    const ft = String(
                        feature.properties?.featurecla ||
                            feature.properties?.type ||
                            ""
                    ).toLowerCase();
                    const fn = String(feature.properties?.name || "").toLowerCase();
                    if (
                        ft.includes("graticule") ||
                        ft.includes("grid") ||
                        ft.includes("line") ||
                        fn.includes("graticule") ||
                        fn.includes("grid") ||
                        fn.includes("line")
                    ) {
                        continue;
                    }

                    const geometry = feature.geometry;
                    if (!geometry || !geometry.coordinates) continue;

                    if (
                        geometry.type === "Polygon" &&
                        geometry.coordinates.length > 0
                    ) {
                        processRing(geometry.coordinates[0]);
                    } else if (geometry.type === "MultiPolygon") {
                        for (const polygon of geometry.coordinates as any[]) {
                            if (polygon.length > 0) processRing(polygon[0]);
                        }
                    }

                    await breathe();
                    if (cancelled) return null;
                }

                const merged = mergeGeometries(outlineGeoms);
                if (merged) {
                    outlinePositions = merged.attributes.position
                        .array as Float32Array;
                    outlineIndex = merged.index!.array as
                        | Uint16Array
                        | Uint32Array;
                    merged.dispose();
                }
                mark("outlines", tOutline);
            }

            if (cancelled) return null;
            await yieldToMain();
            if (cancelled) return null;

            /* ----- land mask raster (once per page load) ----- */
            const tMask = performance.now();
            const bitmapWidth = 2048;
            const bitmapHeight = 1024;
            const maskWasCached = landMaskCache !== null;
            if (!landMaskCache) {
                const offscreenCanvas = document.createElement("canvas");
                offscreenCanvas.width = bitmapWidth;
                offscreenCanvas.height = bitmapHeight;
                // willReadFrequently is intentionally OFF: we read this canvas
                // exactly once, and enabling it forces a slow software-rendered
                // 2D context for the expensive path fill below.
                const ctx = offscreenCanvas.getContext("2d");
                if (!ctx) throw new Error("Canvas not supported");
                const projection = geoEquirectangular().fitSize(
                    [bitmapWidth, bitmapHeight],
                    { type: "Sphere" } as any
                );
                const pathGenerator = geoPath().projection(projection).context(ctx);
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, bitmapWidth, bitmapHeight);
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                (landFeatures.features as any[]).forEach((feature) => {
                    pathGenerator(feature);
                });
                ctx.fill();
                const rgba = ctx.getImageData(0, 0, bitmapWidth, bitmapHeight).data;
                const mask = new Uint8Array(bitmapWidth * bitmapHeight);
                for (let i = 0; i < mask.length; i++) mask[i] = rgba[i * 4];
                landMaskCache = mask;
            }
            mark(maskWasCached ? "land mask (cached)" : "land mask", tMask);

            const pixels = landMaskCache;
            const isOnLand = (lng: number, lat: number) => {
                const x =
                    Math.round(((lng + 180) / 360) * bitmapWidth) % bitmapWidth;
                const y = Math.round(((90 - lat) / 180) * bitmapHeight);
                const clampedY = Math.max(0, Math.min(bitmapHeight - 1, y));
                return pixels[clampedY * bitmapWidth + x] > 128;
            };

            if (cancelled) return null;

            /* ----- dot positions ----- */
            const tDots = performance.now();
            const collected: number[] = [];
            const baseStep = dotSpacing * 0.08;
            for (let lat = -90; lat <= 90; lat += baseStep) {
                const latRad = (Math.abs(lat) * Math.PI) / 180;
                const cosLat = Math.cos(latRad);
                const lngStep =
                    cosLat > 0.01 ? baseStep / Math.max(0.3, cosLat) : 360;
                for (let lng = -180; lng < 180; lng += lngStep) {
                    if (allDots || isOnLand(lng, lat)) {
                        const pos = latLngToPosition(lat, lng);
                        collected.push(
                            pos.x * globeRadius,
                            pos.y * globeRadius,
                            pos.z * globeRadius
                        );
                    }
                }
            }
            mark("dots", tDots);

            return {
                outlinePositions,
                outlineIndex,
                dotPositions: new Float32Array(collected),
            };
        };

        /* The "solid" fill mode is rare and needs a live canvas texture, so it
         * keeps the original uncached path. */
        const buildSolidFill = async () => {
            const landFeatures = await loadLandData();
            if (cancelled) return;
            const bitmapWidth = 2048;
            const bitmapHeight = 1024;
            if (!landMaskCache) {
                const offscreenCanvas = document.createElement("canvas");
                offscreenCanvas.width = bitmapWidth;
                offscreenCanvas.height = bitmapHeight;
                const ctx = offscreenCanvas.getContext("2d");
                if (!ctx) throw new Error("Canvas not supported");
                const projection = geoEquirectangular().fitSize(
                    [bitmapWidth, bitmapHeight],
                    { type: "Sphere" } as any
                );
                const pathGenerator = geoPath().projection(projection).context(ctx);
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, bitmapWidth, bitmapHeight);
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                (landFeatures.features as any[]).forEach((feature) => {
                    pathGenerator(feature);
                });
                ctx.fill();
                const rgba = ctx.getImageData(0, 0, bitmapWidth, bitmapHeight).data;
                const mask = new Uint8Array(bitmapWidth * bitmapHeight);
                for (let i = 0; i < mask.length; i++) mask[i] = rgba[i * 4];
                landMaskCache = mask;
            }
            const pixels = landMaskCache;
            const isOnLand = (lng: number, lat: number) => {
                const x =
                    Math.round(((lng + 180) / 360) * bitmapWidth) % bitmapWidth;
                const y = Math.round(((90 - lat) / 180) * bitmapHeight);
                const clampedY = Math.max(0, Math.min(bitmapHeight - 1, y));
                return pixels[clampedY * bitmapWidth + x] > 128;
            };

            const texW = 1024;
            const texH = 512;
            const fillCanvas = document.createElement("canvas");
            fillCanvas.width = texW;
            fillCanvas.height = texH;
            const fctx = fillCanvas.getContext("2d")!;
            const img = fctx.createImageData(texW, texH);
            const data = img.data;
            const fr = Math.round(fillRgba.r * 255);
            const fg = Math.round(fillRgba.g * 255);
            const fb = Math.round(fillRgba.b * 255);
            const fa = Math.round((fillRgba.a || 1) * 255);
            for (let ty = 0; ty < texH; ty++) {
                for (let tx = 0; tx < texW; tx++) {
                    const u = tx / texW;
                    const v = ty / texH;
                    let lng = (u - 0.25) * 360;
                    lng = ((((lng + 180) % 360) + 360) % 360) - 180;
                    const lat = (v - 0.5) * 180;
                    const onLand = allDots || isOnLand(lng, lat);
                    const idx = (ty * texW + tx) * 4;
                    if (onLand) {
                        data[idx] = fr;
                        data[idx + 1] = fg;
                        data[idx + 2] = fb;
                        data[idx + 3] = fa;
                    } else {
                        data[idx + 3] = 0;
                    }
                }
            }
            fctx.putImageData(img, 0, 0);
            const fillTexture = track(new CanvasTexture(fillCanvas));
            fillTexture.flipY = false;
            fillTexture.needsUpdate = true;
            const fillGeometry = track(
                new SphereGeometry(globeRadius * 1.002, 64, 64)
            );
            const fillMaterial = track(
                new MeshBasicMaterial({ map: fillTexture, transparent: true })
            );
            globeGroup.add(new Mesh(fillGeometry, fillMaterial));
            updateMarkers();
            renderer.render(scene, camera);
            reveal();
        };

        const loadWorldData = async () => {
            try {
                const t0 = performance.now();

                if (fill === "solid") {
                    await buildSolidFill();
                    mark("TOTAL", t0);
                    return;
                }

                // 1. same page, already built
                let built = builtCache.get(buildKey) ?? null;
                let source = "memory";

                // 2. previous visit, read straight off disk
                if (!built) {
                    built = await idbGetBuild(buildKey);
                    source = "indexeddb";
                    if (built) builtCache.set(buildKey, built);
                }

                // 3. cold - do the real work
                let isFresh = false;
                if (!built) {
                    built = await buildFromGeoJson();
                    source = "built";
                    isFresh = true;
                    if (built) builtCache.set(buildKey, built);
                }

                if (cancelled || !built) return;

                applyBuilt(built);
                mark(`TOTAL (${source})`, t0);

                // Persist after painting so writing never delays the globe.
                if (isFresh) {
                    const toStore = built;
                    setTimeout(() => {
                        idbPutBuild(buildKey, toStore).catch(() => {});
                    }, 0);
                }
            } catch {
                if (!cancelled) setError("Failed to load land map data");
            }
        };

        /* ---------- animation loop ---------- */
        const animate = () => {
            if (cancelled || !inView || !tabVisible) {
                animationFrameId = null;
                return;
            }

            let needsRender = false;
            const threshold = 0.01;

            // The ring keeps turning even while the globe is paused on hover.
            if (ringGroup && ringSpin !== 0) {
                ringGroup.rotation.z += ringSpin;
                needsRender = true;
            }
            if (
                !isDragging &&
                rotationSpeed !== 0 &&
                (!stopOnHover || !isHovering)
            ) {
                targetRotation.x += rotationSpeed * 0.01;
            }
            if (!isDragging && smoothingN > 0) {
                if (
                    Math.abs(velocity.x) > threshold ||
                    Math.abs(velocity.y) > threshold
                ) {
                    targetRotation.x += velocity.x;
                    targetRotation.y += velocity.y;
                    targetRotation.y = Math.max(
                        -Math.PI / 2,
                        Math.min(Math.PI / 2, targetRotation.y)
                    );
                    velocity.x *= velocityDecay;
                    velocity.y *= velocityDecay;
                } else {
                    velocity.x = 0;
                    velocity.y = 0;
                }
            }
            const dx = targetRotation.x - rotation.x;
            const dy = targetRotation.y - rotation.y;
            if (
                Math.abs(dx) > threshold ||
                Math.abs(dy) > threshold ||
                rotationSpeed !== 0 ||
                isDragging
            ) {
                rotation.x += dx * lerpFactor;
                rotation.y += dy * lerpFactor;
                rotation.y = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, rotation.y)
                );
                needsRender = true;
            }
            if (needsRender || rotationSpeed !== 0 || isDragging) {
                // ring already advanced above
                globeGroup.rotation.y = rotation.x;
                globeGroup.rotation.x = rotation.y;
                renderer.render(scene, camera);
            }
            const hasVelocity =
                Math.abs(velocity.x) > threshold ||
                Math.abs(velocity.y) > threshold;
            const hasLerpDelta =
                Math.abs(dx) > threshold || Math.abs(dy) > threshold;
            const ringSpinning = ringGroup !== null && ringSpin !== 0;
            const needsContinue =
                isDragging ||
                rotationSpeed !== 0 ||
                ringSpinning ||
                hasVelocity ||
                hasLerpDelta;
            if (needsContinue) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                animationFrameId = null;
            }
        };

        const startAnimation = () => {
            if (cancelled || !inView || !tabVisible) return;
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        const stopAnimation = () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        /* ---------- pause when off screen or tab hidden ---------- */
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                inView = entries[0]?.isIntersecting ?? true;
                if (inView) startAnimation();
                else stopAnimation();
            },
            { threshold: 0 }
        );
        intersectionObserver.observe(container);

        const handleVisibility = () => {
            tabVisible = !document.hidden;
            if (tabVisible) startAnimation();
            else stopAnimation();
        };
        document.addEventListener("visibilitychange", handleVisibility);

        if (rotationSpeed !== 0 || (ringGroup && ringSpin !== 0)) startAnimation();

        /* ---------- drag ---------- */
        const handleMouseDown = (event: MouseEvent) => {
            isDragging = true;
            velocity.x = 0;
            velocity.y = 0;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            startAnimation();
            const handleMouseMoveDrag = (moveEvent: MouseEvent) => {
                const sensitivity = mapDragSpeedUiToSensitivity(dragSpeed);
                const ddx = moveEvent.clientX - lastMouseX;
                const ddy = moveEvent.clientY - lastMouseY;
                targetRotation.x += ddx * sensitivity;
                targetRotation.y += ddy * sensitivity;
                targetRotation.y = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, targetRotation.y)
                );
                velocity.x = ddx * sensitivity * 0.3;
                velocity.y = ddy * sensitivity * 0.3;
                lastMouseX = moveEvent.clientX;
                lastMouseY = moveEvent.clientY;
            };
            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMoveDrag);
                document.removeEventListener("mouseup", handleMouseUp);
                isDragging = false;
            };
            document.addEventListener("mousemove", handleMouseMoveDrag);
            document.addEventListener("mouseup", handleMouseUp);
        };
        canvas.addEventListener("mousedown", handleMouseDown);

        /* ---------- hover test ----------
         * Analytic ray/sphere intersection instead of Raycaster. The old code
         * ray-traced 8,192 triangles on every mousemove event; this is
         * mathematically identical for a sphere at the origin but costs a
         * handful of multiplications, and it is throttled to one rAF. */
        let hoverRafPending = false;
        let pendingClientX = 0;
        let pendingClientY = 0;
        const evaluateHover = () => {
            hoverRafPending = false;
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const ndcX = ((pendingClientX - rect.left) / rect.width) * 2 - 1;
            const ndcY = -((pendingClientY - rect.top) / rect.height) * 2 + 1;

            const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360);
            const dirX = ndcX * tanHalfFov * camera.aspect;
            const dirY = ndcY * tanHalfFov;
            const dirZ = -1;
            const originZ = camera.position.z;

            // Solve |o + t*d|^2 = r^2 with o = (0, 0, originZ)
            const a = dirX * dirX + dirY * dirY + dirZ * dirZ;
            const b = 2 * originZ * dirZ;
            const c = originZ * originZ - globeRadius * globeRadius;
            isHovering = b * b - 4 * a * c >= 0;
        };
        const handleMouseMove = (event: MouseEvent) => {
            if (!stopOnHover) return;
            pendingClientX = event.clientX;
            pendingClientY = event.clientY;
            if (!hoverRafPending) {
                hoverRafPending = true;
                requestAnimationFrame(evaluateHover);
            }
        };
        const handleMouseLeave = () => {
            isHovering = false;
            startAnimation();
        };
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        /* ---------- resize (debounced) ---------- */
        let resizeTimer: number | null = null;
        const resizeObserver = new ResizeObserver(() => {
            if (resizeTimer !== null) window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                if (cancelled) return;
                const newWidth =
                    container.clientWidth || container.offsetWidth || 800;
                const newHeight =
                    container.clientHeight || container.offsetHeight || 600;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
                const newCameraDistance = 2.5 / scaleMultiplier;
                camera.position.set(0, 0, newCameraDistance);
                camera.lookAt(0, 0, 0);
                renderer.render(scene, camera);
            }, 100);
        });
        resizeObserver.observe(container);

        loadWorldData();

        /* ---------- teardown ---------- */
        return () => {
            cancelled = true;
            stopAnimation();
            if (resizeTimer !== null) window.clearTimeout(resizeTimer);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("visibilitychange", handleVisibility);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();

            // Free GPU memory. Without this, every rebuild leaked hundreds of
            // buffers and eventually an entire WebGL context.
            scene.traverse((obj) => {
                const mesh = obj as Mesh;
                if (mesh.geometry) mesh.geometry.dispose();
                const mat = mesh.material as Material | Material[] | undefined;
                if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
                else if (mat) mat.dispose();
            });
            disposables.forEach((d) => {
                try {
                    d.dispose();
                } catch {
                    /* already disposed */
                }
            });
            renderer.dispose();
            renderer.forceContextLoss?.();
            canvas.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // Primitives only. An inline dots={{...}} or markerConfig={{...}} in the
        // parent can no longer force a teardown + refetch + full rebuild.
        smoothingN,
        fill,
        fillColor,
        allDots,
        density,
        dotSize,
        dotColor,
        stopOnHover,
        markersKey,
        markerColor,
        initialLatitude,
        initialLongitude,
        oceanColor,
        outlineColor,
        showOutline,
        graticuleColor,
        showGrid,
        outlineWidth,
        dragSpeed,
        detail,
        revealImmediately,
        debug,
        ringEnabled,
        ringCount,
        ringColor,
        ringSizeUi,
        ringRadiusFactor,
        ringSpeedUi,
        ringDirection,
        rotationSpeed,
        dotSpacing,
        dotSizeMultiplier,
        markerRadiusMultiplier,
        scaleMultiplier,
    ]);

    const containerStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    if (error) {
        return (
            <div style={containerStyle}>
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        minWidth: 0,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        textAlign: "center",
                        padding: "16px",
                        fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    }}
                >
                    <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        Error loading Earth visualization
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "4px" }}>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return <div ref={containerRef} style={containerStyle} />;
}