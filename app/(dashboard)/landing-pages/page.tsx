"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Layers, ArrowRight } from "lucide-react";

export default function LandingPagesPage() {
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
              className="rounded-2xl border border-border bg-background p-7 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Select Template to create manually</h2>
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
