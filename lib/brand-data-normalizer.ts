"use client";

import { BrandVaultState, BrandColors, BrandTypography, BrandVoice, BrandStyle, BrandLogo, BrandSocial } from "./brand-vault-context";

// Storage keys for different data sources
export const STORAGE_KEYS = {
  BRAND_VAULT: "universell_brand_vault",
  ONBOARDING_DATA: "universell-onboarding-data",
  LEGACY_BRAND_VAULT: "universell-brand-vault",
  BUSINESS_INFO: "universell-business-info",
  WIZARD_DATA: "universell-wizard-data",
} as const;

// Business info structure from wizard
export interface BusinessInfoData {
  name?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  logo?: File | null;
  logoPreview?: string | null;
}

// Onboarding data structure (from AI chat step)
export interface OnboardingData {
  businessName?: string;
  inspiration?: string;
  primaryColor?: { name: string; value: string; hex: string; description: string } | null;
  primaryShade?: { name: string; hex: string; value: number } | null;
  secondaryColor?: { name: string; value: string; hex: string; description: string } | null;
  secondaryShade?: { name: string; hex: string; value: number } | null;
  shopType?: string | null;
  style?: string;
  selectedPages?: string[];
  customPages?: string[];
  pageCustomizations?: Record<string, { name: string; prompt: string }>;
  completedAt?: string;
  // From Brand Vault modal in onboarding
  color?: string;
  accentColor?: string;
  brandTone?: string;
  industry?: string;
  targetAudience?: string;
  fontPreference?: string;
  hasLogo?: boolean;
  logoPreview?: string;
  fromBrandVault?: boolean;
}

// Legacy Brand Vault data (from onboarding Brand Vault modal)
export interface LegacyBrandVaultData {
  inspirationLinks?: string[];
  logoFile?: File | null;
  logoPreview?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontPreference?: string;
  brandTone?: string;
  industry?: string;
  targetAudience?: string;
  moodboardImages?: string[];
  socialLinks?: string[];
  brandGuidelines?: File | null;
  additionalNotes?: string;
}

// AI chat text patterns for extracting brand signals
const STYLE_KEYWORDS: Record<string, string[]> = {
  modern: ["modern", "contemporary", "current", "fresh", "sleek"],
  minimal: ["minimal", "minimalist", "clean", "simple", "uncluttered"],
  playful: ["playful", "fun", "vibrant", "colorful", "energetic", "lively"],
  elegant: ["elegant", "sophisticated", "refined", "luxurious", "classy"],
  bold: ["bold", "strong", "powerful", "impactful", "dramatic"],
  vintage: ["vintage", "retro", "classic", "nostalgic", "timeless"],
  professional: ["professional", "corporate", "business", "formal"],
};

const TONE_KEYWORDS: Record<string, string[]> = {
  friendly: ["friendly", "warm", "welcoming", "approachable", "inviting"],
  professional: ["professional", "formal", "business", "corporate", "polished"],
  premium: ["premium", "luxury", "high-end", "exclusive", "upscale"],
  playful: ["playful", "fun", "whimsical", "cheerful", "lighthearted"],
  trustworthy: ["trustworthy", "reliable", "dependable", "honest", "credible"],
  innovative: ["innovative", "cutting-edge", "forward-thinking", "creative"],
  casual: ["casual", "relaxed", "laid-back", "informal", "easygoing"],
  authoritative: ["authoritative", "expert", "knowledgeable", "leading"],
};

const TYPOGRAPHY_KEYWORDS: Record<string, string[]> = {
  "clean-modern": ["clean", "modern", "sans-serif", "contemporary", "sleek"],
  "classic-professional": ["classic", "professional", "serif", "traditional", "elegant"],
  "fun-friendly": ["fun", "friendly", "rounded", "approachable", "playful"],
};

/**
 * Extract design styles from text content
 */
export function extractDesignStyles(text: string): string[] {
  const lowerText = text.toLowerCase();
  const styles: string[] = [];
  
  for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      styles.push(style);
    }
  }
  
  return [...new Set(styles)];
}

