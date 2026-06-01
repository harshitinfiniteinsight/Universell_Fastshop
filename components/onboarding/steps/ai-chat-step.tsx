"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Send,
  ArrowRight,
  ShoppingBag,
  Globe,
  Palette,
  Layout,
  Image,
  Star,
  Coffee,
  Store,
  Briefcase,
  Check,
  Loader2,
  Wand2,
  Layers,
  Package,
  MessageCircle,
  Zap,
  PenTool,
  SkipForward,
  LogOut,
  Home,
  Users,
  Phone,
  FileText,
  Shield,
  CalendarDays,
  Plus,
  X,
  Grip,
  Pencil,
  AlertCircle,
  Upload,
  Link,
  Type,
  Heart,
  FolderOpen,
  Target,
  Instagram,
  FileUp,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIGenerationLoadingOverlay } from "@/components/ai-web-builder/AIGenerationLoadingOverlay";

interface AiChatStepProps {
  businessName: string;
  onNext: () => void;
  onSkip: () => void;
  mode?: "website" | "landing-page";
  showBusinessModelStep?: boolean;
}

type ScreenState = "intro" | "chat";
type MessageType = "ai" | "user";
type ConversationStep = "inspiration" | "color" | "color-shade" | "secondary-color" | "shop-type" | "style" | "project-type" | "landing-page-type" | "lp-details" | "pages" | "products" | "complete";

// Shop type definition
type ShopType = "products" | "services" | "booking" | "hybrid";

interface ShopTypeOption {
  id: ShopType;
  title: string;
  description: string;
  examples: string;
  icon: React.ElementType;
}

// Page suggestion definitions
interface SuggestedPage {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ElementType;
  showFor: ("products" | "services" | "booking" | "hybrid" | "all")[];
  isLegal?: boolean;
}

// Page customization state (user edits)
interface PageCustomization {
  name: string;
  prompt: string;
}

// Brand Vault data structure
interface BrandVaultData {
  // Core
  inspirationLinks: string[];
  logoFile: File | null;
  logoPreview: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  // Recommended
  fontPreference: string;
  brandTone: string;
  industry: string;
  targetAudience: string;
  // Nice-to-have
  moodboardImages: string[];
  socialLinks: string[];
  brandGuidelines: File | null;
  additionalNotes: string;
}

const BRAND_VAULT_KEY = "universell-brand-vault";

// Changed key to reset for all users - increment version to reset again
const INTRO_SEEN_KEY = "universell-ai-intro-v3";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  options?: { label: string; value: string; icon?: React.ElementType }[];
}

// Color palette definitions
interface ColorOption {
  name: string;
  value: string;
  hex: string;
  description: string;
}

interface ShadeOption {
  name: string;
  hex: string;
  value: number; // 0-100 for slider position
}

interface ColorSelectionState {
  primaryColor: ColorOption | null;
  primaryShade: ShadeOption | null;
  secondaryColor: ColorOption | null;
  secondaryShade: ShadeOption | null;
  isAutoSuggested: boolean;
}

// Primary color palette
const PRIMARY_COLORS: ColorOption[] = [
  { name: "Warm Orange", value: "warm-orange", hex: "#f04f29", description: "Energetic and welcoming" },
  { name: "Professional Blue", value: "professional-blue", hex: "#2563eb", description: "Trustworthy and modern" },
  { name: "Elegant Black", value: "elegant-black", hex: "#18181b", description: "Sophisticated and bold" },
  { name: "Fresh Green", value: "fresh-green", hex: "#16a34a", description: "Natural and vibrant" },
  { name: "Royal Purple", value: "royal-purple", hex: "#7c3aed", description: "Creative and luxurious" },
  { name: "Rose Pink", value: "rose-pink", hex: "#e11d48", description: "Playful and passionate" },
];

// Generate shades for a color
const generateShades = (baseHex: string): ShadeOption[] => {
  return [
    { name: "Lightest", hex: lightenColor(baseHex, 40), value: 0 },
    { name: "Light", hex: lightenColor(baseHex, 25), value: 25 },
    { name: "Base", hex: baseHex, value: 50 },
    { name: "Dark", hex: darkenColor(baseHex, 20), value: 75 },
    { name: "Darkest", hex: darkenColor(baseHex, 35), value: 100 },
  ];
};

// Helper functions for color manipulation
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}

// Get secondary color suggestions based on primary
const getSecondaryColorSuggestions = (primaryColor: ColorOption): ColorOption[] => {
  const suggestions: Record<string, ColorOption[]> = {
    "warm-orange": [
      { name: "Soft Cream", value: "soft-cream", hex: "#fef3c7", description: "Warm complement" },
      { name: "Charcoal Gray", value: "charcoal-gray", hex: "#374151", description: "Strong contrast" },
      { name: "Deep Brown", value: "deep-brown", hex: "#78350f", description: "Earthy balance" },
    ],
    "professional-blue": [
      { name: "Light Gray", value: "light-gray", hex: "#f3f4f6", description: "Clean and minimal" },
      { name: "Pure White", value: "pure-white", hex: "#ffffff", description: "Maximum clarity" },
      { name: "Accent Orange", value: "accent-orange", hex: "#f97316", description: "Energetic pop" },
    ],
    "elegant-black": [
      { name: "Gold", value: "gold", hex: "#d97706", description: "Luxurious accent" },
      { name: "Silver Gray", value: "silver-gray", hex: "#9ca3af", description: "Subtle elegance" },
      { name: "Crisp White", value: "crisp-white", hex: "#ffffff", description: "Sharp contrast" },
    ],
    "fresh-green": [
      { name: "Earth Brown", value: "earth-brown", hex: "#78350f", description: "Natural pairing" },
      { name: "Soft Beige", value: "soft-beige", hex: "#fef3c7", description: "Organic feel" },
      { name: "Slate Gray", value: "slate-gray", hex: "#64748b", description: "Modern balance" },
    ],
    "royal-purple": [
      { name: "Soft Lavender", value: "soft-lavender", hex: "#e9d5ff", description: "Gentle complement" },
      { name: "Gold Accent", value: "gold-accent", hex: "#eab308", description: "Royal pairing" },
      { name: "Cool Gray", value: "cool-gray", hex: "#6b7280", description: "Sophisticated" },
    ],
    "rose-pink": [
      { name: "Blush", value: "blush", hex: "#fce7f3", description: "Soft feminine" },
      { name: "Charcoal", value: "charcoal", hex: "#1f2937", description: "Bold contrast" },
      { name: "Rose Gold", value: "rose-gold", hex: "#f59e0b", description: "Warm glamour" },
    ],
  };
  return suggestions[primaryColor.value] || suggestions["warm-orange"];
};

interface ConversationData {
  inspiration: string;
  color: string;
  shopType: ShopType | null;
  style: string;
  landingPageType: string | null;
  lpDetails: Record<string, string>;
  selectedLeadFormId: string | null;
  isCreatingNewLeadForm: boolean;
  selectedPages: string[];
  customPages: string[];
  pageCustomizations: Record<string, PageCustomization>;
  products: string;
}

interface LeadFormOption {
  id: string;
  name: string;
}

const LEAD_FORMS_STORAGE_KEYS = [
  "universell-lead-forms",
  "universell-saved-lead-forms",
  "universell-crm-lead-forms",
];

const DEFAULT_LEAD_FORMS: LeadFormOption[] = [
  { id: "lf-1", name: "Newsletter Signup" },
  { id: "lf-2", name: "Free Trial Request" },
  { id: "lf-3", name: "Demo Request" },
];

const normalizeLandingPageType = (typeId: string | null) =>
  typeId ? typeId.replace(/-/g, "_") : null;

// Shop type options for card-based selection
const SHOP_TYPE_OPTIONS: ShopTypeOption[] = [
  {
    id: "products",
    title: "Products Only",
    description: "Sell physical or digital products through an online store",
    examples: "Clothing, Electronics, Digital Downloads",
    icon: Package,
  },
  {
    id: "services",
    title: "Services Only",
    description: "Offer professional services to your customers",
    examples: "Consulting, Design, Marketing",
    icon: Briefcase,
  },
  {
    id: "booking",
    title: "Booking Type",
    description: "Allow customers to book appointments or reservations",
    examples: "Salon, Restaurant, Medical Practice",
    icon: Coffee,
  },
  {
    id: "hybrid",
    title: "Products + Services",
    description: "Sell products and offer services together",
    examples: "Spa with Products, Auto Shop with Parts",
    icon: Layers,
  },
];

// Suggested pages based on shop type
// Full prompt specs (including schema, design system, and cookie consent directives)
// live in lib/ai-prompts.ts. The prompt strings here are the base content layer;
// at generation time they are composed with buildPagePrompt() from that module.
const SUGGESTED_PAGES: SuggestedPage[] = [
  {
    id: "homepage",
    title: "Homepage",
    description: "First impression and key highlights",
    prompt: `Generate a welcoming, conversion-focused Homepage for the business.

CONTENT STRUCTURE:
1. Hero Section — Bold H1 value proposition, supporting sub-heading, primary CTA ("Shop Now" / "Book a Table" / "Get Started" based on business type), hero image or gradient illustration.
2. Social Proof Bar — Logo strip or star-rating strip to build immediate trust.
3. Featured Products / Services — 3–4 spotlight cards with image, name, short description, price (if applicable), and CTA.
4. Brand Story Snippet — 2–3 sentence mission with a CTA linking to the About page.
5. Testimonials Carousel — 3 customer reviews with avatar, name, star rating, and quote.
6. Newsletter / Lead Capture — Email opt-in strip with incentive copy.
7. Footer — Navigation, social icons, legal links, and business contact details.

SCHEMA (auto-inject <script type="application/ld+json">):
- Primary: WebSite + LocalBusiness
- Populate: name, url, description, address, telephone, sameAs (social profiles)

DESIGN SYSTEM:
- Sticky frosted-glass header, smooth-scroll, fade-in-up section animations
- Gradient-accent hero band using brand primary colour CSS variable (--brand-primary)
- Rounded-2xl cards, soft box-shadow, hover lift (translateY(-4px))
- Mobile-first grid; WCAG AA contrast

COOKIE CONSENT: Inject GDPR banner on first load — Essential / Non-Essential toggles, Accept All / Reject / Manage actions. On consent, POST to /api/cookie-consent with choice, categories, sessionId, page, and timestamp.`,
    icon: Home,
    showFor: ["all"],
  },
  {
    id: "about",
    title: "About Us",
    description: "Your story, mission, and brand",
    prompt: `Generate a story-driven About Us page for the business.

CONTENT STRUCTURE:
1. Hero Banner — "Our Story" headline with a full-width brand image or illustration.
2. Founding Story — 3–4 paragraph narrative: why the business was started and the journey so far.
3. Mission & Values — 3–4 icon-card blocks with value title and 1–2 sentence description each.
4. Team Section — Grid of team member cards (photo, name, role, short bio).
5. Milestones Timeline — Key business milestones (founding year, first product, expansion, awards).
6. Community / Social Impact — Optional CSR or sustainability block.
7. CTA Strip — "Work with us" or "Visit our shop" linking to Contact or Shop page.

SCHEMA (auto-inject <script type="application/ld+json">):
- Primary: AboutPage + Organization
- Populate: name, url, description, foundingDate, founders, sameAs

DESIGN SYSTEM: Same as global spec — sticky header, scroll animations, gradient accents, mobile-first grid.

COOKIE CONSENT: Same GDPR banner spec — POST consent data to /api/cookie-consent.`,
    icon: Users,
    showFor: ["all"],
  },
  {
    id: "shop",
    title: "Shop / Products",
    description: "Browse and purchase products",
    prompt: `Generate a high-converting product catalogue page for the business.

CONTENT STRUCTURE:
1. Page Header — H1 "Shop" with filter bar (category chips, sort dropdown, search input).
2. Product Grid — Responsive grid (1→2→3–4 col). Each card: image, name, price, star rating, "Add to Cart" / "View Details" CTA.
3. Featured Collection Banner — Full-width promotional banner for a featured collection or sale.
4. Category Navigation — Icon-based category tabs or horizontal scroll chips above the grid.
5. Pagination / Load More — Progressive loading pattern.
6. Recently Viewed — Horizontal scroll strip (client-side state).
7. Trust Badges — Free shipping threshold, secure checkout, returns policy icons.

SCHEMA (auto-inject <script type="application/ld+json">):
- Primary: CollectionPage; nested ItemList with ListItem entries for each product
- Each product: Product @type with name, description, image, offers (Offer with price, priceCurrency, availability)

DESIGN SYSTEM: Global spec applies. Product cards use rounded-2xl, soft shadow, hover lift.

COOKIE CONSENT: Same GDPR banner spec — POST to /api/cookie-consent.`,
    icon: ShoppingBag,
    showFor: ["products", "hybrid"],
  },
  {
    id: "services",
    title: "Services",
    description: "Showcase your service offerings",
    prompt: `Generate a professional, lead-generating Services page for the business.

CONTENT STRUCTURE:
1. Hero — "What We Offer" headline, supporting paragraph, "Book a Free Consultation" CTA.
2. Services Grid — 3–6 cards: icon, service name, 2–3 sentence description, pricing indicator, "Learn More" / "Book Now" CTA.
3. Process — "How It Works" 3-step numbered visual (Enquire → Consult → Deliver).
4. Pricing Tiers (optional) — 3-column table (Starter / Professional / Enterprise) with feature checklist.
5. Testimonials — 3 client quotes specific to service quality.
6. FAQs Accordion — 5–7 common questions about the services.
7. Final CTA — "Ready to get started?" with contact form or booking link.

SCHEMA (auto-inject <script type="application/ld+json">):
- Primary: Service + ProfessionalService
- Each service: Service @type with name, description, provider (the business), offers

DESIGN SYSTEM: Global spec — gradient accents, hover lift cards, mobile-first grid.

COOKIE CONSENT: Same GDPR banner spec — POST to /api/cookie-consent.`,
    icon: Briefcase,
    showFor: ["services", "hybrid"],
  },
  {
    id: "bookings",
    title: "Bookings",
    description: "Schedule appointments or reservations",
    prompt: `Generate a frictionless Bookings / Reservations page for the business.

CONTENT STRUCTURE:
1. Hero — "Book Your Experience" headline, expectation-setting sub-heading, direct "Book Now" CTA.
2. Booking Widget — Calendar date-picker, time-slot selector, party-size / service selector, multi-step form (Contact Info → Confirm → Pay/Deposit).
3. What to Expect — 3-step visual guide (Select → Confirm → Enjoy) with icons.
4. Available Services / Packages — Cards with description, duration, and price.
5. Cancellation Policy — Clear icon-based policy block.
6. Testimonials — 2–3 booking-specific reviews.
7. FAQ Accordion — Booking changes, deposits, group bookings, accessibility.

SCHEMA (auto-inject <script type="application/ld+json">):
- Primary: Event (for event-based bookings) or Service with potentialAction: ReserveAction
- Include: availableChannel, bookingAgent, startDate, endDate where applicable

DESIGN SYSTEM: Global spec — frosted header, scroll animations, brand accent CTA buttons.

COOKIE CONSENT: Same GDPR banner spec — POST to /api/cookie-consent.`,
    icon: CalendarDays,
    showFor: ["booking"],
  },
  {
    id: "contact",
    title: "Contact Us",
    description: "Email, phone, location, and form",
    prompt: `Generate a welcoming, multi-channel Contact page for the business.

CONTENT STRUCTURE:
1. Hero — "Get in Touch" headline with a warm encouraging sub-heading.
2. Contact Form — Name, Email, Phone (optional), Subject (dropdown), Message, GDPR consent checkbox.
3. Contact Details Cards — Phone (click-to-call), Email (mailto), Physical Address with Google Maps embed.
4. Business Hours Table — Opening hours clearly formatted per day.
5. Social Media Links — Icon-button row for all active social profiles.
6. Live Chat Prompt — Optional "Chat with us" CTA.

SCHEMA (auto-inject <script type="application/ld+json">):
- Primary: ContactPage + LocalBusiness
- Populate: name, url, telephone, email, address (PostalAddress), openingHoursSpecification, sameAs

DESIGN SYSTEM: Global spec — gradient accent map frame border, hover lift on contact cards.

COOKIE CONSENT: Same GDPR banner spec — POST to /api/cookie-consent.`,
    icon: Phone,
    showFor: ["all"],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    description: "Legal information for customers",
    prompt: `Generate a clear, legally sound Terms & Conditions page for the business.

CONTENT STRUCTURE:
1. Introduction — Effective date, parties to the agreement, and scope.
2. Use of Service — Acceptable use, prohibited activities, account responsibilities.
3. Products & Orders — Ordering process, pricing, payment terms, cancellation.
4. Shipping & Delivery — Timeframes, international shipping, risk of loss.
5. Returns & Refunds — Return window, conditions, refund processing.
6. Intellectual Property — Content ownership, trademarks, user-generated content.
7. Limitation of Liability — Disclaimer and liability cap.
8. Governing Law — Jurisdiction and dispute resolution.
9. Changes to Terms — Update process and notification.
10. Contact — Legal queries contact details.

SCHEMA (auto-inject <script type="application/ld+json">):
- @type: WebPage with name "Terms and Conditions", publisher (the business Organization)

DESIGN SYSTEM: Clean readable typography — max-width prose container, anchored section headings with smooth-scroll nav, muted background section separators.

COOKIE CONSENT: Same GDPR banner spec — POST to /api/cookie-consent.`,
    icon: FileText,
    showFor: ["all"],
    isLegal: true,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "Data usage and compliance",
    prompt: `Generate a transparent, GDPR-compliant Privacy Policy page for the business.

CONTENT STRUCTURE:
1. Introduction — Who we are, what this policy covers, effective date.
2. Data We Collect — Explicit list: name, email, address, payment info, usage data, cookies.
3. How We Collect Data — Forms, cookies, third-party integrations.
4. How We Use Data — Fulfilment, marketing (opt-in), analytics, legal obligations.
5. Legal Basis (GDPR) — Consent, contract, legitimate interest, legal obligation.
6. Data Sharing — Third parties listed by name with purpose.
7. Data Retention — Retention periods per category.
8. Your Rights (GDPR) — Access, rectification, erasure, portability, objection, withdraw consent.
9. Cookie Policy — Cookie categories; reference to the consent banner on the site.
10. Data Security — Encryption, access controls, breach notification.
11. Children's Privacy — No collection from under-13s.
12. Contact / DPO — Privacy queries email and DPO details where required.

SCHEMA (auto-inject <script type="application/ld+json">):
- @type: WebPage with name "Privacy Policy", publisher (the business Organization)

DESIGN SYSTEM: Same as Terms page — readable prose, anchored nav, muted separators.

COOKIE CONSENT: Same GDPR banner spec — POST to /api/cookie-consent.`,
    icon: Shield,
    showFor: ["all"],
    isLegal: true,
  },
];

