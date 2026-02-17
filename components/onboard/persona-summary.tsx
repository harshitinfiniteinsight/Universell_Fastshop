"use client";

import { Badge } from "@/components/ui/badge";
import type { OnboardAnswers } from "@/lib/onboard-types";
import {
  INDUSTRIES,
  BUSINESS_SIZES,
  PAIN_POINTS,
  GOALS,
} from "@/lib/onboard-types";

interface PersonaSummaryProps {
  answers: OnboardAnswers;
  compact?: boolean;
}

/**
 * Shows the onboarding questionnaire answers that produced this dashboard.
 * Matches the structure from step-review (Business, Operations, Challenges, Goals).
 */
export function PersonaSummary({ answers, compact = false }: PersonaSummaryProps) {
  const industryLabel = INDUSTRIES.find((i) => i.value === answers.industry)?.label || answers.industry || "—";
  const sizeLabel = BUSINESS_SIZES.find((s) => s.value === answers.businessSize)?.label || answers.businessSize || "—";
  const painLabels = answers.painPoints.map(
    (id) => PAIN_POINTS.find((p) => p.id === id)?.label || id
  );
  const goalLabels = answers.goals.map(
    (id) => GOALS.find((g) => g.id === id)?.label || id
  );

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="secondary">{industryLabel}</Badge>
        <Badge variant="secondary">{sizeLabel}</Badge>
        {answers.sellsProducts && <Badge variant="outline">Products</Badge>}
        {answers.offersServices && <Badge variant="outline">Services</Badge>}
        {answers.hasPhysicalStore && <Badge variant="outline">Store</Badge>}
        {answers.sellsOnline === "yes" && <Badge variant="outline">Online</Badge>}
        {answers.hasEmployees && <Badge variant="outline">Employees</Badge>}
        {painLabels.slice(0, 3).map((l, i) => (
          <Badge key={i} variant="outline" className="border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400">
            {l}
          </Badge>
        ))}
        {painLabels.length > 3 && (
          <Badge variant="outline">+{painLabels.length - 3} more</Badge>
        )}
        {goalLabels.slice(0, 2).map((l, i) => (
          <Badge key={i} variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400">
            {l}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
          <p className="font-medium">{answers.businessName || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Industry</p>
          <p className="font-medium">{industryLabel}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Size</p>
          <p className="font-medium">{sizeLabel}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Operations</p>
          <p className="font-medium text-muted-foreground text-xs">
            {[
              answers.sellsProducts && "Products",
              answers.offersServices && "Services",
              answers.hasPhysicalStore && "Store",
              answers.sellsOnline === "yes" && "Online",
              answers.hasEmployees && "Employees",
            ]
              .filter(Boolean)
              .join(", ") || "None"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Challenges</p>
        <div className="flex flex-wrap gap-2">
          {painLabels.length > 0 ? (
            painLabels.map((label, i) => (
              <Badge key={i} variant="outline">
                {label}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground italic">None selected</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Goals</p>
        <div className="flex flex-wrap gap-2">
          {goalLabels.length > 0 ? (
            goalLabels.map((label, i) => (
              <Badge key={i} variant="outline" className="border-emerald-200 dark:border-emerald-800">
                {label}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground italic">None selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
