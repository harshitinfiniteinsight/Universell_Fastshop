"use client";

import { Suspense } from "react";
import { AIBuilderContent } from "@/components/ai-web-builder/builder-content";

function LandingPageBuilderInner() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Landing Page Builder</h1>
        <p className="text-muted-foreground">
          Generate high-converting landing pages with AI in minutes
        </p>
      </div>
      <AIBuilderContent builderType="landing-page" />
    </div>
  );
}

export default function LandingPageBuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <LandingPageBuilderInner />
    </Suspense>
  );
}