/**
 * Extract brand tones from text content
 */
export function extractBrandTones(text: string): string[] {
  const lowerText = text.toLowerCase();
  const tones: string[] = [];
  
  for (const [tone, keywords] of Object.entries(TONE_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      tones.push(tone);
    }
  }
  
  return [...new Set(tones)];
}

/**
 * Extract typography preference from text content
 */
export function extractTypographyPreference(text: string): "clean-modern" | "classic-professional" | "fun-friendly" | null {
  const lowerText = text.toLowerCase();
  
  for (const [pref, keywords] of Object.entries(TYPOGRAPHY_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return pref as "clean-modern" | "classic-professional" | "fun-friendly";
    }
  }
  
  return null;
}

/**
 * Map font preference string to typography preference
 */
function mapFontPreference(fontPref: string | undefined): "clean-modern" | "classic-professional" | "fun-friendly" | null {
  if (!fontPref) return null;
  
  const lower = fontPref.toLowerCase();
  if (lower.includes("clean") || lower.includes("modern") || lower.includes("sans")) {
    return "clean-modern";
  }
  if (lower.includes("classic") || lower.includes("professional") || lower.includes("serif")) {
    return "classic-professional";
  }
  if (lower.includes("fun") || lower.includes("friendly") || lower.includes("rounded")) {
    return "fun-friendly";
  }
  
  return null;
}

/**
 * Load all brand-related data from storage
 */
export function loadAllBrandSources(): {
  brandVault: Partial<BrandVaultState> | null;
  onboarding: OnboardingData | null;
  legacyVault: LegacyBrandVaultData | null;
  businessInfo: BusinessInfoData | null;
} {
  let brandVault: Partial<BrandVaultState> | null = null;
  let onboarding: OnboardingData | null = null;
  let legacyVault: LegacyBrandVaultData | null = null;
  let businessInfo: BusinessInfoData | null = null;

  try {
    const brandVaultStr = localStorage.getItem(STORAGE_KEYS.BRAND_VAULT);
    if (brandVaultStr) {
      brandVault = JSON.parse(brandVaultStr);
    }
  } catch (e) {
    console.error("Failed to load brand vault:", e);
  }

  try {
    const onboardingStr = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
    if (onboardingStr) {
      onboarding = JSON.parse(onboardingStr);
    }
  } catch (e) {
    console.error("Failed to load onboarding data:", e);
  }

  try {
    const legacyStr = localStorage.getItem(STORAGE_KEYS.LEGACY_BRAND_VAULT);
    if (legacyStr) {
      legacyVault = JSON.parse(legacyStr);
    }
  } catch (e) {
    console.error("Failed to load legacy brand vault:", e);
  }

  try {
    const businessInfoStr = localStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
    if (businessInfoStr) {
      businessInfo = JSON.parse(businessInfoStr);
    }
  } catch (e) {
    console.error("Failed to load business info:", e);
  }

  return { brandVault, onboarding, legacyVault, businessInfo };
}

/**
 * Normalize and merge all brand data sources into a single BrandVaultState
 * Priority: Brand Vault > Onboarding > Legacy Vault > Business Info > Defaults
 */
