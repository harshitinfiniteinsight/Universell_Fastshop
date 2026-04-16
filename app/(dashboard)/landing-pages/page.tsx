"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Layers, ArrowRight, LayoutTemplate, ShoppingBag, FormInput, Megaphone } from "lucide-react";

export default function LandingPagesPage() {
  const buildStages = ["Layout", "Sections", "Content", "Ready"];
  const templateSlides = [
    { title: "Product Launch", subtitle: "Hero + Features + CTA", color: "from-blue-500/20 to-indigo-500/10" },
    { title: "Restaurant Promo", subtitle: "Menu + Gallery + Booking", color: "from-orange-500/20 to-amber-500/10" },
    { title: "Service Lead Form", subtitle: "Benefits + Form + Reviews", color: "from-emerald-500/20 to-teal-500/10" },
    { title: "Event Registration", subtitle: "Schedule + Speakers + Signup", color: "from-fuchsia-500/20 to-pink-500/10" },
  ];

  const [buildStageIndex, setBuildStageIndex] = useState(0);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setBuildStageIndex((prev) => (prev + 1) % buildStages.length);
    }, 1300);

    const templateTimer = setInterval(() => {
      setActiveTemplateIndex((prev) => (prev + 1) % templateSlides.length);
    }, 2200);

    return () => {
      clearInterval(stageTimer);
      clearInterval(templateTimer);
    };
  }, [buildStages.length, templateSlides.length]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Landing Pages</h1>
        <p className="text-muted-foreground mt-1">
          No page is generated yet. Choose how you want to create your first landing page.
        </p>
      </div>

      <Card className="relative overflow-hidden border border-border/70">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute top-0 right-0 h-56 w-56 bg-primary/10 blur-3xl rounded-full" />
        <div className="relative p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Link
              href="/landing-page"
              className="group relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-background p-7 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
            >
              <div className="absolute top-4 right-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1">
                Recommended
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="mb-5 rounded-xl border border-primary/20 bg-background/80 p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="ml-2 text-[10px] text-muted-foreground">AI Builder</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[LayoutTemplate, ShoppingBag, FormInput].map((Icon, idx) => (
                    <div
                      key={idx}
                      className={`h-10 rounded-lg border flex items-center justify-center transition-all duration-500 ${
                        idx <= buildStageIndex % 3
                          ? "border-primary/40 bg-primary/10"
                          : "border-border bg-muted/40"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${idx <= buildStageIndex % 3 ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Building website</span>
                    <span className="text-primary font-medium">{buildStages[buildStageIndex]}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700"
                      style={{ width: `${(buildStageIndex + 1) * 25}%` }}
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground">Generate using AI</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Tell AI about your business and goals. It generates a complete landing page draft
                with content structure and design direction in minutes.
              </p>
              <div className="mt-6">
                <Button className="w-full group-hover:shadow-md transition-shadow">
                  Start with AI
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>

            <Link
              href="/landing-pages/templates"
              className="group rounded-2xl border border-border bg-background p-7 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-foreground" />
              </div>

              <div className="mb-5 rounded-xl border border-border/70 bg-muted/30 p-3 overflow-hidden">
                <div className="relative h-24">
                  {templateSlides.map((slide, idx) => (
                    <div
                      key={slide.title}
                      className={`absolute inset-0 rounded-lg border bg-gradient-to-br ${slide.color} p-3 transition-all duration-500 ${
                        idx === activeTemplateIndex
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold text-foreground">{slide.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{slide.subtitle}</p>
                        </div>
                        <Megaphone className="w-4 h-4 text-primary/70" />
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 mt-3">
                        <div className="h-2 rounded bg-foreground/10" />
                        <div className="h-2 rounded bg-foreground/10" />
                        <div className="h-2 rounded bg-foreground/10" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">Template preview slides</p>
                  <div className="flex gap-1">
                    {templateSlides.map((slide, idx) => (
                      <span
                        key={slide.title}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === activeTemplateIndex ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground">Select template from our library</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Pick from professionally structured templates and manually customize sections,
                content and layout for full creative control.
              </p>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Choose a Template
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
