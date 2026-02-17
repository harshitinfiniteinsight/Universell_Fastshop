"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleDetail } from "@/components/onboard/module-detail";
import { getModuleById } from "@/lib/modules-data";
import type { OnboardState } from "@/lib/onboard-types";

const STORAGE_KEY = "universell-onboard-result";

export default function ModuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.module as string;
  const [state, setState] = useState<OnboardState | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      } else {
        router.push("/onboard");
      }
    } catch {
      router.push("/onboard");
    }
  }, [router]);

  const persist = useCallback((newState: OnboardState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // ignore
    }
  }, []);

  const module = getModuleById(moduleId);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Module not found</h2>
        <p className="text-muted-foreground">
          The module &quot;{moduleId}&quot; does not exist.
        </p>
      </div>
    );
  }

  const handleToggleStep = (stepId: string) => {
    const current = state.moduleProgress[moduleId]?.stepsCompleted || [];
    const isCompleted = current.includes(stepId);
    const updated = isCompleted
      ? current.filter((id) => id !== stepId)
      : [...current, stepId];

    const newState: OnboardState = {
      ...state,
      moduleProgress: {
        ...state.moduleProgress,
        [moduleId]: { stepsCompleted: updated },
      },
    };

    setState(newState);
    persist(newState);
  };

  return <ModuleDetail module={module} state={state} onToggleStep={handleToggleStep} />;
}
