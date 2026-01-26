"use client";

import { useCallback, useEffect, useState } from "react";
import { useBrandVault, BrandVaultState } from "@/lib/brand-vault-context";

interface UseBrandTokensOptions {
  /**
   * Whether to re-render when brand vault updates
   * @default true
   */
  autoUpdate?: boolean;
}

/**
 * Hook to access brand tokens in pages and components.
 * Automatically syncs with Brand Vault updates.
 */
export function useBrandTokens(options: UseBrandTokensOptions = {}) {
  const { autoUpdate = true } = options;
  const { brand, getBrandToken, isLoading } = useBrandVault();
  const [, forceUpdate] = useState({});

  // Listen for brand vault updates
  useEffect(() => {
    if (!autoUpdate) return;

    const handleUpdate = () => {
      forceUpdate({});
    };

    window.addEventListener("brand-vault-updated", handleUpdate);
    return () => {
      window.removeEventListener("brand-vault-updated", handleUpdate);
    };
  }, [autoUpdate]);

  /**
   * Get a CSS variable string for use in styles
   */
  const getCssVar = useCallback((token: string): string => {
    const value = getBrandToken(token);
    return value || "";
  }, [getBrandToken]);

  /**
   * Apply brand tokens to a content string
   * Replaces {{brand.tokenName}} patterns with actual values
   */
  const applyTokens = useCallback((content: string): string => {
    return content.replace(/\{\{(brand\.[a-zA-Z]+)\}\}/g, (match, token) => {
      const value = getBrandToken(token);
      return value !== undefined ? value : match;
    });
  }, [getBrandToken]);

  /**
   * Get inline styles object with brand colors
   */
  const getBrandStyles = useCallback(() => ({
    "--brand-primary": brand.colors.primary,
    "--brand-secondary": brand.colors.secondary,
    "--brand-accent": brand.colors.accent,
    "--brand-background": brand.colors.background,
    "--brand-text": brand.colors.text,
    "--brand-heading-font": brand.typography.headingFont,
    "--brand-body-font": brand.typography.bodyFont,
  } as React.CSSProperties), [brand]);

  return {
    // Direct access
    brand,
    isLoading,
    
    // Token access
    getToken: getBrandToken,
    getCssVar,
    applyTokens,
    getBrandStyles,
    
    // Common tokens
    colors: brand.colors,
    typography: brand.typography,
    brandName: brand.brandName,
    tagline: brand.tagline,
    logo: brand.logo,
    voice: brand.voice,
  };
}

/**
 * Component wrapper that provides brand CSS variables to children
 */
export function BrandStyleProvider({ 
  children,
  className,
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { getBrandStyles } = useBrandTokens();
  
  return (
    <div style={getBrandStyles()} className={className}>
      {children}
    </div>
  );
}
