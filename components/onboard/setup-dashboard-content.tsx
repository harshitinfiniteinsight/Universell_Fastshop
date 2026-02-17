"use client";

import { useState } from "react";
import { ModuleCard } from "@/components/onboard/module-card";
import { MODULES, PHASE_LABELS, getModuleById } from "@/lib/modules-data";
import type { OnboardState, ModuleStatus, RelevanceLevel } from "@/lib/onboard-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  RotateCcw,
  ChevronRight,
  FileText,
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

interface SetupDashboardContentProps {
  state: OnboardState;
  onStartOver?: () => void;
  showStartOver?: boolean;
  /** When true, only show essential + recommended modules (hides optional) - for preview to differentiate scenarios */
  essentialAndRecommendedOnly?: boolean;
}

export function SetupDashboardContent({
  state,
  onStartOver,
  showStartOver = true,
  essentialAndRecommendedOnly = false,
}: SetupDashboardContentProps) {
  const [showSampleReport, setShowSampleReport] = useState(false);

  const recommendedModules = state.recommendations
    .filter((r) => {
      if (r.score <= 0) return false;
      if (essentialAndRecommendedOnly) {
        return r.relevance === "essential" || r.relevance === "recommended";
      }
      return true;
    })
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
      {/* Onboarding dashboard notice + EOD report placeholder */}
      <div className="bg-muted/50 border border-border rounded-xl p-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground mb-1">
                This is an onboarding dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Once you have enough data, you will see the EOD report here.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
            onClick={() => setShowSampleReport(true)}
          >
            <FileText className="w-3.5 h-3.5" />
            See the sample EOD report
          </Button>
        </div>
      </div>

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
          {showStartOver && onStartOver && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 shrink-0"
              onClick={onStartOver}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start Over
            </Button>
          )}
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

      {/* Sample EOD Report popup */}
      <Dialog open={showSampleReport} onOpenChange={setShowSampleReport}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sample EOD Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              End of Day summary report. This is a sample — your actual report will appear once you have enough transaction data.
            </p>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-right p-3 font-medium">Sales</th>
                    <th className="text-right p-3 font-medium">Orders</th>
                    <th className="text-right p-3 font-medium">Customers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Feb 10, 2025</td>
                    <td className="text-right p-3">$2,450</td>
                    <td className="text-right p-3">48</td>
                    <td className="text-right p-3">42</td>
                  </tr>
                  <tr className="border-t bg-muted/20">
                    <td className="p-3">Feb 9, 2025</td>
                    <td className="text-right p-3">$2,180</td>
                    <td className="text-right p-3">41</td>
                    <td className="text-right p-3">38</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Feb 8, 2025</td>
                    <td className="text-right p-3">$2,890</td>
                    <td className="text-right p-3">55</td>
                    <td className="text-right p-3">49</td>
                  </tr>
                  <tr className="border-t bg-muted/20">
                    <td className="p-3">Feb 7, 2025</td>
                    <td className="text-right p-3">$1,920</td>
                    <td className="text-right p-3">36</td>
                    <td className="text-right p-3">34</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Sample data for demonstration only.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
