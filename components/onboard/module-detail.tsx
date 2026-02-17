"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ModuleDefinition, OnboardState, Industry } from "@/lib/onboard-types";
import { getModuleById, MODULES } from "@/lib/modules-data";
import {
  Package,
  Users,
  UserCog,
  ShoppingCart,
  Receipt,
  Megaphone,
  Gift,
  BarChart3,
  ArrowLeft,
  Check,
  Circle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Play,
  ArrowRight,
  PlusCircle,
  FolderPlus,
  Truck,
  Bell,
  Eye,
  Upload,
  Settings,
  Tags,
  GitBranch,
  UserPlus,
  Target,
  ListChecks,
  Lock,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Package,
  Users,
  UserCog,
  ShoppingCart,
  Receipt,
  Megaphone,
  Gift,
  BarChart3,
};

// Pick step icon from title keywords
function getStepIcon(title: string): React.ComponentType<{ className?: string }> {
  const t = title.toLowerCase();
  if (t.includes("segment") || t.includes("group")) return Tags;
  if (t.includes("category")) return FolderPlus;
  if (t.includes("lead")) return GitBranch;
  if (t.includes("prospect")) return Target;
  if (t.includes("vendor") || t.includes("supplier")) return Truck;
  if (t.includes("alert")) return Bell;
  if (t.includes("review") || t.includes("dashboard")) return Eye;
  if (t.includes("import")) return Upload;
  if (t.includes("configure") || t.includes("set up")) return Settings;
  if (t.includes("add") || t.includes("first") || t.includes("customer")) return UserPlus;
  if (t.includes("set up")) return Settings;
  if (t.includes("create")) return FolderPlus;
  return PlusCircle;
}

// Map module IDs to their main app routes for "Go to Step" buttons
const MODULE_ROUTES: Record<string, string> = {
  inventory: "/inventory",
  crm: "/crm",
  employees: "/employees",
  fastshop: "/fastshop",
  invoices: "/sales",
  marketing: "/marketing",
  rewards: "/marketing",
  analytics: "/dashboard",
};

interface Props {
  module: ModuleDefinition;
  state: OnboardState;
  onToggleStep: (stepId: string) => void;
}

