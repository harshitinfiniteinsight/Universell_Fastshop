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
import { Sparkles, FileText, Zap, ArrowRight, Check, Edit, Upload, Loader2, LayoutTemplate, Target, Globe, ExternalLink, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LandingPageStep = "type-select" | "intro" | "business-info" | "ai-chat" | "generation" | "done";
type LandingPageType = "business" | "lead" | null;

type SavedLandingPageDraft = {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  html: string;
  css: string;
  updatedAt: string;
  status: "draft" | "published";
};

const SAVED_LANDING_PAGES_KEY = "universell-saved-landing-pages";

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
  const [landingPageType, setLandingPageType] = useState<LandingPageType>(null);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [savedLandingPages, setSavedLandingPages] = useState<SavedLandingPageDraft[]>([]);
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
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false);

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

  useEffect(() => {
    const loadSavedLandingPages = () => {
      try {
        const raw = localStorage.getItem(SAVED_LANDING_PAGES_KEY);
        if (!raw) {
          setSavedLandingPages([]);
          return;
        }

        const parsed = JSON.parse(raw) as Array<Omit<SavedLandingPageDraft, "status"> & { status?: "draft" | "published" }>;
        const normalized = parsed
          .map((item) => ({
            ...item,
            status: item.status ?? "draft",
          }))
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        setSavedLandingPages(normalized as SavedLandingPageDraft[]);
      } catch {
        setSavedLandingPages([]);
      }
    };

    loadSavedLandingPages();
    window.addEventListener("focus", loadSavedLandingPages);

    return () => {
      window.removeEventListener("focus", loadSavedLandingPages);
    };
  }, []);

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
    setLandingPageType(null);
    setWizardData(initialWizardData);
    setGeneratedPageName("Homepage");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Landing Pages</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage professional landing pages
            </p>
          </div>

          {step === "intro" && (
            <div className="flex items-center gap-2 self-start sm:mt-1">
              <Button
                onClick={() => setStep("business-info")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Landing Page
              </Button>
              <Button asChild variant="outline" className="rounded-lg">
                <Link href="/landing-pages/templates">Select Template</Link>
              </Button>
            </div>
          )}
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

        {/* ── TYPE SELECT ── */}
        {step === "type-select" && (
          <div className="relative overflow-hidden p-6 lg:p-10">
            {/* Ambient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-400/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">

              {/* Heading */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                  What would you like to{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    create?
                  </span>
                </h2>
                <p className="text-muted-foreground text-base max-w-lg mx-auto">
                  Pick the right starting point — AI will tailor your page structure and content based on your goal.
                </p>
              </div>

              {/* Primary cards — Business & Lead Capture */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Business Landing Page */}
                <button
                  onClick={() => { setLandingPageType("business"); setStep("ai-chat"); }}
                  className="group text-left rounded-2xl border border-border bg-background p-6 space-y-4 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <LayoutTemplate className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      Business Landing Page
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Introduce your brand, showcase your products or services, and build trust with visitors. Best for establishing your online presence.
                    </p>
                  </div>

                  <ul className="space-y-1.5">
                    {["Custom brand sections", "Product & service showcase", "Story & trust building"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-primary pt-1">
                    Get started
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>

                {/* Lead Capture Page */}
                <button
                  onClick={() => { setLandingPageType("lead"); setStep("ai-chat"); }}
                  className="group text-left rounded-2xl border border-border bg-background p-6 space-y-4 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-orange-400/10 flex items-center justify-center group-hover:bg-orange-400/15 transition-colors">
                      <Target className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                      High Converting
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      Lead Capture Page
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Collect enquiries, drive sign-ups, and run promotions with a focused single-action page. Built to turn visitors into leads.
                    </p>
                  </div>

                  <ul className="space-y-1.5">
                    {["Contact & sign-up forms", "Promotion & campaign ready", "Single powerful CTA"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Get started
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setLearnMoreModalOpen(true); }}
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-primary transition-colors"
                    >
                      Learn more
                    </button>
                  </div>
                </button>
              </div>

              {/* Third card — Multi-Page Website */}
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">Multi-Page Website</h3>
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                          Via FastShop AI
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Get a complete AI-generated website — Home, About, Products & Contact — all set up through the FastShop builder.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/onboarding")}
                    className="flex-shrink-0 gap-1.5 text-xs"
                  >
                    Launch FastShop Builder
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── INTRO ── */}
        {step === "intro" && (
          <div className="p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              {savedLandingPages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-gradient-to-br from-primary/5 to-primary/2 p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No landing pages yet</h3>
                  <p className="text-muted-foreground mt-2">Generate your first landing page to get started.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {savedLandingPages.filter((page) => (page.status ?? "draft") === "draft").length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            Drafts
                          </h2>
                        </div>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {savedLandingPages.filter((page) => (page.status ?? "draft") === "draft").length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {savedLandingPages.filter((page) => (page.status ?? "draft") === "draft").map((page) => (
                          <div key={page.id} className="group rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 overflow-hidden flex flex-col">
                            {/* Preview area */}
                            <div className="relative h-40 bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border/50 flex items-center justify-center overflow-hidden">
                              <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/20" />
                                <div className="absolute bottom-6 right-6 w-16 h-8 rounded bg-white/20" />
                                <div className="absolute top-1/3 right-4 w-20 h-1 rounded-full bg-white/10" />
                                <div className="absolute bottom-1/3 left-4 w-24 h-1 rounded-full bg-white/10" />
                              </div>
                              <div className="relative text-center space-y-2">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto flex items-center justify-center">
                                  <span className="text-white font-bold text-xl">{page.businessName.split(" ").slice(0, 2).map(w => w[0]).join("")}</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{page.businessName}</p>
                              </div>
                              <span className="absolute top-3 right-3 text-[10px] font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">Draft</span>
                            </div>

                            {/* Content area */}
                            <div className="flex-1 p-4 flex flex-col gap-3">
                              <div className="min-h-0">
                                <p className="text-sm font-semibold text-foreground line-clamp-1">{page.tagline}</p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(page.updatedAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-2 mt-auto">
                                <Button size="sm" asChild className="flex-1 rounded-lg text-xs">
                                  <Link href={`/landing-pages/edit/${page.id}`}>
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {savedLandingPages.filter((page) => page.status === "published").length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Published
                          </h2>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                          {savedLandingPages.filter((page) => page.status === "published").length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {savedLandingPages.filter((page) => page.status === "published").map((page) => (
                          <div key={page.id} className="group rounded-2xl border border-emerald-200/50 bg-background hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 overflow-hidden flex flex-col">
                            {/* Preview area */}
                            <div className="relative h-40 bg-gradient-to-br from-emerald-100/40 via-emerald-50/20 to-background border-b border-emerald-200/30 flex items-center justify-center overflow-hidden">
                              <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/20" />
                                <div className="absolute bottom-6 right-6 w-16 h-8 rounded bg-white/20" />
                                <div className="absolute top-1/3 right-4 w-20 h-1 rounded-full bg-white/10" />
                                <div className="absolute bottom-1/3 left-4 w-24 h-1 rounded-full bg-white/10" />
                              </div>
                              <div className="relative text-center space-y-2">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mx-auto flex items-center justify-center">
                                  <span className="text-white font-bold text-xl">{page.businessName.split(" ").slice(0, 2).map(w => w[0]).join("")}</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{page.businessName}</p>
                              </div>
                              <span className="absolute top-3 right-3 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Live</span>
                            </div>

                            {/* Content area */}
                            <div className="flex-1 p-4 flex flex-col gap-3">
                              <div className="min-h-0">
                                <p className="text-sm font-semibold text-foreground line-clamp-1">{page.tagline}</p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(page.updatedAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-2 mt-auto">
                                <Button size="sm" variant="outline" asChild className="flex-1 rounded-lg text-xs">
                                  <Link href={`/landing-pages/edit/${page.id}`}>
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
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

              {/* 1) Basic Details */}
              <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Basic Details</h3>
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

      {/* ── LEARN MORE — Lead Forms ── */}
      <Dialog open={learnMoreModalOpen} onOpenChange={setLearnMoreModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
                  {/* Header band */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/60 px-6 pt-6 pb-5 border-b border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-400/15 flex items-center justify-center">
                        <Target className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="text-xs font-semibold text-orange-600 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-full">
                        Lead Forms
                      </span>
                    </div>
                    <DialogHeader className="space-y-1 text-left">
                      <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
                        What are Lead Forms?
                      </DialogTitle>
                      <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Simple forms that collect customer details for you.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5 space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      Lead Forms are <span className="font-semibold text-foreground">ready-made forms</span> that ask visitors for details like name, phone number, and email. Their details are saved automatically into your CRM.
                    </p>

                    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">What they collect</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["Full name", "Phone number", "Email address", "Custom questions"].map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You can add a Lead Form anywhere on your page, such as at the top, in a popup, or at the end of an offer, so people can contact you quickly.
                    </p>

                    <div className="rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-orange-700 leading-relaxed">
                        <span className="font-semibold">For now</span>, focus on creating your landing page. You can add and edit Lead Forms after your page goes live.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-5 flex justify-end">
                    <Button
                      onClick={() => setLearnMoreModalOpen(false)}
                      className="rounded-xl px-6"
                    >
                      Got it
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
