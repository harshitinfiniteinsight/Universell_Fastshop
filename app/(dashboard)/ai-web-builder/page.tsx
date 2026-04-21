"use client";

import { useEffect, useState, Suspense } from "react";
import { AiChatStep } from "@/components/onboarding/steps/ai-chat-step";
import { AiGenerationStep } from "@/components/onboarding/steps/ai-generation-step";
import { WizardContainer } from "@/components/onboarding/wizard-container";
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
import { Sparkles, FileText, Zap, ArrowRight, Check, Edit, Upload, Loader2, LayoutTemplate, Target, Globe, ExternalLink, ChevronRight, Code, Layers, Palette, ShoppingCart, LayoutDashboard, Package, Truck, Users, Megaphone, FileText as FileText2, Image as ImageIcon, AlignLeft, Grid, LayoutList, Monitor, Smartphone, Share2, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type AIWebBuilderStep = "intro" | "business-info" | "ai-chat" | "generation" | "done";
type BuilderType = "landing-page" | "website" | "ecommerce";

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

function AIWebBuilderInner() {
  const [step, setStep] = useState<AIWebBuilderStep>("intro");
  const [builderType, setBuilderType] = useState<BuilderType>("website");
  const searchParams = useSearchParams();
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [generatedPageName, setGeneratedPageName] = useState("Homepage");
  const [animatedSectionIndex, setAnimatedSectionIndex] = useState(0);
  const [generatingTagline, setGeneratingTagline] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [generatingDesign, setGeneratingDesign] = useState(false);
  const [designModalOpen, setDesignModalOpen] = useState(false);
  const [selectedDesignStyle, setSelectedDesignStyle] = useState("modern");
  const [selectedColorScheme, setSelectedColorScheme] = useState("blue");
  const [designPrimaryColor, setDesignPrimaryColor] = useState("#3b82f6");
  const [designSecondaryColor, setDesignSecondaryColor] = useState("#60a5fa");
  const [taglineModalOpen, setTaglineModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [taglinePrompt, setTaglinePrompt] = useState("");
  const [descriptionPrompt, setDescriptionPrompt] = useState("");
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false);

  const aiDesignStyles = [
    { id: "modern", label: "Modern" },
    { id: "minimalist", label: "Minimalist" },
    { id: "bold", label: "Bold" },
    { id: "elegant", label: "Elegant" },
    { id: "playful", label: "Playful" },
    { id: "tech", label: "Tech" },
    { id: "business", label: "Business" },
    { id: "creative", label: "Creative" },
  ];

  const colorSchemeOptions = [
    { id: "blue", label: "Blue", primary: "#3b82f6", secondary: "#60a5fa" },
    { id: "purple", label: "Purple", primary: "#8b5cf6", secondary: "#a78bfa" },
    { id: "slate", label: "Slate", primary: "#64748b", secondary: "#94a3b8" },
    { id: "orange", label: "Orange", primary: "#f97316", secondary: "#fb923c" },
    { id: "green", label: "Green", primary: "#10b981", secondary: "#34d399" },
    { id: "rose", label: "Rose", primary: "#f43f5e", secondary: "#fb7185" },
  ];

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
      note:
        "Use urgency, outcome-driven copy, and a short form to maximize conversions without overwhelming visitors.",
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
      note:
        "Lead with the core promise, support with feature cards, and add friction-reducing CTAs for fast evaluation.",
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
      note:
        "Keep the value proposition clear, highlight expertise quickly, and make it easy to contact or book from the same page.",
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
      note:
        "Emphasize deadlines, what visitors get, and a strong call to action repeated across the page for best results.",
      checklist: ["Urgency messaging", "Offer breakdown", "Repeat CTA"],
    },
  ];

  const isLandingPageBuilder = builderType === "landing-page";
  const isWebsiteBuilder = builderType === "website";
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
    const builder = searchParams.get("builder");
    if (builder === "landing-page" || builder === "website" || builder === "ecommerce") {
      setBuilderType(builder);
      setStep("intro");
    }
  }, [searchParams]);

  const activeWebsitePagePreview =
    websitePagePreviewTemplates[animatedSectionIndex % websitePagePreviewTemplates.length];
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

  const handleBuilderTypeChange = (type: BuilderType) => {
    setBuilderType(type);
    setStep("intro");
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

  const updateBusinessInfo = (key: keyof typeof wizardData.businessInfo, value: any) => {
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
      setDesignModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const generateLogoWithAI = () => {
    setGeneratingLogo(true);
    const initials = getBusinessInitials();
    const primary = designPrimaryColor || "#f04f29";
    const secondary = designSecondaryColor || "#fb923c";

    setTimeout(() => {
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
      setGeneratingLogo(false);
    }, 900);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      updateBusinessInfo("banner", file);
      updateBusinessInfo("bannerPreview", preview);
    };
    reader.readAsDataURL(file);
  };

  const buildDesignPreviewSVG = (styleId: string, primaryColor: string, secondaryColor: string) => {
    if (styleId === "modern") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <defs>
            <linearGradient id='grad1' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='${primaryColor}'/>
              <stop offset='100%' stop-color='${secondaryColor}'/>
            </linearGradient>
          </defs>
          <rect width='240' height='240' fill='#f8fafc'/>
          <rect x='20' y='20' width='200' height='60' rx='8' fill='url(#grad1)' opacity='0.2'/>
          <line x1='20' y1='100' x2='220' y2='100' stroke='${primaryColor}' stroke-width='2' opacity='0.3'/>
          <rect x='20' y='120' width='90' height='100' rx='8' fill='${primaryColor}' opacity='0.1'/>
          <rect x='130' y='120' width='90' height='100' rx='8' fill='${secondaryColor}' opacity='0.1'/>
        </svg>
      `.trim();
    }

    if (styleId === "minimalist") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <rect width='240' height='240' fill='white'/>
          <line x1='20' y1='40' x2='220' y2='40' stroke='${primaryColor}' stroke-width='3'/>
          <circle cx='50' cy='120' r='20' fill='${primaryColor}' opacity='0.2'/>
          <rect x='100' y='100' width='100' height='60' rx='4' fill='none' stroke='${primaryColor}' stroke-width='2'/>
          <line x1='20' y1='200' x2='220' y2='200' stroke='${primaryColor}' stroke-width='2' opacity='0.2'/>
        </svg>
      `.trim();
    }

    if (styleId === "bold") {
      return `
        <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
          <rect width='240' height='240' fill='${primaryColor}'/>
          <rect x='30' y='30' width='180' height='180' rx='20' fill='none' stroke='${secondaryColor}' stroke-width='4'/>
          <circle cx='120' cy='120' r='40' fill='${secondaryColor}' opacity='0.3'/>
        </svg>
      `.trim();
    }

    return `
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
        <rect width='240' height='240' fill='#f8fafc'/>
        <rect x='20' y='20' width='200' height='200' rx='12' fill='none' stroke='${primaryColor}' stroke-width='3'/>
        <rect x='40' y='40' width='160' height='40' rx='8' fill='${primaryColor}' opacity='0.15'/>
        <line x1='40' y1='100' x2='200' y2='100' stroke='${primaryColor}' stroke-width='2' opacity='0.2'/>
      </svg>
    `.trim();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">AI Web Builder</h1>
        <p className="text-muted-foreground">
          Generate a professional web presence with AI in minutes
        </p>
      </div>

      {/* Card wrapper */}
      <div className="bg-card rounded-lg shadow-sm border border-border">

        {/* ── E-Commerce FastShop: embed full wizard ── */}
        {builderType === "ecommerce" && (
          <>
            {/* Tabs stay visible at the top */}
            <div className="flex border-b border-border px-6 pt-4">
              <button
                onClick={() => handleBuilderTypeChange("landing-page")}
                className="pb-3 px-6 font-semibold text-sm transition-all border-b-2 -mb-px flex items-center gap-2 text-muted-foreground border-transparent hover:text-foreground"
              >
                <Sparkles className="w-4 h-4" />
                Landing Page
              </button>
              <button
                onClick={() => handleBuilderTypeChange("website")}
                className="pb-3 px-6 font-semibold text-sm transition-all border-b-2 -mb-px flex items-center gap-2 text-muted-foreground border-transparent hover:text-foreground"
              >
                <Globe className="w-4 h-4" />
                Website Builder
              </button>
              <button
                className="pb-3 px-6 font-semibold text-sm transition-all border-b-2 -mb-px flex items-center gap-2 text-primary border-primary"
              >
                <ShoppingCart className="w-4 h-4" />
                E-Commerce Fastshop
              </button>
            </div>
            <WizardContainer />
          </>
        )}

        {/* ── Landing Page / Website Builder flow ── */}
        {builderType !== "ecommerce" && (
          <>
            <div className="flex border-b border-border px-6 pt-4">
              <button
                onClick={() => handleBuilderTypeChange("landing-page")}
                className={`pb-3 px-6 font-semibold text-sm transition-all border-b-2 -mb-px flex items-center gap-2 ${
                  isLandingPageBuilder
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Landing Page
              </button>
              <button
                onClick={() => handleBuilderTypeChange("website")}
                className={`pb-3 px-6 font-semibold text-sm transition-all border-b-2 -mb-px flex items-center gap-2 ${
                  isWebsiteBuilder
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <Globe className="w-4 h-4" />
                Website Builder
              </button>
              <button
                onClick={() => handleBuilderTypeChange("ecommerce")}
                className="pb-3 px-6 font-semibold text-sm transition-all border-b-2 -mb-px flex items-center gap-2 text-muted-foreground border-transparent hover:text-foreground"
              >
                <ShoppingCart className="w-4 h-4" />
                E-Commerce Fastshop
              </button>
            </div>

            {step === "intro" && (
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

                          <h2 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-foreground lg:text-4xl xl:text-[2.6rem]">
                            <span className="block">Design pages to capture attention</span>
                            <span className="block bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">and drive action.</span>
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

                      <div className="relative">
                        <div className="absolute -left-6 top-10 hidden w-44 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur-sm lg:block">
                          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Target className="h-4 w-4" style={{ color: activeWebsitePagePreview.accent }} />
                            Active Page Type
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="rounded-lg bg-muted/60 px-3 py-2">{activeWebsitePagePreview.badge}</div>
                            <div className="rounded-lg bg-muted/60 px-3 py-2">{activeWebsitePagePreview.label}</div>
                            <div className="rounded-lg bg-muted/60 px-3 py-2">Multi-page consistency</div>
                          </div>
                        </div>

                        <div className="absolute -right-4 bottom-14 hidden w-40 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur-sm md:block">
                          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Palette className="h-4 w-4" style={{ color: activeWebsitePagePreview.accent }} />
                            Page Library
                          </div>
                          <div className="mb-3 flex gap-2">
                            <span className="h-8 w-8 rounded-full" style={{ backgroundColor: activeWebsitePagePreview.accent }} />
                            <span className="h-8 w-8 rounded-full" style={{ backgroundColor: `${activeWebsitePagePreview.accent}66` }} />
                            <span className="h-8 w-8 rounded-full bg-foreground/20" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Homepage, about, testimonials, products, services, and contact pages.
                          </p>
                        </div>

                        <div className="rounded-[2rem] border border-border/70 bg-background/80 p-4 shadow-2xl backdrop-blur-sm">
                          <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card">
                            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                                <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
                                <span className="h-2.5 w-2.5 rounded-full bg-primary/15" />
                              </div>
                              <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                Multi-page Website Preview
                              </div>
                            </div>

                            <div className="space-y-5 p-5">
                              <div className="rounded-3xl p-6 transition-all duration-500" style={{ background: `linear-gradient(135deg, ${activeWebsitePagePreview.accent}22, #ffffff)` }}>
                                <div className="mb-4 flex items-center justify-between gap-4">
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{activeWebsitePagePreview.label}</p>
                                    <h3 className="mt-2 text-2xl font-bold text-foreground">{activeWebsitePagePreview.title}</h3>
                                  </div>
                                  <div className="rounded-2xl bg-background/80 p-3 shadow-sm">
                                    <Globe className="h-6 w-6" style={{ color: activeWebsitePagePreview.accent }} />
                                  </div>
                                </div>

                                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                  {activeWebsitePagePreview.note}
                                </p>

                                <div className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card/80">
                                  <div className="relative aspect-[16/8] w-full">
                                    <Image
                                      src={activeWebsitePagePreview.image}
                                      alt={`${activeWebsitePagePreview.badge} preview`}
                                      fill
                                      sizes="(max-width: 1024px) 100vw, 42vw"
                                      className="object-cover"
                                      priority
                                    />
                                  </div>
                                </div>

                                <div className="mt-5 rounded-full bg-background/80 p-1">
                                  <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${activeWebsitePagePreview.progress}%`, backgroundColor: activeWebsitePagePreview.accent }}
                                  />
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                                <div className="space-y-4 rounded-2xl border border-border/70 bg-background p-4">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <LayoutTemplate className="h-4 w-4 text-primary" />
                                    Generated Page System
                                  </div>
                                  {activeWebsitePagePreview.sections.map((section) => (
                                    <div key={section.title} className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-3">
                                      <span className="text-sm text-foreground">{section.title}</span>
                                      <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${activeWebsitePagePreview.accent}22`, color: activeWebsitePagePreview.accent }}>{section.status}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="space-y-4">
                                  <div className="rounded-2xl border border-border/70 bg-background p-4">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                      <FileText className="h-4 w-4" style={{ color: activeWebsitePagePreview.accent }} />
                                      {activeWebsitePagePreview.noteTitle}
                                    </div>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                      “{activeWebsitePagePreview.note}”
                                    </p>
                                  </div>

                                  <div className="rounded-2xl border border-border/70 bg-background p-4">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                      <Zap className="h-4 w-4" style={{ color: activeWebsitePagePreview.accent }} />
                                      AI Checklist
                                    </div>
                                    <div className="space-y-2">
                                      {activeWebsitePagePreview.checklist.map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Check className="h-4 w-4" style={{ color: activeWebsitePagePreview.accent }} />
                                          {item}
                                        </div>
                                      ))}
                                    </div>
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
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Conversion-focused layout",
                              "AI campaign copy",
                              "CTA-first structure",
                            ].map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <h2 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-foreground lg:text-4xl xl:text-[2.6rem]">
                            <span className="block">Capture attention &amp; convert it</span>
                            <span className="block bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">into results.</span>
                          </h2>

                          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:text-lg">
                            Generate focused campaign pages built for lead generation with compelling headlines, persuasive benefit blocks, trust signals, and call-to-action sections that convert visitors into qualified leads.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {[
                            {
                              icon: Target,
                              title: "Conversion strategy",
                              description: "Start from your goal and let AI shape the ideal message-to-CTA journey.",
                            },
                            {
                              icon: FileText,
                              title: "Persuasive copy",
                              description: "Generate headlines, subtext, proof points, and callouts for your offer.",
                            },
                            {
                              icon: Zap,
                              title: "Fast launch",
                              description: "Go from idea to campaign-ready draft in minutes with guided inputs.",
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
                            { label: "Goal-focused", value: "1 CTA", note: "Every section supports one outcome" },
                            { label: "Draft speed", value: "3-5 min", note: "Concept to page structure" },
                            { label: "Core blocks", value: "Hero + Proof", note: "Benefits, FAQs, CTA, trust" },
                          ].map((metric) => (
                            <div key={metric.label} className="space-y-1">
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
                              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                              <p className="text-sm text-muted-foreground">{metric.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="relative xl:min-h-[920px]">
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

                        <div className="rounded-[2rem] border border-border/70 bg-background/80 p-4 shadow-2xl backdrop-blur-sm xl:min-h-[920px]">
                          <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card xl:min-h-[880px]">
                            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                                <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
                                <span className="h-2.5 w-2.5 rounded-full bg-primary/15" />
                              </div>
                              <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                Campaign Page Preview
                              </div>
                            </div>

                            <div className="space-y-5 p-5">
                              <div
                                className="rounded-3xl p-6 transition-all duration-500"
                                style={{ background: `linear-gradient(135deg, ${activeLandingAccentSoft}, color-mix(in srgb, ${activeLandingAccent} 8%, white) 52%, #ffffff)` }}
                              >
                                <div className="mb-4 flex items-center justify-between gap-4">
                                  <div>
                                    <div className="inline-flex rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium shadow-sm" style={{ color: activeLandingAccent }}>
                                      {activeLandingPagePreview.badge}
                                    </div>
                                    <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">{activeLandingPagePreview.label}</p>
                                    <h3 className="mt-2 min-h-[92px] text-2xl font-bold text-foreground">{activeLandingPagePreview.title}</h3>
                                  </div>
                                  <div className="rounded-2xl bg-background/80 p-3 shadow-sm">
                                    <Zap className="h-6 w-6" style={{ color: activeLandingAccent }} />
                                  </div>
                                </div>

                                <p className="max-w-md min-h-[72px] text-sm leading-6 text-muted-foreground">
                                  {activeLandingPagePreview.description}
                                </p>

                                <div className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card/80">
                                  <div className="relative aspect-[16/8] w-full">
                                    <Image
                                      src={activeLandingPagePreview.image}
                                      alt={`${activeLandingPagePreview.badge} template preview`}
                                      fill
                                      sizes="(max-width: 1024px) 100vw, 42vw"
                                      className="object-cover"
                                      priority
                                    />
                                  </div>
                                </div>

                                <div className="mt-5 rounded-full bg-background/80 p-1">
                                  <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                      backgroundColor: activeLandingAccent,
                                      width: `${activeLandingPagePreview.progress}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                                <div className="space-y-4 rounded-2xl border border-border/70 bg-background p-4">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <LayoutTemplate className="h-4 w-4 text-primary" />
                                    Conversion Sections
                                  </div>
                                  {activeLandingPagePreview.sections.map((section) => (
                                    <div key={section.title} className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-3">
                                      <span className="text-sm text-foreground">{section.title}</span>
                                      <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: activeLandingAccentSoft, color: activeLandingAccent }}>{section.status}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="space-y-4">
                                  <div className="rounded-2xl border border-border/70 bg-background p-4">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                      <FileText className="h-4 w-4" style={{ color: activeLandingAccent }} />
                                      {activeLandingPagePreview.noteTitle}
                                    </div>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                      “{activeLandingPagePreview.note}”
                                    </p>
                                  </div>

                                  <div className="rounded-2xl border border-border/70 bg-background p-4">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                      <Check className="h-4 w-4" style={{ color: activeLandingAccent }} />
                                      Conversion Checklist
                                    </div>
                                    <div className="space-y-2">
                                      {activeLandingPagePreview.checklist.map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Check className="h-4 w-4" style={{ color: activeLandingAccent }} />
                                          {item}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
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
                        disabled={generatingLogo}
                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 disabled:opacity-60"
                      >
                        {generatingLogo ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                          </>
                        )}
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
                onUpdate={(pages) => setGeneratedPageName(pages[0] || "Homepage")}
                onNext={() => setStep("done")}
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
                  <h2 className="text-3xl font-bold text-foreground mb-3">Your Website is Ready!</h2>
                  <p className="text-muted-foreground">
                    Your {builderType === "landing-page" ? "landing page" : "website"} has been created successfully with AI-powered design and content.
                  </p>
                </div>
                <div className="bg-background rounded-lg border border-border p-6 mb-6 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Your Website</p>
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
                      <ExternalLink className="w-4 h-4" /> Preview Website
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Your website is live! You can edit and customize it anytime from your dashboard.</p>
              </div>
            </div>
          )}
          </>
        )}
      </div>

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
            <DialogDescription>Tell us what you'd like your tagline to convey</DialogDescription>
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

export default function AIWebBuilder() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <AIWebBuilderInner />
    </Suspense>
  );
}
