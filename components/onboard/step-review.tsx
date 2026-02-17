"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OnboardAnswers } from "@/lib/onboard-types";
import { INDUSTRIES, BUSINESS_SIZES, PAIN_POINTS, GOALS } from "@/lib/onboard-types";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

interface Props {
  data: OnboardAnswers;
  onBack: () => void;
  onGenerate: () => void;
}

export function StepReview({ data, onBack, onGenerate }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const industryLabel = INDUSTRIES.find((i) => i.value === data.industry)?.label || data.industry;
  const sizeLabel = BUSINESS_SIZES.find((s) => s.value === data.businessSize)?.label || data.businessSize;
  const painLabels = data.painPoints.map(
    (id) => PAIN_POINTS.find((p) => p.id === id)?.label || id
  );
  const goalLabels = data.goals.map(
    (id) => GOALS.find((g) => g.id === id)?.label || id
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerate();
    }, 2000);
  };

  if (isGenerating) {
    return (
      <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Setting up your dashboard...</h2>
          <p className="text-muted-foreground">
            Preparing your personalized recommendations...
          </p>
        </div>
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Review Your Answers</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Make sure everything looks right before we generate your personalized plan.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="rounded-xl border p-5 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Business Info
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="font-medium">{data.businessName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Industry</p>
              <p className="font-medium">{industryLabel}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Size</p>
              <p className="font-medium">{sizeLabel}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-5 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Operations
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.sellsProducts && <Badge variant="secondary">Sells Products</Badge>}
            {data.offersServices && <Badge variant="secondary">Offers Services</Badge>}
            {data.hasPhysicalStore && <Badge variant="secondary">Physical Store</Badge>}
            {data.sellsOnline === "yes" && <Badge variant="secondary">Sells Online</Badge>}
            {data.sellsOnline === "planning" && (
              <Badge variant="secondary">Planning Online Sales</Badge>
            )}
            {data.hasEmployees && <Badge variant="secondary">Has Employees</Badge>}
          </div>
        </div>

        <div className="rounded-xl border p-5 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Challenges
          </h3>
          <div className="flex flex-wrap gap-2">
            {painLabels.map((label, i) => (
              <Badge key={i} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Goals
          </h3>
          <div className="flex flex-wrap gap-2">
            {goalLabels.map((label, i) => (
              <Badge key={i} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onBack} size="lg" className="px-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleGenerate} size="lg" className="px-8 gap-2">
          <Sparkles className="w-4 h-4" />
          See My Recommendations
        </Button>
      </div>
    </div>
  );
}
