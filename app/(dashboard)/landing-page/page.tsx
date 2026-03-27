"use client";

import { useEffect, useState } from "react";
import { AiChatStep } from "@/components/onboarding/steps/ai-chat-step";
import { AiGenerationStep } from "@/components/onboarding/steps/ai-generation-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const generateTaglineWithAI = () => {
    setGeneratingTagline(true);
    const name = wizardData.businessInfo.name || "Your Business";
    setTimeout(() => {
      updateBusinessInfo("tagline", `Crafted for ${name.split(" ")[0]} customers, served with warmth`);
      setGeneratingTagline(false);
    }, 900);
  };

  const generateDescriptionWithAI = () => {
    setGeneratingDescription(true);
    const name = wizardData.businessInfo.name || "Your business";
    setTimeout(() => {
      updateBusinessInfo(
        "description",
        `${name} delivers premium quality with a modern customer-first experience. Our team focuses on consistency, trust and delight—so every visit feels personal and every purchase feels effortless.`
      );
      setGeneratingDescription(false);
    }, 1100);
  };

  const generateLogoWithAI = () => {
    setGeneratingLogo(true);
    const businessName = wizardData.businessInfo.name || "Business";
    const initials = businessName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "B";

    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
        <defs>
          <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stop-color='#f97316'/>
            <stop offset='100%' stop-color='#ea580c'/>
          </linearGradient>
        </defs>
        <rect width='240' height='240' rx='52' fill='url(#g)'/>
        <circle cx='120' cy='120' r='74' fill='rgba(255,255,255,0.16)'/>
        <text x='120' y='138' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-size='72' font-weight='700'>${initials}</text>
      </svg>
    `.trim();

    setTimeout(() => {
      const logoPreview = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      updateBusinessInfo("logo", null);
      updateBusinessInfo("logoPreview", logoPreview);
      setGeneratingLogo(false);
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
                <h3 className="font-semibold text-foreground">Core details</h3>

                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    value={wizardData.businessInfo.name}
                    onChange={(e) => updateBusinessInfo("name", e.target.value)}
                    placeholder="Your business name"
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
                      onClick={generateTaglineWithAI}
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
                      onClick={generateDescriptionWithAI}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-phone">Phone Number</Label>
                    <Input
                      id="business-phone"
                      value={wizardData.businessInfo.phone}
                      onChange={(e) => updateBusinessInfo("phone", e.target.value)}
                      placeholder="+1 ..."
                    />
                  </div>
                </div>
              </div>

              {/* 2) Business address */}
              <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
                <h3 className="font-semibold text-foreground">Business address</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-country">Country</Label>
                    <Input
                      id="business-country"
                      value={wizardData.businessInfo.country}
                      onChange={(e) => updateBusinessInfo("country", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-state">State</Label>
                    <Input
                      id="business-state"
                      value={wizardData.businessInfo.state}
                      onChange={(e) => updateBusinessInfo("state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-city">City</Label>
                    <Input
                      id="business-city"
                      value={wizardData.businessInfo.city}
                      onChange={(e) => updateBusinessInfo("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-zipcode">Zip Code</Label>
                    <Input
                      id="business-zipcode"
                      value={wizardData.businessInfo.zipcode}
                      onChange={(e) => updateBusinessInfo("zipcode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-street">Street Address</Label>
                  <Input
                    id="business-street"
                    value={wizardData.businessInfo.streetAddress}
                    onChange={(e) => updateBusinessInfo("streetAddress", e.target.value)}
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
                    onClick={generateLogoWithAI}
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
    </div>
  );
}
