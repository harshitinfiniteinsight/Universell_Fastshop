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
import {
  Sparkles,
  FileText,
  Zap,
  ArrowRight,
  Check,
  Edit,
  Upload,
  Loader2,
  LayoutTemplate,
  Target,
  ExternalLink,
  ChevronRight,
  Code,
  Layers,
  Palette,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type AIWebBuilderStep = "intro" | "business-info" | "ai-chat" | "generation" | "done";
type BuilderType = "landing-page" | "website";

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

type SavedWebsiteDraft = {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  pages: string[];
  updatedAt: string;
  status: "draft" | "published";
  previewImage: string;
};

const SAVED_LANDING_PAGES_KEY = "universell-saved-landing-pages";
const SAVED_WEBSITES_KEY = "universell-saved-websites";

const websitePreviewImages = [
  "https://github.com/user-attachments/assets/e701848f-a446-48c6-b533-c7cfd025c34f",
  "https://github.com/user-attachments/assets/00f4c188-aa4c-4f3b-9a93-28135e087589",
  "https://github.com/user-attachments/assets/5965ba34-f784-4841-8d42-21f0745d121d",
  "https://github.com/user-attachments/assets/0096d192-0205-44c6-941a-3cc4dc12cb54",
];

const initialWizardData: WizardData = {
  businessInfo: {
    name: "Modern Store",
    tagline: "Build your online presence instantly",
    description:
      "Create a professional website for your business with AI-powered suggestions and design recommendations.",
    email: "hello@modernstore.com",
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
  themeColor: "#3b82f6",
};

const templateSlides = [
  {
    src: "https://github.com/user-attachments/assets/d2a27feb-16d4-4d90-a35e-8cee7f4bc2c7",
    alt: "Business website template sample",
    label: "Business Website",
  },
  {
    src: "https://github.com/user-attachments/assets/31d121d4-9cdb-445e-8934-d446015dfec4",
    alt: "Portfolio gallery website template sample",
    label: "Portfolio Gallery",
  },
  {
    src: "https://github.com/user-attachments/assets/5cccb920-43e1-49cf-85fb-673f0bd48309",
    alt: "Event & community website template sample",
    label: "Event & Community",
  },
  {
    src: "https://github.com/user-attachments/assets/474e00fb-143a-4024-9d1c-ff1227ac473f",
    alt: "Campaign landing page template sample",
    label: "Campaign Landing",
  },
];

interface AIBuilderContentProps {
  builderType: BuilderType;
}

export function AIBuilderContent({ builderType }: AIBuilderContentProps) {
  const [step, setStep] = useState<AIWebBuilderStep>("intro");
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [generatedPageName, setGeneratedPageName] = useState("Homepage");
  const [generatedPages, setGeneratedPages] = useState<string[]>([]);
  const [animatedSectionIndex, setAnimatedSectionIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [lpCarouselIndex, setLpCarouselIndex] = useState(0);
  const [generatingTagline, setGeneratingTagline] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [taglineModalOpen, setTaglineModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [taglinePrompt, setTaglinePrompt] = useState("");
  const [descriptionPrompt, setDescriptionPrompt] = useState("");
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "view-existing">("generate");
  const [savedLandingPages, setSavedLandingPages] = useState<SavedLandingPageDraft[]>([]);
  const [savedWebsites, setSavedWebsites] = useState<SavedWebsiteDraft[]>([]);

  const isLandingPageBuilder = builderType === "landing-page";
  const isWebsiteBuilder = builderType === "website";

  const websitePagePreviewTemplates = [
    {
      badge: "Homepage",
      label: "Main Landing Experience",
      title: "Build a compelling homepage with strong first impressions",
      progress: 18,
      image: "/website-previews/homepage.svg",
      accent: "#4f46e5",
      sections: [
        { title: "Hero + value proposition", status: "Ready" },
        { title: "Service overview", status: "Structured" },
        { title: "Primary CTA", status: "Optimized" },
      ],
      noteTitle: "Homepage Focus",
      note: "Lead with clarity, immediate value, and strong visual hierarchy to orient visitors in seconds.",
      checklist: ["Clear headline", "Offer snapshot", "Primary CTA above fold"],
    },
    {
      badge: "About Us",
      label: "Brand Story Page",
      title: "Tell your story and build trust with a polished about page",
      progress: 34,
      image: "/website-previews/about-us.svg",
      accent: "#0891b2",
      sections: [
        { title: "Mission + values", status: "Ready" },
        { title: "Team / founder story", status: "Drafted" },
        { title: "Trust credentials", status: "Optimized" },
      ],
      noteTitle: "Brand Credibility",
      note: "Use authentic story points, proof markers, and people-first messaging to deepen visitor trust.",
      checklist: ["Brand narrative", "Proof of expertise", "Human tone"],
    },
    {
      badge: "Testimonials",
      label: "Social Proof Page",
      title: "Showcase client feedback with a conversion-ready testimonials page",
      progress: 50,
      image: "/website-previews/testimonials.svg",
      accent: "#ea580c",
      sections: [
        { title: "Client highlights", status: "Ready" },
        { title: "Case snippets", status: "Structured" },
        { title: "Trust CTA", status: "Optimized" },
      ],
      noteTitle: "Proof Layer",
      note: "Mix short testimonials with measurable outcomes to remove hesitation and reinforce value.",
      checklist: ["Diverse testimonials", "Outcome-based proof", "CTA near proof"],
    },
    {
      badge: "Contact",
      label: "Contact & Inquiry Page",
      title: "Create an easy contact page that drives inquiries and bookings",
      progress: 66,
      image: "/website-previews/contact.svg",
      accent: "#2563eb",
      sections: [
        { title: "Contact form", status: "Ready" },
        { title: "Map + location", status: "Structured" },
        { title: "Booking CTA", status: "Live" },
      ],
      noteTitle: "Inquiry Flow",
      note: "Keep forms short, show contact options clearly, and reduce friction for quick outreach.",
      checklist: ["Simple form", "Phone/email visibility", "Response expectation"],
    },
    {
      badge: "Products",
      label: "Product Catalog Page",
      title: "Present products in a clean catalog designed for discovery",
      progress: 82,
      image: "/website-previews/products.svg",
      accent: "#7c3aed",
      sections: [
        { title: "Category blocks", status: "Ready" },
        { title: "Product cards", status: "Structured" },
        { title: "Detail CTA", status: "Optimized" },
      ],
      noteTitle: "Catalog Experience",
      note: "Use clear product grouping, concise descriptors, and visual hierarchy for faster browsing.",
      checklist: ["Card consistency", "Filter-ready layout", "Product CTAs"],
    },
    {
      badge: "Services",
      label: "Services Overview Page",
      title: "Organize your services into a modern, easy-to-scan page",
      progress: 100,
      image: "/website-previews/services.svg",
      accent: "#16a34a",
      sections: [
        { title: "Service categories", status: "Ready" },
        { title: "Process explanation", status: "Drafted" },
        { title: "Consultation CTA", status: "Optimized" },
      ],
      noteTitle: "Service Clarity",
      note: "Explain outcomes, not just activities, and pair each service with a direct next-step action.",
      checklist: ["Outcome-led copy", "Clear package structure", "Action-focused CTA"],
    },
  ];

  const landingPagePreviewTemplates = [
    {
      badge: "Lead Generation",
      label: "Lead Capture Page",
      title: "Generate qualified leads with a focused signup flow",
      progress: 25,
      accent: "#f97316",
      accentSoft: "rgba(249, 115, 22, 0.14)",
      image: "/landing-previews/lead-generation.svg",
      description:
        "Ideal for demos, consultations, or newsletter campaigns with strong hooks, social proof, and one clear form CTA.",
      sections: [
        { title: "Hero + lead form", status: "Ready" },
        { title: "Benefits + proof", status: "Optimized" },
        { title: "Trust + FAQ", status: "Live" },
      ],
      noteTitle: "Lead Strategy",
      note: "Use urgency, outcome-driven copy, and a short form to maximize conversions without overwhelming visitors.",
      checklist: ["Short conversion form", "Offer-first messaging", "Trust indicators"],
    },
    {
      badge: "Product Information",
      label: "Product Launch Page",
      title: "Showcase features, value, and launch momentum",
      progress: 50,
      accent: "#6366f1",
      accentSoft: "rgba(99, 102, 241, 0.14)",
      image: "/landing-previews/product-launch.svg",
      description:
        "Perfect for new products, SaaS launches, or feature rollouts with benefit-led messaging and comparison-ready sections.",
      sections: [
        { title: "Hero + feature highlights", status: "Ready" },
        { title: "Use cases + specs", status: "Drafted" },
        { title: "Pricing / CTA block", status: "Optimized" },
      ],
      noteTitle: "Product Story",
      note: "Lead with the core promise, support with feature cards, and add friction-reducing CTAs for fast evaluation.",
      checklist: ["Benefit-led headline", "Feature stack", "Launch CTA"],
    },
    {
      badge: "Business Information",
      label: "Business Overview Page",
      title: "Present services, credibility, and contact details clearly",
      progress: 75,
      accent: "#10b981",
      accentSoft: "rgba(16, 185, 129, 0.14)",
      image: "/landing-previews/business-overview.svg",
      description:
        "Best for local businesses, agencies, and professional services that need a sharp one-page summary with trust and contact blocks.",
      sections: [
        { title: "About + service overview", status: "Ready" },
        { title: "Proof + testimonials", status: "Structured" },
        { title: "Contact + map CTA", status: "Live" },
      ],
      noteTitle: "Business Positioning",
      note: "Keep the value proposition clear, highlight expertise quickly, and make it easy to contact or book from the same page.",
      checklist: ["Credibility section", "Service summary", "Contact visibility"],
    },
    {
      badge: "Event / Campaign",
      label: "Promotional One-Page Site",
      title: "Drive registrations, signups, or limited-time campaign action",
      progress: 100,
      accent: "#8b5cf6",
      accentSoft: "rgba(139, 92, 246, 0.14)",
      image: "/landing-previews/campaign-event.svg",
      description:
        "Great for webinars, events, festive offers, and promos with countdown sections, urgency messaging, and high-visibility CTAs.",
      sections: [
        { title: "Event hook + countdown", status: "Ready" },
        { title: "Agenda / offer details", status: "Drafted" },
        { title: "Register CTA", status: "Optimized" },
      ],
      noteTitle: "Campaign Momentum",
      note: "Emphasize deadlines, what visitors get, and a strong call to action repeated across the page for best results.",
      checklist: ["Urgency messaging", "Offer breakdown", "Repeat CTA"],
    },
  ];

  const previewRotationCount = isLandingPageBuilder
    ? landingPagePreviewTemplates.length
    : websitePagePreviewTemplates.length;

  useEffect(() => {
    if (step !== "intro") return;

    const interval = setInterval(() => {
      setAnimatedSectionIndex((prev) => (prev + 1) % previewRotationCount);
    }, 1300);

    return () => clearInterval(interval);
  }, [step, previewRotationCount]);

  useEffect(() => {
    if (step !== "intro") return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % templateSlides.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== "intro" || !isLandingPageBuilder) return;

    const interval = setInterval(() => {
      setLpCarouselIndex((prev) => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, [step, isLandingPageBuilder]);

  useEffect(() => {
    if (!isLandingPageBuilder) return;
    const loadSavedPages = () => {
      try {
        const raw = localStorage.getItem(SAVED_LANDING_PAGES_KEY);
        if (!raw) {
          setSavedLandingPages([]);
          return;
        }
        const parsed = JSON.parse(raw);
        const normalized = parsed
          .map((item: Omit<SavedLandingPageDraft, "status"> & { status?: "draft" | "published" }) => ({
            ...item,
            status: item.status ?? "draft",
          }))
          .sort(
            (a: SavedLandingPageDraft, b: SavedLandingPageDraft) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        setSavedLandingPages(normalized);
      } catch {
        setSavedLandingPages([]);
      }
    };
    loadSavedPages();
    window.addEventListener("focus", loadSavedPages);
    return () => window.removeEventListener("focus", loadSavedPages);
  }, [isLandingPageBuilder]);

  useEffect(() => {
    if (!isWebsiteBuilder) return;
    const loadSavedWebsites = () => {
      try {
        const raw = localStorage.getItem(SAVED_WEBSITES_KEY);
        if (!raw) {
          setSavedWebsites([]);
          return;
        }
        const parsed = JSON.parse(raw);
        const normalized = parsed
          .map((item: Omit<SavedWebsiteDraft, "status"> & { status?: "draft" | "published" }) => ({
            ...item,
            status: item.status ?? "draft",
          }))
          .sort(
            (a: SavedWebsiteDraft, b: SavedWebsiteDraft) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        setSavedWebsites(normalized);
      } catch {
        setSavedWebsites([]);
      }
    };
    loadSavedWebsites();
    window.addEventListener("focus", loadSavedWebsites);
    return () => window.removeEventListener("focus", loadSavedWebsites);
  }, [isWebsiteBuilder]);

  const activeLandingPagePreview =
    landingPagePreviewTemplates[animatedSectionIndex % landingPagePreviewTemplates.length];
  const activeLandingAccent = activeLandingPagePreview.accent;
  const activeLandingAccentSoft = activeLandingPagePreview.accentSoft;

  const learnMoreContent = isLandingPageBuilder
    ? {
        title: "How the AI Landing Page Builder works",
        description:
          "A focused workflow for turning one campaign goal into a high-converting landing page draft.",
        items: [
          {
            icon: Target,
            title: "1. Define the conversion goal",
            description:
              "Tell the AI what action matters most, from lead capture to bookings, demos, or product signups.",
          },
          {
            icon: Sparkles,
            title: "2. Shape the message",
            description:
              "Generate headlines, supporting copy, benefits, and CTAs aligned to your audience and offer.",
          },
          {
            icon: LayoutTemplate,
            title: "3. Build the page structure",
            description:
              "AI assembles the right section flow including hero, proof points, benefits, FAQs, and action blocks.",
          },
          {
            icon: Zap,
            title: "4. Optimize for conversion",
            description:
              "Review the draft and refine messaging, visual hierarchy, and CTA placement before publishing.",
          },
        ],
      }
    : {
        title: "How the AI Website Builder works",
        description:
          "A guided workflow that turns business context into a complete, ready-to-customize website draft.",
        items: [
          {
            icon: Target,
            title: "1. Understand your business",
            description:
              "Capture your audience, positioning, services, and goals so the website starts with the right message.",
          },
          {
            icon: Sparkles,
            title: "2. Shape the brand direction",
            description:
              "Define tone, tagline, description, color direction, and layout style before generation begins.",
          },
          {
            icon: LayoutTemplate,
            title: "3. Generate page structure",
            description:
              "AI assembles the right mix of sections such as hero, services, social proof, FAQs, and conversion blocks.",
          },
          {
            icon: Code,
            title: "4. Review and refine",
            description:
              "Preview the generated draft, adjust messaging, and continue customizing inside Universell.",
          },
        ],
      };

  const generateTaglineWithAI = (context?: string) => {
    setGeneratingTagline(true);
    const name = wizardData.businessInfo.name || "Your Business";
    const prompt = (context || "").trim();
    setTimeout(() => {
      const generatedTagline = prompt
        ? `${name}: ${prompt.replace(/\s+/g, " ").slice(0, 58)}`
        : `Build Your Online Success With ${name}`;
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
          ? `${name} ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}. We deliver excellence through innovative design and seamless user experiences.`
          : `${name} combines cutting-edge design with powerful functionality. Our AI-powered web builder helps you create a stunning online presence that converts visitors into customers.`
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

  const updateBusinessInfo = (key: keyof typeof wizardData.businessInfo, value: unknown) => {
    setWizardData((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [key]: value,
      },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      updateBusinessInfo("logo", file);
      updateBusinessInfo("logoPreview", preview);
    };
    reader.readAsDataURL(file);
  };

  const generateLogoWithAI = () => {
    const initials = getBusinessInitials();
    const primary = "#3b82f6";
    const secondary = "#60a5fa";

    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'>
        <defs>
          <linearGradient id='logoGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stop-color='${primary}'/>
            <stop offset='100%' stop-color='${secondary}'/>
          </linearGradient>
        </defs>
        <rect width='320' height='320' rx='64' fill='url(#logoGrad)'/>
        <circle cx='160' cy='160' r='112' fill='rgba(255,255,255,0.14)'/>
        <text x='160' y='184' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='104' font-weight='700' fill='white'>${initials}</text>
      </svg>
    `.trim();

    const preview = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    updateBusinessInfo("logo", null);
    updateBusinessInfo("logoPreview", preview);
  };

  const saveWebsiteToStorage = (pages: string[]) => {
    if (!isWebsiteBuilder) return;
    try {
      const raw = localStorage.getItem(SAVED_WEBSITES_KEY);
      const existing: SavedWebsiteDraft[] = raw ? JSON.parse(raw) : [];
      const id = `website-${Date.now()}`;
      // Use a deterministic preview image derived from the new entry's id
      const previewImage = websitePreviewImages[existing.length % websitePreviewImages.length];
      const newEntry: SavedWebsiteDraft = {
        id,
        businessName: wizardData.businessInfo.name,
        tagline: wizardData.businessInfo.tagline,
        description: wizardData.businessInfo.description,
        pages: pages.length > 0 ? pages : ["Homepage", "About Us", "Contact", "Terms & Conditions", "Privacy Policy"],
        updatedAt: new Date().toISOString(),
        status: "draft",
        previewImage,
      };
      localStorage.setItem(SAVED_WEBSITES_KEY, JSON.stringify([newEntry, ...existing]));
    } catch {
      // ignore storage errors
    }
  };

  const handleGenerationComplete = () => {
    saveWebsiteToStorage(generatedPages);
    setStep("done");
  };

  return (
    <div className="space-y-6">
      {/* Card wrapper */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        {step === "intro" && (
          <>
            {isLandingPageBuilder && (
              <div className="flex items-center justify-between border-b border-border px-4 lg:px-6">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("generate")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "generate"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Generate New
                  </button>
                  <button
                    onClick={() => setActiveTab("view-existing")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "view-existing"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    View Existing Landing Pages
                  </button>
                </div>
                {activeTab === "generate" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 shrink-0"
                    onClick={() => {}}
                  >
                    <LayoutTemplate className="h-4 w-4" />
                    Select Template
                  </Button>
                )}
              </div>
            )}
            {isWebsiteBuilder && (
              <div className="flex items-center border-b border-border px-4 lg:px-6">
                <button
                  onClick={() => setActiveTab("generate")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "generate"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Generate New
                </button>
                <button
                  onClick={() => setActiveTab("view-existing")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "view-existing"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  View Websites
                </button>
              </div>
            )}
            {activeTab === "generate" ? (
          <div className="relative overflow-hidden px-4 py-6 lg:px-6 lg:py-8">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-[86rem] pr-1 lg:pr-2">
              {isWebsiteBuilder ? (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start 2xl:gap-8">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">AI Website Studio</span>
                    </div>

                    <div className="space-y-5">
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Strategy-led layout",
                          "Brand-aware copy",
                          "Multi-page generation",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-4xl font-bold text-foreground leading-[1.15] tracking-tight lg:text-5xl">
                        Design pages to capture attention{" "}
                        <span className="relative inline-block">
                          <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-orange-500 bg-clip-text text-transparent">
                            and drive action.
                          </span>
                          <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/15 -rotate-1 rounded" />
                        </span>
                      </h2>

                      <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:text-lg">
                        From one short brief, Universell generates a complete multi-page website in minutes, including core pages like homepage, about us, testimonials, services, products, and contact.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {[
                        {
                          icon: Layers,
                          title: "Smart structure",
                          description: "AI maps hero, proof, services, FAQs, and CTAs into a complete website flow.",
                        },
                        {
                          icon: Palette,
                          title: "Create multi page website",
                          description: "Generate essential pages with consistent design and messaging across the full site.",
                        },
                        {
                          icon: Code,
                          title: "Production-ready",
                          description: "Generate sections designed for desktop and mobile with clean, scalable layouts.",
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur-sm"
                          >
                            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Button
                        onClick={() => setStep("business-info")}
                        className="gap-2 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                      >
                        Get started now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-3xl border border-border/70 bg-background/70 p-5 shadow-sm md:grid-cols-3">
                      {[
                        { label: "Average setup", value: "5 min", note: "From brief to draft" },
                        { label: "Core pages", value: "6+", note: "Home, services, about, contact" },
                        { label: "AI outputs", value: "Copy + UI", note: "Messaging and visual direction" },
                      ].map((metric) => (
                        <div key={metric.label} className="space-y-1">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
                          <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                          <p className="text-sm text-muted-foreground">{metric.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="relative">
                      <div className="rounded-[2rem] border border-border/70 bg-background/80 p-4 shadow-2xl backdrop-blur-sm">
                        <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card">
                          <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                              <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
                              <span className="h-2.5 w-2.5 rounded-full bg-primary/15" />
                            </div>
                            <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                              Template Samples
                            </div>
                          </div>

                          {/* Image slideshow */}
                          <div className="relative overflow-hidden" role="region" aria-label="Website template slideshow">
                            <div
                              className="flex transition-transform duration-700 ease-in-out"
                              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                              aria-live="polite"
                              aria-atomic="true"
                            >
                              {templateSlides.map((slide, idx) => (
                                <div key={idx} className="relative min-w-full aspect-[16/10]" aria-hidden={idx !== slideIndex}>
                                  <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 42vw"
                                    className="object-cover"
                                    priority={idx === 0}
                                  />
                                </div>
                              ))}
                            </div>
                            {/* Slide label + dot indicators */}
                            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3">
                              <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow backdrop-blur-sm pointer-events-none">
                                {templateSlides[slideIndex].label}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {templateSlides.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSlideIndex(idx)}
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: idx === slideIndex ? "20px" : "8px",
                                      backgroundColor: idx === slideIndex ? "hsl(var(--primary))" : "rgba(255,255,255,0.5)",
                                    }}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    aria-current={idx === slideIndex ? "true" : undefined}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start 2xl:gap-8">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">AI Landing Page Studio</span>
                    </div>

                    <div className="space-y-5">
                      <h2 className="text-4xl font-bold text-foreground leading-[1.15] tracking-tight lg:text-5xl">
                        Create high-converting{" "}
                        <span className="relative inline-block">
                          <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-orange-500 bg-clip-text text-transparent">
                            landing pages with AI.
                          </span>
                          <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/15 -rotate-1 rounded" />
                        </span>
                      </h2>

                      <p className="max-w-xl text-base leading-7 text-muted-foreground lg:text-lg">
                        Generate pages that convert visitors into leads — launch in minutes, not days.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {[
                        {
                          icon: Target,
                          title: "Conversion strategy",
                          description: "AI maps the ideal message-to-CTA flow for your offer.",
                        },
                        {
                          icon: FileText,
                          title: "Persuasive copy",
                          description: "Generate headlines, benefit bullets, and CTAs that convert.",
                        },
                        {
                          icon: Zap,
                          title: "Fast launch",
                          description: "From idea to campaign-ready page in under 5 minutes.",
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="rounded-2xl border border-border/80 bg-background/80 p-5 shadow-sm backdrop-blur-sm"
                          >
                            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="mb-1.5 text-sm font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Button
                        onClick={() => setStep("business-info")}
                        className="gap-2 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                      >
                        Get started <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="relative">
                      <div className="absolute -left-6 top-10 hidden w-44 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur-sm lg:block">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Target className="h-4 w-4" style={{ color: activeLandingAccent }} />
                          Conversion Flow
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: activeLandingAccentSoft }}>Hook the visitor</div>
                          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: activeLandingAccentSoft }}>Build trust fast</div>
                          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: activeLandingAccentSoft }}>Drive one clear action</div>
                        </div>
                      </div>

                      <div className="absolute -right-4 bottom-14 hidden w-44 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur-sm md:block">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Edit className="h-4 w-4" style={{ color: activeLandingAccent }} />
                          Copy Assist
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: activeLandingAccentSoft }}>Headline variations</div>
                          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: activeLandingAccentSoft }}>Benefit bullets</div>
                          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: activeLandingAccentSoft }}>CTA refinement</div>
                        </div>
                      </div>

                      <div className="rounded-[2rem] border border-border/70 bg-background/80 p-4 shadow-2xl backdrop-blur-sm">
                        <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card">
                          {/* Browser chrome */}
                          <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                              <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
                              <span className="h-2.5 w-2.5 rounded-full bg-primary/15" />
                            </div>
                            <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                              {["Cafe", "Fitness", "Electric", "SaaS"][lpCarouselIndex]} Landing Page
                            </div>
                          </div>

                          {/* Animated landing page carousel */}
                          <div
                            className="relative overflow-hidden"
                            style={{ minHeight: "500px" }}
                            role="region"
                            aria-label="Landing page preview carousel"
                            aria-live="polite"
                          >
                            {/* Slide 1 — Cafe */}
                            <div
                              className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
                              style={{
                                opacity: lpCarouselIndex === 0 ? 1 : 0,
                                transform: lpCarouselIndex === 0 ? "translateX(0)" : "translateX(24px)",
                                pointerEvents: lpCarouselIndex === 0 ? "auto" : "none",
                                background: "linear-gradient(135deg, #1c0a00 0%, #2d1400 50%, #1a0900 100%)",
                              }}
                              aria-hidden={lpCarouselIndex !== 0}
                            >
                              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(180,83,9,0.25)" }}>
                                <span className="font-bold text-sm" style={{ color: "#fbbf24" }}>☕ Brew &amp; Co.</span>
                                <div className="flex gap-4 text-xs" style={{ color: "rgba(253,230,138,0.5)" }}>
                                  <span>Menu</span><span>About</span><span>Visit</span>
                                </div>
                              </div>
                              <div className="flex flex-1 flex-col items-start justify-center px-8 py-8">
                                <span className="mb-3 text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(251,191,36,0.7)" }}>Artisan Coffee</span>
                                <h2 className="mb-4 text-3xl font-bold leading-tight text-white">Crafted with Care,<br />Served with Love</h2>
                                <p className="mb-7 text-sm" style={{ color: "rgba(253,230,138,0.5)" }}>Fresh-roasted blends, slow-brewed for the perfect cup.</p>
                                <span className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: "#d97706", color: "#fff" }}>Visit Us Today →</span>
                              </div>
                              <div className="grid grid-cols-3 gap-3 px-8 pb-12">
                                {[["12+", "Blends"], ["★ 4.9", "Rating"], ["10yr", "Open"]].map(([v, l]) => (
                                  <div key={l} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="font-bold text-sm" style={{ color: "#fbbf24" }}>{v}</div>
                                    <div className="mt-0.5 text-xs" style={{ color: "rgba(253,230,138,0.4)" }}>{l}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Slide 2 — Fitness */}
                            <div
                              className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
                              style={{
                                opacity: lpCarouselIndex === 1 ? 1 : 0,
                                transform: lpCarouselIndex === 1 ? "translateX(0)" : "translateX(24px)",
                                pointerEvents: lpCarouselIndex === 1 ? "auto" : "none",
                                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                              }}
                              aria-hidden={lpCarouselIndex !== 1}
                            >
                              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(249,115,22,0.2)" }}>
                                <span className="font-bold text-sm" style={{ color: "#f97316" }}>⚡ FitCore</span>
                                <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>Join Now</span>
                              </div>
                              <div className="flex flex-1 flex-col items-start justify-center px-8 py-8">
                                <div className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>🔥 Transform in 12 Weeks</div>
                                <h2 className="mb-4 text-3xl font-bold leading-tight text-white">Build the body<br />you&apos;ve always wanted</h2>
                                <p className="mb-7 text-sm" style={{ color: "#94a3b8" }}>Expert coaching, proven plans, real results.</p>
                                <span className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: "#f97316", color: "#fff" }}>Book Free Session →</span>
                              </div>
                              <div className="grid grid-cols-3 gap-3 px-8 pb-12">
                                {[["500+", "Members"], ["★ 4.8", "Reviews"], ["#1", "Rated"]].map(([v, l]) => (
                                  <div key={l} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div className="font-bold text-sm" style={{ color: "#f97316" }}>{v}</div>
                                    <div className="mt-0.5 text-xs" style={{ color: "#64748b" }}>{l}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Slide 3 — Electric Services */}
                            <div
                              className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
                              style={{
                                opacity: lpCarouselIndex === 2 ? 1 : 0,
                                transform: lpCarouselIndex === 2 ? "translateX(0)" : "translateX(24px)",
                                pointerEvents: lpCarouselIndex === 2 ? "auto" : "none",
                                background: "linear-gradient(135deg, #0c1445 0%, #0f2060 50%, #0a1535 100%)",
                              }}
                              aria-hidden={lpCarouselIndex !== 2}
                            >
                              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(59,130,246,0.2)" }}>
                                <span className="font-bold text-sm text-white">⚡ VoltPro</span>
                                <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>Get Quote</span>
                              </div>
                              <div className="flex flex-1 flex-col items-start justify-center px-8 py-8">
                                <div className="mb-4 flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />
                                  <span className="text-xs" style={{ color: "#86efac" }}>Licensed &amp; Insured</span>
                                </div>
                                <h2 className="mb-4 text-3xl font-bold leading-tight text-white">Trusted Electrical<br />Services 24/7</h2>
                                <p className="mb-7 text-sm" style={{ color: "rgba(147,197,253,0.6)" }}>Residential &amp; commercial. Same-day service available.</p>
                                <span className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: "#3b82f6", color: "#fff" }}>Get a Free Quote →</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 px-8 pb-12">
                                {["Panel Upgrades", "EV Charging", "Rewiring", "Inspections"].map((s) => (
                                  <div key={s} className="rounded-xl px-3 py-2 text-xs font-medium" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}>⚡ {s}</div>
                                ))}
                              </div>
                            </div>

                            {/* Slide 4 — SaaS Product */}
                            <div
                              className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
                              style={{
                                opacity: lpCarouselIndex === 3 ? 1 : 0,
                                transform: lpCarouselIndex === 3 ? "translateX(0)" : "translateX(24px)",
                                pointerEvents: lpCarouselIndex === 3 ? "auto" : "none",
                                background: "linear-gradient(135deg, #fafafa 0%, #eef2ff 100%)",
                              }}
                              aria-hidden={lpCarouselIndex !== 3}
                            >
                              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                                <span className="font-bold text-sm" style={{ color: "#6366f1" }}>✦ Launchpad</span>
                                <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "#6366f1", color: "#fff" }}>Try Free</span>
                              </div>
                              <div className="flex flex-1 flex-col items-start justify-center px-8 py-8">
                                <div className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>🚀 Now in public beta</div>
                                <h2 className="mb-4 text-3xl font-bold leading-tight" style={{ color: "#111827" }}>Ship faster.<br />Scale smarter.</h2>
                                <p className="mb-7 text-sm" style={{ color: "#6b7280" }}>The all-in-one platform for modern software teams.</p>
                                <span className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: "#6366f1", color: "#fff" }}>Start Free Trial →</span>
                              </div>
                              <div className="space-y-2 px-8 pb-12">
                                {["✓ No credit card required", "✓ 14-day free trial", "✓ Cancel anytime"].map((f) => (
                                  <div key={f} className="text-sm" style={{ color: "#6b7280" }}>{f}</div>
                                ))}
                              </div>
                            </div>

                            {/* Dot indicators */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                              {[0, 1, 2, 3].map((i) => (
                                <button
                                  key={i}
                                  onClick={() => setLpCarouselIndex(i)}
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: i === lpCarouselIndex ? "20px" : "8px",
                                    background: lpCarouselIndex === 3
                                      ? i === lpCarouselIndex ? "#6366f1" : "rgba(99,102,241,0.3)"
                                      : i === lpCarouselIndex ? "#fff" : "rgba(255,255,255,0.35)",
                                  }}
                                  aria-label={`Go to slide ${i + 1}`}
                                  aria-current={i === lpCarouselIndex ? "true" : undefined}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
            ) : null}
            {isLandingPageBuilder && activeTab === "view-existing" && (
              <div className="p-6 lg:p-8">
                {savedLandingPages.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border bg-gradient-to-br from-primary/5 to-primary/2 p-12 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">No landing pages yet</h3>
                    <p className="text-muted-foreground mt-2">Generate your first landing page to get started.</p>
                    <button
                      onClick={() => setActiveTab("generate")}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate your first page
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {savedLandingPages.map((page) => (
                      <div
                        key={page.id}
                        className={`group rounded-2xl border bg-background hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col ${
                          page.status === "published"
                            ? "border-emerald-200/50 hover:border-emerald-400/60 hover:shadow-emerald-500/10"
                            : "border-border hover:border-primary/50 hover:shadow-primary/10"
                        }`}
                      >
                        <div
                          className={`relative h-40 border-b flex items-center justify-center overflow-hidden ${
                            page.status === "published"
                              ? "bg-gradient-to-br from-emerald-100/40 via-emerald-50/20 to-background border-emerald-200/30"
                              : "bg-gradient-to-br from-primary/20 via-primary/5 to-background border-border/50"
                          }`}
                        >
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/20" />
                            <div className="absolute bottom-6 right-6 w-16 h-8 rounded bg-white/20" />
                          </div>
                          <div className="relative text-center space-y-2">
                            <div
                              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                                page.status === "published"
                                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                                  : "bg-gradient-to-br from-primary to-primary/60"
                              }`}
                            >
                              <span className="text-white font-bold text-xl">
                                {page.businessName
                                  .split(" ")
                                  .filter((w: string) => w.length > 0)
                                  .slice(0, 2)
                                  .map((w: string) => w[0])
                                  .join("")}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">{page.businessName}</p>
                          </div>
                          <span
                            className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full ${
                              page.status === "published"
                                ? "text-emerald-700 bg-emerald-100"
                                : "text-primary bg-primary/20"
                            }`}
                          >
                            {page.status === "published" ? "Live" : "Draft"}
                          </span>
                        </div>
                        <div className="flex-1 p-4 flex flex-col gap-3">
                          <div className="min-h-0">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">{page.tagline}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(page.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-auto">
                            <Link
                              href={`/landing-pages/edit/${encodeURIComponent(page.id)}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border bg-background text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Preview
                            </Link>
                            <Link
                              href={`/landing-pages/edit/${encodeURIComponent(page.id)}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {isWebsiteBuilder && activeTab === "view-existing" && (
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    {
                      id: "dummy-1",
                      businessName: "Sunrise Cafe",
                      tagline: "Fresh brews and good vibes every morning",
                      description: "A cozy neighborhood cafe offering handcrafted coffee, seasonal pastries, and a warm community atmosphere.",
                      pages: ["Homepage", "Menu", "About Us", "Contact", "Events", "Gallery"],
                      updatedAt: "2024-03-15T10:00:00Z",
                      status: "published" as const,
                      previewImage: websitePreviewImages[0],
                    },
                    {
                      id: "dummy-2",
                      businessName: "Tech Studio",
                      tagline: "Innovative software solutions for modern businesses",
                      description: "A full-service digital agency specializing in web apps, mobile development, and cloud architecture.",
                      pages: ["Homepage", "Services", "Portfolio", "About Us", "Blog", "Contact", "Pricing", "Case Studies"],
                      updatedAt: "2024-03-10T14:30:00Z",
                      status: "draft" as const,
                      previewImage: websitePreviewImages[1],
                    },
                    {
                      id: "dummy-3",
                      businessName: "Green Market",
                      tagline: "Farm-fresh produce delivered to your door",
                      description: "An organic marketplace connecting local farmers with health-conscious consumers across the region.",
                      pages: ["Homepage", "Shop", "About Us", "Farmers", "Contact"],
                      updatedAt: "2024-03-08T09:15:00Z",
                      status: "published" as const,
                      previewImage: websitePreviewImages[2],
                    },
                    {
                      id: "dummy-4",
                      businessName: "Luxe Salon",
                      tagline: "Where beauty meets luxury",
                      description: "A premium hair and beauty salon offering bespoke styling, treatments, and wellness experiences.",
                      pages: ["Homepage", "Services", "Book Now", "Gallery", "About Us", "Blog", "Contact"],
                      updatedAt: "2024-03-05T16:45:00Z",
                      status: "draft" as const,
                      previewImage: websitePreviewImages[3],
                    },
                  ].map((site) => (
                    <div
                      key={site.id}
                      className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
                        site.status === "published"
                          ? "border-emerald-200/60 hover:border-emerald-400/70 hover:shadow-emerald-500/10"
                          : "border-border hover:border-primary/50 hover:shadow-primary/10"
                      }`}
                    >
                      {/* Preview image */}
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                        <Image
                          src={site.previewImage}
                          alt={`${site.businessName} preview`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Status badge */}
                        <span
                          className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                            site.status === "published"
                              ? "text-emerald-700 bg-emerald-100/90"
                              : "text-amber-700 bg-amber-100/90"
                          }`}
                        >
                          {site.status === "published" ? "Live" : "Draft"}
                        </span>
                        {/* Pages count badge */}
                        <span className="absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-background/80 text-foreground backdrop-blur-sm">
                          {site.pages.length} pages
                        </span>
                      </div>

                      {/* Card body */}
                      <div className="flex flex-col flex-1 p-4 gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">{site.businessName}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{site.tagline}</p>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-5 line-clamp-2">{site.description}</p>

                        {/* Pages chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {site.pages.slice(0, 3).map((page) => (
                            <span key={page} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {page}
                            </span>
                          ))}
                          {site.pages.length > 3 && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              +{site.pages.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(site.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/website-pages`}
                              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border bg-background text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Preview
                            </Link>
                            <Link
                              href={`/website-pages`}
                              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Business Info Step */}
        {step === "business-info" && (
          <div className="p-6 lg:p-10">
            <div className="max-w-2xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setStep("intro")}
                className="mb-6 gap-2 text-muted-foreground hover:text-foreground -ml-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back
              </Button>

              {/* Step indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-primary font-medium">Business Details</span>
                <ArrowRight className="w-4 h-4" />
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</div>
                <span>Guided Questions</span>
                <ArrowRight className="w-4 h-4" />
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</div>
                <span>Generate</span>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-6">Tell Us About Your Business</h2>

              <div className="space-y-5">
                <div>
                  <Label className="font-semibold mb-1.5 block">Business Name</Label>
                  <Input
                    placeholder="Enter your business name"
                    value={wizardData.businessInfo.name}
                    onChange={(e) => updateBusinessInfo("name", e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="font-semibold">Tagline</Label>
                    <button onClick={() => setTaglineModalOpen(true)} className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                    </button>
                  </div>
                  <Input placeholder="Your business tagline" value={wizardData.businessInfo.tagline} onChange={(e) => updateBusinessInfo("tagline", e.target.value)} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="font-semibold">Business Description</Label>
                    <button onClick={() => setDescriptionModalOpen(true)} className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                    </button>
                  </div>
                  <Textarea placeholder="Describe your business, products, and services" value={wizardData.businessInfo.description} onChange={(e) => updateBusinessInfo("description", e.target.value)} className="min-h-28" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold mb-1.5 block">Email</Label>
                    <Input type="email" placeholder="contact@business.com" value={wizardData.businessInfo.email} onChange={(e) => updateBusinessInfo("email", e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-semibold mb-1.5 block">Phone Number</Label>
                    <Input placeholder="+1 (555) 123-4567" value={wizardData.businessInfo.phone} onChange={(e) => updateBusinessInfo("phone", e.target.value)} />
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <Label className="font-semibold block">Business Address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-medium mb-1.5 block">Country</Label>
                      <Input
                        placeholder="Country"
                        value={wizardData.businessInfo.country}
                        onChange={(e) => updateBusinessInfo("country", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="font-medium mb-1.5 block">State</Label>
                      <Input
                        placeholder="State"
                        value={wizardData.businessInfo.state}
                        onChange={(e) => updateBusinessInfo("state", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="font-medium mb-1.5 block">City</Label>
                      <Input
                        placeholder="City"
                        value={wizardData.businessInfo.city}
                        onChange={(e) => updateBusinessInfo("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="font-medium mb-1.5 block">Zipcode</Label>
                      <Input
                        placeholder="Zipcode"
                        value={wizardData.businessInfo.zipcode}
                        onChange={(e) => updateBusinessInfo("zipcode", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium mb-1.5 block">Street Address</Label>
                    <Input
                      placeholder="Street address"
                      value={wizardData.businessInfo.streetAddress}
                      onChange={(e) => updateBusinessInfo("streetAddress", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold">Business Logo (Optional)</Label>
                    <button
                      type="button"
                      onClick={generateLogoWithAI}
                      className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    {wizardData.businessInfo.logoPreview && (
                      <img src={wizardData.businessInfo.logoPreview} alt="Logo preview" className="w-20 h-20 rounded-lg object-contain bg-muted border border-border" />
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <Input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      <span className="px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg font-medium text-foreground text-sm transition-colors flex items-center gap-2 border border-border">
                        <Upload className="w-4 h-4" /> {wizardData.businessInfo.logoPreview ? "Update Logo" : "Upload Logo"}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setStep("intro")} className="flex-1">Back</Button>
                  <Button onClick={() => setStep("ai-chat")} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Continue</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Step */}
        {step === "ai-chat" && (
          <div className="p-6 lg:p-10">
            <AiChatStep
              businessName={wizardData.businessInfo.name}
              mode={isLandingPageBuilder ? "landing-page" : "website"}
              onNext={() => setStep("generation")}
              onSkip={() => setStep("generation")}
            />
          </div>
        )}

        {/* Generation Step */}
        {step === "generation" && (
          <div className="p-6 lg:p-10">
            <AiGenerationStep
              wizardData={wizardData}
              onUpdate={(pages) => { setGeneratedPageName(pages[0] || "Homepage"); setGeneratedPages(pages); }}
              onNext={handleGenerationComplete}
              onBack={() => setStep("ai-chat")}
            />
          </div>
        )}

        {/* Done Step */}
        {step === "done" && (
          <div className="p-6 lg:p-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">Your {isLandingPageBuilder ? "Landing Page" : "Website"} is Ready!</h2>
                <p className="text-muted-foreground">
                  Your {isLandingPageBuilder ? "landing page" : "website"} has been created successfully with AI-powered design and content.
                </p>
              </div>
              <div className="bg-background rounded-lg border border-border p-6 mb-6 text-left">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Your {isLandingPageBuilder ? "Landing Page" : "Website"}</p>
                    <h3 className="text-xl font-bold text-foreground">{wizardData.businessInfo.name}</h3>
                  </div>
                  {wizardData.businessInfo.logoPreview && (
                    <img src={wizardData.businessInfo.logoPreview} alt="Logo" className="w-14 h-14 rounded-lg object-contain bg-muted border border-border" />
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-4">{wizardData.businessInfo.description}</p>
                <div className="pt-4 border-t border-border flex gap-3">
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">Go to Dashboard</Button>
                  </Link>
                  <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <ExternalLink className="w-4 h-4" /> Preview {isLandingPageBuilder ? "Landing Page" : "Website"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {isLandingPageBuilder
                  ? "Your landing page is live! You can edit and customize it anytime from your dashboard."
                  : "Your website is live! You can edit and customize it anytime from your dashboard."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Learn More Modal */}
      <Dialog open={learnMoreModalOpen} onOpenChange={setLearnMoreModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{learnMoreContent.title}</DialogTitle>
            <DialogDescription>
              {learnMoreContent.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            {learnMoreContent.items.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-2xl border border-border bg-background p-4">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setLearnMoreModalOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tagline Modal */}
      <Dialog open={taglineModalOpen} onOpenChange={setTaglineModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Tagline with AI</DialogTitle>
            <DialogDescription>Tell us what you&apos;d like your tagline to convey</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="e.g., Focus on quality, innovation, and customer service"
              value={taglinePrompt}
              onChange={(e) => setTaglinePrompt(e.target.value)}
              className="min-h-24"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setTaglineModalOpen(false)} className="flex-1">Cancel</Button>
              <Button
                onClick={() => generateTaglineWithAI(taglinePrompt)}
                disabled={generatingTagline}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {generatingTagline && <Loader2 className="w-4 h-4 animate-spin" />}
                {generatingTagline ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Description Modal */}
      <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Description with AI</DialogTitle>
            <DialogDescription>Describe what makes your business unique</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="e.g., We specialize in eco-friendly products made from sustainable materials"
              value={descriptionPrompt}
              onChange={(e) => setDescriptionPrompt(e.target.value)}
              className="min-h-24"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDescriptionModalOpen(false)} className="flex-1">Cancel</Button>
              <Button
                onClick={() => generateDescriptionWithAI(descriptionPrompt)}
                disabled={generatingDescription}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {generatingDescription && <Loader2 className="w-4 h-4 animate-spin" />}
                {generatingDescription ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
