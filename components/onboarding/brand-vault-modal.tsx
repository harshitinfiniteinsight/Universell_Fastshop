"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Link,
  Palette,
  ImageIcon,
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Settings2,
  Instagram,
  FileUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
export interface BrandVaultData {
  coreAssets: {
    inspirationLinks: string[];
    logoFile: File | null;
    logoPreview: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  brandStyle: {
    designStyles: string[];
    typographyPreference: string | null;
  };
  personality: {
    brandTones: string[];
    targetAudience: string;
  };
  extras: {
    socialLinks: string[];
    brandGuidelinesUrl: string;
    notesForAi: string;
    dosAndDonts: string;
  };
}

interface BrandVaultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: BrandVaultData) => void;
  initialData?: Partial<BrandVaultData>;
}

// Full-screen Brand Vault component (for onboarding flow)
interface BrandVaultScreenProps {
  onSave: (data: BrandVaultData) => void;
  onBack: () => void;
  initialData?: Partial<BrandVaultData>;
  logoPreview?: string | null; // Logo from previous step for color extraction
}

const STEPS = [
  { id: 1, label: "Core Assets", shortLabel: "Core", required: true, icon: Palette },
  { id: 2, label: "Brand Style", shortLabel: "Style", required: false, icon: Sparkles },
  { id: 3, label: "Personality", shortLabel: "Personality", required: false, icon: Target },
  { id: 4, label: "Extras", shortLabel: "Extras", required: false, icon: Settings2 },
];

const DESIGN_STYLES = [
  { id: "modern", label: "Modern", emoji: "🔷" },
  { id: "minimal", label: "Minimal", emoji: "◻️" },
  { id: "playful", label: "Playful", emoji: "🎨" },
  { id: "elegant", label: "Elegant", emoji: "✨" },
  { id: "bold", label: "Bold", emoji: "🔥" },
];

const TYPOGRAPHY_OPTIONS = [
  { id: "clean-modern", label: "Clean & Modern", description: "Sans-serif, contemporary feel" },
  { id: "classic-professional", label: "Classic & Professional", description: "Serif, traditional elegance" },
  { id: "fun-friendly", label: "Fun & Friendly", description: "Rounded, approachable warmth" },
];

const BRAND_TONES = [
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "premium", label: "Premium", emoji: "👑" },
  { id: "playful", label: "Playful", emoji: "🎉" },
  { id: "trustworthy", label: "Trustworthy", emoji: "🤝" },
];

const DEFAULT_DATA: BrandVaultData = {
  coreAssets: {
    inspirationLinks: [""],
    logoFile: null,
    logoPreview: null,
    primaryColor: "#000000",
    secondaryColor: "#666666",
    accentColor: "#f04f29",
  },
  brandStyle: {
    designStyles: [],
    typographyPreference: null,
  },
  personality: {
    brandTones: [],
    targetAudience: "",
  },
  extras: {
    socialLinks: [""],
    brandGuidelinesUrl: "",
    notesForAi: "",
    dosAndDonts: "",
  },
};

