"use client";

import { useState, useEffect } from "react";

const PAGE_LABELS = ["Homepage", "About Us", "Services", "Contact"] as const;
const PAGE_COUNT = PAGE_LABELS.length;
const AUTO_ROTATE_MS = 3500;

const BRAND_PRIMARY = "#7c3aed";
const BRAND_ACCENT = "#a78bfa";
const BRAND_SOFT = "rgba(124,58,237,0.15)";

function slideStyle(isActive: boolean) {
  return {
    opacity: isActive ? 1 : 0,
    transform: isActive ? "translateX(0)" : "translateX(20px)",
    pointerEvents: (isActive ? "auto" : "none") as React.CSSProperties["pointerEvents"],
  };
}

function SiteNav({
  ctaLabel = "Get Started",
  borderColor = "rgba(124,58,237,0.28)",
}: {
  ctaLabel?: string;
  borderColor?: string;
}) {
  return (
    <div
      className="relative z-10 flex items-center justify-between px-6 py-4"
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      <span className="text-sm font-bold" style={{ color: BRAND_ACCENT }}>
        ✦ Lumio
      </span>
      <div className="flex gap-4 text-xs" style={{ color: "rgba(196,181,253,0.55)" }}>
        <span>About</span>
        <span>Services</span>
        <span>Work</span>
      </div>
      <span
        className="rounded-full px-3 py-1.5 text-xs font-semibold"
        style={{ background: BRAND_PRIMARY, color: "#fff" }}
      >
        {ctaLabel}
      </span>
    </div>
  );
}

