"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OnboardAnswers, Industry, BusinessSize } from "@/lib/onboard-types";
import { INDUSTRIES, BUSINESS_SIZES } from "@/lib/onboard-types";
import { Building2, ArrowRight } from "lucide-react";

interface Props {
  data: OnboardAnswers;
  onUpdate: (data: Partial<OnboardAnswers>) => void;
  onNext: () => void;
}

export function StepBusinessBasics({ data, onUpdate, onNext }: Props) {
  const isValid = data.businessName.trim() && data.industry && data.businessSize;

  return (
    <div className="p-8 md:p-12 space-y-8 animate-fade-in-up">
      <div className="text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center animate-scale-in">
          <Building2 className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Tell us about your business</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We&apos;ll use this to recommend the right Universell modules for you.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            placeholder="e.g. Sunrise Cafe & Bakery"
            value={data.businessName}
            onChange={(e) => onUpdate({ businessName: e.target.value })}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Industry</Label>
          <Select
            value={data.industry}
            onValueChange={(value) => onUpdate({ industry: value as Industry })}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Business Size</Label>
          <div className="grid grid-cols-2 gap-3">
            {BUSINESS_SIZES.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => onUpdate({ businessSize: size.value as BusinessSize })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.businessSize === size.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                <p className="font-semibold text-sm">{size.label}</p>
                <p className="text-xs text-muted-foreground">{size.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={onNext}
          disabled={!isValid}
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
