"use client";

import Link from "next/link";
import { Sparkles, Globe, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const builderOptions = [
  {
    icon: Sparkles,
    title: "Landing Page",
    description:
      "Generate high-converting, conversion-focused landing pages with AI. Perfect for campaigns, lead generation, product launches, and events.",
    href: "/ai-web-builder/landing-page",
    accent: "#f97316",
    tags: ["Conversion-focused", "AI campaign copy", "CTA-first structure"],
  },
  {
    icon: Globe,
    title: "Website Builder",
    description:
      "Create a complete multi-page website in minutes. AI handles structure, copy, and design for homepage, about, services, contact, and more.",
    href: "/ai-web-builder/website-builder",
    accent: "#4f46e5",
    tags: ["Strategy-led layout", "Brand-aware copy", "Multi-page generation"],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Fastshop",
    description:
      "Set up your online store with AI-powered product and design recommendations. Launch a fully functional e-commerce experience fast.",
    href: "/ai-web-builder/ecommerce-fastshop",
    accent: "#10b981",
    tags: ["Product catalog", "Order management", "AI store setup"],
  },
];

export default function AIWebBuilderPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">AI Web Builder</h1>
        <p className="text-muted-foreground">
          Generate a professional web presence with AI in minutes
        </p>
      </div>

      {/* Builder Options */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {builderOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Link
              key={option.title}
              href={option.href}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${option.accent}18` }}
              >
                <Icon className="h-6 w-6" style={{ color: option.accent }} />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">{option.title}</h2>
              <p className="mb-4 text-sm leading-6 text-muted-foreground flex-1">
                {option.description}
              </p>
              <div className="mb-5 flex flex-wrap gap-2">
                {option.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                className="w-full gap-2 group-hover:bg-primary/90"
                style={{ backgroundColor: option.accent }}
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
