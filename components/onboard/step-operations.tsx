"use client";

import { Button } from "@/components/ui/button";
import type { OnboardAnswers, ThreeWay } from "@/lib/onboard-types";
import {
  ArrowRight,
  ArrowLeft,
  Package,
  Scissors,
  Store,
  Globe,
  Users,
} from "lucide-react";

interface Props {
  data: OnboardAnswers;
  onUpdate: (data: Partial<OnboardAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ToggleCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

function ToggleCard({ icon, label, description, active, onClick }: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all w-full ${
        active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/30 hover:bg-muted/50"
      }`}
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div
        className={`shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-all ${
          active ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {active && (
          <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

interface ThreeWayCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: ThreeWay | "";
  onChange: (value: ThreeWay) => void;
}

function ThreeWayCard({ icon, label, description, value, onChange }: ThreeWayCardProps) {
  return (
    <div className="p-5 rounded-xl border-2 border-border space-y-3">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-sm">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex gap-2 ml-14">
        {(["yes", "no", "planning"] as ThreeWay[]).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              value === opt
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {opt === "yes" ? "Yes" : opt === "no" ? "No" : "Planning to"}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepOperations({ data, onUpdate, onNext, onBack }: Props) {
  return (
    <div className="p-8 md:p-12 space-y-8 animate-fade-in-up">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold">How do you operate?</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Help us understand your day-to-day business operations.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <ToggleCard
          icon={<Package className="w-5 h-5" />}
          label="Do you sell physical products?"
          description="Tangible goods that need inventory tracking"
          active={data.sellsProducts}
          onClick={() => onUpdate({ sellsProducts: !data.sellsProducts })}
        />

        <ToggleCard
          icon={<Scissors className="w-5 h-5" />}
          label="Do you offer services or appointments?"
          description="Bookable services like haircuts, consultations, classes"
          active={data.offersServices}
          onClick={() => onUpdate({ offersServices: !data.offersServices })}
        />

        <ToggleCard
          icon={<Store className="w-5 h-5" />}
          label="Do you have a physical store location?"
          description="A brick-and-mortar location where customers visit"
          active={data.hasPhysicalStore}
          onClick={() => onUpdate({ hasPhysicalStore: !data.hasPhysicalStore })}
        />

        <ThreeWayCard
          icon={<Globe className="w-5 h-5" />}
          label="Do you sell online?"
          description="E-commerce website, online marketplace, or social selling"
          value={data.sellsOnline}
          onChange={(value) => onUpdate({ sellsOnline: value })}
        />

        <ToggleCard
          icon={<Users className="w-5 h-5" />}
          label="Do you have employees to manage?"
          description="Staff members who work in your business"
          active={data.hasEmployees}
          onClick={() => onUpdate({ hasEmployees: !data.hasEmployees })}
        />
      </div>

      <div className="flex justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onBack} size="lg" className="px-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={onNext} size="lg" className="px-8 gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
