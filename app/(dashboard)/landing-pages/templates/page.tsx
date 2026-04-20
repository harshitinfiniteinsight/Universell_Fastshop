"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Search,
  Eye,
  MousePointerClick,
  Layout,
  Zap,
  ShoppingBag,
  Users,
  CalendarDays,
  Star,
  Heart,
  Globe,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Business", "E-Commerce", "Event", "Portfolio", "Lead Generation", "Coming Soon"];

const TEMPLATES = [
  { id: 1, name: "Bold Business", category: "Business", tag: "Popular", icon: Zap, color: "from-orange-500 to-red-500", description: "Clean layout with strong CTAs for service businesses", sections: 6 },
  { id: 2, name: "Shop Starter", category: "E-Commerce", tag: "New", icon: ShoppingBag, color: "from-blue-500 to-indigo-500", description: "Product showcase with cart-ready sections and promos", sections: 8 },
  { id: 3, name: "Event Pro", category: "Event", tag: null, icon: CalendarDays, color: "from-purple-500 to-pink-500", description: "Drive registrations with countdown, speakers & schedule", sections: 7 },
  { id: 4, name: "Agency Portfolio", category: "Portfolio", tag: "Popular", icon: Layout, color: "from-teal-500 to-emerald-500", description: "Showcase projects, case studies and client logos", sections: 9 },
  { id: 5, name: "Lead Magnet", category: "Lead Generation", tag: null, icon: Users, color: "from-yellow-500 to-orange-500", description: "Capture emails with an irresistible offer and social proof", sections: 5 },
  { id: 6, name: "Coming Soon", category: "Coming Soon", tag: null, icon: Star, color: "from-slate-600 to-slate-800", description: "Build hype before launch with countdown and signup", sections: 4 },
  { id: 7, name: "Freelancer Minimal", category: "Portfolio", tag: null, icon: Heart, color: "from-pink-500 to-rose-500", description: "Personal brand site for freelancers and creators", sections: 6 },
  { id: 8, name: "SaaS Landing", category: "Business", tag: "New", icon: Globe, color: "from-cyan-500 to-blue-500", description: "Feature highlights, pricing and testimonials for SaaS", sections: 10 },
  { id: 9, name: "Flash Sale", category: "E-Commerce", tag: "Popular", icon: Zap, color: "from-red-500 to-orange-400", description: "Urgency-driven promo page with countdown timer", sections: 5 },
];

const TAG_STYLES: Record<string, string> = {
  Popular: "bg-orange-100 text-orange-700",
  New: "bg-emerald-100 text-emerald-700",
};

export default function LandingPageTemplatesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b border-border/60 bg-background/90 backdrop-blur-sm sticky top-0 z-10 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2">
              <Link href="/landing-page">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>
            <div className="h-5 w-px bg-border" />
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">Select a Template</h1>
              <p className="text-[11px] text-muted-foreground">{TEMPLATES.length} templates available</p>
            </div>
          </div>
          <Button asChild className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl h-9 text-sm shadow-sm">
            <Link href="/landing-page">
              <Sparkles className="w-3.5 h-3.5" />
              Generate with AI
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-7">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Templates", value: TEMPLATES.length, sub: "Ready to use", icon: LayoutTemplate, iconBg: "bg-blue-50 text-blue-600" },
            { label: "Categories", value: CATEGORIES.length - 1, sub: "Across all types", icon: Layout, iconBg: "bg-purple-50 text-purple-600" },
            { label: "AI Generated", value: "∞", sub: "Unlimited possibilities", icon: Sparkles, iconBg: "bg-orange-50 text-primary" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-border/60 bg-card p-4 flex items-center gap-4 shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.iconBg)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              className="pl-9 h-9 rounded-xl border-border/60 bg-muted/30 text-sm focus-visible:bg-background"
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border",
                  activeCategory === cat
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground -mt-3">
          Showing <span className="font-medium text-foreground">{filtered.length}</span> template{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && <> in <span className="font-medium text-foreground">{activeCategory}</span></>}
        </p>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* AI Generate Card */}
          <Link
            href="/landing-page"
            className="group relative rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-orange-50/50 hover:from-primary/10 hover:border-primary transition-all flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[260px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Generate with AI</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Answer a few questions and we&apos;ll craft a custom template just for you
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1 group-hover:bg-primary group-hover:text-white transition-all">
              <Sparkles className="w-3 h-3" /> Start now
            </span>
          </Link>

          {filtered.map((template) => {
            const Icon = template.icon;
            const isHovered = hovered === template.id;
            return (
              <div
                key={template.id}
                className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHovered(template.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Preview area */}
                <div className={cn("relative h-44 bg-gradient-to-br flex items-center justify-center overflow-hidden", template.color)}>
                  {/* Decorative mock layout */}
                  <div className="absolute inset-0 flex flex-col gap-2 p-5 opacity-25">
                    <div className="h-3 w-3/4 rounded bg-white" />
                    <div className="h-2 w-1/2 rounded bg-white/70" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-8 w-20 rounded-lg bg-white/60" />
                      <div className="h-8 w-16 rounded-lg bg-white/30" />
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 rounded-lg bg-white/20" />
                      ))}
                    </div>
                  </div>

                  {/* Centre icon */}
                  <div className={cn("relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300", isHovered && "scale-110")}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Tag badge */}
                  {template.tag && (
                    <span className={cn("absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full", TAG_STYLES[template.tag])}>
                      {template.tag}
                    </span>
                  )}

                  {/* Hover overlay with actions */}
                  <div className={cn("absolute inset-0 bg-black/45 flex items-center justify-center gap-3 transition-opacity duration-200", isHovered ? "opacity-100" : "opacity-0")}>
                    <button className="flex items-center gap-1.5 bg-white text-foreground text-xs font-medium px-4 py-2 rounded-xl hover:bg-white/90 transition-colors shadow">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow">
                      <MousePointerClick className="w-3.5 h-3.5" /> Use This
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-foreground">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{template.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full font-medium">
                      {template.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{template.sections} sections</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