export function ModuleDetail({ module, state, onToggleStep }: Props) {
  const Icon = ICON_MAP[module.icon] || Package;
  const industry = (state.answers.industry || "default") as Industry | "default";
  const whyItMatters = module.whyItMatters[industry] || module.whyItMatters.default;
  const completedSteps = state.moduleProgress[module.id]?.stepsCompleted || [];
  const totalSteps = module.setupSteps.length;
  const doneCount = completedSteps.length;
  const progress = totalSteps > 0 ? (doneCount / totalSteps) * 100 : 0;
  const isComplete = doneCount === totalSteps;

  // Module is a prerequisite for others (e.g. Inventory for Fast Shop, CRM for Invoices)
  const isModulePrerequisiteForOthers = MODULES.some((m) =>
    m.prerequisites.includes(module.id)
  );
  // First step of a prerequisite module cannot be skipped - it unlocks the next module
  const cannotSkipStep = (stepIndex: number) =>
    isModulePrerequisiteForOthers && stepIndex === 0;

  const prereqModules = module.prerequisites
    .map((id) => getModuleById(id))
    .filter(Boolean);
  const prereqsMet = module.prerequisites.every((id) => {
    const prereqDone = state.moduleProgress[id]?.stepsCompleted || [];
    const prereqModule = getModuleById(id);
    return prereqModule && prereqDone.length >= 1;
  });

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/setup"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Journey
      </Link>

      {/* Header */}
      <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8 animate-fade-in-up">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{module.name}</h1>
              {isComplete && (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                  Complete
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{module.shortDescription}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Setup progress: {doneCount} of {totalSteps} steps
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Prerequisites warning */}
      {prereqModules.length > 0 && !prereqsMet && (
        <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">
              Prerequisites needed
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-0.5">
              Complete at least one step in{" "}
              {prereqModules.map((m, i) => (
                <span key={m!.id}>
                  <Link
                    href={`/dashboard/setup/${m!.id}`}
                    className="font-medium underline underline-offset-2"
                  >
                    {m!.name}
                  </Link>
                  {i < prereqModules.length - 1 ? " and " : ""}
                </span>
              ))}{" "}
              first.
            </p>
          </div>
        </div>
      )}

      {/* Why it matters */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-2">
          Why this matters for {state.answers.businessName || "your business"}
        </h3>
        <p className="text-sm text-muted-foreground">{whyItMatters}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setup Checklist */}
        <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Setup Checklist</h2>
              <p className="text-sm text-muted-foreground">
                {doneCount} of {totalSteps} completed
              </p>
            </div>
          </div>

          <div className="relative space-y-0">
            {/* Timeline connector */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-border" />
            {totalSteps > 0 && (
              <div
                className="absolute left-[27px] top-6 w-0.5 bg-emerald-500 transition-all duration-500"
                style={{ height: `${(doneCount / totalSteps) * 100}%` }}
              />
            )}

            {module.setupSteps.map((step, index) => {
              const isDone = completedSteps.includes(step.id);
              const hasPrereq = step.prerequisiteModuleId;
              const prereqDone = hasPrereq
                ? (state.moduleProgress[hasPrereq]?.stepsCompleted?.length || 0) >= 1
                : true;
              const stepRoute = MODULE_ROUTES[module.id] || "/dashboard";
              const canGoToStep = prereqDone;
              const isLocked = hasPrereq && !prereqDone && !isDone;
              const canSkip = canGoToStep && !isDone && !cannotSkipStep(index);
              const StepIcon = getStepIcon(step.title);

              return (
                <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Step icon / status */}
                  <div className="relative z-10 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleStep(step.id)}
                      disabled={isLocked}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                        isDone
                          ? "bg-emerald-500 text-white border-2 border-emerald-500"
                          : isLocked
                          ? "bg-muted/50 text-muted-foreground border-2 border-border cursor-not-allowed"
                          : "bg-card border-2 border-border hover:border-primary hover:shadow-md cursor-pointer"
                      )}
                    >
                      {isDone ? (
                        <Check className="w-7 h-7" strokeWidth={2.5} />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6 text-primary" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                        isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Step content card */}
                  <div
                    className={cn(
                      "flex-1 min-w-0 rounded-xl border-2 p-5 transition-all",
                      isDone
                        ? "bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/30"
                        : isLocked
                        ? "bg-muted/30 border-border opacity-75"
                        : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Step {index + 1}
                      </span>
                      {hasPrereq && !prereqDone && (
                        <Badge variant="outline" className="text-[10px] py-0.5 gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Requires {getModuleById(hasPrereq)?.name || hasPrereq}
                        </Badge>
                      )}
                    </div>
                    <p
                      className={cn(
                        "font-semibold text-base",
                        isDone && "line-through text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {hasPrereq && !prereqDone && (
                        <Link
                          href={`/dashboard/setup/${hasPrereq}`}
                          className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                        >
                          Complete {getModuleById(hasPrereq)?.name} first
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {canGoToStep && !isDone && (
                        <Link href={stepRoute}>
                          <Button size="sm" className="gap-2">
                            Go to Step
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                      {canSkip && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2 text-muted-foreground hover:text-foreground"
                          onClick={() => onToggleStep(step.id)}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Video placeholder - compact card above Key Features */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="aspect-video bg-muted/50 flex flex-col items-center justify-center gap-2 relative group cursor-pointer hover:bg-muted/70 transition-colors min-h-[100px]">
              <div className="w-10 h-10 rounded-full bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-colors">
                <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
              </div>
              <div className="text-center px-2">
                <p className="font-medium text-foreground text-sm">
                  Getting started with {module.name}
                </p>
                <p className="text-xs text-muted-foreground">2 min overview</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Key Features</h2>
            <ul className="space-y-2.5">
              {module.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-3">About This Module</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {module.fullDescription}
            </p>
            <Button variant="outline" size="sm" className="mt-4 gap-2 w-full">
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Universell
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
