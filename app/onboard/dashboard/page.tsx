"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModuleCard } from "@/components/onboard/module-card";
import { MODULES, PHASE_LABELS, getModuleById } from "@/lib/modules-data";
import type { OnboardState, ModuleStatus, RelevanceLevel } from "@/lib/onboard-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  RotateCcw,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

function getModuleStatus(
  moduleId: string,
  state: OnboardState
): ModuleStatus {
  const mod = getModuleById(moduleId);
  if (!mod) return "locked";

  const completed = state.moduleProgress[moduleId]?.stepsCompleted || [];
  const totalSteps = mod.setupSteps.length;

  if (completed.length === totalSteps && totalSteps > 0) return "complete";
  if (completed.length > 0) return "in_progress";

  // Check prerequisites
  for (const prereq of mod.prerequisites) {
    const prereqCompleted = state.moduleProgress[prereq]?.stepsCompleted || [];
    if (prereqCompleted.length === 0) return "locked";
  }

  return "ready";
}

function getModuleRelevance(
  moduleId: string,
  state: OnboardState
): RelevanceLevel {
  const rec = state.recommendations.find((r) => r.moduleId === moduleId);
  return rec?.relevance || "optional";
}

function getLockedReason(moduleId: string): string {
  const mod = getModuleById(moduleId);
  if (!mod || mod.prerequisites.length === 0) return "";
  const prereqNames = mod.prerequisites
    .map((id) => getModuleById(id)?.name || id)
    .join(" and ");
  return `Complete ${prereqNames} first`;
}

export default function OnboardDashboard() {
  const router = useRouter();
  const [state, setState] = useState<OnboardState | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("universell-onboard-result");
      if (saved) {
        setState(JSON.parse(saved));
      } else {
        router.push("/onboard");
      }
    } catch {
      router.push("/onboard");
    }
  }, [router]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const recommendedModules = state.recommendations
    .filter((r) => r.score > 0)
    .map((r) => r.moduleId);

  const visibleModules = MODULES.filter((m) =>
    recommendedModules.includes(m.id)
  );

  const totalModules = visibleModules.length;
  const completedModules = visibleModules.filter(
    (m) => getModuleStatus(m.id, state) === "complete"
  ).length;
  const overallProgress =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const phases = [1, 2, 3, 4];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold">
                Welcome, {state.answers.businessName || "there"}!
              </h1>
            </div>
            <p className="text-muted-foreground">
              Your personalized Universell setup plan is ready. Complete each phase
              to unlock new capabilities.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
            onClick={() => {
              localStorage.removeItem("universell-onboard-result");
              localStorage.removeItem("universell-onboard-state");
              router.push("/onboard");
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Overall progress: {completedModules} of {totalModules} modules
            </span>
            <span className="font-semibold">{overallProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="space-y-10">
        {phases.map((phase) => {
          const phaseModules = visibleModules.filter((m) => m.phase === phase);
          if (phaseModules.length === 0) return null;

          const phaseInfo = PHASE_LABELS[phase];
          const phaseComplete = phaseModules.every(
            (m) => getModuleStatus(m.id, state) === "complete"
          );
          const phaseHasProgress = phaseModules.some(
            (m) =>
              getModuleStatus(m.id, state) === "in_progress" ||
              getModuleStatus(m.id, state) === "complete"
          );

            return (
            <div key={phase} className={`relative animate-fade-in-up delay-${phase * 100}`}>
              {/* Phase connector line */}
              {phase > 1 && (
                <div className="absolute left-6 -top-10 w-0.5 h-10 bg-border" />
              )}

              {/* Phase header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
                    phaseComplete
                      ? "bg-emerald-500 text-white"
                      : phaseHasProgress
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {phase}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">{phaseInfo.name}</h2>
                    {phaseComplete && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                        Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {phaseInfo.description}
                  </p>
                </div>
                {!phaseComplete && phaseHasProgress && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                )}
              </div>

              {/* Phase modules grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-15">
                {phaseModules.map((mod) => {
                  const status = getModuleStatus(mod.id, state);
                  const relevance = getModuleRelevance(mod.id, state);
                  const completed =
                    state.moduleProgress[mod.id]?.stepsCompleted?.length || 0;

                  return (
                    <ModuleCard
                      key={mod.id}
                      module={mod}
                      status={status}
                      relevance={relevance}
                      stepsCompleted={completed}
                      totalSteps={mod.setupSteps.length}
                      lockedReason={
                        status === "locked"
                          ? getLockedReason(mod.id)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue to main app */}
      <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8 text-center space-y-4 animate-fade-in-up">
        <h3 className="text-lg font-semibold">Ready to get started?</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          You can come back to this journey anytime. Head to your dashboard to
          start setting up your business.
        </p>
        <Button
          size="lg"
          className="px-8 gap-2"
          onClick={() => router.push("/onboarding")}
        >
          Continue to Setup
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
