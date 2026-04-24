"use client";

import { useState, useEffect } from "react";

const SLIDE_LABELS = ["Cafe", "Fitness", "Electric", "Plumbing", "SaaS"] as const;
const SLIDE_COUNT = SLIDE_LABELS.length;
const AUTO_ROTATE_MS = 3500;

function slideStyle(isActive: boolean) {
  return {
    opacity: isActive ? 1 : 0,
    transform: isActive ? "translateX(0)" : "translateX(20px)",
    pointerEvents: (isActive ? "auto" : "none") as React.CSSProperties["pointerEvents"],
  };
}

// ─── Slide 1: Cafe ───────────────────────────────────────────────────────────
function CafeSlide({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
      style={slideStyle(isActive)}
      aria-hidden={!isActive}
    >
      {/* Hero with real image background */}
      <div
        className="relative flex flex-1 flex-col"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark warm overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(20,7,0,0.90) 0%, rgba(40,18,0,0.82) 60%, rgba(20,7,0,0.88) 100%)",
          }}
        />
        {/* Nav */}
        <div
          className="relative z-10 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(180,83,9,0.28)" }}
        >
          <span className="text-sm font-bold" style={{ color: "#fbbf24" }}>
            <span aria-hidden="true">☕</span> Brew &amp; Co.
          </span>
          <div className="flex gap-4 text-xs" style={{ color: "rgba(253,230,138,0.5)" }}>
            <span>Menu</span>
            <span>About</span>
            <span>Visit</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <span
            className="mb-3 text-xs uppercase tracking-[0.2em]"
            style={{ color: "rgba(251,191,36,0.75)" }}
          >
            Artisan Coffee
          </span>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            Crafted with Care,
            <br />
            Served with Love
          </h2>
          <p className="mb-5 text-sm" style={{ color: "rgba(253,230,138,0.58)" }}>
            Fresh-roasted blends, slow-brewed for the perfect cup.
          </p>
          <div className="mb-5 flex items-center gap-3">
            <span
              className="rounded-full px-5 py-2.5 text-sm font-bold"
              style={{ background: "#d97706", color: "#fff" }}
            >
              Visit Us Today →
            </span>
            <span className="text-xs" style={{ color: "rgba(253,230,138,0.45)" }}>
              Mon–Sun 7am–9pm
            </span>
          </div>
          {/* Feature chips */}
          <div className="flex flex-wrap gap-2">
            {["Cold Brew", "Espresso", "Pastries", "Pour Over"].map((f) => (
              <span
                key={f}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(253,230,138,0.7)",
                  border: "1px solid rgba(251,191,36,0.22)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="grid grid-cols-3 gap-0 pb-12"
        style={{ background: "rgba(20,7,0,0.96)", borderTop: "1px solid rgba(180,83,9,0.22)" }}
      >
        {[
          ["12+", "Blends"],
          ["★ 4.9", "Rating"],
          ["10yr", "Experience"],
        ].map(([v, l], i) => (
          <div
            key={l}
            className="py-3 text-center"
            style={i < 2 ? { borderRight: "1px solid rgba(180,83,9,0.18)" } : {}}
          >
            <div className="text-sm font-bold" style={{ color: "#fbbf24" }}>
              {v}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "rgba(253,230,138,0.38)" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 2: Fitness ─────────────────────────────────────────────────────────
function FitnessSlide({ isActive }: { isActive: boolean }) {
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
            'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(8,12,26,0.92) 0%, rgba(15,23,42,0.85) 60%, rgba(8,12,26,0.92) 100%)",
          }}
        />

        {/* Nav */}
        <div
          className="relative z-10 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(249,115,22,0.22)" }}
        >
          <span className="text-sm font-bold" style={{ color: "#f97316" }}>
            <span aria-hidden="true">⚡</span> FitCore
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(249,115,22,0.16)", color: "#f97316" }}
          >
            Join Now
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <div
            className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
          >
            🔥 Transform in 12 Weeks
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            Build the body
            <br />
            you&apos;ve always wanted
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#94a3b8" }}>
            Expert coaching, proven plans, real results.
          </p>
          <span
            className="mb-5 rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: "#f97316", color: "#fff" }}
          >
            Book Free Session →
          </span>
          {/* Programme chips */}
          <div className="flex flex-wrap gap-2">
            {["Weight Loss", "Strength", "HIIT", "Nutrition"].map((p) => (
              <span
                key={p}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  background: "rgba(249,115,22,0.10)",
                  color: "#fb923c",
                  border: "1px solid rgba(249,115,22,0.22)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-0 pb-12"
        style={{ background: "rgba(8,12,26,0.98)", borderTop: "1px solid rgba(249,115,22,0.18)" }}
      >
        {[
          ["500+", "Members"],
          ["★ 4.8", "Reviews"],
          ["#1", "Rated"],
        ].map(([v, l], i) => (
          <div
            key={l}
            className="py-3 text-center"
            style={i < 2 ? { borderRight: "1px solid rgba(249,115,22,0.15)" } : {}}
          >
            <div className="text-sm font-bold" style={{ color: "#f97316" }}>
              {v}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "#475569" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 3: Electric Services ───────────────────────────────────────────────
function ElectricSlide({ isActive }: { isActive: boolean }) {
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
            'url("https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(7,10,40,0.93) 0%, rgba(10,18,64,0.86) 55%, rgba(7,10,40,0.93) 100%)",
          }}
        />

        {/* Nav */}
        <div
          className="relative z-10 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(59,130,246,0.22)" }}
        >
          <span className="text-sm font-bold text-white">
            <span aria-hidden="true">⚡</span> VoltPro
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(59,130,246,0.22)", color: "#60a5fa" }}
          >
            Get Quote
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />
            <span className="text-xs" style={{ color: "#86efac" }}>
              Licensed &amp; Insured
            </span>
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            Trusted Electrical
            <br />
            Services 24/7
          </h2>
          <p className="mb-5 text-sm" style={{ color: "rgba(147,197,253,0.65)" }}>
            Residential &amp; commercial. Same-day service available.
          </p>
          <span
            className="mb-5 rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: "#3b82f6", color: "#fff" }}
          >
            Get a Free Quote →
          </span>
          <div className="grid grid-cols-2 gap-2">
            {["Panel Upgrades", "EV Charging", "Rewiring", "Inspections"].map((s) => (
              <div
                key={s}
                className="rounded-xl px-3 py-2 text-xs font-medium"
                style={{ background: "rgba(59,130,246,0.14)", color: "#93c5fd" }}
              >
                ⚡ {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-0 pb-12"
        style={{ background: "rgba(7,10,40,0.98)", borderTop: "1px solid rgba(59,130,246,0.18)" }}
      >
        {[
          ["15yr", "Experience"],
          ["★ 4.9", "Rating"],
          ["24/7", "Support"],
        ].map(([v, l], i) => (
          <div
            key={l}
            className="py-3 text-center"
            style={i < 2 ? { borderRight: "1px solid rgba(59,130,246,0.15)" } : {}}
          >
            <div className="text-sm font-bold" style={{ color: "#60a5fa" }}>
              {v}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "rgba(147,197,253,0.38)" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 4: Plumbing Services ───────────────────────────────────────────────
function PlumbingSlide({ isActive }: { isActive: boolean }) {
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
            'url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80&auto=format&fit=crop&fm=webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(0,28,26,0.93) 0%, rgba(0,45,40,0.86) 55%, rgba(0,28,26,0.93) 100%)",
          }}
        />

        {/* Nav */}
        <div
          className="relative z-10 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(20,184,166,0.22)" }}
        >
          <span className="text-sm font-bold" style={{ color: "#2dd4bf" }}>
            <span aria-hidden="true">🔧</span> FlowFix
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(20,184,166,0.18)", color: "#2dd4bf" }}
          >
            Emergency? Call Now
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />
            <span className="text-xs" style={{ color: "#86efac" }}>
              24/7 Emergency Service
            </span>
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            Fast, Reliable Plumbing
            <br />
            You Can Count On
          </h2>
          <p className="mb-5 text-sm" style={{ color: "rgba(153,246,228,0.6)" }}>
            Licensed plumbers serving homes &amp; businesses across the city.
          </p>
          <span
            className="mb-5 rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: "#0d9488", color: "#fff" }}
          >
            Get a Free Estimate →
          </span>
          <div className="grid grid-cols-2 gap-2">
            {["Pipe Repair", "Drain Cleaning", "Water Heater", "Leak Detection"].map((s) => (
              <div
                key={s}
                className="rounded-xl px-3 py-2 text-xs font-medium"
                style={{ background: "rgba(20,184,166,0.13)", color: "#5eead4" }}
              >
                🔧 {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-0 pb-12"
        style={{
          background: "rgba(0,28,26,0.98)",
          borderTop: "1px solid rgba(20,184,166,0.18)",
        }}
      >
        {[
          ["2000+", "Jobs Done"],
          ["★ 4.9", "Rating"],
          ["60min", "Response"],
        ].map(([v, l], i) => (
          <div
            key={l}
            className="py-3 text-center"
            style={i < 2 ? { borderRight: "1px solid rgba(20,184,166,0.15)" } : {}}
          >
            <div className="text-sm font-bold" style={{ color: "#2dd4bf" }}>
              {v}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "rgba(153,246,228,0.38)" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 5: SaaS Product ────────────────────────────────────────────────────
function SaaSSlide({ isActive }: { isActive: boolean }) {
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
              "linear-gradient(160deg, rgba(248,250,252,0.96) 0%, rgba(238,242,255,0.93) 60%, rgba(248,250,252,0.96) 100%)",
          }}
        />

        {/* Nav */}
        <div
          className="relative z-10 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}
        >
          <span className="text-sm font-bold" style={{ color: "#6366f1" }}>
            <span aria-hidden="true">✦</span> Launchpad
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "#6366f1", color: "#fff" }}
          >
            Try Free
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 py-6">
          <div
            className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: "rgba(99,102,241,0.10)", color: "#6366f1" }}
          >
            🚀 Now in public beta
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight" style={{ color: "#111827" }}>
            Ship faster.
            <br />
            Scale smarter.
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#6b7280" }}>
            The all-in-one platform for modern software teams.
          </p>
          <span
            className="mb-6 rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: "#6366f1", color: "#fff" }}
          >
            Start Free Trial →
          </span>
          {/* Feature chips */}
          <div className="flex flex-wrap gap-2">
            {["CI/CD", "Analytics", "Deployments", "Team Collab"].map((f) => (
              <span
                key={f}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  background: "rgba(99,102,241,0.08)",
                  color: "#6366f1",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div
        className="space-y-1.5 px-8 pb-12 pt-4"
        style={{
          background: "rgba(248,250,252,0.98)",
          borderTop: "1px solid rgba(99,102,241,0.12)",
        }}
      >
        {["✓ No credit card required", "✓ 14-day free trial", "✓ Cancel anytime"].map((f) => (
          <div key={f} className="text-sm" style={{ color: "#6b7280" }}>
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Carousel Component ──────────────────────────────────────────────────
export function LandingPageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDE_COUNT);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  const isLightSlide = activeIndex === 4;
  const activeDotColor = isLightSlide ? "#6366f1" : "#fff";
  const inactiveDotColor = isLightSlide ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.35)";

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
            {SLIDE_LABELS[activeIndex]} Landing Page
          </div>
        </div>

        {/* Slides container */}
        <div
          className="relative overflow-hidden"
          style={{ minHeight: "500px" }}
          role="region"
          aria-label="Landing page preview carousel"
          aria-live="polite"
        >
          <CafeSlide isActive={activeIndex === 0} />
          <FitnessSlide isActive={activeIndex === 1} />
          <ElectricSlide isActive={activeIndex === 2} />
          <PlumbingSlide isActive={activeIndex === 3} />
          <SaaSSlide isActive={activeIndex === 4} />

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {Array.from({ length: SLIDE_COUNT }).map((_, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? "20px" : "8px",
                    background: isActive ? activeDotColor : inactiveDotColor,
                  }}
                  aria-label={`Go to ${SLIDE_LABELS[i]} slide`}
                  aria-current={isActive ? "true" : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