export function normalizeBrandData(
  sources: {
    brandVault: Partial<BrandVaultState> | null;
    onboarding: OnboardingData | null;
    legacyVault: LegacyBrandVaultData | null;
    businessInfo?: BusinessInfoData | null;
  },
  defaults: BrandVaultState
): BrandVaultState {
  const { brandVault, onboarding, legacyVault, businessInfo } = sources;

  // Start with defaults
  const result: BrandVaultState = { ...defaults };

  // Apply business info (lowest priority after defaults)
  if (businessInfo) {
    if (businessInfo.name) {
      result.brandName = businessInfo.name;
    }
    if (businessInfo.tagline) {
      result.tagline = businessInfo.tagline;
    }
    if (businessInfo.logoPreview) {
      result.logo.url = businessInfo.logoPreview;
    }
  }

  // Apply legacy vault data (low priority)
  if (legacyVault) {
    // Colors
    if (legacyVault.primaryColor) {
      result.colors.primary = legacyVault.primaryColor;
    }
    if (legacyVault.secondaryColor) {
      result.colors.secondary = legacyVault.secondaryColor;
    }
    if (legacyVault.accentColor) {
      result.colors.accent = legacyVault.accentColor;
    }
    
    // Logo
    if (legacyVault.logoPreview) {
      result.logo.url = legacyVault.logoPreview;
    }
    
    // Style
    if (legacyVault.inspirationLinks?.length) {
      result.style.inspirationLinks = legacyVault.inspirationLinks.filter(l => l.trim());
    }
    
    // Voice
    if (legacyVault.brandTone) {
      const tones = extractBrandTones(legacyVault.brandTone);
      if (tones.length) {
        result.voice.tones = tones;
      }
    }
    if (legacyVault.targetAudience) {
      result.voice.targetAudience = legacyVault.targetAudience;
    }
    if (legacyVault.additionalNotes) {
      result.voice.notesForAi = legacyVault.additionalNotes;
    }
    
    // Typography
    if (legacyVault.fontPreference) {
      const pref = mapFontPreference(legacyVault.fontPreference);
      if (pref) {
        result.typography.preference = pref;
      }
    }
    
    // Social
    if (legacyVault.socialLinks?.length) {
      result.social.links = legacyVault.socialLinks.filter(l => l.trim());
    }
  }

  // Apply onboarding data (medium priority)
  if (onboarding) {
    // Brand name
    if (onboarding.businessName) {
      result.brandName = onboarding.businessName;
    }
    
    // Colors from AI chat
    if (onboarding.primaryColor?.hex) {
      result.colors.primary = onboarding.primaryShade?.hex || onboarding.primaryColor.hex;
    } else if (onboarding.color) {
      result.colors.primary = onboarding.color;
    }
    
    if (onboarding.secondaryColor?.hex) {
      result.colors.secondary = onboarding.secondaryShade?.hex || onboarding.secondaryColor.hex;
    }
    
    if (onboarding.accentColor) {
      result.colors.accent = onboarding.accentColor;
    }
    
    // Logo
    if (onboarding.logoPreview) {
      result.logo.url = onboarding.logoPreview;
    }
    
    // Extract styles from inspiration/style text
    if (onboarding.style) {
      const extractedStyles = extractDesignStyles(onboarding.style);
      if (extractedStyles.length) {
        result.style.designStyles = [...new Set([...result.style.designStyles, ...extractedStyles])];
      }
    }
    
    // Inspiration links
    if (onboarding.inspiration) {
      const links = onboarding.inspiration.split(",").map(l => l.trim()).filter(l => l);
      if (links.length) {
        result.style.inspirationLinks = [...new Set([...result.style.inspirationLinks, ...links])];
      }
    }
    
    // Voice/Tone
    if (onboarding.brandTone) {
      const tones = extractBrandTones(onboarding.brandTone);
      if (tones.length) {
        result.voice.tones = [...new Set([...result.voice.tones, ...tones])];
      }
    }
    
    if (onboarding.targetAudience) {
      result.voice.targetAudience = onboarding.targetAudience;
    }
    
    // Typography
    if (onboarding.fontPreference) {
      const pref = mapFontPreference(onboarding.fontPreference);
      if (pref) {
        result.typography.preference = pref;
      }
    }
  }

  // Apply existing brand vault data (highest priority)
  if (brandVault) {
    // Core Identity
    if (brandVault.brandName) {
      result.brandName = brandVault.brandName;
    }
    if (brandVault.tagline) {
      result.tagline = brandVault.tagline;
    }
    
    // Logo
    if (brandVault.logo) {
      if (brandVault.logo.url) result.logo.url = brandVault.logo.url;
      if (brandVault.logo.altText) result.logo.altText = brandVault.logo.altText;
    }
    
    // Colors
    if (brandVault.colors) {
      if (brandVault.colors.primary) result.colors.primary = brandVault.colors.primary;
      if (brandVault.colors.secondary) result.colors.secondary = brandVault.colors.secondary;
      if (brandVault.colors.accent) result.colors.accent = brandVault.colors.accent;
      if (brandVault.colors.background) result.colors.background = brandVault.colors.background;
      if (brandVault.colors.text) result.colors.text = brandVault.colors.text;
    }
    
    // Typography
    if (brandVault.typography) {
      if (brandVault.typography.headingFont) result.typography.headingFont = brandVault.typography.headingFont;
      if (brandVault.typography.bodyFont) result.typography.bodyFont = brandVault.typography.bodyFont;
      if (brandVault.typography.preference) result.typography.preference = brandVault.typography.preference;
    }
    
    // Voice
    if (brandVault.voice) {
      if (brandVault.voice.tones?.length) result.voice.tones = brandVault.voice.tones;
      if (brandVault.voice.targetAudience) result.voice.targetAudience = brandVault.voice.targetAudience;
      if (brandVault.voice.dosAndDonts) result.voice.dosAndDonts = brandVault.voice.dosAndDonts;
      if (brandVault.voice.notesForAi) result.voice.notesForAi = brandVault.voice.notesForAi;
    }
    
    // Style
    if (brandVault.style) {
      if (brandVault.style.designStyles?.length) result.style.designStyles = brandVault.style.designStyles;
      if (brandVault.style.inspirationLinks?.length) result.style.inspirationLinks = brandVault.style.inspirationLinks;
    }
    
    // Social
    if (brandVault.social) {
      if (brandVault.social.links?.length) result.social.links = brandVault.social.links;
      if (brandVault.social.brandGuidelinesUrl) result.social.brandGuidelinesUrl = brandVault.social.brandGuidelinesUrl;
    }
    
    // Metadata
    if (brandVault.lastUpdated) result.lastUpdated = brandVault.lastUpdated;
    if (brandVault.version) result.version = brandVault.version;
  }

  // Ensure we have at least one item in arrays that need it for UI
  if (result.style.inspirationLinks.length === 0) {
    result.style.inspirationLinks = [""];
  }
  if (result.social.links.length === 0) {
    result.social.links = [""];
  }

  return result;
}

