"use client";

import { Suspense } from "react";
import { WizardContainer } from "@/components/onboarding/wizard-container";

function EcommerceFastshopInner() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">E-Commerce Fastshop</h1>
        <p className="text-muted-foreground">
          Set up your online store with AI-powered product and design recommendations
        </p>
      </div>
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <WizardContainer />
      </div>
    </div>
  );
}

export default function EcommerceFastshopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <EcommerceFastshopInner />
    </Suspense>
  );
}
