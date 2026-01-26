"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { loadAllBrandSources, normalizeBrandData, STORAGE_KEYS } from "./brand-data-normalizer";

// Brand Vault Types
export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
  text?: string;
}

export interface BrandTypography {
  headingFont: string;
  bodyFont: string;
  preference: "clean-modern" | "classic-professional" | "fun-friendly" | null;
}

export interface BrandLogo {
  url: string | null;
  altText: string;
  file?: File | null;
}

export interface BrandVoice {
  tones: string[];
  targetAudience: string;
  dosAndDonts: string;
  notesForAi: string;
}

export interface BrandStyle {
  designStyles: string[];
  inspirationLinks: string[];
}

export interface BrandSocial {
  links: string[];
  brandGuidelinesUrl: string;
}

export interface BrandVaultState {
  // Core Identity
  brandName: string;
  tagline: string;
  
  // Visual Identity
  logo: BrandLogo;
  colors: BrandColors;
  typography: BrandTypography;
  
  // Brand Personality
  voice: BrandVoice;
  style: BrandStyle;
  
  // Additional Info
  social: BrandSocial;
  
  // Metadata
  lastUpdated: string | null;
  version: number;
}

export interface BrandVaultContextType {
  brand: BrandVaultState;
  updateBrand: (updates: Partial<BrandVaultState>) => void;
  updateColors: (colors: Partial<BrandColors>) => void;
  updateTypography: (typography: Partial<BrandTypography>) => void;
  updateLogo: (logo: Partial<BrandLogo>) => void;
  updateVoice: (voice: Partial<BrandVoice>) => void;
  updateStyle: (style: Partial<BrandStyle>) => void;
  updateSocial: (social: Partial<BrandSocial>) => void;
  saveBrand: () => Promise<void>;
  resetBrand: () => void;
  isLoading: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  
  // Token-based access for pages
  getBrandToken: (token: string) => string | undefined;
}

// Default brand state
const DEFAULT_BRAND_STATE: BrandVaultState = {
  brandName: "",
  tagline: "",
  logo: {
    url: null,
    altText: "",
    file: null,
  },
  colors: {
    primary: "#f04f29",
    secondary: "#666666",
    accent: "#000000",
    background: "#ffffff",
    text: "#1a1a1a",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    preference: "clean-modern",
  },
  voice: {
    tones: [],
    targetAudience: "",
    dosAndDonts: "",
    notesForAi: "",
  },
  style: {
    designStyles: [],
    inspirationLinks: [],
  },
  social: {
    links: [],
    brandGuidelinesUrl: "",
  },
  lastUpdated: null,
  version: 1,
};

// Storage key for persistence
const BRAND_VAULT_STORAGE_KEY = STORAGE_KEYS.BRAND_VAULT;

const BrandVaultContext = createContext<BrandVaultContextType | undefined>(undefined);