// Get suggested pages based on shop type
const getSuggestedPagesForShopType = (shopType: ShopType | null): SuggestedPage[] => {
  return SUGGESTED_PAGES.filter((page) => {
    if (page.showFor.includes("all")) return true;
    if (!shopType) return !page.showFor.some(s => ["products", "services", "booking", "hybrid"].includes(s));
    return page.showFor.includes(shopType);
  });
};

// Floating preview card component
function FloatingPreviewCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("absolute rounded-2xl shadow-2xl overflow-hidden", className)}>
      {children}
    </div>
  );
}

// Colorful Hero Section Preview
function HeroPreview({ color = "primary" }: { color?: string }) {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background to-muted/50">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/30 border-b border-border/20">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 p-4">
        <div className={cn(
          "h-16 rounded-xl mb-3 flex items-center justify-center",
          color === "primary" ? "bg-gradient-to-r from-primary/30 to-primary/10" : 
          color === "blue" ? "bg-gradient-to-r from-blue-500/30 to-blue-500/10" :
          "bg-gradient-to-r from-purple-500/30 to-purple-500/10"
        )}>
          <div className="w-24 h-3 bg-foreground/20 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Product Grid Preview
function ProductGridPreview() {
  return (
    <div className="w-full h-full bg-background p-3">
      <div className="grid grid-cols-2 gap-2 h-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-primary/10 to-orange-200/20 rounded-lg flex items-center justify-center">
            <ShoppingBag className={cn(
              "w-5 h-5",
              i % 2 === 0 ? "text-primary/40" : "text-orange-400/40"
            )} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Color Palette Preview
function ColorPalettePreview() {
  return (
    <div className="w-full h-full bg-background p-4 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium">Your Palette</span>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-primary shadow-lg ring-2 ring-primary/30" />
        <div className="w-8 h-8 rounded-full bg-orange-400 shadow-lg" />
        <div className="w-8 h-8 rounded-full bg-amber-300 shadow-lg" />
        <div className="w-8 h-8 rounded-full bg-rose-400 shadow-lg" />
      </div>
    </div>
  );
}

// Style Preview Card
function StylePreviewCard() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-4 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-4 h-4 text-violet-500" />
        <span className="text-xs font-semibold text-foreground">Modern & Minimal</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 bg-violet-500/20 rounded-full w-full" />
        <div className="h-2 bg-violet-500/10 rounded-full w-3/4" />
      </div>
    </div>
  );
}

// Chat Message Component
function ChatMessage({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const isAi = message.type === "ai";
  
  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in-up",
        isAi ? "justify-start" : "justify-end"
      )}
      style={{ animationDelay: isLatest ? "0ms" : "0ms" }}
    >
      {isAi && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isAi
            ? "bg-muted/50 border border-border/50 text-foreground"
            : "bg-primary text-white"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}

// Typing Indicator
function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-fade-in-up">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-muted/50 border border-border/50 rounded-2xl px-4 py-3">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// Quick Option Button
function QuickOption({
  label,
  icon: Icon,
  onClick,
  selected,
}: {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
        selected
          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
          : "bg-background border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}

// Visual Color Swatch Component
function ColorSwatch({
  color,
  selected,
  onClick,
}: {
  color: ColorOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        selected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-transparent bg-muted/30 hover:bg-muted/50 hover:border-border"
      )}
      aria-label={`Select ${color.name}`}
      aria-pressed={selected}
    >
      {/* Color circle */}
      <div className="relative">
        <div
          className={cn(
            "w-12 h-12 rounded-full shadow-lg transition-all duration-300",
            selected ? "scale-110 ring-4 ring-primary/30" : "group-hover:scale-105"
          )}
          style={{ backgroundColor: color.hex }}
        />
        {/* Check mark overlay */}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}
      </div>
      {/* Label */}
      <span className={cn(
        "text-xs font-medium text-center transition-colors",
        selected ? "text-foreground" : "text-muted-foreground"
      )}>
        {color.name}
      </span>
    </button>
  );
}

