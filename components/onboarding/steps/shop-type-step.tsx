"use client";

import { Button } from "@/components/ui/button";
import { ShopType } from "../wizard-container";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Briefcase,
  Calendar,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopTypeStepProps {
  selectedType: ShopType;
  onSelect: (type: ShopType) => void;
  onNext: () => void;
  onBack: () => void;
}

const shopTypes = [
  {
    id: "products" as ShopType,
    icon: ShoppingBag,
    title: "Products Only",
    description: "Sell physical or digital products with an e-commerce store",
    examples: "Clothing, Electronics, Digital Downloads",
  },
  {
    id: "services" as ShopType,
    icon: Briefcase,
    title: "Services Only",
    description: "Offer professional services to your customers",
    examples: "Consulting, Design, Marketing",
  },
  {
    id: "booking" as ShopType,
    icon: Calendar,
    title: "Booking Type",
    description: "Allow customers to book appointments or reservations",
    examples: "Salon, Restaurant, Medical Practice",
  },
  {
    id: "both" as ShopType,
    icon: Layers,
    title: "Products + Services",
    description: "Hybrid model - sell products and offer services together",
    examples: "Spa with Products, Auto Shop with Parts",
  },
];

export function ShopTypeStep({
  selectedType,
  onSelect,
  onNext,
  onBack,
}: ShopTypeStepProps) {
  const handleNext = () => {
    if (selectedType) {
      onNext();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            What type of shop are you creating?
          </h2>
          <p className="text-muted-foreground mt-1">
            Choose the option that best describes your business model
          </p>
        </div>

        {/* Shop type cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => onSelect(type.id)}
                className={cn(
                  "relative p-6 rounded-lg border-2 text-left transition-all hover:shadow-md",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  <type.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {type.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Examples:</span> {type.examples}
                </p>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!selectedType}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
