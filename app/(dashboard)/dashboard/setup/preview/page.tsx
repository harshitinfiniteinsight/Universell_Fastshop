"use client";

import { useState, useEffect, useCallback } from "react";
import { SetupDashboardContent } from "@/components/onboard/setup-dashboard-content";
import { PersonaSummary } from "@/components/onboard/persona-summary";
import { SCENARIO_PRESETS } from "@/lib/scenario-presets";
import { MODULES } from "@/lib/modules-data";
import type { OnboardState } from "@/lib/onboard-types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SetupPreview() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [state, setState] = useState<OnboardState | null>(null);

  // Initialize the current scenario (static presets - no calculation)
  useEffect(() => {
    if (SCENARIO_PRESETS.length > 0) {
      const preset = SCENARIO_PRESETS[currentSlide];

      // Build module progress (all empty/not started) - matches OnboardState shape
      const moduleProgress: Record<string, { stepsCompleted: string[] }> = {};
      for (const mod of MODULES) {
        moduleProgress[mod.id] = { stepsCompleted: [] };
      }

      const newState: OnboardState = {
        answers: preset.answers,
        recommendations: preset.recommendations,
        moduleProgress,
      };

      setState(newState);
    }
  }, [currentSlide]);

  const handlePrevious = useCallback(() => {
    setCurrentSlide((prev) =>
      prev > 0 ? prev - 1 : SCENARIO_PRESETS.length - 1
    );
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) =>
      prev < SCENARIO_PRESETS.length - 1 ? prev + 1 : 0
    );
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePrevious, handleNext]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="gap-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center flex-1 max-w-md mx-4">
          <h2 className="text-lg font-semibold">
            {SCENARIO_PRESETS[currentSlide].name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {SCENARIO_PRESETS[currentSlide].description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Scenario {currentSlide + 1} of {SCENARIO_PRESETS.length} • Use ← → to navigate
          </p>
        </div>

        <div className="flex gap-1">
          {SCENARIO_PRESETS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to scenario ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Persona summary - shows questionnaire answers that produced this dashboard */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Questionnaire answers for this scenario
        </p>
        <PersonaSummary answers={state.answers} />
      </div>

      {/* Preview Content */}
      <div className="bg-card rounded-xl border p-6 md:p-8">
        <SetupDashboardContent
          state={state}
          onStartOver={undefined}
          showStartOver={false}
          essentialAndRecommendedOnly={true}
        />
      </div>

      {/* Footer info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Each scenario uses different onboarding answers and produces a different set of recommended modules.
        </p>
      </div>
    </div>
  );
}
