"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OnboardProgress } from "./onboard-progress";
import { StepBusinessBasics } from "./step-business-basics";
import { StepOperations } from "./step-operations";
import { StepPainPoints } from "./step-pain-points";
import { StepGoals } from "./step-goals";
import { StepReview } from "./step-review";
import type { OnboardAnswers } from "@/lib/onboard-types";
import { generateRecommendations } from "@/lib/recommendations";

const STORAGE_KEY = "universell-onboard-state";

const STEPS = [
  { id: 1, name: "Business" },
  { id: 2, name: "Operations" },
  { id: 3, name: "Challenges" },
  { id: 4, name: "Goals" },
  { id: 5, name: "Review" },
];

const initialAnswers: OnboardAnswers = {
  businessName: "",
  industry: "",
  businessSize: "",
  sellsProducts: false,
  offersServices: false,
  hasPhysicalStore: false,
  sellsOnline: "",
  hasEmployees: false,
  painPoints: [],
  goals: [],
};

export function OnboardWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardAnswers>(initialAnswers);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.step) setCurrentStep(parsed.step);
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback(
    (newAnswers: OnboardAnswers, step: number) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ answers: newAnswers, step })
        );
      } catch {
        // ignore
      }
    },
    []
  );

  const updateAnswers = (partial: Partial<OnboardAnswers>) => {
    const updated = { ...answers, ...partial };
    setAnswers(updated);
    persist(updated, currentStep);
  };

  const nextStep = () => {
    const next = Math.min(currentStep + 1, STEPS.length);
    setCurrentStep(next);
    persist(answers, next);
  };

  const prevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    setCurrentStep(prev);
    persist(answers, prev);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
      persist(answers, step);
    }
  };

  const handleGenerate = () => {
    const recommendations = generateRecommendations(answers);
    const state = {
      answers,
      recommendations,
      moduleProgress: {} as Record<string, { stepsCompleted: string[] }>,
    };
    localStorage.setItem("universell-onboard-result", JSON.stringify(state));
    router.push("/dashboard/setup");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBusinessBasics
            data={answers}
            onUpdate={updateAnswers}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <StepOperations
            data={answers}
            onUpdate={updateAnswers}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <StepPainPoints
            data={answers}
            onUpdate={updateAnswers}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <StepGoals
            data={answers}
            onUpdate={updateAnswers}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <StepReview
            data={answers}
            onBack={prevStep}
            onGenerate={handleGenerate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <OnboardProgress
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={goToStep}
      />
      <div className="bg-card rounded-xl border shadow-sm">{renderStep()}</div>
    </div>
  );
}
