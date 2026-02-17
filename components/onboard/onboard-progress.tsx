"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function OnboardProgress({ steps, currentStep, onStepClick }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                isCompleted && "bg-primary text-primary-foreground cursor-pointer",
                isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground border border-border"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step.id}
            </button>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  currentStep > step.id ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
