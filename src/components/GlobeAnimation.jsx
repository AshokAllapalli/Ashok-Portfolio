// components/GlobeAnimation.jsx
import Globe from "react-globe.gl";
import { useRef, useEffect } from "react";

export default function GlobeAnimation() {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundColor="rgba(0,0,0,0)"
      width={300}
      height={300}
    />
  );
}