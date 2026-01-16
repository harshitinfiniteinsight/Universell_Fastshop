"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AiChatStepProps {
  businessName: string;
  onNext: () => void;
  onSkip: () => void;
}

type ScreenState = "intro" | "chat";
type MessageType = "ai" | "user";
type ConversationStep = "inspiration" | "color" | "color-shade" | "secondary-color" | "shop-type" | "style" | "pages" | "products" | "complete";

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

// Changed key to reset for all users - increment version to reset again
const INTRO_SEEN_KEY = "universell-ai-intro-v2";

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
  selectedPages: string[];
  customPages: string[];
  pageCustomizations: Record<string, PageCustomization>;
  products: string;
}

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
const SUGGESTED_PAGES: SuggestedPage[] = [
  {
    id: "homepage",
    title: "Homepage",
    description: "First impression and key highlights",
    prompt: "Create a welcoming homepage highlighting our brand, featured products, and customer trust. Include a hero section, featured items, and call-to-action buttons.",
    icon: Home,
    showFor: ["all"],
  },
  {
    id: "about",
    title: "About Us",
    description: "Your story, mission, and brand",
    prompt: "Design an About Us page that tells our brand story, showcases our mission and values, and introduces our team. Make it personal and authentic.",
    icon: Users,
    showFor: ["all"],
  },
  {
    id: "shop",
    title: "Shop / Products",
    description: "Browse and purchase products",
    prompt: "Create a product catalog page with filters, search functionality, and product cards. Include categories, pricing, and add-to-cart buttons.",
    icon: ShoppingBag,
    showFor: ["products", "hybrid"],
  },
  {
    id: "services",
    title: "Services",
    description: "Showcase your service offerings",
    prompt: "Design a services page that showcases our offerings with descriptions, pricing tiers, and benefits. Include testimonials and a contact form.",
    icon: Briefcase,
    showFor: ["services", "hybrid"],
  },
  {
    id: "bookings",
    title: "Bookings",
    description: "Schedule appointments or reservations",
    prompt: "Create a booking page with a calendar view, available time slots, and easy reservation flow. Include service selection and confirmation details.",
    icon: CalendarDays,
    showFor: ["booking"],
  },
  {
    id: "contact",
    title: "Contact Us",
    description: "Email, phone, location, and form",
    prompt: "Design a contact page with a contact form, business hours, location map, and multiple ways to reach us (email, phone, social media).",
    icon: Phone,
    showFor: ["all"],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    description: "Legal information for customers",
    prompt: "Generate a Terms & Conditions page covering user agreements, purchase terms, returns policy, and legal disclaimers for our business.",
    icon: FileText,
    showFor: ["all"],
    isLegal: true,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "Data usage and compliance",
    prompt: "Create a Privacy Policy page explaining how we collect, use, and protect customer data. Include cookie policy and GDPR compliance information.",
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
      {/* Section Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">Choose your secondary color</h3>
        <p className="text-sm text-muted-foreground">
          This color will complement your primary and add depth to your design.
        </p>
      </div>

      {/* Recommended badge */}
      <div className="flex items-center justify-center gap-2">
        <Star className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium text-amber-600">Recommended for {primaryColor.name}</span>
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
      <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Want a different color?</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="rounded-lg"
          >
            <Palette className="w-4 h-4 mr-2" />
            {showColorPicker ? "Close picker" : "Pick a custom color"}
          </Button>
        </div>
        
        {showColorPicker && (
          <div className="mt-4 animate-fade-in-up">
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
            <Label htmlFor="page-prompt">Prompt</Label>
            <Textarea
              id="page-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how AI should generate this page..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This prompt helps AI generate content for this page.
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
      <div className="flex items-center gap-2 mb-2">
        <Layout className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Review your site pages</span>
      </div>

      {/* Pages checklist */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
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
            <button
              onClick={() => onRemoveCustomPage(pageName)}
              className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-destructive/10 flex items-center justify-center transition-colors"
              aria-label={`Remove ${pageName}`}
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}

        {/* Add custom page input */}
        <CustomPageInput onAdd={onAddCustomPage} />
      </div>

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
            onClick={onConfirm}
            disabled={totalSelected === 0}
            className="flex-1 rounded-xl shadow-md"
          >
            Confirm Pages & Continue
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <button
            onClick={onSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
          >
            Skip (use recommended)
          </button>
        </div>
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
  return (
    <div className="animate-fade-in-up space-y-4">
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

// Intro Screen Component - First-time entry experience
function IntroScreen({
  businessName,
  onStartChat,
  onSkipChat,
}: {
  businessName: string;
  onStartChat: () => void;
  onSkipChat: () => void;
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
                Tell us a little about your business and what you&apos;d like to create. 
                Universell AI will guide you step by step and design a website tailored just for you.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Personalized Design</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Smart Suggestions</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Ready in Minutes</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              {/* Primary CTA */}
              <Button
                onClick={onStartChat}
                size="lg"
                className="w-full h-14 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start with AI Chat
              </Button>

              {/* Secondary CTA */}
              <button
                onClick={onSkipChat}
                className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 group"
              >
                Create website without chat
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

// Key for storing onboarding data
const ONBOARDING_DATA_KEY = "universell-onboarding-data";

export function AiChatStep({ businessName, onNext, onSkip }: AiChatStepProps) {
  const router = useRouter();
  
  // Start with intro, then check localStorage on mount
  const [screenState, setScreenState] = useState<ScreenState>("intro");
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Check localStorage on client side only
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_SEEN_KEY);
    if (hasSeenIntro === "true") {
      setScreenState("chat");
    }
    setHasCheckedStorage(true);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConversationStep>("inspiration");
  const [conversationData, setConversationData] = useState<ConversationData>({
    inspiration: "",
    color: "",
    shopType: null,
    style: "",
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
  
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  // Initial AI greeting - only when in chat mode
  useEffect(() => {
    if (screenState !== "chat") return;
    
    const timer = setTimeout(() => {
      setMessages([
        {
          id: "1",
          type: "ai",
          content: `Hi! I'm excited to help create a stunning website for ${businessName}. To get started, can you share a sample website you like or describe the kind of website you want?`,
        },
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, [businessName, screenState]);

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
      addAiMessage("Next, let's understand your business model. What type of shop are you creating?", 2400);
      setCurrentStep("shop-type");
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
        addAiMessage("Now, do you have a particular style in mind for the design?", 2400);
        setCurrentStep("style");
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
      const stepOrder: ConversationStep[] = ["inspiration", "color", "color-shade", "secondary-color", "shop-type", "style", "pages", "products", "complete"];
      const currentIndex = stepOrder.indexOf(currentStep);
      let nextStep = stepOrder[currentIndex + 1];
      
      // Skip shade and secondary if skipping color
      if (currentStep === "color") {
        nextStep = "shop-type";
      } else if (currentStep === "color-shade" || currentStep === "secondary-color") {
        nextStep = "shop-type";
      }
      
      // Initialize pages if moving to pages step
      if (nextStep === "pages") {
        const suggestedPages = getSuggestedPagesForShopType(conversationData.shopType);
        setConversationData((prev) => ({
          ...prev,
          selectedPages: suggestedPages.map((p) => p.id),
        }));
      }

      if (nextStep === "complete") {
        addAiMessage(`Great! I have enough information to create an amazing website for ${businessName}. Click 'Generate My Website' when you're ready!`, 1400);
        setCurrentStep("complete");
      } else {
        // Ask the next question
        const nextQuestions: Record<ConversationStep, string> = {
          inspiration: "",
          color: "What primary color would you like for your website?",
          "color-shade": "Fine-tune your shade preference.",
          "secondary-color": "Would you like a secondary color?",
          "shop-type": "What type of shop are you creating?",
          style: "Do you have a particular style in mind for the design?",
          pages: "I've put together a set of pages that usually work best for a business like yours. You can review, customize, or remove anything.",
          products: "Tell me about your products or services. What do you offer?",
          complete: "",
        };
        addAiMessage(nextQuestions[nextStep], 1400);
        setCurrentStep(nextStep);
      }
    }, 1000);
  };

  // Handle ending the chat early - redirects to dashboard for Option 2
  const handleEndChat = () => {
    if (isTyping) return;

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
          // Initialize selected pages based on shop type
          const suggestedPages = getSuggestedPagesForShopType(conversationData.shopType);
          setConversationData((prev) => ({
            ...prev,
            selectedPages: suggestedPages.map((p) => p.id),
          }));
          addAiMessage("I've put together a set of pages that usually work best for a business like yours. You can review, customize, or remove anything.", 2400);
          setCurrentStep("pages");
        }, 100);
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
      <IntroScreen
        businessName={businessName}
        onStartChat={handleStartChat}
        onSkipChat={handleSkipChat}
      />
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
                {currentStep === "shop-type" && (
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
                  <button
                    onClick={handleEndChat}
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
                  onClick={onNext}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
                >
                  Generate My Website
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Skip Option - only show when chat is active */}
            {currentStep !== "complete" && (
              <div className="px-6 pb-4 text-center">
                <button
                  onClick={onSkip}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Set up without AI chat
                  <ArrowRight className="w-3 h-3 inline ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {["inspiration", "color", "shop-type", "style", "pages", "products"].map((step, index) => {
              // Map the visual step to account for color sub-steps
              const stepOrder = ["inspiration", "color", "shop-type", "style", "pages", "products"];
              const currentStepMapped = currentStep === "secondary-color" || currentStep === "color-shade" ? "color" : currentStep;
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
              Universell AI has helped create <span className="font-semibold text-foreground">10,000+</span> websites
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
