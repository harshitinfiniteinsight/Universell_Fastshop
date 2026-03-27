"use client";

import { useEffect, useState } from "react";
import { AiChatStep } from "@/components/onboarding/steps/ai-chat-step";
import { AiGenerationStep } from "@/components/onboarding/steps/ai-generation-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WizardData } from "@/components/onboarding/wizard-container";
import { Sparkles, FileText, Zap, ArrowRight, Check, Edit, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LandingPageStep = "intro" | "business-info" | "ai-chat" | "generation" | "done";

const initialWizardData: WizardData = {
  businessInfo: {
    name: "Sunrise Cafe & Bakery",
    tagline: "Where every morning starts with warmth",
    description:
      "Fresh baked goods and artisan coffee in the heart of downtown. We source local ingredients and craft each item with love.",
    email: "hello@sunrisecafe.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    state: "California",
    city: "San Francisco",
    zipcode: "94102",
    streetAddress: "123 Main Street, Suite 100",
    logo: null,
    logoPreview: null,
    banner: null,
    bannerPreview: null,
  },
  shopType: null,
  selectedProducts: [],
  selectedServices: [],
  generatedPages: [],
  themeColor: "#f04f29",
};

export default function LandingPageWizard() {
  const router = useRouter();
  const [step, setStep] = useState<LandingPageStep>("intro");
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [generatedPageName, setGeneratedPageName] = useState("Homepage");
  const [animatedSectionIndex, setAnimatedSectionIndex] = useState(0);
  const [generatingTagline, setGeneratingTagline] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [selectedLogoStyle, setSelectedLogoStyle] = useState("icon-modern");
  const [selectedLogoTheme, setSelectedLogoTheme] = useState("minimal");
  const [logoPrimaryColor, setLogoPrimaryColor] = useState("#1f2a3d");
  const [logoSecondaryColor, setLogoSecondaryColor] = useState("#4b5563");
  const [taglineModalOpen, setTaglineModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [taglinePrompt, setTaglinePrompt] = useState("");
  const [descriptionPrompt, setDescriptionPrompt] = useState("");

  const aiLogoStyles = [
    { id: "icon-modern", label: "Icon Modern" },
    { id: "text-badge", label: "Text Badge" },
    { id: "wordmark", label: "Wordmark" },
    { id: "icon-text", label: "Icon + Text" },
    { id: "minimal", label: "Minimal" },
    { id: "geometric", label: "Geometric" },
    { id: "elegant", label: "Elegant" },
    { id: "playful", label: "Playful" },
  ];

  const logoThemeOptions = [
    { id: "warm", label: "Warm", primary: "#f04f29", secondary: "#fb7a45" },
    { id: "modern", label: "Modern", primary: "#3b82f6", secondary: "#60a5fa" },
    { id: "minimal", label: "Minimal", primary: "#1f2a3d", secondary: "#4b5563" },
    { id: "bold", label: "Bold", primary: "#7c3aed", secondary: "#a78bfa" },
    { id: "pastel", label: "Pastel", primary: "#ec4899", secondary: "#f9a8d4" },
    { id: "nature", label: "Nature", primary: "#059669", secondary: "#34d399" },
  ];

  const animatedSections = [
    { label: "Hero Section", title: "Sunrise Cafe & Bakery", progress: 22 },
    { label: "Benefits Section", title: "Why Customers Love Us", progress: 41 },
    { label: "Featured Products", title: "Best Sellers", progress: 58 },
    { label: "Testimonials", title: "Customer Stories", progress: 73 },
    { label: "CTA Section", title: "Order Fresh Today", progress: 91 },
  ];

  useEffect(() => {
    if (step !== "intro") return;

    const interval = setInterval(() => {
      setAnimatedSectionIndex((prev) => (prev + 1) % animatedSections.length);
    }, 1300);

    return () => clearInterval(interval);
  }, [step, animatedSections.length]);

  const activeAnimatedSection = animatedSections[animatedSectionIndex];

  const generateTaglineWithAI = (context?: string) => {
    setGeneratingTagline(true);
    const name = wizardData.businessInfo.name || "Your Business";
    const prompt = (context || "").trim();
    setTimeout(() => {
      const generatedTagline = prompt
        ? `${name.split(" ")[0]}: ${prompt.replace(/\s+/g, " ").slice(0, 58)}`
        : `Crafted for ${name.split(" ")[0]} customers, served with warmth`;
      updateBusinessInfo("tagline", generatedTagline);
      setGeneratingTagline(false);
      setTaglineModalOpen(false);
      setTaglinePrompt("");
    }, 900);
  };

  const generateDescriptionWithAI = (context?: string) => {
    setGeneratingDescription(true);
    const name = wizardData.businessInfo.name || "Your business";
    const prompt = (context || "").trim();
    setTimeout(() => {
      updateBusinessInfo(
        "description",
        prompt
          ? `${name} ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}. We focus on quality, trust, and a delightful customer-first experience in every interaction.`
          : `${name} delivers premium quality with a modern customer-first experience. Our team focuses on consistency, trust and delight—so every visit feels personal and every purchase feels effortless.`
      );
      setGeneratingDescription(false);
      setDescriptionModalOpen(false);
      setDescriptionPrompt("");
    }, 1100);
  };

  const getBusinessInitials = () => {
    const businessName = wizardData.businessInfo.name || "Business";
    const initials = businessName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "B";

    return initials;
  };

  const buildLogoSvgByStyle = (styleId: string, primaryColor: string, secondaryColor: string) => {
    const initials = getBusinessInitials();

    if (styleId === "text-badge") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <rect width='240' height='240' rx='52' fill='#f8fafc'/>
          <rect x='34' y='34' width='172' height='172' rx='40' fill='none' stroke='${primaryColor}' stroke-width='8'/>
          <text x='120' y='136' text-anchor='middle' fill='${primaryColor}' font-family='Inter, Arial, sans-serif' font-size='54' font-weight='700'>${initials}</text>
        </svg>
      `.trim();
    }

    if (styleId === "wordmark") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <rect width='240' height='240' rx='52' fill='${primaryColor}'/>
          <text x='120' y='138' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-size='52' font-weight='700' letter-spacing='2'>${initials}</text>
        </svg>
      `.trim();
    }

    if (styleId === "icon-text") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <defs>
            <linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='${primaryColor}'/>
              <stop offset='100%' stop-color='${secondaryColor}'/>
            </linearGradient>
          </defs>
          <rect width='240' height='240' rx='52' fill='url(#g4)'/>
          <text x='120' y='94' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-size='42'>✦</text>
          <text x='120' y='152' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-size='56' font-weight='700'>${initials}</text>
        </svg>
      `.trim();
    }

    if (styleId === "minimal") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <rect width='240' height='240' rx='52' fill='white'/>
          <rect x='24' y='24' width='192' height='192' rx='44' fill='none' stroke='${primaryColor}' stroke-width='6'/>
          <circle cx='84' cy='120' r='12' fill='${secondaryColor}'/>
          <text x='128' y='136' text-anchor='start' fill='${primaryColor}' font-family='Inter, Arial, sans-serif' font-size='52' font-weight='700'>${initials}</text>
        </svg>
      `.trim();
    }

    if (styleId === "geometric") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <defs>
            <linearGradient id='g6' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='${primaryColor}'/>
              <stop offset='100%' stop-color='${secondaryColor}'/>
            </linearGradient>
          </defs>
          <rect width='240' height='240' rx='52' fill='url(#g6)'/>
          <polygon points='120,54 172,84 172,144 120,176 68,144 68,84' fill='none' stroke='rgba(255,255,255,0.35)' stroke-width='8'/>
          <text x='120' y='136' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-size='52' font-weight='700'>${initials}</text>
        </svg>
      `.trim();
    }

    if (styleId === "elegant") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <defs>
            <linearGradient id='g7' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='${primaryColor}'/>
              <stop offset='100%' stop-color='${secondaryColor}'/>
            </linearGradient>
          </defs>
          <rect width='240' height='240' rx='52' fill='url(#g7)'/>
          <text x='120' y='92' text-anchor='middle' fill='rgba(255,255,255,0.95)' font-family='Inter, Arial, sans-serif' font-size='32'>♕</text>
          <text x='120' y='152' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-size='52' font-weight='700'>${initials}</text>
        </svg>
      `.trim();
    }

    if (styleId === "playful") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <defs>
            <linearGradient id='g8' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='${primaryColor}'/>
              <stop offset='100%' stop-color='${secondaryColor}'/>
            </linearGradient>
          </defs>
          <rect width='240' height='240' rx='52' fill='url(#g8)'/>
          <circle cx='176' cy='70' r='16' fill='rgba(255,255,255,0.18)'/>
          <text x='120' y='142' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-size='58' font-weight='800'>${initials}</text>
        </svg>
      `.trim();
    }

    return `
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
        <defs>
          <linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stop-color='${primaryColor}'/>
            <stop offset='100%' stop-color='${secondaryColor}'/>
          </linearGradient>
        </defs>
        <rect width='240' height='240' rx='52' fill='url(#g1)'/>
        <circle cx='120' cy='120' r='74' fill='rgba(255,255,255,0.16)'/>
        <rect x='90' y='84' width='60' height='52' rx='12' fill='none' stroke='white' stroke-width='6'/>
        <path d='M82 96l38-28 38 28' fill='none' stroke='white' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/>
      </svg>
    `.trim();
  };

  const getAiLogoPreview = (styleId: string, primaryColor = logoPrimaryColor, secondaryColor = logoSecondaryColor) => {
    const svg = buildLogoSvgByStyle(styleId, primaryColor, secondaryColor);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const applyLogoTheme = (themeId: string) => {
    const selected = logoThemeOptions.find((theme) => theme.id === themeId);
    if (!selected) return;
    setSelectedLogoTheme(themeId);
    setLogoPrimaryColor(selected.primary);
    setLogoSecondaryColor(selected.secondary);
  };

  const generateLogoWithAI = () => {
    setGeneratingLogo(true);

    setTimeout(() => {
      const logoPreview = getAiLogoPreview(selectedLogoStyle, logoPrimaryColor, logoSecondaryColor);
      updateBusinessInfo("logo", null);
      updateBusinessInfo("logoPreview", logoPreview);
      setGeneratingLogo(false);
      setLogoModalOpen(false);
    }, 1200);
  };

  const updateBusinessInfo = (field: keyof WizardData["businessInfo"], value: string | File | null) => {
    setWizardData((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value,
      },
    }));
  };

  const reset = () => {
    setStep("intro");
    setWizardData(initialWizardData);
    setGeneratedPageName("Homepage");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Generate Landing Page</h1>
          <p className="text-muted-foreground mt-1">
            Let AI build a beautiful, personalised page for your store
          </p>
        </div>

        {/* Step indicator — visible during the 2 active steps */}
        {(step === "business-info" || step === "ai-chat" || step === "generation") && (
          <div className="hidden sm:flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {/* Step 1 */}
            <div className={`flex items-center gap-1.5 ${step === "business-info" ? "text-primary font-medium" : ""}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "business-info"
                    ? "bg-primary text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {step === "business-info" ? "1" : <Check className="w-3.5 h-3.5" />}
              </div>
              <span>Business Details</span>
            </div>

            <ArrowRight className="w-4 h-4" />

            {/* Step 2 */}
            <div className={`flex items-center gap-1.5 ${step === "ai-chat" ? "text-primary font-medium" : ""}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "ai-chat"
                    ? "bg-primary text-white"
                    : step === "generation"
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step === "generation" ? <Check className="w-3.5 h-3.5" /> : "2"}
              </div>
              <span>Guided Questions</span>
            </div>

            <ArrowRight className="w-4 h-4" />

            {/* Step 3 */}
            <div className={`flex items-center gap-1.5 ${step === "generation" ? "text-primary font-medium" : ""}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "generation" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <span>Generate Page</span>
            </div>
          </div>
        )}
      </div>

      {/* Card wrapper */}
      <div className="bg-card rounded-lg shadow-sm border border-border">

        {/* ── INTRO ── */}
        {step === "intro" && (
          <div className="relative overflow-hidden min-h-[560px] p-6 lg:p-10">
            {/* Ambient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
              {/* Left side: text + CTA */}
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-background/80">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">AI Landing Page Builder</span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                    Generate through{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      AI
                    </span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-xl">
                    Create a high-converting landing page in minutes. AI helps with
                    structure, content direction and visual polish based on your brand.
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] px-5 py-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Why this helps:</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Create landing page in 2 minutes
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      No code required
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Professional and modern feel
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Attract more customers
                    </li>
                  </ul>
                </div>

                <div>
                  <Button
                    onClick={() => setStep("business-info")}
                    size="lg"
                    className="group px-10 py-6 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
                  >
                    Start Generating
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Right side: animated preview card + floating chips */}
              <div className="relative min-h-[430px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-2xl" />

                <div className="absolute z-30 -top-2 left-0 hidden xl:flex items-center gap-2 px-3 py-2 rounded-full border border-primary/20 bg-background/85 backdrop-blur-sm shadow-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Smart content suggestions</span>
                </div>
                <div className="absolute z-30 top-8 right-0 hidden xl:flex items-center gap-2 px-3 py-2 rounded-full border border-primary/20 bg-background/85 backdrop-blur-sm shadow-sm">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Create in 2 minutes</span>
                </div>
                <div className="absolute z-30 bottom-24 -left-2 hidden xl:flex items-center gap-2 px-3 py-2 rounded-full border border-primary/20 bg-background/85 backdrop-blur-sm shadow-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">No code required</span>
                </div>
                <div className="absolute z-30 bottom-10 right-2 hidden xl:flex items-center gap-2 px-3 py-2 rounded-full border border-primary/20 bg-background/85 backdrop-blur-sm shadow-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Professional look</span>
                </div>

                <div className="relative z-10 w-full max-w-md rounded-3xl border border-primary/20 bg-background/90 backdrop-blur shadow-2xl shadow-primary/15 overflow-hidden">
                  <div className="h-12 border-b border-border/80 bg-muted/40 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs text-muted-foreground">Generating: {activeAnimatedSection.label}</div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 p-4 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-primary font-semibold">{activeAnimatedSection.label}</p>
                          <p className="text-base font-semibold text-foreground mt-1">{activeAnimatedSection.title}</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center animate-pulse">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-12 rounded-lg bg-muted animate-pulse" />
                      <div className="h-12 rounded-lg bg-muted animate-pulse" />
                      <div className="h-12 rounded-lg bg-muted animate-pulse" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {animatedSections.map((section, idx) => (
                        <div
                          key={section.label}
                          className={`rounded-md border px-2.5 py-1.5 transition-colors ${
                            idx <= animatedSectionIndex
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          {section.label}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="h-3 rounded bg-muted animate-pulse" />
                      <div className="h-3 rounded bg-muted animate-pulse w-10/12" />
                      <div className="h-3 rounded bg-muted animate-pulse w-8/12" />
                    </div>

                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Composing sections</span>
                        <span className="text-primary font-medium">{activeAnimatedSection.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700"
                          style={{ width: `${activeAnimatedSection.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BUSINESS INFO REVIEW ── */}
        {step === "business-info" && (
          <div className="p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Business Details</h2>
                <p className="text-muted-foreground mt-2">
                  Review and update your business details before generating your landing page.
                </p>
              </div>

              {/* 1) Core details */}
              <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Core details</h3>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Editable</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    value={wizardData.businessInfo.name}
                    onChange={(e) => updateBusinessInfo("name", e.target.value)}
                    placeholder="Your business name"
                    className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="business-tagline">Tagline</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-primary"
                      onClick={() => setTaglineModalOpen(true)}
                      disabled={generatingTagline}
                    >
                      {generatingTagline ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <Input
                    id="business-tagline"
                    value={wizardData.businessInfo.tagline}
                    onChange={(e) => updateBusinessInfo("tagline", e.target.value)}
                    placeholder="A short phrase for your brand"
                    className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="business-description">Business Description</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-primary"
                      onClick={() => setDescriptionModalOpen(true)}
                      disabled={generatingDescription}
                    >
                      {generatingDescription ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="business-description"
                    value={wizardData.businessInfo.description}
                    onChange={(e) => updateBusinessInfo("description", e.target.value)}
                    rows={4}
                    placeholder="Describe your business"
                    className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-email">Contact Email</Label>
                    <Input
                      id="business-email"
                      type="email"
                      value={wizardData.businessInfo.email}
                      onChange={(e) => updateBusinessInfo("email", e.target.value)}
                      placeholder="you@business.com"
                      className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-phone">Phone Number</Label>
                    <Input
                      id="business-phone"
                      value={wizardData.businessInfo.phone}
                      onChange={(e) => updateBusinessInfo("phone", e.target.value)}
                      placeholder="+1 ..."
                      className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              {/* 2) Business address */}
              <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Business address</h3>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Editable</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-country">Country</Label>
                    <Input
                      id="business-country"
                      value={wizardData.businessInfo.country}
                      onChange={(e) => updateBusinessInfo("country", e.target.value)}
                      className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-state">State</Label>
                    <Input
                      id="business-state"
                      value={wizardData.businessInfo.state}
                      onChange={(e) => updateBusinessInfo("state", e.target.value)}
                      className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-city">City</Label>
                    <Input
                      id="business-city"
                      value={wizardData.businessInfo.city}
                      onChange={(e) => updateBusinessInfo("city", e.target.value)}
                      className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-zipcode">Zip Code</Label>
                    <Input
                      id="business-zipcode"
                      value={wizardData.businessInfo.zipcode}
                      onChange={(e) => updateBusinessInfo("zipcode", e.target.value)}
                      className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-street">Street Address</Label>
                  <Input
                    id="business-street"
                    value={wizardData.businessInfo.streetAddress}
                    onChange={(e) => updateBusinessInfo("streetAddress", e.target.value)}
                    className="bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                  />
                </div>
              </div>

              {/* 3) Business logo */}
              <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-foreground">Business logo</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary"
                    onClick={() => setLogoModalOpen(true)}
                    disabled={generatingLogo}
                  >
                    {generatingLogo ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Generate with AI
                  </Button>
                </div>

                <div className="rounded-xl border border-dashed border-border p-4">
                  <Label htmlFor="business-logo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Upload logo</p>
                        <p className="text-xs text-muted-foreground">PNG/JPG up to 2MB</p>
                      </div>
                    </div>
                  </Label>
                  <input
                    id="business-logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) return;
                      updateBusinessInfo("logo", file);
                      updateBusinessInfo("logoPreview", URL.createObjectURL(file));
                    }}
                  />
                </div>

                {wizardData.businessInfo.logoPreview && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                    <img
                      src={wizardData.businessInfo.logoPreview}
                      alt="Business logo preview"
                      className="w-12 h-12 rounded-lg object-cover border border-border"
                    />
                    <p className="text-sm text-muted-foreground">Logo selected</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep("intro")}>Back</Button>
                <Button onClick={() => setStep("ai-chat")} className="px-8">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── GUIDED QUESTIONS (AI CHAT) ── */}
        {step === "ai-chat" && (
          <div className="space-y-4">
            <div className="px-6 pt-6 lg:px-8 lg:pt-8">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="text-base font-semibold text-foreground">Guided Questions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Answer these quick questions so AI can generate your desired landing page layout,
                  content direction and style.
                </p>
              </div>
            </div>

            <AiChatStep
              businessName={wizardData.businessInfo.name}
              mode="landing-page"
              onNext={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "universell-landing-page-draft",
                    JSON.stringify({
                      businessName: wizardData.businessInfo.name,
                      tagline: wizardData.businessInfo.tagline,
                      description: wizardData.businessInfo.description,
                      generatedAt: new Date().toISOString(),
                    })
                  );
                }
                router.push("/landing-pages/edit/ai-generated");
              }}
              onSkip={() => setStep("generation")}
            />
          </div>
        )}

        {/* ── AI GENERATION ── */}
        {step === "generation" && (
          <AiGenerationStep
            wizardData={wizardData}
            onUpdate={(pages) => {
              setWizardData((prev) => ({ ...prev, generatedPages: pages }));
              if (pages.length > 0) setGeneratedPageName(pages[0]);
            }}
            onNext={() => setStep("done")}
            onBack={() => setStep("ai-chat")}
          />
        )}

        {/* ── DONE ── */}
        {step === "done" && (
          <div className="flex items-center justify-center min-h-[500px] p-8">
            <div className="max-w-md w-full text-center space-y-6">
              {/* Success icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your page is ready! 🎉</h2>
                <p className="text-muted-foreground">
                  AI has generated your page. You can now preview or edit it in
                  the website editor.
                </p>
              </div>

              {/* Generated page card */}
              <div className="bg-muted/30 rounded-xl border border-border p-4 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate capitalize">{generatedPageName}</p>
                  <p className="text-xs text-muted-foreground">AI-generated · Draft</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-600 font-medium">Generated</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button className="flex-1 rounded-xl" asChild>
                  <Link href="/website-pages">
                    <Edit className="w-4 h-4 mr-2" />
                    Go to Website Pages
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl" onClick={reset}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Another
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Let&apos;s get to know your business better 👋</DialogTitle>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">
              A few details here will help us write a great description for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Label htmlFor="business-description-ai-prompt" className="text-base font-semibold text-foreground">
              Tell us about your business
            </Label>
            <Textarea
              id="business-description-ai-prompt"
              value={descriptionPrompt}
              onChange={(e) => setDescriptionPrompt(e.target.value)}
              placeholder="What do you sell? Who is it for? What makes you different?"
              className="min-h-[150px] text-base leading-relaxed rounded-xl border border-primary/40 focus-visible:ring-primary/30"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setDescriptionModalOpen(false)}
              className="h-10 px-5 rounded-xl"
              disabled={generatingDescription}
            >
              Cancel
            </Button>
            <Button
              onClick={() => generateDescriptionWithAI(descriptionPrompt)}
              className="h-10 px-5 rounded-xl"
              disabled={generatingDescription}
            >
              {generatingDescription ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Description
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={taglineModalOpen} onOpenChange={setTaglineModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Let&apos;s craft your brand tagline ✨</DialogTitle>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">
              Share a bit about your tone and audience, and we&apos;ll generate a catchy tagline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Label htmlFor="business-tagline-ai-prompt" className="text-base font-semibold text-foreground">
              Describe the vibe you want
            </Label>
            <Textarea
              id="business-tagline-ai-prompt"
              value={taglinePrompt}
              onChange={(e) => setTaglinePrompt(e.target.value)}
              placeholder="Friendly, premium, modern, playful..."
              className="min-h-[150px] text-base leading-relaxed rounded-xl border border-primary/40 focus-visible:ring-primary/30"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setTaglineModalOpen(false)}
              className="h-10 px-5 rounded-xl"
              disabled={generatingTagline}
            >
              Cancel
            </Button>
            <Button
              onClick={() => generateTaglineWithAI(taglinePrompt)}
              className="h-10 px-5 rounded-xl"
              disabled={generatingTagline}
            >
              {generatingTagline ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Tagline
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={logoModalOpen} onOpenChange={setLogoModalOpen}>
        <DialogContent className="sm:max-w-3xl rounded-2xl p-4 h-[74vh] max-h-[700px] overflow-hidden">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold text-foreground">
              AI-Generated Logos for {wizardData.businessInfo.name || "Your Business"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select a logo style that fits your brand. You can customize colors after selection.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
            {aiLogoStyles.map((style) => {
              const selected = selectedLogoStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedLogoStyle(style.id)}
                  className={`rounded-lg border p-2 text-left transition-all ${
                    selected
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-border hover:border-primary/40 bg-background"
                  }`}
                >
                  <div className="w-full h-11 rounded-md border border-border/50 bg-white flex items-center justify-center mb-1 overflow-hidden">
                    <img
                      src={getAiLogoPreview(style.id)}
                      alt={`${style.label} logo preview`}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-foreground">{style.label}</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-border p-2.5 bg-background space-y-2">
              <h4 className="text-base font-semibold text-foreground">Logo Preview</h4>
              <div className="rounded-lg bg-muted/20 border border-border p-2.5 flex items-center justify-center">
                <img
                  src={getAiLogoPreview(selectedLogoStyle, logoPrimaryColor, logoSecondaryColor)}
                  alt="Selected logo preview"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">{wizardData.businessInfo.name || "Your Business"}</p>
            </div>

            <div className="rounded-xl border border-border p-2.5 bg-background space-y-2.5">
              <h4 className="text-base font-semibold text-foreground">Customize Logo Colors</h4>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Color Themes</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {logoThemeOptions.map((theme) => {
                    const active = selectedLogoTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => applyLogoTheme(theme.id)}
                        className={`rounded-lg border p-2 transition-all ${
                          active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.secondary }} />
                        </div>
                        <p className="text-[11px] text-foreground">{theme.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-1.5 border-t border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Custom Colors</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="logo-primary-color" className="text-xs">Primary</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="logo-primary-color"
                        type="color"
                        value={logoPrimaryColor}
                        onChange={(e) => {
                          setSelectedLogoTheme("custom");
                          setLogoPrimaryColor(e.target.value);
                        }}
                        className="w-7 h-7 rounded border border-border"
                      />
                      <Input
                        value={logoPrimaryColor.toUpperCase()}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedLogoTheme("custom");
                          setLogoPrimaryColor(value);
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="logo-secondary-color" className="text-xs">Secondary</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="logo-secondary-color"
                        type="color"
                        value={logoSecondaryColor}
                        onChange={(e) => {
                          setSelectedLogoTheme("custom");
                          setLogoSecondaryColor(e.target.value);
                        }}
                        className="w-7 h-7 rounded border border-border"
                      />
                      <Input
                        value={logoSecondaryColor.toUpperCase()}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedLogoTheme("custom");
                          setLogoSecondaryColor(value);
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setLogoModalOpen(false)} disabled={generatingLogo} className="h-9 px-4">
              Cancel
            </Button>
            <Button onClick={generateLogoWithAI} disabled={generatingLogo} className="h-9 px-4">
              {generatingLogo ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Use Selected Logo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