// Shade Editor Component
function ShadeEditor({
  baseColor,
  selectedShade,
  onShadeSelect,
}: {
  baseColor: ColorOption;
  selectedShade: ShadeOption | null;
  onShadeSelect: (shade: ShadeOption) => void;
}) {
  const shades = generateShades(baseColor.hex);

  return (
    <div className="animate-fade-in-up bg-muted/20 rounded-xl p-4 border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Fine-tune your shade</span>
      </div>
      
      {/* Shade swatches */}
      <div className="flex gap-2 justify-center mb-4">
        {shades.map((shade, index) => (
          <button
            key={index}
            onClick={() => onShadeSelect(shade)}
            className={cn(
              "w-10 h-10 rounded-lg transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/30",
              selectedShade?.value === shade.value
                ? "ring-2 ring-primary scale-110 shadow-lg"
                : "hover:scale-105"
            )}
            style={{ backgroundColor: shade.hex }}
            aria-label={shade.name}
          />
        ))}
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Preview:</span>
          <div
            className="h-8 px-4 rounded-lg flex items-center justify-center text-xs font-medium text-white shadow-md"
            style={{ backgroundColor: selectedShade?.hex || baseColor.hex }}
          >
            Button
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-32 rounded-md"
            style={{ 
              background: `linear-gradient(to right, ${selectedShade?.hex || baseColor.hex}, ${lightenColor(selectedShade?.hex || baseColor.hex, 30)})`
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Secondary Color Picker Component (with Shade Editing)
function SecondaryColorPicker({
  primaryColor,
  selectedSecondary,
  selectedSecondaryShade,
  onSecondarySelect,
  onSecondaryShadeSelect,
  onCustomInput,
  onConfirm,
}: {
  primaryColor: ColorOption;
  selectedSecondary: ColorOption | null;
  selectedSecondaryShade: ShadeOption | null;
  onSecondarySelect: (color: ColorOption) => void;
  onSecondaryShadeSelect: (shade: ShadeOption) => void;
  onCustomInput: (value: string) => void;
  onConfirm: () => void;
}) {
  const suggestions = getSecondaryColorSuggestions(primaryColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customHex, setCustomHex] = useState("#6366f1");

  // Generate shades for selected secondary color
  const secondaryShades = selectedSecondary ? generateShades(selectedSecondary.hex) : [];

  // Shade cards with clear labels and descriptions
  const shadeCards = secondaryShades.length >= 5 ? [
    { shade: secondaryShades[4], label: "Soft / Light", description: "Backgrounds, sections", usage: "Subtle backgrounds" },
    { shade: secondaryShades[2], label: "Balanced / Default", description: "UI elements, cards", usage: "Primary accents" },
    { shade: secondaryShades[0], label: "Bold / Dark", description: "Buttons, emphasis", usage: "Strong emphasis" },
  ] : [];

  // Calculate contrast between primary and secondary
  const getContrastStatus = () => {
    if (!selectedSecondary) return null;
    const secondaryHex = selectedSecondaryShade?.hex || selectedSecondary.hex;
    
    // Simple luminance difference check
    const getLuminance = (hex: string) => {
      const num = parseInt(hex.replace("#", ""), 16);
      const r = (num >> 16) & 0xff;
      const g = (num >> 8) & 0xff;
      const b = num & 0xff;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };
    
    const primaryLum = getLuminance(primaryColor.hex);
    const secondaryLum = getLuminance(secondaryHex);
    const diff = Math.abs(primaryLum - secondaryLum);
    
    if (diff > 0.3) return { status: "great", label: "Great contrast", icon: Check };
    if (diff > 0.15) return { status: "good", label: "Good contrast", icon: Check };
    return { status: "low", label: "Low contrast", icon: AlertCircle };
  };

  const contrastInfo = getContrastStatus();

  // Handle custom color picker
  const handleCustomColorApply = () => {
    if (customHex && /^#[0-9A-Fa-f]{6}$/.test(customHex)) {
      onCustomInput(customHex);
      setShowColorPicker(false);
    }
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Friendly intro text */}
      <div className="text-center pb-2">
        <p className="text-sm text-muted-foreground">
          To complement your primary color, here are a few suggestions that pair nicely ✨
        </p>
      </div>

      {/* Recommended Colors Section */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
        {/* Section header with badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-amber-700">Recommended for {primaryColor.name}</span>
          </div>
        </div>

        {/* Suggestion swatches */}
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((color) => (
            <button
              key={color.value}
              onClick={() => onSecondarySelect(color)}
              className={cn(
                "group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                "min-w-[80px]",
                selectedSecondary?.value === color.value
                  ? "border-primary border-[3px] bg-primary/5 shadow-lg"
                  : "border-border bg-card hover:bg-muted/50 hover:border-primary/30"
              )}
              aria-label={`Select ${color.name}`}
              aria-pressed={selectedSecondary?.value === color.value}
            >
              {/* Selection checkmark */}
              {selectedSecondary?.value === color.value && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="relative">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full shadow-md transition-all duration-300",
                    selectedSecondary?.value === color.value ? "scale-110" : "group-hover:scale-105",
                    // Add visible border for light/white colors
                    isLightColor(color.hex) ? "border-2 border-gray-300" : "border-2 border-white"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">{color.name}</span>
              <span className="text-[10px] text-muted-foreground">{color.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shade Editor - appears after secondary color selection */}
      {selectedSecondary && shadeCards.length > 0 && (
        <div className="animate-fade-in-up bg-card rounded-2xl p-5 border border-border shadow-sm">
          {/* Section title */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Fine-tune your secondary color</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose how this color will be used across your website (backgrounds, accents, highlights).
            </p>
          </div>
          
          {/* Shade Selection Cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {shadeCards.map((card, index) => {
              const isSelected = selectedSecondaryShade?.value === card.shade.value;
              return (
                <button
                  key={index}
                  onClick={() => onSecondaryShadeSelect(card.shade)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30",
                    "min-h-[140px]",
                    isSelected
                      ? "border-primary border-[3px] bg-primary/5 shadow-lg"
                      : "border-border bg-background hover:bg-muted/30 hover:border-primary/30"
                  )}
                  aria-label={`Select ${card.label} shade`}
                  aria-pressed={isSelected}
                >
                  {/* Selection checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  {/* Color preview with contrast-aware border */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl shadow-md transition-all duration-200",
                      isSelected ? "scale-110" : "",
                      // Add visible border for light colors
                      isLightColor(card.shade.hex) ? "border-2 border-gray-300" : "border-2 border-white"
                    )}
                    style={{ backgroundColor: card.shade.hex }}
                  />
                  
                  {/* Label */}
                  <span className="text-xs font-semibold text-foreground">{card.label}</span>
                  
                  {/* Description */}
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">
                    {card.description}
                  </span>

                  {/* Selected indicator label */}
                  {isSelected && (
                    <span className="text-[10px] font-medium text-primary mt-1">
                      ✓ Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected shade helper text */}
          {selectedSecondaryShade && (
            <div className="flex items-center justify-center gap-2 py-2 px-3 bg-primary/5 rounded-lg mb-4">
              <Check className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-medium">
                Used for {shadeCards.find(c => c.shade.value === selectedSecondaryShade.value)?.usage || "primary accents"}
              </span>
            </div>
          )}

          {/* Live Preview */}
          <div className="bg-muted/30 rounded-xl p-4 mb-4">
            <div className="text-xs text-muted-foreground mb-3 text-center">Preview</div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Badge preview */}
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium shadow-sm",
                    isLightColor(selectedSecondaryShade?.hex || selectedSecondary.hex) 
                      ? "border border-gray-300" 
                      : ""
                  )}
                  style={{ 
                    backgroundColor: selectedSecondaryShade?.hex || selectedSecondary.hex,
                    color: isLightColor(selectedSecondaryShade?.hex || selectedSecondary.hex) ? "#000" : "#fff"
                  }}
                >
                  Featured
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Badge</span>
              </div>

              {/* Accent line preview */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-16 h-1.5 rounded-full",
                    isLightColor(selectedSecondaryShade?.hex || selectedSecondary.hex)
                      ? "border border-gray-300"
                      : ""
                  )}
                  style={{ backgroundColor: selectedSecondaryShade?.hex || selectedSecondary.hex }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">Accent</span>
              </div>

              {/* Icon highlight preview - fixed for light colors */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center relative",
                    isLightColor(selectedSecondaryShade?.hex || selectedSecondary.hex)
                      ? "border border-gray-300"
                      : ""
                  )}
                  style={{ 
                    backgroundColor: isLightColor(selectedSecondaryShade?.hex || selectedSecondary.hex)
                      ? darkenColor(selectedSecondaryShade?.hex || selectedSecondary.hex, 10)
                      : lightenColor(selectedSecondaryShade?.hex || selectedSecondary.hex, 35)
                  }}
                >
                  {/* Contrasting circle badge behind icon */}
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: selectedSecondaryShade?.hex || selectedSecondary.hex,
                      border: isLightColor(selectedSecondaryShade?.hex || selectedSecondary.hex) 
                        ? "1px solid rgba(0,0,0,0.15)" 
                        : "none"
                    }}
                  >
                    <Star 
                      className="w-4 h-4" 
                      style={{ 
                        color: isLightColor(selectedSecondaryShade?.hex || selectedSecondary.hex) 
                          ? darkenColor(selectedSecondaryShade?.hex || selectedSecondary.hex, 50)
                          : "#fff"
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">Highlight</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Palette Summary */}
      {selectedSecondary && (
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Your palette:</span>
              <div className="flex items-center gap-1">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white shadow-md"
                  style={{ backgroundColor: primaryColor.hex }}
                  title="Primary"
                />
                <span className="text-muted-foreground mx-1">+</span>
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white shadow-md"
                  style={{ backgroundColor: selectedSecondaryShade?.hex || selectedSecondary.hex }}
                  title="Secondary"
                />
              </div>
            </div>
            {contrastInfo && (
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                contrastInfo.status === "great" || contrastInfo.status === "good"
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              )}>
                <contrastInfo.icon className="w-3.5 h-3.5" />
                {contrastInfo.label}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Color Picker */}
      <div className="pt-2">
        <p className="text-sm text-muted-foreground text-center mb-3">
          Want to use your own brand color instead?
        </p>
        
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">Pick a custom color</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="rounded-lg"
            >
              {showColorPicker ? "Close" : "Open picker"}
            </Button>
          </div>
          
          {showColorPicker && (
            <div className="mt-4 animate-fade-in-up pt-3 border-t border-border">
              <div className="flex items-center gap-4">
                {/* Color preview and picker */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-border shadow-inner cursor-pointer relative overflow-hidden"
                    style={{ backgroundColor: customHex }}
                  >
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => setCustomHex(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Pick a color"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Selected color</span>
                    <span className="text-sm font-mono font-medium text-foreground">{customHex.toUpperCase()}</span>
                  </div>
                </div>
                
                {/* Apply button */}
                <Button
                  size="sm"
                  onClick={handleCustomColorApply}
                  className="rounded-lg ml-auto"
                >
                  Apply Color
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {selectedSecondary && (
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onConfirm()}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip secondary color
            </button>
          </div>
          <Button
            onClick={onConfirm}
            size="default"
            className="rounded-xl shadow-md px-6"
          >
            Confirm Secondary Color
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper: Check if a color is light (for text contrast)
function isLightColor(hex: string): boolean {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

// Shop Type Card Component
function ShopTypeCard({
  option,
  selected,
  onClick,
}: {
  option: ShopTypeOption;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        "hover:shadow-md",
        selected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-border/60 bg-background hover:border-primary/40 hover:bg-muted/30"
      )}
      aria-label={`Select ${option.title}`}
      aria-pressed={selected}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      
      {/* Icon */}
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
        selected ? "bg-primary/20" : "bg-muted/50"
      )}>
        <Icon className={cn(
          "w-5 h-5 transition-colors",
          selected ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
      
      {/* Title */}
      <h3 className={cn(
        "font-semibold text-sm mb-1 transition-colors",
        selected ? "text-foreground" : "text-foreground"
      )}>
        {option.title}
      </h3>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
        {option.description}
      </p>
      
      {/* Examples */}
      <p className="text-[10px] text-muted-foreground/70 italic">
        e.g. {option.examples}
      </p>
    </button>
  );
}

// Shop Type Picker Component
function ShopTypePicker({
  selectedType,
  onSelect,
}: {
  selectedType: ShopType | null;
  onSelect: (type: ShopType) => void;
}) {
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Intro text */}
      <div className="flex items-center gap-2 mb-3">
        <Store className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Choose your business model</span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {SHOP_TYPE_OPTIONS.map((option) => (
          <ShopTypeCard
            key={option.id}
            option={option}
            selected={selectedType === option.id}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center pt-2">
        This helps us suggest the right features and page layouts for you
      </p>
    </div>
  );
}

// Suggested Page Card Component
function SuggestedPageCard({
  page,
  selected,
  customization,
  onToggle,
  onEdit,
}: {
  page: SuggestedPage;
  selected: boolean;
  customization?: PageCustomization;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const Icon = page.icon;
  const displayName = customization?.name || page.title;
  
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left w-full",
        selected
          ? "border-primary/60 bg-primary/5"
          : "border-border/40 bg-muted/20"
      )}
    >
      {/* Checkbox button */}
      <button
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center mt-0.5",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          selected
            ? "bg-primary border-primary"
            : "border-muted-foreground/40 bg-background hover:border-primary/40"
        )}
        aria-label={`${selected ? "Remove" : "Add"} ${displayName}`}
        aria-pressed={selected}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </button>
      
      {/* Icon */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
        selected ? "bg-primary/20" : "bg-muted/50"
      )}>
        <Icon className={cn(
          "w-4 h-4 transition-colors",
          selected ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
      
      {/* Content */}
      <button
        onClick={onToggle}
        className="flex-1 min-w-0 text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "font-medium text-sm transition-colors",
            selected ? "text-foreground" : "text-foreground/80"
          )}>
            {displayName}
          </h3>
          {page.isLegal && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              Legal
            </span>
          )}
          {customization && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              Edited
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {page.description}
        </p>
      </button>
      
      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className={cn(
          "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
        aria-label={`Edit ${displayName}`}
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Edit Page Modal Component
function EditPageModal({
  isOpen,
  page,
  customization,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  page: SuggestedPage | null;
  customization?: PageCustomization;
  onClose: () => void;
  onSave: (pageId: string, customization: PageCustomization) => void;
}) {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [nameError, setNameError] = useState("");

  // Reset form when modal opens with new page
  useEffect(() => {
    if (isOpen && page) {
      setName(customization?.name || page.title);
      setPrompt(customization?.prompt || page.prompt);
      setNameError("");
    }
  }, [isOpen, page, customization]);

  const handleSave = () => {
    // Validate name
    if (!name.trim()) {
      setNameError("Page name is required");
      return;
    }
    if (name.length > 50) {
      setNameError("Page name must be 50 characters or less");
      return;
    }

    if (page) {
      onSave(page.id, {
        name: name.trim(),
        prompt: prompt.trim(),
      });
    }
    onClose();
  };

  if (!page) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Page</DialogTitle>
          <DialogDescription>
            Customize how this page should be generated
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Page Name Field */}
          <div className="space-y-2">
            <Label htmlFor="page-name">Page Name</Label>
            <Input
              id="page-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              placeholder="Enter page name"
              maxLength={50}
              className={cn(nameError && "border-destructive")}
            />
            {nameError && (
              <p className="text-xs text-destructive">{nameError}</p>
            )}
          </div>

          {/* Prompt Field */}
          <div className="space-y-2">
            <Label htmlFor="page-prompt">What&apos;s on your mind?</Label>
            <Textarea
              id="page-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how AI should generate this page..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Describe your ideas here — include links, preferred colors, design references, or examples of pages you like so we can design a more desirable page for you.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Custom Page Input Component
function CustomPageInput({
  onAdd,
}: {
  onAdd: (pageName: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pageName, setPageName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (pageName.trim()) {
      onAdd(pageName.trim());
      setPageName("");
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "flex items-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all duration-200 w-full",
          "border-border/40 hover:border-primary/40 hover:bg-muted/20 text-muted-foreground hover:text-foreground"
        )}
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">Add a custom page</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-xl border-2 border-primary/40 bg-muted/20">
      <Input
        ref={inputRef}
        value={pageName}
        onChange={(e) => setPageName(e.target.value)}
        placeholder="Page name (e.g., Gallery, FAQ)"
        className="h-9 text-sm border-0 bg-transparent focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") {
            setIsExpanded(false);
            setPageName("");
          }
        }}
      />
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!pageName.trim()}
        className="h-8 px-3 rounded-lg"
      >
        Add
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setIsExpanded(false);
          setPageName("");
        }}
        className="h-8 w-8 p-0 rounded-lg"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

const PAGES_PICKER_UPSELL_TIPS = [
  "💡 Conversion-focused websites help turn more visitors into paying customers.",
  "💡 Mobile-optimized experiences can significantly improve engagement and sales.",
  "💡 Collecting customer inquiries helps businesses grow faster and market smarter.",
  "💡 Strong call-to-actions improve lead generation and customer retention.",
  "💡 SEO-friendly pages help more customers discover your business online.",
  "💡 Personalized website experiences increase customer trust and conversions.",
  "💡 Integrated customer data collection helps businesses market smarter and grow faster.",
];

interface GenerationStage {
  duration: number;
  message: string;
  targetPct: number;
  label: string;
}

const GENERATION_STAGES: GenerationStage[] = [
  { duration: 5000, message: "Analyzing your business structure and selected pages...",  targetPct: 8,   label: "Business structure analyzed" },
  { duration: 5000, message: "Understanding your products, audience, and goals...",       targetPct: 19,  label: "Audience profile created" },
  { duration: 8000, message: "Designing a modern and conversion-focused layout...",       targetPct: 33,  label: "Layout design complete" },
  { duration: 7000, message: "Generating responsive HTML and UI components...",           targetPct: 47,  label: "HTML components generated" },
  { duration: 7000, message: "Creating optimized sections and customer journeys...",      targetPct: 61,  label: "Customer journeys mapped" },
  { duration: 8000, message: "Applying branding, typography, colors, and spacing...",    targetPct: 74,  label: "Branding applied" },
  { duration: 8000, message: "Optimizing mobile responsiveness and SEO performance...",  targetPct: 89,  label: "Mobile & SEO optimized" },
  { duration: 2000, message: "Finalizing your website experience...",                     targetPct: 100, label: "Website finalized" },
];

function waitMs(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** How many recently-completed stages to show in the checklist */
const MAX_VISIBLE_COMPLETED_STAGES = 3;
/** How long to display the success state before calling onConfirm (ms) */
const POST_COMPLETION_DELAY_MS = 1800;

// Suggested Pages Picker Component
function SuggestedPagesPicker({
  shopType,
  selectedPages,
  customPages,
  pageCustomizations,
  onTogglePage,
  onAddCustomPage,
  onRemoveCustomPage,
  onEditPage,
  onConfirm,
  onSkip,
}: {
  shopType: ShopType | null;
  selectedPages: string[];
  customPages: string[];
  pageCustomizations: Record<string, PageCustomization>;
  onTogglePage: (pageId: string) => void;
  onAddCustomPage: (pageName: string) => void;
  onRemoveCustomPage: (pageName: string) => void;
  onEditPage: (pageId: string, customization: PageCustomization) => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const suggestedPages = getSuggestedPagesForShopType(shopType);
  const totalSelected = selectedPages.length + customPages.length;
  
  // Modal state
  const [editingPage, setEditingPage] = useState<SuggestedPage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AI generation loading state
  const [isConfirming, setIsConfirming] = useState(false);
  const [msgVisible, setMsgVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [generationDone, setGenerationDone] = useState(false);
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  // Drive staged progress when confirming starts
  useEffect(() => {
    if (!isConfirming) return;
    let cancelled = false;
    let prevPct = 0;

    const runStages = async () => {
      for (let i = 0; i < GENERATION_STAGES.length; i++) {
        if (cancelled) return;
        const stage = GENERATION_STAGES[i];

        // Fade out message before switching stage
        if (i > 0) {
          setMsgVisible(false);
          await waitMs(300);
          if (cancelled) return;
        }
        setStageIndex(i);
        setMsgVisible(true);

        // Animate progress from prevPct to stage.targetPct
        const steps = 30;
        const stepDelay = stage.duration / steps;
        const startPct = prevPct;
        for (let s = 1; s <= steps; s++) {
          await waitMs(stepDelay);
          if (cancelled) return;
          const pct = startPct + Math.round(((stage.targetPct - startPct) * s) / steps);
          setProgress(pct);
        }

        prevPct = stage.targetPct;
        setCompletedStages((prev) => [...prev, i]);
      }

      if (cancelled) return;
      setGenerationDone(true);
      await waitMs(POST_COMPLETION_DELAY_MS);
      if (cancelled) return;
      onConfirmRef.current();
    };

    runStages();
    return () => { cancelled = true; };
  }, [isConfirming]);

  // Rotate upsell tips independently on a staggered interval
  useEffect(() => {
    if (!isConfirming) return;
    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((i) => (i + 1) % PAGES_PICKER_UPSELL_TIPS.length);
        setTipVisible(true);
      }, 500);
    }, 7000);
    return () => clearInterval(interval);
  }, [isConfirming]);

  const handleConfirmClick = () => {
    if (isConfirming) return;
    setIsConfirming(true);
    // onConfirm() will be called after the staged generation sequence completes
  };

  const handleOpenEdit = (page: SuggestedPage) => {
    setEditingPage(page);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const handleSaveEdit = (pageId: string, customization: PageCustomization) => {
    onEditPage(pageId, customization);
  };

  // Get display name for a page (customized or original)
  const getDisplayName = (page: SuggestedPage) => {
    return pageCustomizations[page.id]?.name || page.title;
  };

  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Intro text */}
      <div className="flex items-start gap-2 mb-2">
        <Layout className="w-4 h-4 text-primary mt-0.5" />
        <span className="text-sm font-medium">Review your site pages below. Click the edit icon to rename a page or tweak its description so it looks exactly the way you want.</span>
      </div>

      {/* Pages checklist */}
      <div className={cn("space-y-2 max-h-[280px] overflow-y-auto pr-1", isConfirming && "pointer-events-none opacity-60")}>
        {suggestedPages.map((page) => (
          <SuggestedPageCard
            key={page.id}
            page={page}
            selected={selectedPages.includes(page.id)}
            customization={pageCustomizations[page.id]}
            onToggle={() => onTogglePage(page.id)}
            onEdit={() => handleOpenEdit(page)}
          />
        ))}

        {/* Custom pages */}
        {customPages.map((pageName) => (
          <div
            key={pageName}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary/60 bg-primary/5"
          >
            {/* Checkbox */}
            <div className="flex-shrink-0 w-5 h-5 rounded-md bg-primary border-2 border-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground">{pageName}</h3>
              <p className="text-xs text-muted-foreground">Custom page</p>
            </div>

            {/* Remove button */}
            {!isConfirming && (
              <button
                onClick={() => onRemoveCustomPage(pageName)}
                className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-destructive/10 flex items-center justify-center transition-colors"
                aria-label={`Remove ${pageName}`}
              >
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </div>
        ))}

        {/* Add custom page input */}
        {!isConfirming && <CustomPageInput onAdd={onAddCustomPage} />}
      </div>

      {/* Helper text about reordering */}
      <p className="text-xs text-muted-foreground">
        Don&apos;t worry about the order for now. You can easily rearrange your pages later from the Website Pages section.
      </p>

      {/* Summary and preview */}
      <div className="pt-3 border-t border-border/30 space-y-3">
        {/* Page count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grip className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Total pages selected: <span className="font-semibold text-foreground">{totalSelected}</span>
            </span>
          </div>
        </div>

        {/* Visual sitemap preview */}
        {totalSelected > 0 && (
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Site structure preview:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPages
                .filter((page) => selectedPages.includes(page.id))
                .map((page) => (
                  <span
                    key={page.id}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-background border border-border/50"
                  >
                    <page.icon className="w-3 h-3 text-primary" />
                    {getDisplayName(page)}
                  </span>
                ))}
              {customPages.map((pageName) => (
                <span
                  key={pageName}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-background border border-primary/30"
                >
                  <FileText className="w-3 h-3 text-primary" />
                  {pageName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleConfirmClick}
            disabled={totalSelected === 0 || isConfirming}
            className={cn(
              "rounded-xl shadow-md transition-all duration-300",
              isConfirming ? "flex-[2] opacity-90 cursor-not-allowed" : "flex-1"
            )}
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Website...
              </>
            ) : (
              <>
                Confirm Pages & Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
          {!isConfirming && (
            <button
              onClick={onSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Skip (use recommended)
            </button>
          )}
        </div>

        {/* AI Generation Status Panel */}
        {isConfirming && (
          <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-orange-50/60 to-white shadow-lg shadow-primary/10 overflow-hidden animate-fade-in-up">
            {/* Animated top strip */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-orange-400 to-primary bg-[length:200%_100%] animate-[gradient-shift_3s_ease_infinite]" />

            <div className="p-4 space-y-4">
              {/* Header row */}
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-md shadow-primary/25">
                  {generationDone ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {generationDone ? "Your website is ready!" : "Universell AI is building your website"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {generationDone ? "Redirecting you now…" : "Estimated completion time: 4–8 minutes"}
                  </p>
                </div>
              </div>

              {/* Secondary message */}
              {!generationDone && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our AI is designing and building a high-converting website tailored to your business.
                </p>
              )}

              {/* Progress percentage + bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center gap-2">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium transition-all duration-300 flex-1 min-w-0",
                      msgVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                    )}
                  >
                    {generationDone ? (
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Website generation complete!
                      </span>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                        <span className="text-primary/80 truncate">
                          {GENERATION_STAGES[stageIndex]?.message}
                          <span className="inline-flex gap-0.5 ml-1 align-middle">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="inline-block w-1 h-1 rounded-full bg-primary/70 animate-bounce"
                                style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
                              />
                            ))}
                          </span>
                        </span>
                      </>
                    )}
                  </span>
                  <span className="text-sm font-bold text-primary tabular-nums shrink-0">{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Completed stages checklist */}
              {completedStages.length > 0 && (
                <div className="space-y-1 pt-1">
                  {completedStages.slice(-MAX_VISIBLE_COMPLETED_STAGES).map((si) => (
                    <div key={si} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>{GENERATION_STAGES[si]?.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Rotating upsell tip */}
              {!generationDone && (
                <p
                  className={cn(
                    "text-xs text-muted-foreground pt-2 border-t border-border/30 transition-all duration-500",
                    tipVisible ? "opacity-100" : "opacity-0"
                  )}
                >
                  {PAGES_PICKER_UPSELL_TIPS[tipIndex]}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Page Modal */}
      <EditPageModal
        isOpen={isModalOpen}
        page={editingPage}
        customization={editingPage ? pageCustomizations[editingPage.id] : undefined}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

// Visual Primary Color Picker Component (Full)
function PrimaryColorPicker({
  selectedColor,
  selectedShade,
  onColorSelect,
  onShadeSelect,
  onConfirm,
}: {
  selectedColor: ColorOption | null;
  selectedShade: ShadeOption | null;
  onColorSelect: (color: ColorOption) => void;
  onShadeSelect: (shade: ShadeOption) => void;
  onConfirm: () => void;
}) {
  const [customColorHex, setCustomColorHex] = useState("#6366f1");
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomColorHex(hex);
    // Create a custom color option
    const customColor: ColorOption = {
      name: "Custom Color",
      value: "custom",
      hex: hex,
      description: "Your custom brand color",
    };
    onColorSelect(customColor);
  };

  const handleCustomColorClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Friendly intro text */}
      <div className="text-center pb-2">
        <p className="text-sm text-muted-foreground">
          Based on what we know about your business, here are some colors that would work beautifully for your brand 🎨
        </p>
      </div>

      {/* Recommended Colors Section */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
        {/* Section header with badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-amber-700">Recommended for you</span>
          </div>
        </div>

        {/* Color swatches grid */}
        <div className="grid grid-cols-3 gap-2">
          {PRIMARY_COLORS.map((color) => (
            <ColorSwatch
              key={color.value}
              color={color}
              selected={selectedColor?.value === color.value}
              onClick={() => onColorSelect(color)}
            />
          ))}
        </div>
      </div>

      {/* Custom Color Section */}
      <div className="pt-2">
        <p className="text-sm text-muted-foreground text-center mb-3">
          Want to use your own brand color?
        </p>
        
        <button
          onClick={handleCustomColorClick}
          className={cn(
            "w-full group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
            selectedColor?.value === "custom"
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "border-dashed border-border hover:border-primary/40 hover:bg-muted/30"
          )}
          aria-label="Pick a custom color"
        >
          {/* Hidden color input */}
          <input
            ref={colorInputRef}
            type="color"
            value={customColorHex}
            onChange={handleCustomColorChange}
            className="sr-only"
            aria-hidden="true"
          />
          
          {/* Color preview circle */}
          <div className="relative">
            <div
              className={cn(
                "w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center",
                selectedColor?.value === "custom" ? "ring-4 ring-primary/30" : ""
              )}
              style={{ backgroundColor: selectedColor?.value === "custom" ? customColorHex : "#e5e7eb" }}
            >
              {selectedColor?.value !== "custom" && (
                <Plus className="w-5 h-5 text-muted-foreground" />
              )}
              {selectedColor?.value === "custom" && (
                <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          </div>
          
          {/* Label */}
          <div className="text-left flex-1">
            <span className={cn(
              "text-sm font-medium transition-colors block",
              selectedColor?.value === "custom" ? "text-foreground" : "text-muted-foreground"
            )}>
              Pick a custom color
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedColor?.value === "custom" ? `Selected: ${customColorHex.toUpperCase()}` : "Click to open color picker"}
            </span>
          </div>
          
          {/* Palette icon */}
          <Palette className={cn(
            "w-5 h-5 transition-colors",
            selectedColor?.value === "custom" ? "text-primary" : "text-muted-foreground/50"
          )} />
        </button>
      </div>

      {/* Shade editor - only show when color is selected */}
      {selectedColor && (
        <ShadeEditor
          baseColor={selectedColor}
          selectedShade={selectedShade}
          onShadeSelect={onShadeSelect}
        />
      )}

      {/* Confirm button */}
      {selectedColor && (
        <div className="flex justify-end pt-2">
          <Button
            onClick={onConfirm}
            size="sm"
            className="rounded-xl shadow-md"
          >
            Confirm Color
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Brand Vault Modal Component
function BrandVaultModal({
  isOpen,
  onClose,
  onSave,
  businessName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BrandVaultData) => void;
  businessName: string;
}) {
  const [expandedSections, setExpandedSections] = useState({
    core: true,
    recommended: false,
    optional: false,
  });

  const [vaultData, setVaultData] = useState<BrandVaultData>({
    inspirationLinks: [""],
    logoFile: null,
    logoPreview: null,
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    fontPreference: "",
    brandTone: "",
    industry: "",
    targetAudience: "",
    moodboardImages: [],
    socialLinks: [""],
    brandGuidelines: null,
    additionalNotes: "",
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const guidelinesInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: "core" | "recommended" | "optional") => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVaultData(prev => ({
          ...prev,
          logoFile: file,
          logoPreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addInspirationLink = () => {
    setVaultData(prev => ({
      ...prev,
      inspirationLinks: [...prev.inspirationLinks, ""],
    }));
  };

  const updateInspirationLink = (index: number, value: string) => {
    setVaultData(prev => {
      const links = [...prev.inspirationLinks];
      links[index] = value;
      return { ...prev, inspirationLinks: links };
    });
  };

  const removeInspirationLink = (index: number) => {
    setVaultData(prev => ({
      ...prev,
      inspirationLinks: prev.inspirationLinks.filter((_, i) => i !== index),
    }));
  };

  const addSocialLink = () => {
    setVaultData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, ""],
    }));
  };

  const updateSocialLink = (index: number, value: string) => {
    setVaultData(prev => {
      const links = [...prev.socialLinks];
      links[index] = value;
      return { ...prev, socialLinks: links };
    });
  };

  const removeSocialLink = (index: number) => {
    setVaultData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    // Filter out empty links
    const cleanedData = {
      ...vaultData,
      inspirationLinks: vaultData.inspirationLinks.filter(l => l.trim()),
      socialLinks: vaultData.socialLinks.filter(l => l.trim()),
    };
    onSave(cleanedData);
  };

  const brandTones = [
    { id: "professional", label: "Professional", emoji: "💼" },
    { id: "friendly", label: "Friendly", emoji: "😊" },
    { id: "premium", label: "Premium", emoji: "✨" },
    { id: "playful", label: "Playful", emoji: "🎉" },
    { id: "minimal", label: "Minimal", emoji: "◻️" },
    { id: "bold", label: "Bold", emoji: "🔥" },
  ];

  const industries = [
    "Fashion & Apparel",
    "Food & Beverage",
    "Health & Wellness",
    "Technology",
    "Home & Living",
    "Beauty & Skincare",
    "Sports & Fitness",
    "Arts & Crafts",
    "Professional Services",
    "Other",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Create Your Brand Vault</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                Add everything you already have — you can always change or refine it later.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Helper notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              These help us design a more accurate and polished website — but you can edit everything later.
            </p>
          </div>

          {/* Core Section */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => toggleSection("core")}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-foreground">Core Brand Assets</span>
                  <span className="text-xs text-muted-foreground block">Inspiration, logo, colors</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Recommended</span>
                {expandedSections.core ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>
            </button>

            {expandedSections.core && (
              <div className="p-4 pt-0 space-y-5 border-t border-border">
                {/* Inspiration Links */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Website Inspiration</Label>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Share websites you like — we&apos;ll use them as design references.
                  </p>
                  <div className="space-y-2">
                    {vaultData.inspirationLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="https://example.com"
                          value={link}
                          onChange={(e) => updateInspirationLink(index, e.target.value)}
                          className="flex-1"
                        />
                        {vaultData.inspirationLinks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInspirationLink(index)}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addInspirationLink}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add another link
                  </Button>
                </div>

                {/* Logo Upload */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Brand Logo</Label>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {vaultData.logoPreview ? (
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="w-16 h-16 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden">
                        <img src={vaultData.logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{vaultData.logoFile?.name}</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Upload your logo</span>
                      <span className="text-xs text-muted-foreground">PNG, JPG, or SVG</span>
                    </button>
                  )}
                </div>

                {/* Brand Colors */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Brand Colors</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Primary */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground">Primary</span>
                      <div className="relative">
                        <input
                          type="color"
                          value={vaultData.primaryColor || "#6366f1"}
                          onChange={(e) => setVaultData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          className="w-full h-12 rounded-lg border-2 border-border cursor-pointer flex items-center justify-center"
                          style={{ backgroundColor: vaultData.primaryColor || "#f3f4f6" }}
                        >
                          {!vaultData.primaryColor && <Plus className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>
                    {/* Secondary */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground">Secondary</span>
                      <div className="relative">
                        <input
                          type="color"
                          value={vaultData.secondaryColor || "#8b5cf6"}
                          onChange={(e) => setVaultData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          className="w-full h-12 rounded-lg border-2 border-border cursor-pointer flex items-center justify-center"
                          style={{ backgroundColor: vaultData.secondaryColor || "#f3f4f6" }}
                        >
                          {!vaultData.secondaryColor && <Plus className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>
                    {/* Accent */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground">Accent</span>
                      <div className="relative">
                        <input
                          type="color"
                          value={vaultData.accentColor || "#f59e0b"}
                          onChange={(e) => setVaultData(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          className="w-full h-12 rounded-lg border-2 border-border cursor-pointer flex items-center justify-center"
                          style={{ backgroundColor: vaultData.accentColor || "#f3f4f6" }}
                        >
                          {!vaultData.accentColor && <Plus className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Section */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => toggleSection("recommended")}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-foreground">Brand Personality</span>
                  <span className="text-xs text-muted-foreground block">Fonts, tone, audience</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">Suggested</span>
                {expandedSections.recommended ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>
            </button>

            {expandedSections.recommended && (
              <div className="p-4 pt-0 space-y-5 border-t border-border">
                {/* Font Preference */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Font Preference</Label>
                  </div>
                  <Input
                    placeholder="e.g., Modern sans-serif, Classic serif, Handwritten..."
                    value={vaultData.fontPreference}
                    onChange={(e) => setVaultData(prev => ({ ...prev, fontPreference: e.target.value }))}
                  />
                </div>

                {/* Brand Tone */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Brand Tone</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {brandTones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setVaultData(prev => ({ ...prev, brandTone: tone.id }))}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all text-left",
                          vaultData.brandTone === tone.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span className="text-lg">{tone.emoji}</span>
                        <span className="text-sm font-medium block mt-1">{tone.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Industry</Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => setVaultData(prev => ({ ...prev, industry }))}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-sm transition-all",
                          vaultData.industry === industry
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border hover:border-primary/40 text-muted-foreground"
                        )}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Target Audience</Label>
                  </div>
                  <Textarea
                    placeholder="Who is your website for? e.g., Young professionals aged 25-40, health-conscious consumers..."
                    value={vaultData.targetAudience}
                    onChange={(e) => setVaultData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optional Section */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => toggleSection("optional")}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-foreground">Extra Assets</span>
                  <span className="text-xs text-muted-foreground block">Social links, guidelines, notes</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Optional</span>
                {expandedSections.optional ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>
            </button>

            {expandedSections.optional && (
              <div className="p-4 pt-0 space-y-5 border-t border-border">
                {/* Social Links */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Social Media Links</Label>
                  </div>
                  <div className="space-y-2">
                    {vaultData.socialLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="https://instagram.com/yourbrand"
                          value={link}
                          onChange={(e) => updateSocialLink(index, e.target.value)}
                          className="flex-1"
                        />
                        {vaultData.socialLinks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSocialLink(index)}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSocialLink}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add another link
                  </Button>
                </div>

                {/* Brand Guidelines */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Brand Guidelines (PDF)</Label>
                  </div>
                  <input
                    ref={guidelinesInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setVaultData(prev => ({ ...prev, brandGuidelines: file }));
                      }
                    }}
                    className="hidden"
                  />
                  {vaultData.brandGuidelines ? (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm flex-1">{vaultData.brandGuidelines.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVaultData(prev => ({ ...prev, brandGuidelines: null }))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => guidelinesInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload PDF
                    </Button>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Additional Notes</Label>
                  </div>
                  <Textarea
                    placeholder="Anything else you'd like us to know about your brand..."
                    value={vaultData.additionalNotes}
                    onChange={(e) => setVaultData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reassurance note */}
          <div className="flex items-center gap-2 justify-center pt-2">
            <Check className="w-4 h-4 text-green-500" />
            <p className="text-sm text-muted-foreground">
              Nothing here is final. You can tweak, replace, or remove any item later.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-6">
            <FolderOpen className="w-4 h-4 mr-2" />
            Save Brand Vault & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Intro Screen Component - First-time entry experience
function IntroScreen({
  businessName,
  onStartChat,
  onSkipChat,
  onOpenBrandVault,
}: {
  businessName: string;
  onStartChat: () => void;
  onSkipChat: () => void;
  onOpenBrandVault: () => void;
}) {
  return (
    <div className="relative min-h-[650px] lg:min-h-[750px] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-400/5 rounded-full blur-3xl" />

      {/* Subtle floating elements - Left side */}
      <div className="hidden lg:flex absolute top-24 left-[12%] glass rounded-full px-4 py-2 shadow-lg animate-float items-center gap-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium">AI Guided</span>
      </div>

      <div className="hidden lg:flex absolute bottom-32 left-[8%] glass rounded-full px-4 py-2 shadow-lg animate-float-delayed items-center gap-2">
        <Zap className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium">Instant Setup</span>
      </div>

      {/* Subtle floating elements - Right side */}
      <div className="hidden lg:flex absolute top-28 right-[10%] glass rounded-full px-4 py-2 shadow-lg animate-float-slow items-center gap-2">
        <PenTool className="w-4 h-4 text-violet-500" />
        <span className="text-xs font-medium">Custom Design</span>
      </div>

      <div className="hidden lg:flex absolute bottom-28 right-[12%] glass rounded-full px-4 py-2 shadow-lg animate-float items-center gap-2">
        <Layout className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-medium">Smart Layout</span>
      </div>

      {/* Center Card */}
      <div className="relative z-10 flex items-center justify-center min-h-[650px] lg:min-h-[750px] px-4">
        <div className="w-full max-w-xl animate-fade-in-up">
          {/* Main Card */}
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 lg:p-12">
            {/* AI Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-3xl ring-4 ring-primary/20 animate-pulse" />
                {/* Subtle glow */}
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-10" />
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                Bring your website to life with{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Universell AI
                </span>
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                Great! We&apos;ve got your business details and logo ready—now let&apos;s turn them into a beautiful website. This is where it all comes together ✨
              </p>
            </div>

            {/* Two Path Options */}
            <div className="space-y-4 mb-6">
              {/* Option A: Brand Vault */}
              <button
                onClick={onOpenBrandVault}
                className="w-full group relative p-5 rounded-2xl border-2 border-border bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground text-lg">Create a Brand Vault</span>
                      <span className="text-xs font-medium text-violet-600 bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Add everything you already have — you can always change or refine it later.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Logo</span>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Colors</span>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Inspiration</span>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">+ More</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-2" />
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-medium text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Option B: Guided Questions */}
              <button
                onClick={onStartChat}
                className="w-full group relative p-5 rounded-2xl border-2 border-border bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-foreground text-lg block mb-1">Guided Questions</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Answer a few quick questions and we&apos;ll handle the rest.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Takes about 2 minutes</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0 mt-2" />
                </div>
              </button>
            </div>

            {/* Skip option */}
            <div className="pt-2 border-t border-border/50">
              <button
                onClick={onSkipChat}
                className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 group"
              >
                Skip for now and explore
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Trust indicator */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              <Globe className="w-4 h-4 inline mr-1.5 text-primary/60" />
              Trusted by <span className="font-semibold text-foreground">10,000+</span> businesses worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Landing Page Types ────────────────────────────────────────────────────
interface LandingPageTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  example: string;
}

const LANDING_PAGE_TYPES: LandingPageTypeOption[] = [
  {
    id: "product-launch",
    title: "Product Launch",
    description: "Showcase a new product with highlights and a clear buy CTA",
    icon: Package,
    example: "New sneaker drop, app release",
  },
  {
    id: "lead-generation",
    title: "Lead Generation",
    description: "Capture emails and leads with an irresistible offer",
    icon: Target,
    example: "Free guide, newsletter signup",
  },
  {
    id: "event-webinar",
    title: "Event / Webinar",
    description: "Promote an upcoming event or online session",
    icon: CalendarDays,
    example: "Conference, workshop, live stream",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Showcase your work, projects, or case studies",
    icon: Briefcase,
    example: "Design portfolio, agency work",
  },
  {
    id: "service-showcase",
    title: "Service Showcase",
    description: "Highlight a specific service and drive bookings",
    icon: Zap,
    example: "Coaching, consulting, freelance",
  },
  {
    id: "coming-soon",
    title: "Coming Soon",
    description: "Build anticipation and collect early signups",
    icon: Star,
    example: "App launch, new collection",
  },
  {
    id: "discount-promo",
    title: "Discount / Promo",
    description: "Drive urgency with a limited-time offer or sale",
    icon: Sparkles,
    example: "Black Friday, flash sale",
  },
  {
    id: "about-brand",
    title: "About / Brand Story",
    description: "Tell your story and connect emotionally with visitors",
    icon: Heart,
    example: "Founder story, brand mission",
  },
];

// Landing Page Type Picker — single select
// ─── Landing Page Details Forms ──────────────────────────────────────────────

const MOCK_INVENTORY = [
  { id: "inv-1", name: "Classic White Tee", sku: "CWT-001", price: "$29", image: "👕" },
  { id: "inv-2", name: "Running Shoes Pro", sku: "RSP-042", price: "$120", image: "👟" },
  { id: "inv-3", name: "Leather Wallet", sku: "LW-007", price: "$55", image: "👛" },
  { id: "inv-4", name: "Wireless Earbuds", sku: "WE-203", price: "$89", image: "🎧" },
  { id: "inv-5", name: "Coffee Mug XL", sku: "CM-XL", price: "$18", image: "☕" },
  { id: "inv-6", name: "Yoga Mat Premium", sku: "YM-P1", price: "$65", image: "🧘" },
];

function LandingPageDetailsForm({
  landingPageType,
  onConfirm,
}: {
  landingPageType: string;
  onConfirm: (summary: string, details: Record<string, string>) => void;
}) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [selectedInventory, setSelectedInventory] = useState<string[]>([]);
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>({});

  const set = (key: string, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const toggleInventory = (id: string) =>
    setSelectedInventory((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleCheck = (key: string) =>
    setCheckedFields((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleConfirm = () => {
    const details: Record<string, string> = { ...fields };

    // Augment with structured data
    if (selectedInventory.length > 0) {
      const names = selectedInventory.map(
        (id) => MOCK_INVENTORY.find((i) => i.id === id)?.name ?? id
      );
      details["selectedProducts"] = names.join(", ");
    }
    const checkedKeys = Object.entries(checkedFields)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (checkedKeys.length > 0) {
      details["selectedOptions"] = checkedKeys.join(", ");
    }

    // Build human-readable summary
    const summaryParts = Object.entries(details)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1").toLowerCase()}: ${v}`);
    const summary = summaryParts.join(" · ") || "Details provided";
    onConfirm(summary, details);
  };

  const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50";
  const labelClass = "block text-xs font-medium text-foreground mb-1";
  const sectionClass = "space-y-3";

  const renderForm = () => {
    switch (landingPageType) {
      case "product-launch":
        return (
          <div className={sectionClass}>
            <p className="text-xs text-muted-foreground">Select from your inventory or describe a new product.</p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_INVENTORY.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInventory(item.id)}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all",
                    selectedInventory.includes(item.id)
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  <span className="text-xl">{item.image}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.price}</p>
                  </div>
                  {selectedInventory.includes(item.id) && (
                    <Check className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div>
              <label className={labelClass}>Or describe a custom product</label>
              <Input
                className={inputClass}
                placeholder="e.g. Limited edition sneaker, new flavour…"
                value={fields.customProduct ?? ""}
                onChange={(e) => set("customProduct", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Key selling point / headline</label>
              <Input
                className={inputClass}
                placeholder="e.g. Sell out faster with one bold CTA"
                value={fields.headline ?? ""}
                onChange={(e) => set("headline", e.target.value)}
              />
            </div>
          </div>
        );

      case "lead-generation":
        return (
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>What information do you want to collect?</label>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {["Full Name", "Email Address", "Phone Number", "Company", "Job Title", "Location"].map((f) => (
                  <label key={f} className="flex items-center gap-2 text-xs cursor-pointer p-2 rounded-lg border border-border/40 hover:bg-muted/30">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={!!checkedFields[f]}
                      onChange={() => toggleCheck(f)}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>What offer / incentive are you giving visitors?</label>
              <Input
                className={inputClass}
                placeholder="e.g. Free eBook, 20% discount, webinar access…"
                value={fields.offer ?? ""}
                onChange={(e) => set("offer", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>What information do you want to show on the page?</label>
              <Textarea
                className={cn(inputClass, "resize-none")}
                rows={3}
                placeholder="e.g. Intro about your brand, benefits list, testimonials…"
                value={fields.pageInfo ?? ""}
                onChange={(e) => set("pageInfo", e.target.value)}
              />
            </div>
          </div>
        );

      case "event-webinar":
        return (
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>Event / webinar name</label>
              <Input className={inputClass} placeholder="e.g. Growth Hacking Summit 2026" value={fields.eventName ?? ""} onChange={(e) => set("eventName", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Date</label>
                <Input className={inputClass} type="date" value={fields.date ?? ""} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Time</label>
                <Input className={inputClass} type="time" value={fields.time ?? ""} onChange={(e) => set("time", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location (or "Online")</label>
              <Input className={inputClass} placeholder="e.g. Zoom, New York Convention Center…" value={fields.location ?? ""} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Short description</label>
              <Textarea className={cn(inputClass, "resize-none")} rows={3} placeholder="What will attendees learn or experience?" value={fields.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Registration link (optional)</label>
              <Input className={inputClass} placeholder="https://…" value={fields.registrationLink ?? ""} onChange={(e) => set("registrationLink", e.target.value)} />
            </div>
          </div>
        );

      case "portfolio":
        return (
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>What type of work do you showcase?</label>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {["Photography", "Graphic Design", "Web Development", "Video / Film", "Writing / Copy", "Architecture", "Illustration", "Other"].map((f) => (
                  <label key={f} className="flex items-center gap-2 text-xs cursor-pointer p-2 rounded-lg border border-border/40 hover:bg-muted/30">
                    <input type="checkbox" className="accent-primary" checked={!!checkedFields[f]} onChange={() => toggleCheck(f)} />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Describe your best projects or case studies</label>
              <Textarea className={cn(inputClass, "resize-none")} rows={3} placeholder="e.g. Rebranded 5 startups, built e-commerce site for 10k+ users…" value={fields.projects ?? ""} onChange={(e) => set("projects", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Target audience / clients</label>
              <Input className={inputClass} placeholder="e.g. Startups, SMEs, creative agencies…" value={fields.audience ?? ""} onChange={(e) => set("audience", e.target.value)} />
            </div>
          </div>
        );

      case "service-showcase":
        return (
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>Service name</label>
              <Input className={inputClass} placeholder="e.g. 1-on-1 Business Coaching" value={fields.serviceName ?? ""} onChange={(e) => set("serviceName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Key benefit / headline</label>
              <Input className={inputClass} placeholder="e.g. Double your revenue in 90 days" value={fields.keyBenefit ?? ""} onChange={(e) => set("keyBenefit", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Price or pricing model (optional)</label>
              <Input className={inputClass} placeholder="e.g. $299/month, custom quote, free consultation…" value={fields.price ?? ""} onChange={(e) => set("price", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Who is this for?</label>
              <Input className={inputClass} placeholder="e.g. Solo founders, fitness professionals…" value={fields.targetAudience ?? ""} onChange={(e) => set("targetAudience", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>What should visitors do? (CTA)</label>
              <Input className={inputClass} placeholder="e.g. Book a free call, Get a quote…" value={fields.cta ?? ""} onChange={(e) => set("cta", e.target.value)} />
            </div>
          </div>
        );

      case "coming-soon":
        return (
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>Product / service name</label>
              <Input className={inputClass} placeholder="e.g. My New App, Summer Collection 2026…" value={fields.productName ?? ""} onChange={(e) => set("productName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Expected launch date</label>
              <Input className={inputClass} type="date" value={fields.launchDate ?? ""} onChange={(e) => set("launchDate", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Teaser / headline</label>
              <Input className={inputClass} placeholder="e.g. Something big is coming. Be the first to know." value={fields.teaser ?? ""} onChange={(e) => set("teaser", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Collect early signups?</label>
              <div className="flex gap-3 mt-1">
                {["Yes, collect emails", "No, just announce"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input type="radio" name="collectEmails" className="accent-primary" checked={fields.collectEmails === opt} onChange={() => set("collectEmails", opt)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "discount-promo":
        return (
          <div className={sectionClass}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Discount amount</label>
                <Input className={inputClass} placeholder="e.g. 30% off, $10 off, BOGO…" value={fields.discount ?? ""} onChange={(e) => set("discount", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Promo code (optional)</label>
                <Input className={inputClass} placeholder="e.g. SAVE30" value={fields.promoCode ?? ""} onChange={(e) => set("promoCode", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Offer expiry date</label>
              <Input className={inputClass} type="date" value={fields.expiry ?? ""} onChange={(e) => set("expiry", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Applicable products / services</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {MOCK_INVENTORY.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInventory(item.id)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all",
                      selectedInventory.includes(item.id)
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    <span className="text-xl">{item.image}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.price}</p>
                    </div>
                    {selectedInventory.includes(item.id) && (
                      <Check className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Urgency message (optional)</label>
              <Input className={inputClass} placeholder="e.g. Only 48 hours left! Limited stock." value={fields.urgency ?? ""} onChange={(e) => set("urgency", e.target.value)} />
            </div>
          </div>
        );

      case "about-brand":
        return (
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>Founder / team name</label>
              <Input className={inputClass} placeholder="e.g. Sarah & Team" value={fields.founderName ?? ""} onChange={(e) => set("founderName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Brand mission (one sentence)</label>
              <Input className={inputClass} placeholder="e.g. We help small businesses grow through smart design." value={fields.mission ?? ""} onChange={(e) => set("mission", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Key brand values</label>
              <Input className={inputClass} placeholder="e.g. Authenticity, Community, Sustainability" value={fields.values ?? ""} onChange={(e) => set("values", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Your story (brief)</label>
              <Textarea className={cn(inputClass, "resize-none")} rows={3} placeholder="How did the brand start? What problem do you solve?" value={fields.story ?? ""} onChange={(e) => set("story", e.target.value)} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const typeLabels: Record<string, string> = {
    "product-launch": "Product Launch",
    "lead-generation": "Lead Generation",
    "event-webinar": "Event / Webinar",
    "portfolio": "Portfolio",
    "service-showcase": "Service Showcase",
    "coming-soon": "Coming Soon",
    "discount-promo": "Discount / Promo",
    "about-brand": "About / Brand Story",
  };

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Tell us about your {typeLabels[landingPageType] ?? "landing page"}</span>
      </div>
      <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3">
        {renderForm()}
      </div>
      <Button
        onClick={handleConfirm}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-10 text-sm font-medium"
      >
        Confirm & Continue →
      </Button>
    </div>
  );
}

// ─── Landing Page Type Picker ─────────────────────────────────────────────────

function LandingPageTypePicker({
  selectedType,
  onSelect,
}: {
  selectedType: string | null;
  onSelect: (typeId: string) => void;
}) {
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Which type of landing page do you want?</span>
        <span className="ml-auto text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          Select one
        </span>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-2">
        {LANDING_PAGE_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={cn(
                "relative flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
                "hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border/60 bg-background hover:border-primary/40 hover:bg-muted/30"
              )}
              aria-label={`Select ${type.title}`}
              aria-pressed={isSelected}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-colors",
                  isSelected ? "bg-primary/20" : "bg-muted/50"
                )}
              >
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>

              <h3 className="font-semibold text-sm mb-0.5 text-foreground">{type.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                {type.description}
              </p>
              <p className="text-[10px] text-muted-foreground/60 italic">e.g. {type.example}</p>
            </button>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-xs text-muted-foreground text-center">
        You&apos;re building a single focused landing page — not a full website
      </p>
    </div>
  );
}

function LeadFormSelectionSection({
  leadForms,
  selectedLeadForm,
  onLeadFormChange,
  onAddNew,
  isVisible,
}: {
  leadForms: LeadFormOption[];
  selectedLeadForm: string | null;
  onLeadFormChange: (formId: string) => void;
  onAddNew: () => void;
  isVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isVisible ? "max-h-80 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
      )}
      aria-hidden={!isVisible}
    >
      <div className="mt-3 rounded-2xl border border-border/60 bg-background p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Select a Lead Form</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Lead Form</Label>
            <Select value={selectedLeadForm ?? ""} onValueChange={onLeadFormChange}>
              <SelectTrigger className="h-10 w-full rounded-xl">
                <SelectValue placeholder="Select an existing lead form" />
              </SelectTrigger>
              <SelectContent>
                {leadForms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" type="button" className="h-10 rounded-xl" onClick={onAddNew}>
            Add New
          </Button>
        </div>
      </div>
    </div>
  );
}

// Key for storing onboarding data
const ONBOARDING_DATA_KEY = "universell-onboarding-data";

export function AiChatStep({ businessName, onNext, onSkip, mode = "website", showBusinessModelStep = false }: AiChatStepProps) {
  const router = useRouter();
  const shouldAskBusinessModel = mode !== "landing-page" && showBusinessModelStep;
  
  // Start directly with chat (intro is now handled in welcome-step.tsx Phase 3)
  const [screenState, setScreenState] = useState<ScreenState>("chat");
  const [hasCheckedStorage, setHasCheckedStorage] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConversationStep>("inspiration");
  const [conversationData, setConversationData] = useState<ConversationData>({
    inspiration: "",
    color: "",
    shopType: null,
    style: "",
    landingPageType: null,
    lpDetails: {},
    selectedLeadFormId: null,
    isCreatingNewLeadForm: false,
    selectedPages: [],
    customPages: [],
    pageCustomizations: {},
    products: "",
  });
  
  // Color selection state
  const [colorSelection, setColorSelection] = useState<ColorSelectionState>({
    primaryColor: null,
    primaryShade: null,
    secondaryColor: null,
    secondaryShade: null,
    isAutoSuggested: false,
  });

  const [selectedLandingPageType, setSelectedLandingPageType] = useState<string | null>(null);
  const [selectedLeadForm, setSelectedLeadForm] = useState<string | null>(null);
  const [isCreatingNewLeadForm, setIsCreatingNewLeadForm] = useState(false);
  const [availableLeadForms, setAvailableLeadForms] = useState<LeadFormOption[]>(DEFAULT_LEAD_FORMS);
  
  const [isFocused, setIsFocused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerationOverlay, setShowGenerationOverlay] = useState(false);
  const [generatingMsgIndex, setGeneratingMsgIndex] = useState(0);
  const [generatingMsgVisible, setGeneratingMsgVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const GENERATING_MESSAGES = [
    "Analyzing your business and brand identity...",
    "Gathering product and audience insights...",
    "Designing a modern and conversion-focused layout...",
    "Generating compelling copy and visual structure...",
    "Optimizing sections for mobile responsiveness...",
    "Crafting a beautiful customer experience...",
    "Applying your selected style and branding...",
    "Preparing high-quality landing page assets...",
    "Fine-tuning colors, spacing, and typography...",
    "Almost ready — finalizing your landing page...",
  ];

  const GENERATING_TIPS = [
    "💡 High-performing landing pages usually include strong social proof.",
    "💡 Mobile-optimized pages can significantly improve conversions.",
    "💡 Clear call-to-actions help increase engagement.",
    "💡 Using consistent brand colors builds trust with visitors.",
    "💡 Short, benefit-focused headlines outperform generic ones.",
  ];

  useEffect(() => {
    if (mode !== "landing-page") return;

    const normalizeLeadForms = (value: unknown): LeadFormOption[] => {
      if (!Array.isArray(value)) return [];
      return value
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;
          const form = item as Record<string, unknown>;
          const rawId = form.id;
          const rawName = form.name ?? form.title ?? form.label;
          const id = typeof rawId === "string" && rawId.trim() ? rawId : `lf-${index + 1}`;
          const name = typeof rawName === "string" && rawName.trim() ? rawName : null;
          if (!name) return null;
          return { id, name };
        })
        .filter((form): form is LeadFormOption => form !== null);
    };

    for (const key of LEAD_FORMS_STORAGE_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const normalized = normalizeLeadForms(parsed);
        if (normalized.length > 0) {
          setAvailableLeadForms(normalized);
          return;
        }
      } catch {
        // ignore and fall back to defaults
      }
    }

    setAvailableLeadForms(DEFAULT_LEAD_FORMS);
  }, [mode]);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setGeneratingMsgVisible(false);
      setTimeout(() => {
        setGeneratingMsgIndex((i) => (i + 1) % GENERATING_MESSAGES.length);
        setGeneratingMsgVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating]);

  // End-chat landing page type picker modal state
  const [showEndChatTypePicker, setShowEndChatTypePicker] = useState(false);
  const [endChatSelectedType, setEndChatSelectedType] = useState<string | null>(null);

  // Brand Vault state
  const [showBrandVaultModal, setShowBrandVaultModal] = useState(false);
  const [brandVaultData, setBrandVaultData] = useState<BrandVaultData | null>(null);

  // Handle starting the AI chat
  const handleStartChat = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    setScreenState("chat");
  };

  // Handle skipping the chat
  const handleSkipChat = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    onSkip();
  };

  // Handle opening Brand Vault modal
  const handleOpenBrandVault = () => {
    setShowBrandVaultModal(true);
  };

  // Handle saving Brand Vault and proceeding
  const handleSaveBrandVault = (data: BrandVaultData) => {
    setBrandVaultData(data);
    localStorage.setItem(BRAND_VAULT_KEY, JSON.stringify(data));
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowBrandVaultModal(false);
    
    // Use vault data to skip to website creation
    // Store the vault data in onboarding data
    const onboardingData = {
      inspiration: data.inspirationLinks.filter(l => l.trim()).join(", "),
      color: data.primaryColor || "",
      secondaryColor: data.secondaryColor || "",
      accentColor: data.accentColor || "",
      brandTone: data.brandTone || "",
      industry: data.industry || "",
      targetAudience: data.targetAudience || "",
      fontPreference: data.fontPreference || "",
      hasLogo: !!data.logoPreview,
      logoPreview: data.logoPreview || "",
      fromBrandVault: true,
    };
    localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(onboardingData));
    
    // Proceed to next step (website creation)
    onSkip();
  };

  // Initial AI greeting - only when in chat mode
  useEffect(() => {
    if (screenState !== "chat") return;
    
    const timer = setTimeout(() => {
      setMessages([
        {
          id: "1",
          type: "ai",
          content:
            mode === "landing-page"
              ? "Do you already have a landing page you like, or a design reference we can use as inspiration? Share a link or describe the style."
              : `Do you already have a website, or is there a website you really like? Share a link or example so we can use it as inspiration for your design.`,
        },
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, [businessName, screenState, mode]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const addAiMessage = (content: string, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content,
      };
      setMessages((prev) => [...prev, newMessage]);
    }, delay);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    addUserMessage(userMessage);
    setCurrentInput("");

    // Process based on current step
    processStep(userMessage);
  };

  const handleQuickOption = (value: string) => {
    addUserMessage(value);
    processStep(value);
  };

  // Handle primary color selection from visual picker
  const handlePrimaryColorSelect = (color: ColorOption) => {
    setColorSelection((prev) => ({
      ...prev,
      primaryColor: color,
      primaryShade: { name: "Base", hex: color.hex, value: 50 }, // Default to base shade
    }));
  };

  // Handle shade selection
  const handleShadeSelect = (shade: ShadeOption) => {
    setColorSelection((prev) => ({
      ...prev,
      primaryShade: shade,
    }));
  };

  // Handle confirming primary color and moving to secondary
  const handleConfirmPrimaryColor = () => {
    if (!colorSelection.primaryColor) return;

    const colorName = colorSelection.primaryColor.name;
    const shadeName = colorSelection.primaryShade?.name || "Base";
    
    addUserMessage(`${colorName} (${shadeName} shade)`);
    setConversationData((prev) => ({ ...prev, color: `${colorName} - ${shadeName}` }));
    
    // AI response with personality
    const colorResponses: Record<string, string> = {
      "warm-orange": "Nice choice! This warm orange will give your site an energetic, welcoming feel. 🧡",
      "professional-blue": "Excellent! Professional blue conveys trust and reliability — perfect for business. 💙",
      "elegant-black": "Sophisticated choice! Black creates a bold, luxury aesthetic. 🖤",
      "fresh-green": "Love it! Fresh green brings a natural, vibrant energy to your site. 💚",
      "royal-purple": "Beautiful! Royal purple adds creativity and a touch of luxury. 💜",
      "rose-pink": "Gorgeous! Rose pink brings warmth and a modern, playful vibe. 💗",
    };
    
    addAiMessage(colorResponses[colorSelection.primaryColor.value] || "That'll look amazing! ✨");
    
    setTimeout(() => {
      addAiMessage("Would you like to choose a secondary color to complement your primary color? I have some recommendations based on your choice.", 2400);
      setCurrentStep("secondary-color");
    }, 100);
  };

  // Handle secondary color selection
  const handleSecondaryColorSelect = (color: ColorOption) => {
    setColorSelection((prev) => ({
      ...prev,
      secondaryColor: color,
      secondaryShade: { name: "Base", hex: color.hex, value: 50 }, // Default to base shade
      isAutoSuggested: true,
    }));
  };

  // Handle secondary shade selection
  const handleSecondaryShadeSelect = (shade: ShadeOption) => {
    setColorSelection((prev) => ({
      ...prev,
      secondaryShade: shade,
    }));
  };

  // Handle confirming secondary color and moving to shop type
  const handleConfirmSecondaryColor = () => {
    if (colorSelection.secondaryColor) {
      const colorName = colorSelection.secondaryColor.name;
      const shadeName = colorSelection.secondaryShade?.name || "Base";
      const shadeHex = colorSelection.secondaryShade?.hex || colorSelection.secondaryColor.hex;
      
      addUserMessage(`Secondary: ${colorName} (${shadeName} shade)`);
      
      // AI response acknowledging the great pairing
      const pairingResponses = [
        "Great choice — this secondary color pairs really well with your primary color and keeps the design balanced. ✨",
        "Perfect match! This combination will give your site a polished, professional look. 💫",
        "Love it! These colors complement each other beautifully and will make your content pop. 🎨",
      ];
      const randomResponse = pairingResponses[Math.floor(Math.random() * pairingResponses.length)];
      addAiMessage(randomResponse);
    } else {
      addUserMessage("Skip secondary color");
      addAiMessage("No problem! We'll work with your primary color. You can always add a secondary later.");
    }
    
    setTimeout(() => {
      addAiMessage("Great. Now, do you have a particular style in mind for the design?", 2400);
      setCurrentStep("style");
    }, 100);
  };

  // Handle shop type selection
  const handleShopTypeSelect = (type: ShopType) => {
    setConversationData((prev) => ({ ...prev, shopType: type }));
    
    // Get the option details for the message
    const option = SHOP_TYPE_OPTIONS.find((o) => o.id === type);
    if (option) {
      addUserMessage(option.title);
      
      // AI acknowledgment
      const typeResponses: Record<ShopType, string> = {
        products: "Got it — an online store focused on products! I'll tailor the layouts, pages, and features for e-commerce. 🛒",
        services: "Perfect — a service-based business! I'll focus on showcasing your offerings and making it easy for clients to reach you. 💼",
        booking: "Great — a booking-focused site! I'll include scheduling features and optimize for appointments. 📅",
        hybrid: "Awesome — products and services together! I'll create a versatile setup that handles both beautifully. ✨",
      };
      
      addAiMessage(typeResponses[type]);
      
      setTimeout(() => {
        if (shouldAskBusinessModel) {
          triggerWebsitePagesReviewFlow(
            "Review your site pages below. Click the edit icon to rename a page or tweak its description so it looks exactly the way you want."
          );
        } else {
          addAiMessage("Now, do you have a particular style in mind for the design?", 2400);
          setCurrentStep("style");
        }
      }, 100);
    }
  };

  // Handle toggling a page selection
  const handleTogglePage = (pageId: string) => {
    setConversationData((prev) => {
      const isSelected = prev.selectedPages.includes(pageId);
      return {
        ...prev,
        selectedPages: isSelected
          ? prev.selectedPages.filter((id) => id !== pageId)
          : [...prev.selectedPages, pageId],
      };
    });
  };

  // Handle adding a custom page
  const handleAddCustomPage = (pageName: string) => {
    setConversationData((prev) => {
      // Prevent duplicates
      if (prev.customPages.includes(pageName)) return prev;
      return {
        ...prev,
        customPages: [...prev.customPages, pageName],
      };
    });
  };

  // Handle removing a custom page
  const handleRemoveCustomPage = (pageName: string) => {
    setConversationData((prev) => ({
      ...prev,
      customPages: prev.customPages.filter((name) => name !== pageName),
    }));
  };

  // Handle editing a page (customizing name and prompt)
  const handleEditPage = (pageId: string, customization: PageCustomization) => {
    setConversationData((prev) => ({
      ...prev,
      pageCustomizations: {
        ...prev.pageCustomizations,
        [pageId]: customization,
      },
    }));
  };

  // Handle confirming pages selection - redirects to dashboard for Option 2
  const handleConfirmPages = () => {
    const totalPages = conversationData.selectedPages.length + conversationData.customPages.length;
    
    // Build a summary message with customized names
    const suggestedPages = getSuggestedPagesForShopType(conversationData.shopType);
    const selectedPageNames = suggestedPages
      .filter((p) => conversationData.selectedPages.includes(p.id))
      .map((p) => conversationData.pageCustomizations[p.id]?.name || p.title);
    const allPageNames = [...selectedPageNames, ...conversationData.customPages];
    
    if (allPageNames.length <= 4) {
      addUserMessage(allPageNames.join(", "));
    } else {
      addUserMessage(`${totalPages} pages selected`);
    }
    
    addAiMessage("Perfect — your website structure is ready! I'm setting everything up now... ✨");
    
    // Store all collected data for dashboard to use
    const onboardingData = {
      businessName,
      inspiration: conversationData.inspiration,
      primaryColor: colorSelection.primaryColor,
      primaryShade: colorSelection.primaryShade,
      secondaryColor: colorSelection.secondaryColor,
      secondaryShade: colorSelection.secondaryShade,
      shopType: conversationData.shopType,
      style: conversationData.style,
      selectedPages: conversationData.selectedPages,
      customPages: conversationData.customPages,
      pageCustomizations: conversationData.pageCustomizations,
      completedAt: new Date().toISOString(),
    };
    
    // Save to localStorage for dashboard to access
    localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(onboardingData));
    
    // Set a flag to show the welcome toast on dashboard
    localStorage.setItem("universell-show-welcome-toast", "true");
    
    // Redirect to dashboard website-pages after a brief delay
    setTimeout(() => {
      router.push("/website-pages");
    }, 1500);
  };

  // Handle skipping pages (use recommended) - redirects to dashboard for Option 2
  const handleSkipPages = () => {
    addUserMessage("Use recommended pages");
    addAiMessage("Great choice! I'll set up your site with the recommended page structure and redirect you to your dashboard... 👍");
    
    // Store all collected data for dashboard to use
    const onboardingData = {
      businessName,
      inspiration: conversationData.inspiration,
      primaryColor: colorSelection.primaryColor,
      primaryShade: colorSelection.primaryShade,
      secondaryColor: colorSelection.secondaryColor,
      secondaryShade: colorSelection.secondaryShade,
      shopType: conversationData.shopType,
      style: conversationData.style,
      selectedPages: conversationData.selectedPages,
      customPages: conversationData.customPages,
      pageCustomizations: conversationData.pageCustomizations,
      completedAt: new Date().toISOString(),
    };
    
    // Save to localStorage for dashboard to access
    localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(onboardingData));
    
    // Set a flag to show the welcome toast on dashboard
    localStorage.setItem("universell-show-welcome-toast", "true");
    
    // Redirect to dashboard website-pages after a brief delay
    setTimeout(() => {
      router.push("/website-pages");
    }, 1500);
  };

  // Handle custom secondary color input
  const handleCustomSecondaryColor = (value: string) => {
    // Try to parse hex color or use a placeholder
    let hexValue = "#6b7280"; // Default gray
    if (value.startsWith("#") && (value.length === 4 || value.length === 7)) {
      hexValue = value;
    }
    
    const customColor: ColorOption = {
      name: value,
      value: value.toLowerCase().replace(/\s+/g, "-"),
      hex: hexValue,
      description: "Custom color",
    };
    setColorSelection((prev) => ({
      ...prev,
      secondaryColor: customColor,
      secondaryShade: { name: "Base", hex: hexValue, value: 50 },
      isAutoSuggested: false,
    }));
  };

  // Handle skipping the current question
  const handleSkipQuestion = () => {
    if (isTyping || currentStep === "complete") return;

    // AI acknowledges the skip
    addAiMessage("No problem! We can come back to this later. Let's move on.", 800);

    // Move to next step after acknowledgment
    setTimeout(() => {
      const stepOrder: ConversationStep[] = mode === "landing-page"
        ? ["inspiration", "color", "color-shade", "secondary-color", "style", "landing-page-type", "lp-details", "complete"]
        : shouldAskBusinessModel
        ? ["inspiration", "color", "color-shade", "secondary-color", "style", "shop-type", "pages", "products", "complete"]
        : ["inspiration", "color", "color-shade", "secondary-color", "style", "pages", "products", "complete"];
      const currentIndex = stepOrder.indexOf(currentStep);
      let nextStep = stepOrder[currentIndex + 1] ?? "complete";

      // Skip shade and secondary if skipping color
      if (currentStep === "color") {
        nextStep = "secondary-color";
      } else if (currentStep === "color-shade" || currentStep === "secondary-color") {
        nextStep = "style";
      } else if (currentStep === "style" && shouldAskBusinessModel) {
        nextStep = "shop-type";
      }
      
      // Initialize pages if moving to pages step (website mode only)
      if (nextStep === "pages") {
        const suggestedPages = getSuggestedPagesForShopType(conversationData.shopType);
        setConversationData((prev) => ({
          ...prev,
          selectedPages: suggestedPages.map((p) => p.id),
        }));
      }

      if (nextStep === "complete") {
        const doneMsg = mode === "landing-page"
          ? `I have everything I need! Click 'Generate My Landing Page' when you're ready.`
          : `Great! I have enough information to create an amazing website for ${businessName}. Click 'Generate My Website' when you're ready!`;
        addAiMessage(doneMsg, 1400);
        setCurrentStep("complete");
      } else {
        // Ask the next question
        const nextQuestions: Record<ConversationStep, string> = {
          inspiration: "Do you have a website you admire, or one that inspires the look and feel you want? Share a link or describe it.",
          color: "What primary color would you like for your website?",
          "color-shade": "Fine-tune your shade preference.",
          "secondary-color": "Would you like a secondary color?",
          "shop-type": "What type of shop are you creating?",
          style: "Do you have a particular style in mind for the design?",
          "project-type": "",
          "landing-page-type": "Which type of landing page would you like to create?",
          "lp-details": "Tell us a bit more about your landing page.",
          pages: "I've put together a set of pages that usually work best for a business like yours. You can review, customize, or remove anything.",
          products: "Tell me about your products or services. What do you offer?",
          complete: "",
        };
        addAiMessage(nextQuestions[nextStep], 1400);
        setCurrentStep(nextStep);
      }
    }, 1000);
  };

  const triggerWebsitePagesReviewFlow = (message?: string) => {
    const suggestedPages = getSuggestedPagesForShopType(conversationData.shopType);
    setConversationData((prev) => ({
      ...prev,
      selectedPages: suggestedPages.map((p) => p.id),
    }));

    addAiMessage(
      message ||
        "Review your site pages below. Click the edit icon to rename a page or tweak its description so it looks exactly the way you want.",
      2400
    );
    setCurrentStep("pages");
  };

  // Handle ending the chat early - redirects to dashboard for Option 2
  const handleEndChat = () => {
    if (isTyping) return;

    if (mode === "landing-page") {
      if (!conversationData.landingPageType) {
        setShowEndChatTypePicker(true);
        return;
      }

      if (conversationData.landingPageType === "lead-generation") {
        if (selectedLeadForm || isCreatingNewLeadForm || currentStep === "complete") {
          return;
        }
        addAiMessage("Please select a lead form or click Add New to continue.", 500);
        return;
      }

      if (currentStep !== "lp-details" && currentStep !== "complete") {
        triggerLandingPageFollowUpFlow(conversationData.landingPageType, false);
      }
      return;
    }

    if (currentStep !== "pages" && currentStep !== "products" && currentStep !== "complete") {
      triggerWebsitePagesReviewFlow(
        "Review your site pages below. Click the edit icon to rename a page or tweak its description so it looks exactly the way you want."
      );
    }
  };

  // Save data and redirect after end-chat flow completes
  const redirectAfterEndChat = (landingPageType?: string) => {
    if (mode === "landing-page") {
      // Save collected data for editor to use
      const landingPageData = {
        businessName,
        inspiration: conversationData.inspiration,
        primaryColor: colorSelection.primaryColor,
        primaryShade: colorSelection.primaryShade,
        secondaryColor: colorSelection.secondaryColor,
        secondaryShade: colorSelection.secondaryShade,
        style: conversationData.style,
        landingPageType: landingPageType ?? conversationData.landingPageType,
        selectedLandingPageType,
        selectedLeadFormId: selectedLeadForm,
        isCreatingNewLeadForm,
        lpDetails: {
          ...conversationData.lpDetails,
          selectedLeadFormId: selectedLeadForm ?? "",
          isCreatingNewLeadForm: String(isCreatingNewLeadForm),
        },
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem("universell-landing-page-draft", JSON.stringify(landingPageData));
      router.push("/landing-pages/edit/new");
      return;
    }

    // Brief acknowledgment then redirect to dashboard
    addAiMessage("Perfect! I'll use what we've discussed to create your website. Redirecting you to your dashboard... ✨", 800);
    
    // Store all collected data for dashboard to use
    const onboardingData = {
      businessName,
      inspiration: conversationData.inspiration,
      primaryColor: colorSelection.primaryColor,
      primaryShade: colorSelection.primaryShade,
      secondaryColor: colorSelection.secondaryColor,
      secondaryShade: colorSelection.secondaryShade,
      shopType: conversationData.shopType,
      style: conversationData.style,
      selectedPages: conversationData.selectedPages,
      customPages: conversationData.customPages,
      pageCustomizations: conversationData.pageCustomizations,
      completedAt: new Date().toISOString(),
    };
    
    // Save to localStorage for dashboard to access
    localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(onboardingData));
    
    // Set a flag to show the welcome toast on dashboard
    localStorage.setItem("universell-show-welcome-toast", "true");
    
    // Redirect to dashboard website-pages after a brief delay
    setTimeout(() => {
      router.push("/website-pages");
    }, 1500);
  };

  const triggerLandingPageFollowUpFlow = (typeId: string, shouldAddUserMessage = true) => {
    const type = LANDING_PAGE_TYPES.find((t) => t.id === typeId);
    if (!type) return;

    const normalizedType = normalizeLandingPageType(typeId);
    setSelectedLandingPageType(normalizedType);

    if (typeId === "lead-generation") {
      setSelectedLeadForm(null);
      setIsCreatingNewLeadForm(false);
      setConversationData((prev) => ({
        ...prev,
        landingPageType: typeId,
        selectedLeadFormId: null,
        isCreatingNewLeadForm: false,
      }));

      if (shouldAddUserMessage) {
        addUserMessage(type.title);
      }
      addAiMessage("Great pick. Select an existing lead form or click Add New to create one.");
      setTimeout(() => setCurrentStep("landing-page-type"), 900);
      return;
    }

    setSelectedLeadForm(null);
    setIsCreatingNewLeadForm(false);
    setConversationData((prev) => ({
      ...prev,
      landingPageType: typeId,
      selectedLeadFormId: null,
      isCreatingNewLeadForm: false,
    }));
    if (shouldAddUserMessage) {
      addUserMessage(type.title);
    }

    const typeResponses: Record<string, string> = {
      "product-launch": "Great choice! Now let me ask a few quick questions about the product. 🚀",
      "event-webinar": "Awesome! Tell me a bit about your event. 🎤",
      "portfolio": "Love it! Let's gather some details about your work. 💼",
      "service-showcase": "Nice! A few quick questions about your service. ⚡",
      "coming-soon": "Smart move! Let's build the anticipation. 🌟",
      "discount-promo": "Excellent! Let's set up your promo details. 🎉",
      "about-brand": "Wonderful! Tell me a little about your brand story. 💫",
    };

    addAiMessage(typeResponses[typeId] || "Great choice! Let's gather a few details. ✨");
    setTimeout(() => setCurrentStep("lp-details"), 900);
  };

  const handleLeadFormSelect = (formId: string) => {
    const selectedForm = availableLeadForms.find((form) => form.id === formId);
    setSelectedLeadForm(formId);
    setIsCreatingNewLeadForm(false);

    setConversationData((prev) => ({
      ...prev,
      landingPageType: "lead-generation",
      selectedLeadFormId: formId,
      isCreatingNewLeadForm: false,
      lpDetails: {
        ...prev.lpDetails,
        selectedLeadFormId: formId,
        selectedLeadFormName: selectedForm?.name ?? "",
        isCreatingNewLeadForm: "false",
      },
    }));

    if (selectedForm) {
      addUserMessage(`Lead Form: ${selectedForm.name}`);
      addAiMessage(`Perfect — I'll use ${selectedForm.name} for this landing page. 📩`, 500);
      setTimeout(() => {
        addAiMessage("Click 'Generate My Landing Page' when you're ready!", 2200);
        setCurrentStep("complete");
      }, 100);
    }
  };

  const handleCreateNewLeadForm = () => {
    setSelectedLeadForm(null);
    setIsCreatingNewLeadForm(true);
    setConversationData((prev) => ({
      ...prev,
      landingPageType: "lead-generation",
      selectedLeadFormId: null,
      isCreatingNewLeadForm: true,
    }));
  };

  // Handle landing page type selection (single select, landing-page mode only)
  const handleLandingPageTypeSelect = (typeId: string) => {
    const normalizedType = normalizeLandingPageType(typeId);
    setSelectedLandingPageType(normalizedType);

    if (typeId === "lead-generation") {
      setConversationData((prev) => ({
        ...prev,
        landingPageType: typeId,
        selectedLeadFormId: null,
        isCreatingNewLeadForm: false,
      }));
      setSelectedLeadForm(null);
      setIsCreatingNewLeadForm(false);
      return;
    }

    triggerLandingPageFollowUpFlow(typeId);
  };

  // Handle landing page details confirmation
  const handleLandingPageDetailsConfirm = (summary: string, details: Record<string, string>) => {
    setConversationData((prev) => ({
      ...prev,
      lpDetails: {
        ...details,
        selectedLeadFormId: selectedLeadForm ?? "",
        isCreatingNewLeadForm: String(isCreatingNewLeadForm),
      },
      selectedLeadFormId: selectedLeadForm,
      isCreatingNewLeadForm,
    }));
    addUserMessage(summary);
    addAiMessage("Perfect — I have everything I need to generate your landing page! 🚀");
    setTimeout(() => {
      addAiMessage("Click 'Generate My Landing Page' when you're ready!", 2400);
      setCurrentStep("complete");
    }, 100);
  };

  const processStep = (userResponse: string) => {
    switch (currentStep) {
      case "inspiration":
        setConversationData((prev) => ({ ...prev, inspiration: userResponse }));
        addAiMessage("Great choice! I love that direction. 🎨");
        setTimeout(() => {
          addAiMessage("Now let's pick a color palette! Select a primary color that represents your brand, or type your own.", 2400);
          setCurrentStep("color");
        }, 100);
        break;

      case "color":
        // This handles text input for color (fallback)
        setConversationData((prev) => ({ ...prev, color: userResponse }));
        addAiMessage("That'll look amazing! ✨");
        setTimeout(() => {
          addAiMessage("Would you like to choose a secondary color to complement your primary? I can suggest some options.", 2400);
          setCurrentStep("secondary-color");
        }, 100);
        break;

      case "secondary-color":
        // Handle text input for secondary color
        addAiMessage("Great choice! That combination will work beautifully together. ✨");
        setTimeout(() => {
          addAiMessage("Do you have a particular style in mind for the design?", 2400);
          setCurrentStep("style");
        }, 100);
        break;

      case "style":
        setConversationData((prev) => ({ ...prev, style: userResponse }));
        addAiMessage("Excellent taste! I can already picture it. 🌟");
        setTimeout(() => {
          if (mode === "landing-page") {
            if (conversationData.landingPageType === "multi-page-website") {
              const suggestedPages = getSuggestedPagesForShopType(conversationData.shopType);
              setConversationData((prev) => ({
                ...prev,
                selectedPages: suggestedPages.map((p) => p.id),
              }));
              addAiMessage("Here are the recommended pages for your website. Review, customise, or remove anything you like.", 2400);
              setTimeout(() => setCurrentStep("pages"), 100);
            } else {
              addAiMessage("Almost done! Which type of landing page would you like to create?", 2400);
              setTimeout(() => setCurrentStep("landing-page-type"), 100);
            }
          } else {
            if (shouldAskBusinessModel) {
              addAiMessage("Next, let's understand your business model. What type of shop are you creating?", 2400);
              setCurrentStep("shop-type");
            } else {
              triggerWebsitePagesReviewFlow(
                "I've put together a set of pages that usually work best for a business like yours. You can review, customize, or remove anything."
              );
            }
          }
        }, 100);
        break;

      case "landing-page-type":
        // Text-input fallback — the component handles direct selection
        setConversationData((prev) => ({ ...prev, landingPageType: userResponse }));
        addAiMessage("Great choice! Let me ask a few quick questions. ✨");
        setTimeout(() => setCurrentStep("lp-details"), 900);
        break;

      case "lp-details":
        // Text-input fallback — the component handles direct submission
        addAiMessage("Got it! I have everything I need. Click 'Generate My Landing Page' when you're ready! 🚀");
        setTimeout(() => setCurrentStep("complete"), 100);
        break;

      case "pages":
        // This handles any text input for pages (fallback)
        addAiMessage("Got it! I've noted your preferences.");
        setTimeout(() => {
          addAiMessage("Last question: Tell me about your products or services. What do you offer?", 2400);
          setCurrentStep("products");
        }, 100);
        break;

      case "products":
        setConversationData((prev) => ({ ...prev, products: userResponse }));
        addAiMessage("Wonderful! I have everything I need. 🚀");
        setTimeout(() => {
          addAiMessage(`I'm ready to create an amazing website for ${businessName}. Click 'Generate My Website' to see the magic happen!`, 2400);
          setCurrentStep("complete");
        }, 100);
        break;

      default:
        break;
    }
  };

  const styleOptions = [
    { label: "Modern & Minimal", value: "modern-minimal", icon: Layout },
    { label: "Bold & Colorful", value: "bold-colorful", icon: Palette },
    { label: "Elegant & Professional", value: "elegant-professional", icon: Briefcase },
    { label: "Playful & Creative", value: "playful-creative", icon: Wand2 },
  ];

  const projectTypeOptions = [
    { label: "Multi-page website", value: "multi-page website", icon: Globe },
    { label: "Single landing page", value: "single landing page", icon: FileText },
  ];

  const colorOptions = [
    { label: "Warm Orange", value: "warm orange" },
    { label: "Professional Blue", value: "professional blue" },
    { label: "Elegant Black", value: "elegant black" },
    { label: "Fresh Green", value: "fresh green" },
  ];

  // Show loading state while checking storage
  if (!hasCheckedStorage) {
    return (
      <div className="relative min-h-[650px] lg:min-h-[750px] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  // Show intro screen for first-time users
  if (screenState === "intro") {
    return (
      <>
        <IntroScreen
          businessName={businessName}
          onStartChat={handleStartChat}
          onSkipChat={handleSkipChat}
          onOpenBrandVault={handleOpenBrandVault}
        />
        <BrandVaultModal
          isOpen={showBrandVaultModal}
          onClose={() => setShowBrandVaultModal(false)}
          onSave={handleSaveBrandVault}
          businessName={businessName}
        />
      </>
    );
  }

  // Show chat interface
  return (
    <div className="relative min-h-[650px] lg:min-h-[750px] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      
      {/* Animated gradient orbs - More colorful */}
      <div className="absolute top-10 left-[5%] w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 right-[5%] w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-400/5 rounded-full blur-3xl" />
      <div className="absolute top-20 right-[15%] w-48 h-48 bg-amber-400/10 rounded-full blur-3xl animate-float" />

      {/* Floating Preview Cards - Left Side */}
      <FloatingPreviewCard className="hidden xl:block w-52 h-36 top-12 left-[3%] animate-float rotate-[-5deg] glass border border-white/20">
        <HeroPreview color="primary" />
      </FloatingPreviewCard>

      <FloatingPreviewCard className="hidden xl:block w-40 h-32 top-52 left-[6%] animate-float-delayed rotate-[3deg] glass border border-white/20">
        <ProductGridPreview />
      </FloatingPreviewCard>

      <FloatingPreviewCard className="hidden xl:block w-44 h-28 bottom-24 left-[4%] animate-float-slow rotate-[-3deg] glass border border-white/20">
        <ColorPalettePreview />
      </FloatingPreviewCard>

      {/* Floating Preview Cards - Right Side */}
      <FloatingPreviewCard className="hidden xl:block w-48 h-32 top-16 right-[4%] animate-float-slow rotate-[4deg] glass border border-white/20">
        <HeroPreview color="blue" />
      </FloatingPreviewCard>

      <FloatingPreviewCard className="hidden xl:block w-44 h-28 top-56 right-[6%] animate-float rotate-[-4deg] glass border border-white/20">
        <StylePreviewCard />
      </FloatingPreviewCard>

      <FloatingPreviewCard className="hidden xl:block w-40 h-32 bottom-28 right-[5%] animate-float-delayed rotate-[5deg] glass border border-white/20">
        <ProductGridPreview />
      </FloatingPreviewCard>

      {/* Floating indicator pills */}
      <div className="hidden lg:flex absolute top-28 left-[18%] glass rounded-full px-4 py-2 shadow-lg animate-float-delayed items-center gap-2">
        <Layout className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium">Custom Pages</span>
      </div>

      <div className="hidden lg:flex absolute bottom-20 right-[18%] glass rounded-full px-4 py-2 shadow-lg animate-float items-center gap-2">
        <Image className="w-4 h-4 text-green-500" />
        <span className="text-xs font-medium">AI Images</span>
      </div>

      <div className="hidden lg:flex absolute top-1/2 left-[12%] glass rounded-full px-4 py-2 shadow-lg animate-float-slow items-center gap-2">
        <Package className="w-4 h-4 text-violet-500" />
        <span className="text-xs font-medium">E-commerce</span>
      </div>

      {/* Center Chat Card */}
      <div className="relative z-10 flex items-center justify-center min-h-[650px] lg:min-h-[750px] px-4 py-6">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Universell AI</h2>
                  <p className="text-xs text-muted-foreground">Website Design Assistant</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="h-[340px] overflow-y-auto p-6 space-y-4 custom-scrollbar"
            >
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Options */}
            {!isTyping && messages.length > 0 && (
              <div className="px-6 pb-4">
                {currentStep === "style" && (
                  <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
                    {styleOptions.map((option) => (
                      <QuickOption
                        key={option.value}
                        label={option.label}
                        icon={option.icon}
                        onClick={() => handleQuickOption(option.value)}
                      />
                    ))}
                  </div>
                )}

                {/* Landing Page Type Picker — single select, landing-page mode only */}
                {currentStep === "landing-page-type" && mode === "landing-page" && (
                  <div className="mb-4">
                    <LandingPageTypePicker
                      selectedType={conversationData.landingPageType}
                      onSelect={handleLandingPageTypeSelect}
                    />
                    <LeadFormSelectionSection
                      leadForms={availableLeadForms}
                      selectedLeadForm={selectedLeadForm}
                      onLeadFormChange={handleLeadFormSelect}
                      onAddNew={handleCreateNewLeadForm}
                      isVisible={
                        selectedLandingPageType === "lead_generation" && !isCreatingNewLeadForm
                      }
                    />

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        selectedLandingPageType === "lead_generation" && isCreatingNewLeadForm
                          ? "max-h-[800px] opacity-100 translate-y-0 mt-3"
                          : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="rounded-2xl border border-border/60 bg-background p-4">
                        <LandingPageDetailsForm
                          landingPageType="lead-generation"
                          onConfirm={handleLandingPageDetailsConfirm}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Landing Page Details Form — shown after type selection */}
                {currentStep === "lp-details" &&
                  mode === "landing-page" &&
                  conversationData.landingPageType &&
                  conversationData.landingPageType !== "lead-generation" && (
                    <div className="mb-4">
                      <LandingPageDetailsForm
                        landingPageType={conversationData.landingPageType}
                        onConfirm={handleLandingPageDetailsConfirm}
                      />
                    </div>
                  )}

                {/* Suggested Pages Picker */}
                {currentStep === "pages" && (
                  <div className="mb-4">
                    <SuggestedPagesPicker
                      shopType={conversationData.shopType}
                      selectedPages={conversationData.selectedPages}
                      customPages={conversationData.customPages}
                      pageCustomizations={conversationData.pageCustomizations}
                      onTogglePage={handleTogglePage}
                      onAddCustomPage={handleAddCustomPage}
                      onRemoveCustomPage={handleRemoveCustomPage}
                      onEditPage={handleEditPage}
                      onConfirm={handleConfirmPages}
                      onSkip={handleSkipPages}
                    />
                  </div>
                )}

                {/* Visual Primary Color Picker */}
                {currentStep === "color" && (
                  <div className="mb-4">
                    <PrimaryColorPicker
                      selectedColor={colorSelection.primaryColor}
                      selectedShade={colorSelection.primaryShade}
                      onColorSelect={handlePrimaryColorSelect}
                      onShadeSelect={handleShadeSelect}
                      onConfirm={handleConfirmPrimaryColor}
                    />
                  </div>
                )}

                {/* Secondary Color Picker */}
                {currentStep === "secondary-color" && colorSelection.primaryColor && (
                  <div className="mb-4">
                    <SecondaryColorPicker
                      primaryColor={colorSelection.primaryColor}
                      selectedSecondary={colorSelection.secondaryColor}
                      selectedSecondaryShade={colorSelection.secondaryShade}
                      onSecondarySelect={handleSecondaryColorSelect}
                      onSecondaryShadeSelect={handleSecondaryShadeSelect}
                      onCustomInput={handleCustomSecondaryColor}
                      onConfirm={handleConfirmSecondaryColor}
                    />
                    {/* Skip option when no color selected yet */}
                    {!colorSelection.secondaryColor && (
                      <div className="flex justify-center mt-4 pt-3 border-t border-border/30">
                        <button
                          onClick={handleConfirmSecondaryColor}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          Skip secondary color for now
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Shop Type Picker */}
                {currentStep === "shop-type" && mode !== "landing-page" && (
                  <div className="mb-4">
                    <ShopTypePicker
                      selectedType={conversationData.shopType}
                      onSelect={handleShopTypeSelect}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Input Area */}
            {currentStep !== "complete" ? (
              <div className="px-6 pb-6">
                <div
                  className={cn(
                    "relative rounded-2xl border-2 transition-all duration-300",
                    isFocused
                      ? "border-primary shadow-lg shadow-primary/10 bg-background"
                      : "border-border/60 bg-muted/30 hover:border-primary/40"
                  )}
                >
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={
                      currentStep === "inspiration"
                        ? "Describe your ideal website or share a reference..."
                        : currentStep === "color"
                        ? "Or type a custom color (e.g., 'teal', 'navy blue')..."
                        : currentStep === "secondary-color"
                        ? "Or type a custom secondary color..."
                        : currentStep === "style"
                        ? "Type a style or select from options..."
                        : currentStep === "landing-page-type"
                        ? "Or describe the page type you have in mind..."
                        : currentStep === "pages"
                        ? "Add a note about your pages..."
                        : "Tell me about your products or services..."
                    }
                    disabled={isTyping}
                    className="h-12 text-sm border-0 bg-transparent rounded-2xl px-4 pr-12 focus-visible:ring-0 placeholder:text-muted-foreground/60"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && currentInput.trim() && !isTyping) {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || isTyping}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg transition-all duration-300",
                      currentInput.trim() && !isTyping
                        ? "bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Chat Control Actions */}
                <div className="flex items-center justify-center gap-4 mt-3">
                  {/* Hide Skip for mandatory landing-page-type step */}
                  {!(mode === "landing-page" && (currentStep === "landing-page-type" || currentStep === "lp-details")) && (
                    <>
                      <button
                        onClick={handleSkipQuestion}
                        disabled={isTyping}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground rounded-lg transition-all duration-200",
                          "hover:text-foreground hover:bg-muted/50",
                          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
                          isTyping && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                        Skip question
                      </button>
                      <div className="w-px h-4 bg-border" />
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleEndChat();
                    }}
                    disabled={isTyping}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground rounded-lg transition-all duration-200",
                      "hover:text-foreground hover:bg-muted/50",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
                      isTyping && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    End chat & continue
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 pb-6 space-y-3 animate-fade-in-up">
                <Button
                  disabled={isGenerating}
                  onClick={() => {
                    if (mode === "landing-page") {
                      const landingPageData = {
                        businessName,
                        inspiration: conversationData.inspiration,
                        primaryColor: colorSelection.primaryColor,
                        primaryShade: colorSelection.primaryShade,
                        secondaryColor: colorSelection.secondaryColor,
                        secondaryShade: colorSelection.secondaryShade,
                        style: conversationData.style,
                        landingPageType: conversationData.landingPageType,
                        selectedLandingPageType,
                        selectedLeadFormId: selectedLeadForm,
                        isCreatingNewLeadForm,
                        lpDetails: {
                          ...conversationData.lpDetails,
                          selectedLeadFormId: selectedLeadForm ?? "",
                          isCreatingNewLeadForm: String(isCreatingNewLeadForm),
                        },
                        completedAt: new Date().toISOString(),
                      };
                      localStorage.setItem("universell-landing-page-draft", JSON.stringify(landingPageData));
                      setIsGenerating(true);
                      setShowGenerationOverlay(true);
                    } else {
                      onNext();
                    }
                  }}
                  size="lg"
                  className={cn(
                    "w-full h-14 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300",
                    isGenerating
                      ? "opacity-80 cursor-not-allowed"
                      : "hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02]"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {mode === "landing-page" ? "Generating Your Landing Page..." : "Generating Your Website..."}
                    </>
                  ) : (
                    <>
                      {mode === "landing-page" ? "Generate My Landing Page" : "Generate My Website"}
                      <Sparkles className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Skip Option - only show when chat is active */}
            {currentStep !== "complete" && (
              <div className="px-6 pb-4 text-center">
                <button
                  onClick={() => {
                    if (mode === "landing-page") {
                      router.push("/landing-pages/templates");
                    } else {
                      onSkip();
                    }
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Set up without AI
                  <ArrowRight className="w-3 h-3 inline ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {(mode === "landing-page"
              ? ["inspiration", "color", "style", "landing-page-type", "lp-details"]
              : shouldAskBusinessModel
              ? ["inspiration", "color", "style", "shop-type", "pages", "products"]
              : ["inspiration", "color", "style", "pages", "products"]
            ).map((step, index) => {
              const stepOrder = mode === "landing-page"
                ? ["inspiration", "color", "style", "landing-page-type", "lp-details"]
                : shouldAskBusinessModel
                ? ["inspiration", "color", "style", "shop-type", "pages", "products"]
                : ["inspiration", "color", "style", "pages", "products"];
              const currentStepMapped =
                currentStep === "secondary-color" || currentStep === "color-shade" ? "color" : currentStep;
              const currentIndex = stepOrder.indexOf(currentStepMapped);
              const isComplete = index < currentIndex || currentStep === "complete";
              const isCurrent = step === currentStepMapped;

              return (
                <div
                  key={step}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    isComplete
                      ? "bg-primary"
                      : isCurrent
                      ? "bg-primary/60 scale-125"
                      : "bg-muted-foreground/30"
                  )}
                />
              );
            })}
          </div>

          {/* Trust Text */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              <Globe className="w-4 h-4 inline mr-1.5 text-primary/60" />
              {mode === "landing-page"
                ? "Universell AI - Gorgeous designs that compel buyers trust"
                : shouldAskBusinessModel
                ? "Universell AI - The powerhouse behind refined E-commerce brands"
                : "Universell AI - Powerful websites built to out perform your competition!"}
            </p>
          </div>
        </div>
      </div>

      {/* AI Generation Loading Overlay — full-screen staged experience */}
      {showGenerationOverlay && (
        <AIGenerationLoadingOverlay
          onComplete={() => router.push("/landing-pages/edit/new")}
        />
      )}

      {/* End Chat — Landing Page Type Picker Modal */}
      {showEndChatTypePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-2xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">What type of landing page?</h2>
                  <p className="text-sm text-muted-foreground">Choose the type of landing page you want to create</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-3">
              {LANDING_PAGE_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = endChatSelectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setEndChatSelectedType(type.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground">{type.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{type.description}</div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary shrink-0 mt-1 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-6 pt-2 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEndChatTypePicker(false);
                  setEndChatSelectedType(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!endChatSelectedType}
                onClick={() => {
                  setShowEndChatTypePicker(false);
                  if (endChatSelectedType) {
                    triggerLandingPageFollowUpFlow(endChatSelectedType);
                  }
                  setEndChatSelectedType(null);
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
