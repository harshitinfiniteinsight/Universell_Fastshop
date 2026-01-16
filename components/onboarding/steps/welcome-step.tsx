"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Rocket,
  Store,
  Sparkles,
  Zap,
  ShoppingBag,
  CreditCard,
  Star,
  TrendingUp,
  Package,
  ArrowRight,
  Play,
  Check,
  Clock,
  Shield,
  Upload,
  ImageIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessInfo } from "../wizard-container";

interface WelcomeStepProps {
  onNext: () => void;
  businessInfo?: BusinessInfo;
  onUpdateBusinessInfo?: (data: BusinessInfo) => void;
}

type DesignVariant = "landing" | "guided" | "fast-start";
type GuidedStep = 1 | 2 | 3;

// Floating product card component
function FloatingProductCard({
  className,
  delay = "0",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`absolute glass rounded-2xl shadow-xl p-4 w-48 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl mb-3 flex items-center justify-center">
        <Package className="w-10 h-10 text-primary/60" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-foreground/10 rounded-full w-3/4" />
        <div className="h-2 bg-foreground/5 rounded-full w-1/2" />
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold text-primary">$49.99</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 fill-primary/80 text-primary/80"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating stats card
function FloatingStatsCard({ className }: { className?: string }) {
  return (
    <div className={`absolute glass rounded-2xl shadow-xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Monthly Sales</p>
          <p className="text-lg font-bold text-foreground">$12,847</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-2 flex-1 bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary/80 rounded-full" />
        </div>
        <span className="text-xs font-medium text-primary">+24%</span>
      </div>
    </div>
  );
}

