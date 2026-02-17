"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ModuleDefinition, ModuleStatus, RelevanceLevel } from "@/lib/onboard-types";
import {
  Package,
  Users,
  UserCog,
  ShoppingCart,
  Receipt,
  Megaphone,
  Gift,
  BarChart3,
  Lock,
  Check,
  ChevronRight,
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

function getStatusBadge(status: ModuleStatus) {
  switch (status) {
    case "complete":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800">Complete</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800">In Progress</Badge>;
    case "ready":
      return <Badge variant="outline">Ready</Badge>;
    case "locked":
      return <Badge className="bg-muted text-muted-foreground border-border">Locked</Badge>;
  }
}

function getRelevanceBadge(relevance: RelevanceLevel) {
  switch (relevance) {
    case "essential":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Essential</Badge>;
    case "recommended":
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800">Recommended</Badge>;
    case "optional":
      return <Badge variant="secondary">Optional</Badge>;
  }
}

interface Props {
  module: ModuleDefinition;
  status: ModuleStatus;
  relevance: RelevanceLevel;
  stepsCompleted: number;
  totalSteps: number;
  lockedReason?: string;
}

export function ModuleCard({
  module,
  status,
  relevance,
  stepsCompleted,
  totalSteps,
  lockedReason,
}: Props) {
  const Icon = ICON_MAP[module.icon] || Package;
  const isLocked = status === "locked";
  const progress = totalSteps > 0 ? (stepsCompleted / totalSteps) * 100 : 0;

  const content = (
    <div
      className={cn(
        "group relative rounded-xl border-2 p-5 transition-all",
        isLocked
          ? "border-border bg-muted/30 opacity-60 cursor-not-allowed"
          : "border-border hover:border-primary/40 cursor-pointer bg-card card-hover-lift"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}
        >
          {isLocked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div className="flex items-center gap-2">
          {getRelevanceBadge(relevance)}
          {getStatusBadge(status)}
        </div>
      </div>

      <h3 className="font-semibold text-base mb-1">{module.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {module.shortDescription}
      </p>

      {isLocked && lockedReason ? (
        <p className="text-xs text-muted-foreground italic">{lockedReason}</p>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              {stepsCompleted} of {totalSteps} steps
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                status === "complete" ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      {!isLocked && (
        <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {status === "complete" ? "View details" : "Set up now"}
          <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      )}

      {status === "complete" && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link href={`/dashboard/setup/${module.id}`}>
      {content}
    </Link>
  );
}
