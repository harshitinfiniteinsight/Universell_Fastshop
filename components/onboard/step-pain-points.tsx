"use client";

import { Button } from "@/components/ui/button";
import type { OnboardAnswers } from "@/lib/onboard-types";
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Package,
  Users,
  Megaphone,
  CreditCard,
  UserCog,
  Globe,
  Heart,
  Truck,
  BarChart3,
  FileSignature,
  Calendar,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: OnboardAnswers;
  onUpdate: (data: Partial<OnboardAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CHALLENGES = [
  {
    id: "inventory",
    label: "Inventory Tracking",
    description: "Keeping stock accurate across channels",
    icon: Package,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    selectedBg: "bg-blue-50 dark:bg-blue-500/5",
  },
  {
    id: "crm",
    label: "Customer Management",
    description: "Organizing leads, contacts, and follow-ups",
    icon: Users,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-500/10",
    selectedBg: "bg-violet-50 dark:bg-violet-500/5",
  },
  {
    id: "marketing",
    label: "Marketing Campaigns",
    description: "Running effective email and SMS outreach",
    icon: Megaphone,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-500/10",
    selectedBg: "bg-pink-50 dark:bg-pink-500/5",
  },
  {
    id: "payments",
    label: "Payments & Invoicing",
    description: "Getting paid on time with less hassle",
    icon: CreditCard,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    selectedBg: "bg-emerald-50 dark:bg-emerald-500/5",
  },
  {
    id: "employees",
    label: "Employee & Schedules",
    description: "Managing shifts, payroll, and team access",
    icon: UserCog,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-500/10",
    selectedBg: "bg-amber-50 dark:bg-amber-500/5",
  },
  {
    id: "online",
    label: "Online Presence",
    description: "Building a website or online store",
    icon: Globe,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-100 dark:bg-cyan-500/10",
    selectedBg: "bg-cyan-50 dark:bg-cyan-500/5",
  },
  {
    id: "loyalty",
    label: "Customer Loyalty",
    description: "Retaining customers and driving repeat visits",
    icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-500/10",
    selectedBg: "bg-rose-50 dark:bg-rose-500/5",
  },
  {
    id: "orders",
    label: "Order Fulfillment",
    description: "Streamlining delivery and shipping workflows",
    icon: Truck,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-500/10",
    selectedBg: "bg-orange-50 dark:bg-orange-500/5",
  },
  {
    id: "analytics",
    label: "Business Analytics",
    description: "Understanding data to make better decisions",
    icon: BarChart3,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-500/10",
    selectedBg: "bg-indigo-50 dark:bg-indigo-500/5",
  },
  {
    id: "agreements",
    label: "Contracts & Agreements",
    description: "Managing digital signatures and documents",
    icon: FileSignature,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-500/10",
    selectedBg: "bg-slate-50 dark:bg-slate-500/5",
  },
  {
    id: "appointments",
    label: "Appointment Scheduling",
    description: "Booking services and managing availability",
    icon: Calendar,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-500/10",
    selectedBg: "bg-green-50 dark:bg-green-500/5",
  },
];

export function StepPainPoints({ data, onUpdate, onNext, onBack }: Props) {
  const togglePainPoint = (id: string) => {
    const current = data.painPoints;
    const updated = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onUpdate({ painPoints: updated });
  };

  const selectedCount = data.painPoints.length;

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in-up">
      <div className="text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center animate-scale-in">
          <AlertTriangle className="w-7 h-7 text-orange-600 dark:text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold">What challenges do you face?</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select all that apply. This helps us prioritize the right tools for you.
        </p>
        {selectedCount > 0 && (
          <p className="text-xs font-medium text-primary">{selectedCount} selected</p>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHALLENGES.map((item, index) => {
            const isSelected = data.painPoints.includes(item.id);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => togglePainPoint(item.id)}
                className={cn(
                  "relative flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all group",
                  `animate-fade-in-up delay-${Math.min(index * 100, 500)}`,
                  isSelected
                    ? `border-primary ${item.selectedBg} shadow-sm`
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isSelected ? `${item.bg}` : "bg-muted group-hover:scale-105"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isSelected ? item.color : "text-muted-foreground"
                    )}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="font-semibold text-sm leading-tight">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>

                {/* Check indicator */}
                <div
                  className={cn(
                    "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5",
                    isSelected
                      ? "bg-primary border-primary text-white scale-110"
                      : "border-border group-hover:border-primary/40"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onBack} size="lg" className="px-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedCount === 0}
          size="lg"
          className="px-8 gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