// Floating checkout card
function FloatingCheckoutCard({ className }: { className?: string }) {
  return (
    <div className={`absolute glass rounded-2xl shadow-xl p-4 w-52 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Quick Checkout
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">$149.97</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-primary">Free</span>
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-primary">$149.97</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION 1: Landing Style (Original)
// ============================================
function LandingStyleVariant({ onNext }: { onNext: () => void }) {
  const features = [
    {
      icon: Store,
      title: "Professional Store",
      description: "Beautiful, conversion-optimized storefronts that sell",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Design",
      description: "Generate stunning pages with intelligent automation",
    },
    {
      icon: Zap,
      title: "Launch in Minutes",
      description: "From zero to live store faster than ever before",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 py-8 px-4 md:px-8 lg:px-12">
        {/* Hero Section - Asymmetric Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left: Content */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Store Builder
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              Build Your Dream{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Online Store
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 rounded" />
              </span>{" "}
              in Minutes
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Create a stunning e-commerce experience with AI-generated pages,
              seamless checkout, and everything you need to start selling today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={onNext}
                size="lg"
                className="group relative px-8 py-6 text-lg font-semibold btn-primary-enhanced animate-pulse-glow rounded-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group px-8 py-6 text-lg font-medium rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <Play className="w-5 h-5 mr-2 text-primary" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-primary/40 border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                    >
                      {["J", "S", "M", "A"][i]}
                    </div>
                  ))}
                </div>
                <span>10k+ stores launched</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right: Floating Elements */}
          <div className="relative h-[400px] lg:h-[500px] hidden md:block">
            {/* Central glow */}
            <div className="absolute inset-0 bg-primary-glow" />

            {/* Floating cards */}
            <FloatingProductCard
              className="top-8 left-8 animate-float"
              delay="0"
            />
            <FloatingStatsCard className="top-4 right-4 animate-float-delayed" />
            <FloatingCheckoutCard className="bottom-16 left-16 animate-float-slow" />

            {/* Additional floating elements */}
            <div className="absolute bottom-8 right-12 glass rounded-xl p-3 animate-float shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">New Order!</p>
                  <p className="text-sm font-semibold">+$89.99</p>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-primary/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-primary/10 rounded-full" />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card border border-border card-hover-lift animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom helper text */}
        <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <p className="text-sm text-muted-foreground">
            ⏱️ Takes about{" "}
            <span className="font-semibold text-foreground">5 minutes</span> to
            complete • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION 2: Guided Onboarding Module (Stepped Flow)
// ============================================
function GuidedOnboardingVariant({
  onNext,
  businessInfo,
  onUpdateBusinessInfo,
}: {
  onNext: () => void;
  businessInfo?: BusinessInfo;
  onUpdateBusinessInfo?: (data: BusinessInfo) => void;
}) {
  // Phase states for Option 2 flow
  // Phase 1: hasStartedGuidedOnboarding = false → show intro screen
  // Phase 2: hasStartedGuidedOnboarding = true, guidedStepsCompleted = false → show step flow
  // Phase 3: guidedStepsCompleted = true → show AI Guided Intro screen
  const [hasStartedGuidedOnboarding, setHasStartedGuidedOnboarding] = useState(false);
  const [guidedStepsCompleted, setGuidedStepsCompleted] = useState(false);
  const [currentGuidedStep, setCurrentGuidedStep] = useState<GuidedStep>(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(businessInfo?.logoPreview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local form state
  const [formData, setFormData] = useState({
    name: businessInfo?.name || "",
    description: businessInfo?.description || "",
    email: businessInfo?.email || "",
    phone: businessInfo?.phone || "",
    country: businessInfo?.country || "",
    state: businessInfo?.state || "",
    city: businessInfo?.city || "",
    zipcode: businessInfo?.zipcode || "",
    streetAddress: businessInfo?.streetAddress || "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmStep = () => {
    // Save current step data
    if (onUpdateBusinessInfo && businessInfo) {
      onUpdateBusinessInfo({
        ...businessInfo,
        ...formData,
        logoPreview,
      });
    }

    if (currentGuidedStep < 3) {
      setCurrentGuidedStep((prev) => (prev + 1) as GuidedStep);
    } else {
      // Step 3 completed → show AI Guided Intro screen
      setGuidedStepsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentGuidedStep > 1) {
      setCurrentGuidedStep((prev) => (prev - 1) as GuidedStep);
    }
  };

  const stepTitles = {
    1: "Business Logo",
    2: "Business Details",
    3: "Business Address",
  };

  // ==========================================
  // PHASE 1: Intro Screen (Before "Get Started")
  // ==========================================
  if (!hasStartedGuidedOnboarding) {
    return (
      <div className="relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  Step 1 of 3 — Let&apos;s get started
                </span>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="grid lg:grid-cols-5 gap-8 items-center">
              {/* Left: Content (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                {/* Headline */}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
                  Create your store with{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    AI assistance
                  </span>
                </h1>

                {/* Short description */}
                <p className="text-lg text-muted-foreground max-w-md">
                  Answer a few quick questions and we&apos;ll design a beautiful, 
                  personalized store for your business.
                </p>

                {/* Quick benefits */}
                <div className="space-y-3 py-2">
                  {[
                    "AI generates your pages automatically",
                    "Customize everything after launch",
                    "Go live in under 5 minutes",
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Primary CTA */}
                <div className="pt-4">
                  <Button
                    onClick={() => setHasStartedGuidedOnboarding(true)}
                    size="lg"
                    className="group relative px-10 py-7 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>

                {/* Reassurance */}
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Takes ~5 minutes
                </p>
              </div>

              {/* Right: Website Builder Preview (2 cols) */}
              <div className="lg:col-span-2 hidden lg:block">
                <div className="relative">
                  {/* Browser Frame */}
                  <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-6 bg-background rounded-md flex items-center px-3">
                          <div className="w-3 h-3 rounded-full bg-muted-foreground/20 mr-2" />
                          <div className="h-2 bg-muted-foreground/20 rounded w-24" />
                        </div>
                      </div>
                    </div>

                    {/* Builder Interface */}
                    <div className="flex h-[280px]">
                      {/* Sidebar */}
                      <div className="w-14 bg-muted/30 border-r border-border/30 py-3 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <div className="w-4 h-4 rounded bg-primary/60" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <div className="w-4 h-3 rounded-sm bg-muted-foreground/30" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Canvas */}
                      <div className="flex-1 bg-background p-3 overflow-hidden">
                        {/* Website Preview Sections */}
                        <div className="space-y-2 h-full">
                          {/* Header Section */}
                          <div className="h-8 bg-muted/40 rounded-md flex items-center px-3 justify-between border border-dashed border-primary/30">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded bg-primary/40" />
                              <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
                            </div>
                            <div className="flex gap-2">
                              <div className="h-2 w-8 bg-muted-foreground/20 rounded" />
                              <div className="h-2 w-8 bg-muted-foreground/20 rounded" />
                            </div>
                          </div>

                          {/* Hero Section */}
                          <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/5 rounded-md flex items-center px-4 border border-dashed border-primary/30">
                            <div className="space-y-2">
                              <div className="h-3 w-24 bg-primary/30 rounded" />
                              <div className="h-2 w-32 bg-muted-foreground/20 rounded" />
                              <div className="h-5 w-16 bg-primary/50 rounded-md mt-1" />
                            </div>
                          </div>

                          {/* Products Section */}
                          <div className="flex-1 bg-muted/20 rounded-md p-2 border border-dashed border-muted-foreground/20">
                            <div className="grid grid-cols-3 gap-2 h-full">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-background rounded border border-border/50 p-1.5">
                                  <div className="h-10 bg-muted/50 rounded mb-1.5" />
                                  <div className="h-1.5 w-3/4 bg-muted-foreground/20 rounded mb-1" />
                                  <div className="h-1.5 w-1/2 bg-primary/30 rounded" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer Section */}
                          <div className="h-6 bg-muted/30 rounded-md flex items-center justify-center border border-dashed border-muted-foreground/20">
                            <div className="flex gap-3">
                              <div className="h-1.5 w-6 bg-muted-foreground/20 rounded" />
                              <div className="h-1.5 w-6 bg-muted-foreground/20 rounded" />
                              <div className="h-1.5 w-6 bg-muted-foreground/20 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating accent */}
                  <div className="absolute -bottom-3 -right-3 glass rounded-xl p-2.5 shadow-lg animate-float border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-medium">AI Building...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PHASE 3: AI Guided Intro Screen (After Steps Complete)
  // ==========================================
  if (guidedStepsCompleted) {
    return (
      <div className="relative overflow-hidden min-h-[600px]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        {/* Floating Feature Tags */}
        <div className="absolute top-20 left-16 hidden lg:block animate-float" style={{ animationDelay: "0s" }}>
          <div className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Guided
            </span>
          </div>
        </div>
        <div className="absolute top-32 right-20 hidden lg:block animate-float" style={{ animationDelay: "0.5s" }}>
          <div className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Setup
            </span>
          </div>
        </div>
        <div className="absolute bottom-32 left-24 hidden lg:block animate-float" style={{ animationDelay: "1s" }}>
          <div className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-violet-500" />
              Custom Design
            </span>
          </div>
        </div>
        <div className="absolute bottom-24 right-32 hidden lg:block animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Smart Layout
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[600px] px-4">
          <div className="max-w-2xl mx-auto">
            {/* Main Card */}
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12 text-center">
              {/* Success Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    Business details saved
                  </span>
                </div>
              </div>

              {/* AI Icon with glow */}
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Bring your website to life with{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Universell AI
                </span>
              </h1>

              {/* Supporting text */}
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Tell us a little about your business and what you'd like to create.
                Universell AI will guide you step by step and design a website tailored just for you.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {[
                  { label: "Personalized Design", color: "text-primary" },
                  { label: "Smart Suggestions", color: "text-amber-500" },
                  { label: "Ready in Minutes", color: "text-green-500" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50"
                  >
                    <div className={cn("w-2 h-2 rounded-full", 
                      item.color === "text-primary" ? "bg-primary" :
                      item.color === "text-amber-500" ? "bg-amber-500" : "bg-green-500"
                    )} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Primary CTA */}
              <Button
                onClick={onNext}
                size="lg"
                className="group relative px-12 py-7 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 mb-4"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start with AI Chat
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Secondary Action */}
              <div className="mt-4">
                <button
                  onClick={onNext}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
                >
                  Create website without chat
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reassurance below card */}
            <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              You can always customize everything later
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PHASE 2: Step-by-Step Flow (After "Get Started")
  // ==========================================
  return (
    <div className="relative overflow-hidden min-h-[600px]">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 py-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      step === currentGuidedStep
                        ? "w-6 bg-primary"
                        : step < currentGuidedStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                Step {currentGuidedStep} of 3 — {stepTitles[currentGuidedStep]}
              </span>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
            <div className="p-8 lg:p-10">
              {/* Step 1: Business Logo */}
              {currentGuidedStep === 1 && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Business Logo</h2>
                      <p className="text-sm text-muted-foreground">Upload your logo for your website</p>
                    </div>
                  </div>

                  {/* Logo Upload Area */}
                  <div className="max-w-md mx-auto">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
                        logoPreview
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-muted/30"
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      
                      {logoPreview ? (
                        <div className="space-y-4">
                          <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden bg-muted">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">Click to change logo</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-xl bg-muted/50 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground/60" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Upload your logo</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              PNG, JPG up to 2MB • AI will generate if not provided
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
                    <button
                      onClick={handleConfirmStep}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Skip for now
                    </button>
                    <Button
                      onClick={handleConfirmStep}
                      size="lg"
                      className="px-8 rounded-xl shadow-lg shadow-primary/20"
                    >
                      Confirm & Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Business Details */}
              {currentGuidedStep === 2 && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Business Details</h2>
                      <p className="text-sm text-muted-foreground">Review and confirm your business information</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5 max-w-lg">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Business Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Your business name"
                        className="h-11 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Business Description / Tagline
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Brief description of your business"
                        className="rounded-xl resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          Contact Email <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="hello@example.com"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmStep}
                      size="lg"
                      className="px-8 rounded-xl shadow-lg shadow-primary/20"
                      disabled={!formData.name || !formData.email}
                    >
                      Confirm & Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Business Address */}
              {currentGuidedStep === 3 && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Business Address</h2>
                      <p className="text-sm text-muted-foreground">Where is your business located?</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5 max-w-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium">
                          Country <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => updateField("country", e.target.value)}
                          placeholder="United States"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          placeholder="California"
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          placeholder="San Francisco"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipcode" className="text-sm font-medium">
                          Zipcode <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="zipcode"
                          value={formData.zipcode}
                          onChange={(e) => updateField("zipcode", e.target.value)}
                          placeholder="94102"
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="streetAddress" className="text-sm font-medium">
                        Street Address <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="streetAddress"
                        value={formData.streetAddress}
                        onChange={(e) => updateField("streetAddress", e.target.value)}
                        placeholder="123 Main Street, Suite 100"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmStep}
                      size="lg"
                      className="px-8 rounded-xl shadow-lg shadow-primary/20"
                      disabled={!formData.country || !formData.state || !formData.city || !formData.zipcode || !formData.streetAddress}
                    >
                      Confirm & Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom helper text */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Takes ~5 minutes to complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION 3: Fast Start Module (High-Conversion)
// ============================================
type FastStartScreen = "initial" | "complete";

function FastStartVariant({ onNext }: { onNext: () => void }) {
  const [screen, setScreen] = useState<FastStartScreen>("initial");

  // Handle Get Started - go to completion screen
  const handleGetStarted = () => {
    setScreen("complete");
  };

  // Handle Go to Website Builder - navigate to dashboard
  const handleGoToBuilder = () => {
    // In production, this would navigate to the dashboard/editor
    // For now, we call onNext to proceed in the wizard
    onNext();
  };

  // Handle Edit Setup - go back to initial or restart onboarding
  const handleEditSetup = () => {
    setScreen("initial");
  };

  // Initial "Get Started" screen
  if (screen === "initial") {
    return (
      <div className="relative overflow-hidden min-h-[550px]">
        {/* Dynamic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 h-full py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto h-full">
            {/* Split Layout */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center h-full">
              
              {/* Left: Primary Content */}
              <div className="space-y-8">
                {/* Speed Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Instant Setup</span>
                </div>

                {/* Strong Headline */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
                  Your store.{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Ready fast.
                  </span>
                </h1>

                {/* Punchy supporting line */}
                <p className="text-lg text-muted-foreground max-w-md">
                  AI sets everything up so you can start selling right away.
                </p>

                {/* Dominant CTA - Hero of the screen */}
                <div className="pt-2">
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="group h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300 animate-pulse-glow"
                  >
                    Get Started
                    <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                {/* Minimal microcopy */}
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ~5 minutes to launch
                </p>
              </div>

              {/* Right: AI Generation Visual */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Main Builder Visual */}
                  <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="h-5 bg-background/80 rounded flex items-center px-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary/30 mr-2" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-20" />
                        </div>
                      </div>
                    </div>

                    {/* AI Generation Progress Canvas */}
                    <div className="p-4 bg-gradient-to-b from-background to-muted/10 h-[320px]">
                      {/* Generation Progress Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium">AI Generating...</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-xs text-muted-foreground">Building</span>
                        </div>
                      </div>

                      {/* Sections Being Built */}
                      <div className="space-y-3">
                        {/* Header - Complete */}
                        <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-primary/30 shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Header</span>
                              <span className="text-xs text-primary">Complete</span>
                            </div>
                            <div className="h-1.5 bg-primary rounded-full mt-1.5" />
                          </div>
                        </div>

                        {/* Hero - Complete */}
                        <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-primary/30 shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Hero Section</span>
                              <span className="text-xs text-primary">Complete</span>
                            </div>
                            <div className="h-1.5 bg-primary rounded-full mt-1.5" />
                          </div>
                        </div>

                        {/* Products - In Progress */}
                        <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Package className="w-4 h-4 text-primary/60" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Products</span>
                              <span className="text-xs text-muted-foreground">78%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full w-[78%] bg-gradient-to-r from-primary to-primary/80 rounded-full animate-shimmer" />
                            </div>
                          </div>
                        </div>

                        {/* Footer - Pending */}
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                            <div className="w-4 h-4 rounded border-2 border-muted-foreground/30" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Footer</span>
                              <span className="text-xs text-muted-foreground">Pending</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full mt-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Progress Badge */}
                  <div className="absolute -top-3 -right-3 bg-primary text-white rounded-xl px-4 py-2 shadow-xl shadow-primary/30">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-bold">3 of 4</span>
                    </div>
                  </div>

                  {/* Floating Speed Indicator */}
                  <div className="absolute -bottom-3 -left-3 glass rounded-xl p-3 shadow-lg border border-white/20 animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. time</p>
                        <p className="text-sm font-bold">2 min left</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completion Screen - "You're all set!"
  return (
    <div className="relative overflow-hidden min-h-[550px]">
      {/* Celebratory background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 h-full py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 mb-8 animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            You're all set!
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            You've shared everything needed to get started. We've applied your color theme, style preferences, and business details. You can now create and customize pages exactly the way you want.
          </p>

          {/* What Happens Next */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 mb-10 text-left animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              What you can do next
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Create and manage website pages</span> — Home, Shop, Services, and more
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Customize layouts</span> using your selected color theme
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Add products, services, or bookings</span> to your store
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Edit content and images</span> with AI assistance anytime
                </span>
              </li>
            </ul>
          </div>

          {/* Primary CTA */}
          <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <Button
              onClick={handleGoToBuilder}
              size="lg"
              className="group h-16 px-14 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300"
            >
              Go to Website Builder
              <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Secondary Action */}
          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <button
              onClick={handleEditSetup}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Edit setup details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TAB SWITCHER COMPONENT
// ============================================
function VariantTabSwitcher({
  activeVariant,
  onVariantChange,
}: {
  activeVariant: DesignVariant;
  onVariantChange: (variant: DesignVariant) => void;
}) {
  const tabs: { id: DesignVariant; label: string; description: string }[] = [
    { id: "landing", label: "Option 1", description: "Landing Page Style" },
    { id: "guided", label: "Option 2", description: "Guided Onboarding" },
    { id: "fast-start", label: "Option 3", description: "Fast Start" },
  ];

  return (
    <div className="bg-muted/50 border-b border-border px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Stakeholder Preview — Select Design Variant
          </span>
        </div>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onVariantChange(tab.id)}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl text-left transition-all duration-200",
                activeVariant === tab.id
                  ? "bg-background border-2 border-primary shadow-lg"
                  : "bg-background/50 border border-border/50 hover:bg-background hover:border-border"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    activeVariant === tab.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {activeVariant === tab.id && (
                    <Check className="w-2.5 h-2.5 text-white" />
                  )}
                </div>
                <span
                  className={cn(
                    "font-medium text-sm",
                    activeVariant === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
              </div>
              <p
                className={cn(
                  "text-xs mt-1 ml-6",
                  activeVariant === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {tab.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function WelcomeStep({ onNext, businessInfo, onUpdateBusinessInfo }: WelcomeStepProps) {
  const [activeVariant, setActiveVariant] = useState<DesignVariant>("landing");

  return (
    <div className="flex flex-col min-h-full">
      {/* Tab Switcher (Stakeholder Review Only) */}
      <VariantTabSwitcher
        activeVariant={activeVariant}
        onVariantChange={setActiveVariant}
      />

      {/* Variant Content */}
      <div className="flex-1 relative">
        <div
          key={activeVariant}
          className="animate-fade-in-up"
        >
          {activeVariant === "landing" && <LandingStyleVariant onNext={onNext} />}
          {activeVariant === "guided" && (
            <GuidedOnboardingVariant
              onNext={onNext}
              businessInfo={businessInfo}
              onUpdateBusinessInfo={onUpdateBusinessInfo}
            />
          )}
          {activeVariant === "fast-start" && <FastStartVariant onNext={onNext} />}
        </div>
      </div>
    </div>
  );
}