export function BrandVaultProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandVaultState>(DEFAULT_BRAND_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load and normalize brand data from all sources on mount
  useEffect(() => {
    const loadBrandData = () => {
      try {
        // Load all brand data sources
        const sources = loadAllBrandSources();
        
        // Normalize and merge all sources into a single state
        const normalizedBrand = normalizeBrandData(sources, DEFAULT_BRAND_STATE);
        
        setBrand(normalizedBrand);
        
        if (normalizedBrand.lastUpdated) {
          setLastSaved(new Date(normalizedBrand.lastUpdated));
        }
        
        setIsHydrated(true);
      } catch (error) {
        console.error("Failed to load brand data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrandData();
  }, []);

  // Auto-save when brand data changes (debounced)
  useEffect(() => {
    if (!isDirty || isLoading) return;

    const timeout = setTimeout(() => {
      saveBrand();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeout);
  }, [brand, isDirty, isLoading]);

  const updateBrand = useCallback((updates: Partial<BrandVaultState>) => {
    setBrand((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const updateColors = useCallback((colors: Partial<BrandColors>) => {
    setBrand((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
    setIsDirty(true);
  }, []);

  const updateTypography = useCallback((typography: Partial<BrandTypography>) => {
    setBrand((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...typography },
    }));
    setIsDirty(true);
  }, []);

  const updateLogo = useCallback((logo: Partial<BrandLogo>) => {
    setBrand((prev) => ({
      ...prev,
      logo: { ...prev.logo, ...logo },
    }));
    setIsDirty(true);
  }, []);

  const updateVoice = useCallback((voice: Partial<BrandVoice>) => {
    setBrand((prev) => ({
      ...prev,
      voice: { ...prev.voice, ...voice },
    }));
    setIsDirty(true);
  }, []);

  const updateStyle = useCallback((style: Partial<BrandStyle>) => {
    setBrand((prev) => ({
      ...prev,
      style: { ...prev.style, ...style },
    }));
    setIsDirty(true);
  }, []);

  const updateSocial = useCallback((social: Partial<BrandSocial>) => {
    setBrand((prev) => ({
      ...prev,
      social: { ...prev.social, ...social },
    }));
    setIsDirty(true);
  }, []);

  const saveBrand = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      const updatedBrand = {
        ...brand,
        lastUpdated: now,
        version: brand.version + 1,
      };
      
      // Persist to localStorage (in production, this would be an API call)
      localStorage.setItem(BRAND_VAULT_STORAGE_KEY, JSON.stringify(updatedBrand));
      
      setBrand(updatedBrand);
      setIsDirty(false);
      setLastSaved(new Date(now));
      
      // Dispatch custom event for pages to listen to
      window.dispatchEvent(new CustomEvent("brand-vault-updated", { 
        detail: updatedBrand 
      }));
    } catch (error) {
      console.error("Failed to save brand data:", error);
      throw error;
    }
  }, [brand]);

  const resetBrand = useCallback(() => {
    setBrand(DEFAULT_BRAND_STATE);
    setIsDirty(true);
  }, []);

  // Token-based access for brand values
  const getBrandToken = useCallback((token: string): string | undefined => {
    const tokens: Record<string, string | undefined> = {
      // Colors
      "brand.primaryColor": brand.colors.primary,
      "brand.secondaryColor": brand.colors.secondary,
      "brand.accentColor": brand.colors.accent,
      "brand.backgroundColor": brand.colors.background,
      "brand.textColor": brand.colors.text,
      
      // Typography
      "brand.headingFont": brand.typography.headingFont,
      "brand.bodyFont": brand.typography.bodyFont,
      
      // Identity
      "brand.name": brand.brandName,
      "brand.tagline": brand.tagline,
      "brand.logoUrl": brand.logo.url || undefined,
      "brand.logoAlt": brand.logo.altText,
      
      // Voice
      "brand.targetAudience": brand.voice.targetAudience,
      "brand.tones": brand.voice.tones.join(", "),
    };

    return tokens[token];
  }, [brand]);

  return (
    <BrandVaultContext.Provider
      value={{
        brand,
        updateBrand,
        updateColors,
        updateTypography,
        updateLogo,
        updateVoice,
        updateStyle,
        updateSocial,
        saveBrand,
        resetBrand,
        isLoading,
        isDirty,
        lastSaved,
        getBrandToken,
      }}
    >
      {children}
    </BrandVaultContext.Provider>
  );
}

export function useBrandVault() {
  const context = useContext(BrandVaultContext);
  if (context === undefined) {
    throw new Error("useBrandVault must be used within a BrandVaultProvider");
  }
  return context;
}

// Hook for pages to subscribe to brand updates
export function useBrandUpdates(callback: (brand: BrandVaultState) => void) {
  useEffect(() => {
    const handleUpdate = (event: CustomEvent<BrandVaultState>) => {
      callback(event.detail);
    };

    window.addEventListener("brand-vault-updated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("brand-vault-updated", handleUpdate as EventListener);
    };
  }, [callback]);
}

// Utility to apply brand tokens to content
export function applyBrandTokens(
  content: string,
  getBrandToken: (token: string) => string | undefined
): string {
  // Replace {{brand.tokenName}} patterns with actual values
  return content.replace(/\{\{(brand\.[a-zA-Z]+)\}\}/g, (match, token) => {
    const value = getBrandToken(token);
    return value !== undefined ? value : match;
  });
}
