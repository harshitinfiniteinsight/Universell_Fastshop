"use client";

import { Suspense } from "react";
import { AIBuilderContent } from "@/components/ai-web-builder/builder-content";

function WebsiteBuilderInner() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Website Builder</h1>
        <p className="text-muted-foreground">
          Generate a complete multi-page website with AI in minutes
        </p>
      </div>
      <AIBuilderContent builderType="website" />
    </div>
  );
}

export default function WebsiteBuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <WebsiteBuilderInner />
    </Suspense>
  );
}