// ─── Slide 1: Homepage ────────────────────────────────────────────────────────
function HomepageSlide({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
      style={slideStyle(isActive)}
      aria-hidden={!isActive}
    >
      <div
        className="relative flex flex-1 flex-col"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(15,10,40,0.93) 0%, rgba(30,20,80,0.87) 55%, rgba(15,10,40,0.93) 100%)",
          }}
        />
        <SiteNav />
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <div
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: BRAND_SOFT, color: "#c4b5fd" }}
          >
            ✦ AI-Powered Website Builder
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            Your business.
            <br />
            Beautifully designed.
          </h2>
          <p className="mb-5 text-sm" style={{ color: "rgba(196,181,253,0.65)" }}>
            Go from idea to a live, multi-page website in minutes.
          </p>
          <div className="mb-5 flex items-center gap-3">
            <span
              className="rounded-full px-5 py-2.5 text-sm font-bold"
              style={{ background: BRAND_PRIMARY, color: "#fff" }}
            >
              Build My Website →
            </span>
            <span
              className="rounded-full px-4 py-2.5 text-sm"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(196,181,253,0.8)",
                border: "1px solid rgba(124,58,237,0.28)",
              }}
            >
              View Demo
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PAGE_LABELS.map((p) => (
              <span
                key={p}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  background: "rgba(124,58,237,0.12)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(124,58,237,0.22)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="grid grid-cols-3 gap-0 pb-12"
        style={{
          background: "rgba(15,10,40,0.98)",
          borderTop: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        {[
          ["10+", "Pages"],
          ["★ 4.9", "Rating"],
          ["5min", "Setup"],
        ].map(([v, l], i) => (
          <div
            key={l}
            className="py-3 text-center"
            style={i < 2 ? { borderRight: "1px solid rgba(124,58,237,0.18)" } : {}}
          >
            <div className="text-sm font-bold" style={{ color: BRAND_ACCENT }}>
              {v}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "rgba(196,181,253,0.38)" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 2: About Us ────────────────────────────────────────────────────────
function AboutSlide({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
      style={slideStyle(isActive)}
      aria-hidden={!isActive}
    >
      <div
        className="relative flex flex-1 flex-col"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,12,45,0.93) 0%, rgba(20,25,90,0.87) 55%, rgba(10,12,45,0.93) 100%)",
          }}
        />
        <SiteNav ctaLabel="Contact Us" borderColor="rgba(99,102,241,0.28)" />
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <span
            className="mb-3 text-xs uppercase tracking-[0.18em]"
            style={{ color: "rgba(165,180,252,0.7)" }}
          >
            Our Story
          </span>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            We build the web
            <br />
            for ambitious brands.
          </h2>
          <p className="mb-5 max-w-xs text-sm" style={{ color: "rgba(165,180,252,0.6)" }}>
            Founded in 2019, Lumio has helped 500+ businesses launch beautiful,
            high-converting websites.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Design-first", "Client-focused", "Results-driven"].map((v) => (
              <span
                key={v}
                className="rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}
              >
                ✓ {v}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="grid grid-cols-3 gap-0 pb-12"
        style={{
          background: "rgba(10,12,45,0.98)",
          borderTop: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        {[
          ["500+", "Clients"],
          ["6yr", "Experience"],
          ["★ 4.9", "Rated"],
        ].map(([v, l], i) => (
          <div
            key={l}
            className="py-3 text-center"
            style={i < 2 ? { borderRight: "1px solid rgba(99,102,241,0.18)" } : {}}
          >
            <div className="text-sm font-bold" style={{ color: "#a5b4fc" }}>
              {v}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "rgba(165,180,252,0.38)" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 3: Services ────────────────────────────────────────────────────────
function ServicesSlide({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
      style={slideStyle(isActive)}
      aria-hidden={!isActive}
    >
      <div
        className="relative flex flex-1 flex-col"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(5,12,40,0.94) 0%, rgba(10,25,80,0.88) 55%, rgba(5,12,40,0.94) 100%)",
          }}
        />
        <SiteNav ctaLabel="Get Quote" borderColor="rgba(59,130,246,0.28)" />
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <span
            className="mb-3 text-xs uppercase tracking-[0.18em]"
            style={{ color: "rgba(147,197,253,0.7)" }}
          >
            What We Do
          </span>
          <h2 className="mb-4 text-2xl font-bold leading-tight text-white">
            Services built for
            <br />
            every business need.
          </h2>
          <div className="w-full max-w-xs space-y-2.5">
            {[
              { label: "Web Design", desc: "Beautiful, conversion-focused sites" },
              { label: "Branding", desc: "Logos, colors, and identity systems" },
              { label: "Development", desc: "Fast, scalable, production-ready code" },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: "#60a5fa" }}
                />
                <div>
                  <div className="text-xs font-semibold text-white">{label}</div>
                  <div className="text-xs" style={{ color: "rgba(147,197,253,0.6)" }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="flex items-center justify-between px-8 pb-12 pt-4"
        style={{
          background: "rgba(5,12,40,0.98)",
          borderTop: "1px solid rgba(59,130,246,0.18)",
        }}
      >
        <span className="text-sm" style={{ color: "rgba(147,197,253,0.5)" }}>
          Trusted by 500+ businesses
        </span>
        <span
          className="rounded-full px-4 py-2 text-xs font-semibold"
          style={{ background: "#3b82f6", color: "#fff" }}
        >
          Explore Services →
        </span>
      </div>
    </div>
  );
}

// ─── Slide 4: Contact ─────────────────────────────────────────────────────────
function ContactSlide({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
      style={slideStyle(isActive)}
      aria-hidden={!isActive}
    >
      <div
        className="relative flex flex-1 flex-col"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,15,35,0.94) 0%, rgba(20,30,70,0.89) 55%, rgba(10,15,35,0.94) 100%)",
          }}
        />
        <SiteNav ctaLabel="Book a Call" borderColor="rgba(124,58,237,0.22)" />
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <span
            className="mb-3 text-xs uppercase tracking-[0.18em]"
            style={{ color: "rgba(196,181,253,0.65)" }}
          >
            Get In Touch
          </span>
          <h2 className="mb-4 text-xl font-bold leading-tight text-white">
            Let&apos;s build something
            <br />
            great together.
          </h2>
          <div className="w-full max-w-xs space-y-2.5">
            {["Your name", "Email address", "Tell us about your project..."].map(
              (ph, idx) => (
                <div
                  key={ph}
                  className="rounded-xl px-4 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  {idx < 2 ? (
                    <div
                      className="h-3.5 w-28 rounded"
                      style={{ background: "rgba(196,181,253,0.2)" }}
                    />
                  ) : (
                    <div className="space-y-1.5">
                      <div
                        className="h-2.5 w-40 rounded"
                        style={{ background: "rgba(196,181,253,0.15)" }}
                      />
                      <div
                        className="h-2.5 w-32 rounded"
                        style={{ background: "rgba(196,181,253,0.1)" }}
                      />
                    </div>
                  )}
                </div>
              )
            )}
            <span
              className="block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold"
              style={{ background: BRAND_PRIMARY, color: "#fff" }}
            >
              Send Message →
            </span>
          </div>
        </div>
      </div>
      <div
        className="flex items-center justify-between px-8 pb-12 pt-4"
        style={{
          background: "rgba(10,15,35,0.98)",
          borderTop: "1px solid rgba(124,58,237,0.18)",
        }}
      >
        <span className="text-xs" style={{ color: "rgba(196,181,253,0.45)" }}>
          hello@lumio.co
        </span>
        <span className="text-xs" style={{ color: "rgba(196,181,253,0.45)" }}>
          +1 (555) 234-5678
        </span>
      </div>
    </div>
  );
}

// ─── Main Carousel Component ──────────────────────────────────────────────────
export function WebsitePreviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PAGE_COUNT);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-[2rem] border border-border/70 bg-background/80 p-4 shadow-2xl backdrop-blur-sm">
      <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card">
        {/* Browser chrome */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/15" />
          </div>
          <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            lumio.co / {PAGE_LABELS[activeIndex].toLowerCase().replace(/ /g, "-")}
          </div>
        </div>

        {/* Slides container */}
        <div
          className="relative overflow-hidden"
          style={{ minHeight: "500px" }}
          role="region"
          aria-label="Website page preview carousel"
          aria-live="polite"
        >
          <HomepageSlide isActive={activeIndex === 0} />
          <AboutSlide isActive={activeIndex === 1} />
          <ServicesSlide isActive={activeIndex === 2} />
          <ContactSlide isActive={activeIndex === 3} />

          {/* Page label */}
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
            <span className="pointer-events-none rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {PAGE_LABELS[activeIndex]}
            </span>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {Array.from({ length: PAGE_COUNT }).map((_, i) => {
              const isActiveDot = i === activeIndex;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: isActiveDot ? "20px" : "8px",
                    background: isActiveDot ? "#fff" : "rgba(255,255,255,0.35)",
                  }}
                  aria-label={`Go to ${PAGE_LABELS[i]} page`}
                  aria-current={isActiveDot ? "true" : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
