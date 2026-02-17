"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SetupDashboardContent } from "@/components/onboard/setup-dashboard-content";
import type { OnboardState } from "@/lib/onboard-types";

export default function SetupGuide() {
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

  const handleStartOver = () => {
    localStorage.removeItem("universell-onboard-result");
    localStorage.removeItem("universell-onboard-state");
    router.push("/onboard");
  };

  return (
    <SetupDashboardContent 
      state={state} 
      onStartOver={handleStartOver}
      showStartOver={true}
    />
  );
}