export function BrandVaultModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: BrandVaultModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [data, setData] = useState<BrandVaultData>(() => ({
    ...DEFAULT_DATA,
    ...initialData,
    coreAssets: { ...DEFAULT_DATA.coreAssets, ...initialData?.coreAssets },
    brandStyle: { ...DEFAULT_DATA.brandStyle, ...initialData?.brandStyle },
    personality: { ...DEFAULT_DATA.personality, ...initialData?.personality },
    extras: { ...DEFAULT_DATA.extras, ...initialData?.extras },
  }));

  // Update helpers
  const updateCoreAssets = (updates: Partial<BrandVaultData["coreAssets"]>) => {
    setData((prev) => ({
      ...prev,
      coreAssets: { ...prev.coreAssets, ...updates },
    }));
  };

  const updateBrandStyle = (updates: Partial<BrandVaultData["brandStyle"]>) => {
    setData((prev) => ({
      ...prev,
      brandStyle: { ...prev.brandStyle, ...updates },
    }));
  };

  const updatePersonality = (updates: Partial<BrandVaultData["personality"]>) => {
    setData((prev) => ({
      ...prev,
      personality: { ...prev.personality, ...updates },
    }));
  };

  const updateExtras = (updates: Partial<BrandVaultData["extras"]>) => {
    setData((prev) => ({
      ...prev,
      extras: { ...prev.extras, ...updates },
    }));
  };

  // Navigation
  const goToStep = (step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      if (step > currentStep) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
      }
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    goToStep(currentStep - 1);
  };

  const handleSkip = () => {
    goToStep(currentStep + 1);
  };

  const handleSave = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    onSave(data);
    onOpenChange(false);
  };

  // Toggle functions
  const toggleDesignStyle = (styleId: string) => {
    const current = data.brandStyle.designStyles;
    if (current.includes(styleId)) {
      updateBrandStyle({ designStyles: current.filter((s) => s !== styleId) });
    } else {
      updateBrandStyle({ designStyles: [...current, styleId] });
    }
  };

  const toggleBrandTone = (toneId: string) => {
    const current = data.personality.brandTones;
    if (current.includes(toneId)) {
      updatePersonality({ brandTones: current.filter((t) => t !== toneId) });
    } else {
      updatePersonality({ brandTones: [...current, toneId] });
    }
  };

  // Step content renderers
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  // Step 1: Core Brand Assets
  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Website Inspiration */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Website Inspiration</Label>
        <p className="text-sm text-muted-foreground">
          Share websites you like — we&apos;ll use them as design references.
        </p>
        <div className="space-y-2">
          {data.coreAssets.inspirationLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => {
                    const links = [...data.coreAssets.inspirationLinks];
                    links[index] = e.target.value;
                    updateCoreAssets({ inspirationLinks: links });
                  }}
                  className="pl-10 h-11"
                />
              </div>
              {data.coreAssets.inspirationLinks.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-11 w-11 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    updateCoreAssets({
                      inspirationLinks: data.coreAssets.inspirationLinks.filter((_, i) => i !== index),
                    });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              updateCoreAssets({
                inspirationLinks: [...data.coreAssets.inspirationLinks, ""],
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add another
          </Button>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Brand Colors</Label>
        <div className="flex items-center gap-4">
          {/* Primary */}
          <div className="flex-1 space-y-1.5">
            <span className="text-xs text-muted-foreground">Primary</span>
            <div className="relative">
              <input
                type="color"
                value={data.coreAssets.primaryColor}
                onChange={(e) => updateCoreAssets({ primaryColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="h-11 rounded-lg border border-border cursor-pointer transition-all hover:ring-2 hover:ring-primary/20"
                style={{ backgroundColor: data.coreAssets.primaryColor }}
              />
            </div>
          </div>
          {/* Secondary */}
          <div className="flex-1 space-y-1.5">
            <span className="text-xs text-muted-foreground">Secondary</span>
            <div className="relative">
              <input
                type="color"
                value={data.coreAssets.secondaryColor}
                onChange={(e) => updateCoreAssets({ secondaryColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="h-11 rounded-lg border border-border cursor-pointer transition-all hover:ring-2 hover:ring-primary/20"
                style={{ backgroundColor: data.coreAssets.secondaryColor }}
              />
            </div>
          </div>
          {/* Accent */}
          <div className="flex-1 space-y-1.5">
            <span className="text-xs text-muted-foreground">Accent</span>
            <div className="relative">
              <input
                type="color"
                value={data.coreAssets.accentColor}
                onChange={(e) => updateCoreAssets({ accentColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="h-11 rounded-lg border border-border cursor-pointer transition-all hover:ring-2 hover:ring-primary/20"
                style={{ backgroundColor: data.coreAssets.accentColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Brand Style - Two column layout
  const renderStep2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Design Style */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-foreground">Design Style</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select all that match your vision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {DESIGN_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => toggleDesignStyle(style.id)}
              className={cn(
                "px-4 py-2.5 rounded-full border transition-all text-sm font-medium inline-flex items-center gap-2",
                data.brandStyle.designStyles.includes(style.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground bg-background"
              )}
            >
              <span>{style.emoji}</span>
              <span>{style.label}</span>
              {data.brandStyle.designStyles.includes(style.id) && (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Typography */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-foreground">Typography</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a font style that fits your brand.
          </p>
        </div>
        <div className="space-y-2">
          {TYPOGRAPHY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateBrandStyle({ typographyPreference: option.id })}
              className={cn(
                "w-full px-4 py-3 rounded-xl border transition-all text-left flex items-center justify-between",
                data.brandStyle.typographyPreference === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 bg-background"
              )}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              {data.brandStyle.typographyPreference === option.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 3: Brand Personality - Two column layout
  const renderStep3 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Brand Tone */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-foreground">Brand Tone</Label>
          <p className="text-sm text-muted-foreground mt-1">
            How should your brand feel? Pick all that apply.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {BRAND_TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => toggleBrandTone(tone.id)}
              className={cn(
                "px-4 py-2.5 rounded-full border transition-all text-sm font-medium inline-flex items-center gap-2",
                data.personality.brandTones.includes(tone.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground bg-background"
              )}
            >
              <span>{tone.emoji}</span>
              <span>{tone.label}</span>
              {data.personality.brandTones.includes(tone.id) && (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Target Audience */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-foreground">Target Audience</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Who are you trying to reach?
          </p>
        </div>
        <Input
          placeholder="e.g., Young professionals, health-conscious families..."
          value={data.personality.targetAudience}
          onChange={(e) => updatePersonality({ targetAudience: e.target.value })}
          className="h-11"
        />
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> Be specific about demographics, interests, or pain points to help us tailor your messaging.
          </p>
        </div>
      </div>
    </div>
  );

  // Step 4: Extras - Single column vertical layout
  const renderStep4 = () => (
    <div className="space-y-6 max-w-xl">
      {/* Social Links */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Social Links</Label>
        <div className="space-y-2">
          {data.extras.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="https://instagram.com/yourbrand"
                  value={link}
                  onChange={(e) => {
                    const links = [...data.extras.socialLinks];
                    links[index] = e.target.value;
                    updateExtras({ socialLinks: links });
                  }}
                  className="pl-10 h-11"
                />
              </div>
              {data.extras.socialLinks.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-11 w-11 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    updateExtras({
                      socialLinks: data.extras.socialLinks.filter((_, i) => i !== index),
                    });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              updateExtras({
                socialLinks: [...data.extras.socialLinks, ""],
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add another
          </Button>
        </div>
      </div>

      {/* Brand Guidelines URL */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Brand Guidelines URL</Label>
        <div className="relative">
          <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="https://drive.google.com/your-guidelines"
            value={data.extras.brandGuidelinesUrl}
            onChange={(e) => updateExtras({ brandGuidelinesUrl: e.target.value })}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Notes for AI */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Notes for AI / Designer</Label>
        <Textarea
          placeholder="Any specific preferences, must-haves, or things to keep in mind..."
          value={data.extras.notesForAi}
          onChange={(e) => updateExtras({ notesForAi: e.target.value })}
          className="min-h-[120px] resize-y"
        />
      </div>

      {/* Do's & Don'ts */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Do&apos;s & Don&apos;ts</Label>
        <Textarea
          placeholder="e.g., Don't use pink colors, Always include our tagline..."
          value={data.extras.dosAndDonts}
          onChange={(e) => updateExtras({ dosAndDonts: e.target.value })}
          className="min-h-[120px] resize-y"
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[860px] w-[calc(100%-48px)] max-h-[85vh] h-auto p-0 overflow-hidden rounded-2xl shadow-2xl border-border/50 flex flex-col"
      >
        {/* Header - Sticky */}
        <div className="shrink-0 px-6 py-5 border-b border-border flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create Your Brand Vault</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              You can edit everything later — nothing is final.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper - Sticky */}
        <div className="shrink-0 px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible = isCurrent || isCompleted || currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => isAccessible && goToStep(step.id)}
                    disabled={!isAccessible}
                    className={cn(
                      "flex items-center gap-2 transition-all",
                      isAccessible ? "cursor-pointer" : "cursor-default",
                      isCurrent ? "opacity-100" : isAccessible ? "opacity-70 hover:opacity-100" : "opacity-40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        isCurrent
                          ? "bg-primary text-white shadow-sm"
                          : isCompleted
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted && !isCurrent ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium hidden sm:block",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-px mx-3 transition-colors",
                        isCompleted || currentStep > step.id ? "bg-primary/40" : "bg-border"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-6 py-6">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="shrink-0 px-6 py-4 border-t border-border bg-background flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <Button variant="ghost" onClick={handleBack} className="text-muted-foreground">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < STEPS.length && !STEPS[currentStep - 1].required && (
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                Skip
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                Save Brand Vault & Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// BRAND VAULT SCREEN (Full-page version for onboarding)
// ============================================
export function BrandVaultScreen({
  onSave,
  onBack,
  initialData,
  logoPreview,
}: BrandVaultScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [colorsExtractedFromLogo, setColorsExtractedFromLogo] = useState(false);
  const [hasManuallyEditedColors, setHasManuallyEditedColors] = useState(false);
  const colorExtractionRef = useRef(false);
  const [data, setData] = useState<BrandVaultData>(() => ({
    ...DEFAULT_DATA,
    ...initialData,
    coreAssets: { ...DEFAULT_DATA.coreAssets, ...initialData?.coreAssets },
    brandStyle: { ...DEFAULT_DATA.brandStyle, ...initialData?.brandStyle },
    personality: { ...DEFAULT_DATA.personality, ...initialData?.personality },
    extras: { ...DEFAULT_DATA.extras, ...initialData?.extras },
  }));

  // Color extraction from logo
  useEffect(() => {
    // Only extract colors once, if we have a logo and colors haven't been manually edited
    if (logoPreview && !colorExtractionRef.current && !hasManuallyEditedColors) {
      // Skip if it's a recommended logo reference (starts with "recommended:")
      if (logoPreview.startsWith("recommended:")) {
        // Extract colors from the recommended logo string format
        const parts = logoPreview.split(":");
        if (parts.length >= 5) {
          const primaryColor = parts[3];
          const secondaryColor = parts[4];
          if (primaryColor && secondaryColor) {
            setData((prev) => ({
              ...prev,
              coreAssets: {
                ...prev.coreAssets,
                primaryColor: primaryColor,
                secondaryColor: secondaryColor,
                accentColor: primaryColor, // Use primary as accent fallback
              },
            }));
            setColorsExtractedFromLogo(true);
            colorExtractionRef.current = true;
          }
        }
        return;
      }
      
      // Extract colors from actual image using canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Scale down for performance
          const maxSize = 100;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          // Build color frequency map (excluding transparent and near-white/black pixels)
          const colorMap: Record<string, number> = {};
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            // Skip transparent pixels
            if (a < 128) continue;

            // Skip near-white and near-black (not distinctive brand colors)
            const brightness = (r + g + b) / 3;
            if (brightness > 240 || brightness < 15) continue;

            // Quantize colors to reduce noise (group similar colors)
            const qr = Math.round(r / 32) * 32;
            const qg = Math.round(g / 32) * 32;
            const qb = Math.round(b / 32) * 32;
            const key = `${qr},${qg},${qb}`;
            colorMap[key] = (colorMap[key] || 0) + 1;
          }

          // Sort by frequency
          const sortedColors = Object.entries(colorMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5 colors

          if (sortedColors.length >= 1) {
            const toHex = (rgb: string) => {
              const [r, g, b] = rgb.split(",").map(Number);
              return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            };

            const primaryColor = toHex(sortedColors[0][0]);
            const secondaryColor = sortedColors.length >= 2 ? toHex(sortedColors[1][0]) : "#666666";
            const accentColor = sortedColors.length >= 3 ? toHex(sortedColors[2][0]) : primaryColor;

            setData((prev) => ({
              ...prev,
              coreAssets: {
                ...prev.coreAssets,
                primaryColor,
                secondaryColor,
                accentColor,
              },
            }));
            setColorsExtractedFromLogo(true);
            colorExtractionRef.current = true;
          }
        } catch (error) {
          console.error("Error extracting colors from logo:", error);
        }
      };
      img.src = logoPreview;
    }
  }, [logoPreview, hasManuallyEditedColors]);

  // Update helpers - track manual edits for colors
  const updateCoreAssets = (updates: Partial<BrandVaultData["coreAssets"]>) => {
    // Check if any color is being updated
    if (updates.primaryColor || updates.secondaryColor || updates.accentColor) {
      setHasManuallyEditedColors(true);
    }
    setData((prev) => ({
      ...prev,
      coreAssets: { ...prev.coreAssets, ...updates },
    }));
  };

  const updateBrandStyle = (updates: Partial<BrandVaultData["brandStyle"]>) => {
    setData((prev) => ({
      ...prev,
      brandStyle: { ...prev.brandStyle, ...updates },
    }));
  };

  const updatePersonality = (updates: Partial<BrandVaultData["personality"]>) => {
    setData((prev) => ({
      ...prev,
      personality: { ...prev.personality, ...updates },
    }));
  };

  const updateExtras = (updates: Partial<BrandVaultData["extras"]>) => {
    setData((prev) => ({
      ...prev,
      extras: { ...prev.extras, ...updates },
    }));
  };

  // Navigation
  const goToStep = (step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      if (step > currentStep) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
      }
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    goToStep(currentStep + 1);
  };

  const handleBackStep = () => {
    goToStep(currentStep - 1);
  };

  const handleSkip = () => {
    goToStep(currentStep + 1);
  };

  const handleSave = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    onSave(data);
  };

  // Toggle functions
  const toggleDesignStyle = (styleId: string) => {
    const current = data.brandStyle.designStyles;
    if (current.includes(styleId)) {
      updateBrandStyle({ designStyles: current.filter((s) => s !== styleId) });
    } else {
      updateBrandStyle({ designStyles: [...current, styleId] });
    }
  };

  const toggleBrandTone = (toneId: string) => {
    const current = data.personality.brandTones;
    if (current.includes(toneId)) {
      updatePersonality({ brandTones: current.filter((t) => t !== toneId) });
    } else {
      updatePersonality({ brandTones: [...current, toneId] });
    }
  };

  // Step content renderers (same as modal)
  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Website Inspiration */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Website Inspiration</Label>
        <p className="text-sm text-muted-foreground">
          Share websites you like — we&apos;ll use them as design references.
        </p>
        <div className="space-y-2">
          {data.coreAssets.inspirationLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => {
                    const links = [...data.coreAssets.inspirationLinks];
                    links[index] = e.target.value;
                    updateCoreAssets({ inspirationLinks: links });
                  }}
                  className="pl-10 h-11"
                />
              </div>
              {data.coreAssets.inspirationLinks.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-11 w-11 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    updateCoreAssets({
                      inspirationLinks: data.coreAssets.inspirationLinks.filter((_, i) => i !== index),
                    });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              updateCoreAssets({
                inspirationLinks: [...data.coreAssets.inspirationLinks, ""],
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add another
          </Button>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Brand Colors</Label>
        <p className="text-sm text-muted-foreground">
          Pick your primary, secondary, and accent colors.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "primaryColor" as const, label: "Primary" },
            { key: "secondaryColor" as const, label: "Secondary" },
            { key: "accentColor" as const, label: "Accent" },
          ].map((color) => (
            <div key={color.key} className="space-y-2">
              <span className="text-xs text-muted-foreground">{color.label}</span>
              <div className="relative">
                <input
                  type="color"
                  value={data.coreAssets[color.key] || "#000000"}
                  onChange={(e) => updateCoreAssets({ [color.key]: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="h-11 rounded-lg border border-border flex items-center gap-2 px-3 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-md border border-border/50"
                    style={{ backgroundColor: data.coreAssets[color.key] || "#000000" }}
                  />
                  <span className="text-sm font-mono text-muted-foreground">
                    {(data.coreAssets[color.key] || "#000000").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {colorsExtractedFromLogo && !hasManuallyEditedColors && (
          <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-2">
            <Sparkles className="w-3 h-3" />
            These colors are suggested based on your logo — feel free to change them.
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Design Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Design Style</Label>
        <p className="text-sm text-muted-foreground">
          Pick styles that match your brand vibe.
        </p>
        <div className="flex flex-wrap gap-2">
          {DESIGN_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => toggleDesignStyle(style.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                data.brandStyle.designStyles.includes(style.id)
                  ? "bg-primary text-white border-primary"
                  : "bg-muted/30 text-foreground border-border hover:border-primary/50"
              )}
            >
              <span className="mr-1.5">{style.emoji}</span>
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Typography Preference</Label>
        <p className="text-sm text-muted-foreground">
          Choose the overall font feel for your site.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TYPOGRAPHY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateBrandStyle({ typographyPreference: option.id })}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                data.brandStyle.typographyPreference === option.id
                  ? "bg-primary/5 border-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              <p className="font-medium text-foreground text-sm">{option.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Brand Tones */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Brand Personality</Label>
        <p className="text-sm text-muted-foreground">
          Select tones that describe your brand voice.
        </p>
        <div className="flex flex-wrap gap-2">
          {BRAND_TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => toggleBrandTone(tone.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                data.personality.brandTones.includes(tone.id)
                  ? "bg-primary text-white border-primary"
                  : "bg-muted/30 text-foreground border-border hover:border-primary/50"
              )}
            >
              <span className="mr-1.5">{tone.emoji}</span>
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Target Audience</Label>
        <p className="text-sm text-muted-foreground">
          Who are your ideal customers?
        </p>
        <Textarea
          placeholder="e.g., Young professionals aged 25-40 who value sustainability and quality..."
          value={data.personality.targetAudience}
          onChange={(e) => updatePersonality({ targetAudience: e.target.value })}
          className="min-h-[100px] resize-y"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Social Links */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Social Media Links</Label>
        <div className="space-y-2">
          {data.extras.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="https://instagram.com/yourbrand"
                  value={link}
                  onChange={(e) => {
                    const links = [...data.extras.socialLinks];
                    links[index] = e.target.value;
                    updateExtras({ socialLinks: links });
                  }}
                  className="pl-10 h-11"
                />
              </div>
              {data.extras.socialLinks.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-11 w-11 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    updateExtras({
                      socialLinks: data.extras.socialLinks.filter((_, i) => i !== index),
                    });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              updateExtras({
                socialLinks: [...data.extras.socialLinks, ""],
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add another
          </Button>
        </div>
      </div>

      {/* Brand Guidelines URL */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Brand Guidelines</Label>
        <div className="relative">
          <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Link to your brand guidelines (PDF, Notion, etc.)"
            value={data.extras.brandGuidelinesUrl}
            onChange={(e) => updateExtras({ brandGuidelinesUrl: e.target.value })}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Notes for AI */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Notes for AI</Label>
        <Textarea
          placeholder="Any specific instructions or preferences for the AI..."
          value={data.extras.notesForAi}
          onChange={(e) => updateExtras({ notesForAi: e.target.value })}
          className="min-h-[100px] resize-y"
        />
      </div>

      {/* Do's & Don'ts */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Do&apos;s & Don&apos;ts</Label>
        <Textarea
          placeholder="e.g., Don't use pink colors, Always include our tagline..."
          value={data.extras.dosAndDonts}
          onChange={(e) => updateExtras({ dosAndDonts: e.target.value })}
          className="min-h-[120px] resize-y"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="shrink-0 px-6 py-5 border-b border-border flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create Your Brand Vault</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              You can edit everything later — nothing is final.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="shrink-0 px-6 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center max-w-3xl mx-auto">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible = isCurrent || isCompleted || currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isAccessible && goToStep(step.id)}
                  disabled={!isAccessible}
                  className={cn(
                    "flex items-center gap-2 transition-all",
                    isAccessible ? "cursor-pointer" : "cursor-default",
                    isCurrent ? "opacity-100" : isAccessible ? "opacity-70 hover:opacity-100" : "opacity-40"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      isCurrent
                        ? "bg-primary text-white shadow-sm"
                        : isCompleted
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-3 transition-colors",
                      isCompleted || currentStep > step.id ? "bg-primary/40" : "bg-border"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer - Sticky */}
      <div className="shrink-0 px-6 py-4 border-t border-border bg-background">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <Button variant="ghost" onClick={handleBackStep} className="text-muted-foreground">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < STEPS.length && !STEPS[currentStep - 1].required && (
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                Skip
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                Save Brand Vault & Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
