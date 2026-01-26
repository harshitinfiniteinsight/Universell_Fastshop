"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Type,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  Plus,
  X,
  Check,
  Upload,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrandVault } from "@/lib/brand-vault-context";
import { hasBrandData, getBrandDataSummary } from "@/lib/brand-data-normalizer";

const DESIGN_STYLES = [
  { id: "modern", label: "Modern", emoji: "🔷" },
  { id: "minimal", label: "Minimal", emoji: "◻️" },
  { id: "playful", label: "Playful", emoji: "🎨" },
  { id: "elegant", label: "Elegant", emoji: "✨" },
  { id: "bold", label: "Bold", emoji: "🔥" },
  { id: "vintage", label: "Vintage", emoji: "📜" },
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
  { id: "innovative", label: "Innovative", emoji: "💡" },
  { id: "casual", label: "Casual", emoji: "☕" },
  { id: "authoritative", label: "Authoritative", emoji: "📢" },
];

export function BrandVaultEditor() {
  const {
    brand,
    updateBrand,
    updateColors,
    updateTypography,
    updateLogo,
    updateVoice,
    updateStyle,
    updateSocial,
    saveBrand,
    resetBrand,
    isDirty,
    lastSaved,
    isLoading,
  } = useBrandVault();

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDataSummary, setShowDataSummary] = useState(true);

  // Get data summary for status display
  const dataSummary = getBrandDataSummary(brand);
  const hasData = hasBrandData(brand);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBrand();
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLogo({
          url: reader.result as string,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDesignStyle = (styleId: string) => {
    const current = brand.style.designStyles;
    if (current.includes(styleId)) {
      updateStyle({ designStyles: current.filter((s) => s !== styleId) });
    } else {
      updateStyle({ designStyles: [...current, styleId] });
    }
  };

  const toggleBrandTone = (toneId: string) => {
    const current = brand.voice.tones;
    if (current.includes(toneId)) {
      updateVoice({ tones: current.filter((t) => t !== toneId) });
    } else {
      updateVoice({ tones: [...current, toneId] });
    }
  };

  const addInspirationLink = () => {
    updateStyle({
      inspirationLinks: [...brand.style.inspirationLinks, ""],
    });
  };

  const updateInspirationLink = (index: number, value: string) => {
    const links = [...brand.style.inspirationLinks];
    links[index] = value;
    updateStyle({ inspirationLinks: links });
  };

  const removeInspirationLink = (index: number) => {
    updateStyle({
      inspirationLinks: brand.style.inspirationLinks.filter((_, i) => i !== index),
    });
  };

  const addSocialLink = () => {
    updateSocial({
      links: [...brand.social.links, ""],
    });
  };

  const updateSocialLink = (index: number, value: string) => {
    const links = [...brand.social.links];
    links[index] = value;
    updateSocial({ links });
  };

  const removeSocialLink = (index: number) => {
    updateSocial({
      links: brand.social.links.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Status Banner */}
      {showDataSummary && hasData && (
        <div className="relative bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
          <button
            onClick={() => setShowDataSummary(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Brand data loaded from your onboarding
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {dataSummary.populatedFields} of {dataSummary.totalFields} fields are populated. 
                {dataSummary.missingFields.length > 0 && (
                  <> Complete the remaining fields: <span className="text-foreground">{dataSummary.missingFields.slice(0, 3).join(", ")}</span>{dataSummary.missingFields.length > 3 && ` and ${dataSummary.missingFields.length - 3} more`}.</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(dataSummary.populatedFields / dataSummary.totalFields) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-primary">
                  {Math.round((dataSummary.populatedFields / dataSummary.totalFields) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo Preview in Header */}
          {brand.logo.url && (
            <div className="w-14 h-14 rounded-xl border-2 border-border overflow-hidden bg-white flex-shrink-0 shadow-sm">
              <img
                src={brand.logo.url}
                alt={brand.logo.altText || "Brand logo"}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {brand.brandName || "Brand Vault"}
            </h1>
            <p className="text-muted-foreground">
              {brand.tagline || "Manage your brand identity in one place. Changes sync across all pages."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Last saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isDirty && (
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
              Unsaved changes
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={resetBrand}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !isDirty}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Identity
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Assets
          </TabsTrigger>
        </TabsList>

        {/* Identity Tab */}
        <TabsContent value="identity" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Brand Identity</h2>
            <div className="grid gap-6 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  placeholder="Your brand name"
                  value={brand.brandName}
                  onChange={(e) => updateBrand({ brandName: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.name}}"}</code>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="A catchy phrase that describes your brand"
                  value={brand.tagline}
                  onChange={(e) => updateBrand({ tagline: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.tagline}}"}</code>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Design Style</h2>
                <p className="text-sm text-muted-foreground">
                  Select styles that represent your brand aesthetic
                </p>
              </div>
              {brand.style.designStyles.length > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {brand.style.designStyles.length} selected
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {DESIGN_STYLES.map((style) => {
                const isSelected = brand.style.designStyles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    onClick={() => toggleDesignStyle(style.id)}
                    className={cn(
                      "relative px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                        : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full border-2 border-primary flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-primary" />
                      </span>
                    )}
                    <span className="mr-2 text-base">{style.emoji}</span>
                    {style.label}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Website Inspiration</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Share websites you like — we&apos;ll use them as design references.
            </p>
            <div className="space-y-3">
              {brand.style.inspirationLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://example.com"
                      value={link}
                      onChange={(e) => updateInspirationLink(index, e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {brand.style.inspirationLinks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInspirationLink(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addInspirationLink}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add another
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Brand Colors</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Define your brand&apos;s color palette. These colors will be used across your website.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Color */}
              <div className="space-y-3">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={brand.colors.primary}
                      onChange={(e) => updateColors({ primary: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: brand.colors.primary }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={brand.colors.primary}
                      onChange={(e) => updateColors({ primary: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.primaryColor}}"}</code>
                </p>
              </div>

              {/* Secondary Color */}
              <div className="space-y-3">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={brand.colors.secondary}
                      onChange={(e) => updateColors({ secondary: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: brand.colors.secondary }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={brand.colors.secondary}
                      onChange={(e) => updateColors({ secondary: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.secondaryColor}}"}</code>
                </p>
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={brand.colors.accent}
                      onChange={(e) => updateColors({ accent: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: brand.colors.accent }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={brand.colors.accent}
                      onChange={(e) => updateColors({ accent: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.accentColor}}"}</code>
                </p>
              </div>

              {/* Background Color */}
              <div className="space-y-3">
                <Label>Background Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={brand.colors.background || "#ffffff"}
                      onChange={(e) => updateColors({ background: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: brand.colors.background }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={brand.colors.background || "#ffffff"}
                      onChange={(e) => updateColors({ background: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.backgroundColor}}"}</code>
                </p>
              </div>

              {/* Text Color */}
              <div className="space-y-3">
                <Label>Text Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={brand.colors.text || "#1a1a1a"}
                      onChange={(e) => updateColors({ text: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: brand.colors.text }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={brand.colors.text || "#1a1a1a"}
                      onChange={(e) => updateColors({ text: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.textColor}}"}</code>
                </p>
              </div>
            </div>

            {/* Color Preview */}
            <Separator className="my-6" />
            <h3 className="text-sm font-medium mb-4">Preview</h3>
            <div
              className="rounded-lg p-6 border"
              style={{ backgroundColor: brand.colors.background }}
            >
              <h4
                className="text-xl font-bold mb-2"
                style={{ color: brand.colors.primary }}
              >
                {brand.brandName || "Your Brand Name"}
              </h4>
              <p style={{ color: brand.colors.text }}>
                This is how your brand colors will look together on your website.
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: brand.colors.primary }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: brand.colors.secondary }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: brand.colors.accent }}
                >
                  Accent
                </button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Typography Style</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a typography style that matches your brand personality
                </p>
              </div>
              {brand.typography.preference && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Selected
                </Badge>
              )}
            </div>
            <div className="grid gap-4 max-w-xl">
              {TYPOGRAPHY_OPTIONS.map((option) => {
                const isSelected = brand.typography.preference === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => updateTypography({ preference: option.id as "clean-modern" | "classic-professional" | "fun-friendly" })}
                    className={cn(
                      "relative flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/50"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={cn(
                        "font-semibold",
                        isSelected && "text-primary"
                      )}>{option.label}</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary absolute top-3 right-3" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Custom Fonts</h2>
            <div className="grid gap-6 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="headingFont">Heading Font</Label>
                <Input
                  id="headingFont"
                  placeholder="Inter, Poppins, Playfair Display..."
                  value={brand.typography.headingFont}
                  onChange={(e) => updateTypography({ headingFont: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.headingFont}}"}</code>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFont">Body Font</Label>
                <Input
                  id="bodyFont"
                  placeholder="Inter, Open Sans, Roboto..."
                  value={brand.typography.bodyFont}
                  onChange={(e) => updateTypography({ bodyFont: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.bodyFont}}"}</code>
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent value="voice" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Brand Tone</h2>
                <p className="text-sm text-muted-foreground">
                  How should your brand sound? Select all that apply.
                </p>
              </div>
              {brand.voice.tones.length > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {brand.voice.tones.length} selected
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {BRAND_TONES.map((tone) => {
                const isSelected = brand.voice.tones.includes(tone.id);
                return (
                  <button
                    key={tone.id}
                    onClick={() => toggleBrandTone(tone.id)}
                    className={cn(
                      "relative px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                        : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full border-2 border-primary flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-primary" />
                      </span>
                    )}
                    <span className="mr-2 text-base">{tone.emoji}</span>
                    {tone.label}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Target Audience</h2>
            <Textarea
              placeholder="Describe your ideal customer - their age, interests, problems you solve for them..."
              value={brand.voice.targetAudience}
              onChange={(e) => updateVoice({ targetAudience: e.target.value })}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Token: <code className="bg-muted px-1 rounded">{"{{brand.targetAudience}}"}</code>
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Brand Guidelines for AI</h2>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Do&apos;s and Don&apos;ts</Label>
                <Textarea
                  placeholder="e.g., DO use casual language, DON'T use technical jargon..."
                  value={brand.voice.dosAndDonts}
                  onChange={(e) => updateVoice({ dosAndDonts: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Additional Notes for AI</Label>
                <Textarea
                  placeholder="Any other instructions for AI-generated content..."
                  value={brand.voice.notesForAi}
                  onChange={(e) => updateVoice({ notesForAi: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Logo</h2>
            <div className="flex items-start gap-6">
              <div
                className={cn(
                  "w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30 cursor-pointer transition-colors hover:border-primary/50",
                  brand.logo.url && "border-solid border-border"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {brand.logo.url ? (
                  <img
                    src={brand.logo.url}
                    alt={brand.logo.altText || "Brand logo"}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload logo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoAlt">Logo Alt Text</Label>
                  <Input
                    id="logoAlt"
                    placeholder="Describe your logo for accessibility"
                    value={brand.logo.altText}
                    onChange={(e) => updateLogo({ altText: e.target.value })}
                  />
                </div>
                {brand.logo.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateLogo({ url: null, file: null })}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Logo
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  Token: <code className="bg-muted px-1 rounded">{"{{brand.logoUrl}}"}</code>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Social Links</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add your social media profiles
            </p>
            <div className="space-y-3 max-w-xl">
              {brand.social.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://instagram.com/yourbrand"
                      value={link}
                      onChange={(e) => updateSocialLink(index, e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {brand.social.links.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addSocialLink}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add social link
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Brand Guidelines URL</h2>
            <div className="space-y-2 max-w-xl">
              <Input
                placeholder="https://yourbrand.com/brand-guidelines.pdf"
                value={brand.social.brandGuidelinesUrl}
                onChange={(e) => updateSocial({ brandGuidelinesUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Link to your brand guidelines document for reference
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
