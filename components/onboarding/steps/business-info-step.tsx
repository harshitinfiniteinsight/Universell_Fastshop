"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BusinessInfo } from "../wizard-container";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Building2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Upload,
  Globe,
  Palette,
  Layout,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessInfoStepProps {
  data: BusinessInfo;
  onUpdate: (data: BusinessInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BusinessInfoStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: BusinessInfoStepProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessInfo, string>>>({});

  const handleChange = (
    field: keyof BusinessInfo,
    value: string | File | null
  ) => {
    onUpdate({ ...data, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (type === "logo") {
        onUpdate({ ...data, logo: file, logoPreview: preview });
      } else {
        onUpdate({ ...data, banner: file, bannerPreview: preview });
      }
    }
  };

  const removeFile = (type: "logo" | "banner") => {
    if (type === "logo") {
      onUpdate({ ...data, logo: null, logoPreview: null });
    } else {
      onUpdate({ ...data, banner: null, bannerPreview: null });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BusinessInfo, string>> = {};

    if (!data.name.trim()) {
      newErrors.name = "Business name is required";
    }
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Two-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12">
        
        {/* Left Column - AI Guide & Visual Elements */}
        <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
          {/* AI Assistant Intro Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-6 shadow-lg shadow-primary/5">
            {/* Gradient orbs for depth */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative space-y-4">
              {/* AI Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/30 ring-4 ring-primary/10">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Hi, my name is <span className="font-semibold text-primary">Universell AI</span>. I&apos;ll help you create a wonderful website and take care of everything for you.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Let&apos;s start by reviewing the information about your business that we&apos;ve collected from your business settings. You can add or edit any details if needed.
                </p>
              </div>
            </div>
          </div>

          {/* Floating UI Preview Cards - Visual Excitement */}
          <div className="relative hidden lg:block h-[280px]">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl" />
            
            {/* Floating Card 1 - Website Preview */}
            <div className="absolute top-4 left-4 right-8 glass rounded-xl p-4 shadow-xl animate-float">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Website</p>
                  <p className="text-sm font-semibold text-foreground truncate">{data.name || "Your Business"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-foreground/10 rounded-full w-full" />
                <div className="h-2 bg-foreground/5 rounded-full w-3/4" />
              </div>
            </div>

            {/* Floating Card 2 - Design Preview */}
            <div className="absolute top-24 right-2 left-12 glass rounded-xl p-4 shadow-xl animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Theme Color</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-4 rounded-full bg-primary shadow-sm" />
                    <span className="text-xs font-medium text-foreground">Universell Orange</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 3 - Pages */}
            <div className="absolute bottom-4 left-2 right-12 glass rounded-xl p-4 shadow-xl animate-float-slow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Layout className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">AI will generate</p>
                  <p className="text-sm font-semibold text-foreground">5+ pages for you</p>
                </div>
              </div>
            </div>
          </div>

          {/* What happens next - Desktop only */}
          <div className="hidden lg:block rounded-xl bg-muted/30 border border-border/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">NEXT STEPS</p>
            <div className="space-y-2.5">
              {[
                { label: "Choose what you sell", done: false },
                { label: "Select your products", done: false },
                { label: "AI generates your site", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full border border-border/60 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6">
          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Business Information
            </h2>
            <p className="text-muted-foreground">
              Review and update your business details below.
            </p>
          </div>

          {/* Logo Upload - Compact */}
          <div className="rounded-xl bg-gradient-to-b from-muted/30 to-muted/10 border border-border/50 p-5">
            <Label className="text-sm font-medium flex items-center gap-2 mb-3">
              <Upload className="w-4 h-4 text-muted-foreground" />
              Business logo for your website
            </Label>
            <div
              className={cn(
                "group relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer",
                "hover:border-primary/60 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5",
                data.logoPreview 
                  ? "border-primary bg-primary/5" 
                  : "border-border/70 bg-background/50"
              )}
              onClick={() => logoInputRef.current?.click()}
            >
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "logo")}
              />
              {data.logoPreview ? (
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={data.logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain rounded-xl shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile("logo");
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 shadow-lg transition-transform hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted/80 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                    <Building2 className="w-6 h-6 text-muted-foreground group-hover:text-primary/70 transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Upload your logo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB • AI will generate if not provided</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Core Business Details */}
          <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border/50">
              <Building2 className="w-4 h-4 text-primary/70" />
              <span className="text-sm font-medium text-foreground">Core Details</span>
            </div>

            <div className="space-y-4">
              {/* Business Name - Full Width */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">
                  Business Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your business name"
                  value={data.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={cn(
                    "h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors",
                    errors.name && "border-destructive"
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Description - Full Width */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm">Business Description / Tagline</Label>
                <Textarea
                  id="description"
                  placeholder="Tell customers what you do..."
                  value={data.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={2}
                  className="rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors resize-none text-sm"
                />
              </div>

              {/* Email & Phone - 2 Columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    Contact Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@example.com"
                    value={data.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={cn(
                      "h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors",
                      errors.email && "border-destructive"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={data.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border/50">
              <MapPin className="w-4 h-4 text-primary/70" />
              <span className="text-sm font-medium text-foreground">Business Address</span>
            </div>
              
            <div className="space-y-4">
              {/* Country & State - 2 Columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={data.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    placeholder="California"
                    value={data.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              {/* City & Zipcode - 2 Columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={data.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="zipcode" className="text-sm">
                    Zipcode <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="zipcode"
                    placeholder="94102"
                    value={data.zipcode}
                    onChange={(e) => handleChange("zipcode", e.target.value)}
                    className="h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              {/* Street Address - Full Width */}
              <div className="space-y-1.5">
                <Label htmlFor="streetAddress" className="text-sm">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="streetAddress"
                  placeholder="123 Main Street, Suite 100"
                  value={data.streetAddress}
                  onChange={(e) => handleChange("streetAddress", e.target.value)}
                  className="h-10 rounded-lg border-border/60 bg-background/50 focus:bg-background transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Navigation - Aligned with form */}
          <div className="flex justify-between pt-4 border-t border-border/50">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="rounded-lg px-5 h-10 border-border/60 hover:bg-muted/50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className="rounded-lg px-6 h-10 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