/**
 * Check if brand data has been populated from any source
 */
export function hasBrandData(brand: BrandVaultState): boolean {
  return !!(
    brand.brandName ||
    brand.tagline ||
    brand.logo.url ||
    brand.voice.tones.length > 0 ||
    brand.style.designStyles.length > 0 ||
    brand.style.inspirationLinks.some(l => l.trim()) ||
    brand.voice.targetAudience
  );
}

/**
 * Get a summary of populated brand fields for display
 */
export function getBrandDataSummary(brand: BrandVaultState): {
  totalFields: number;
  populatedFields: number;
  missingFields: string[];
} {
  const fields = [
    { name: "Brand Name", filled: !!brand.brandName },
    { name: "Tagline", filled: !!brand.tagline },
    { name: "Logo", filled: !!brand.logo.url },
    { name: "Primary Color", filled: brand.colors.primary !== "#f04f29" },
    { name: "Secondary Color", filled: brand.colors.secondary !== "#666666" },
    { name: "Design Styles", filled: brand.style.designStyles.length > 0 },
    { name: "Brand Tones", filled: brand.voice.tones.length > 0 },
    { name: "Target Audience", filled: !!brand.voice.targetAudience },
    { name: "Typography", filled: !!brand.typography.preference },
    { name: "Inspiration Links", filled: brand.style.inspirationLinks.some(l => l.trim()) },
  ];

  return {
    totalFields: fields.length,
    populatedFields: fields.filter(f => f.filled).length,
    missingFields: fields.filter(f => !f.filled).map(f => f.name),
  };
}
