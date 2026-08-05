import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Boxes,
  Layers,
  ShieldAlert,
  UserCog,
  ChevronRight,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Small utilities                                                       */
/* ---------------------------------------------------------------------- */

// Reveals children with a fade/slide-up transition the first time they
// scroll into view. Pure IntersectionObserver — no animation library.
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

// Tracks which section id is currently most visible, for the sticky nav.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}

/* ---------------------------------------------------------------------- */
/*  Theming — one fixed theme matching the portfolio's own home page      */
/*  (white background, #3c4cfa brand blue). No dark mode.                 */
/* ---------------------------------------------------------------------- */

const BRAND = "#3c4cfa";

const t = {
  page: "bg-white text-slate-900",
  navBg: "bg-white/85 border-blue-100",
  navText: "text-slate-600",
  heroOverlay: "bg-black/35",
  card: "bg-white border-slate-200 shadow-sm",
  cardHover: "hover:border-blue-200 hover:shadow-md",
  textMuted: "text-slate-600",
  textFaint: "text-slate-500",
  divider: "border-slate-200",
  chip: "bg-blue-50 border-blue-100 text-slate-700",
  sectionAlt: "bg-blue-50/40",
  pillActive: "text-white",
  pillInactive: "text-slate-500 hover:text-slate-900 hover:bg-blue-50",
};

/* ---------------------------------------------------------------------- */
/*  Layout                                                                 */
/* ---------------------------------------------------------------------- */

const NAV_ITEMS = [
  { id: "features", label: "Features" },
  { id: "architecture", label: "Architecture" },
  { id: "challenges", label: "Challenges" },
  { id: "contributions", label: "Contributions" },
];

export default function ProjectCaseStudyLayout({ data }) {
  const activeId = useActiveSection(NAV_ITEMS.map((n) => n.id));

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen ${t.page}`}>
      {/* ---------------- Top bar: back link ---------------- */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3">
        <Link
          to="/#projects"
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium backdrop-blur-lg border transition-colors ${t.card} ${t.cardHover}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">All projects</span>
        </Link>
      </div>

      {/* ---------------- Hero (landing page) ---------------- */}
      <header className="relative h-[78vh] min-h-[560px] w-full flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700" />
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:26px_26px]" />
        <div className={`absolute inset-0 ${t.heroOverlay}`} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 pb-16 sm:pb-20">
          <Reveal>
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-5">
              <span className="uppercase tracking-[0.2em] text-xs">{data.category}</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5 max-w-3xl">
              {data.title}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-white/85 text-base sm:text-xl leading-relaxed max-w-2xl mb-8">
              {data.tagline}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap gap-2 mb-10">
              {data.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-white bg-white/15 border border-white/25 backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl border-t border-white/20 pt-6">
              {[
                ["Role", data.role],
                ["Duration", data.duration],
                ["Team", data.team],
                ["Live", data.liveLabel],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-white/55 text-xs uppercase tracking-wider mb-1">
                    {label}
                  </div>
                  {label === "Live" && data.link !== "#" ? (
                    <a
                      href={data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      {value}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="text-white text-sm font-semibold">{value}</div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------------- Sticky section nav ---------------- */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-lg ${t.navBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={activeId === item.id ? { backgroundColor: BRAND } : undefined}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeId === item.id ? t.pillActive : t.pillInactive
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ---------------- Features ---------------- */}
        <Section id="features" title="Features & Modules" icon={Boxes} t={t}>
          <div className="grid sm:grid-cols-2 gap-5">
            {data.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={(i % 2) * 80}>
                  <div className={`h-full p-6 rounded-2xl border transition-all ${t.card} ${t.cardHover}`}>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${BRAND}1a` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: BRAND }} />
                    </div>
                    <h4 className="font-semibold mb-2">{f.title}</h4>
                    <p className={`text-sm leading-relaxed mb-3 ${t.textMuted}`}>{f.description}</p>
                    {f.points && (
                      <ul className="space-y-1.5">
                        {f.points.map((p, j) => (
                          <li key={j} className={`text-sm flex items-start gap-2 ${t.textMuted}`}>
                            <ChevronRight className="w-3.5 h-3.5 mt-1 flex-shrink-0" style={{ color: BRAND }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>

        {/* ---------------- Architecture ---------------- */}
        <Section id="architecture" title="System Architecture" icon={Layers} t={t} alt>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.architecture.map((layer) => (
              <div key={layer.name} className={`p-5 rounded-xl border ${t.card}`}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: BRAND }}>
                  {layer.name}
                </div>
                <ul className="space-y-1.5">
                  {layer.items.map((item) => (
                    <li key={item} className={`text-sm ${t.textMuted}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------- Challenges ---------------- */}
        <Section id="challenges" title="Challenges & Solutions" icon={ShieldAlert} t={t}>
          <div className="space-y-4">
            {data.challenges.map((c, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={`p-5 sm:p-6 rounded-2xl border ${t.card}`}>
                  <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-1.5">
                        Challenge
                      </div>
                      <p className={`text-sm leading-relaxed ${t.textMuted}`}>{c.challenge}</p>
                    </div>
                    <div className={`hidden sm:flex items-center justify-center pt-6 ${t.textFaint}`}>
                      <ArrowUpRight className="w-4 h-4 rotate-90" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: BRAND }}>
                        Solution
                      </div>
                      <p className={`text-sm leading-relaxed ${t.textMuted}`}>{c.solution}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------------- My contributions ---------------- */}
        <Section id="contributions" title="My Contributions" icon={UserCog} t={t} alt>
          <div className={`p-1 rounded-2xl border ${t.card}`}>
            <div className="p-5 sm:p-7">
              <div className="grid sm:grid-cols-2 gap-3">
                {data.contributions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BRAND }} />
                    <span className={`text-sm leading-relaxed ${t.textMuted}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ---------------- Footer nav to other case studies ---------------- */}
        <div className={`border-t py-14 mt-6 ${t.divider}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${t.textFaint}`}>Want to see another project?</p>
            <Link
              to="/#projects"
              style={{ backgroundColor: BRAND }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Back to all projects
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Section wrapper                                                       */
/* ---------------------------------------------------------------------- */

function Section({ id, title, icon: Icon, t, alt, children }) {
  return (
    <section id={id} className={`scroll-mt-24 py-14 sm:py-20 ${alt ? t.sectionAlt : ""}`}>
      <Reveal>
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${t.card}`}>
            <Icon className="w-4.5 h-4.5" style={{ color: BRAND }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        </div>
      </Reveal>
      {children}
    </section>
  );
}