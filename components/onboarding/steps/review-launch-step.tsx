"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WizardData } from "../wizard-container";
import {
  ArrowLeft,
  Rocket,
  Check,
  Building2,
  Package,
  Briefcase,
  Globe,
  ExternalLink,
  Palette,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewLaunchStepProps {
  wizardData: WizardData;
  onBack: () => void;
  onLaunch: () => void;
}

export function ReviewLaunchStep({
  wizardData,
  onBack,
  onLaunch,
}: ReviewLaunchStepProps) {
  const [customDomain, setCustomDomain] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  const selectedProducts = wizardData.selectedProducts.filter((p) => p.selected);
  const selectedServices = wizardData.selectedServices.filter((s) => s.selected);

  const handleLaunch = async () => {
    setIsLaunching(true);
    // Simulate launch
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLaunching(false);
    setIsLaunched(true);
    onLaunch();
  };

  if (isLaunched) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Success animation */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
            <Check className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-foreground">
            Congratulations! 🎉
          </h2>
          <p className="text-lg text-muted-foreground">
            Your Fast Shop is now live and ready to accept customers!
          </p>

          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Your shop URL:</p>
            <div className="flex items-center justify-center gap-2">
              <code className="bg-card px-4 py-2 rounded-lg text-primary font-mono text-lg">
                {wizardData.businessInfo.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
                .fastshop.io
              </code>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
            <Button asChild>
              <a
                href="#"
                target="_blank"
                rel="noopener"
                className="flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Your Shop
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Review & Launch
          </h2>
          <p className="text-muted-foreground mt-1">
            Review your Fast Shop setup before going live
          </p>
        </div>

        {/* Summary sections */}
        <div className="space-y-6">
          {/* Business Info Summary */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                {wizardData.businessInfo.logoPreview ? (
                  <img
                    src={wizardData.businessInfo.logoPreview}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">
                  {wizardData.businessInfo.name || "Your Business"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {wizardData.businessInfo.description || "No description provided"}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  {wizardData.businessInfo.email && (
                    <span>{wizardData.businessInfo.email}</span>
                  )}
                  {wizardData.businessInfo.phone && (
                    <span>{wizardData.businessInfo.phone}</span>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {wizardData.shopType || "Not set"}
              </Badge>
            </div>
          </div>

          {/* Selected Items Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Products */}
            {selectedProducts.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Products ({selectedProducts.length})
                  </h3>
                </div>
                <ul className="space-y-2">
                  {selectedProducts.slice(0, 5).map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground truncate">
                        {product.name}
                      </span>
                      <span className="font-medium">
                        ${product.salePrice || product.price}
                      </span>
                    </li>
                  ))}
                  {selectedProducts.length > 5 && (
                    <li className="text-sm text-muted-foreground">
                      +{selectedProducts.length - 5} more products
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Services */}
            {selectedServices.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Services ({selectedServices.length})
                  </h3>
                </div>
                <ul className="space-y-2">
                  {selectedServices.slice(0, 5).map((service) => (
                    <li
                      key={service.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground truncate">
                        {service.name}
                      </span>
                      <span className="font-medium">
                        ${service.salePrice || service.price}
                      </span>
                    </li>
                  ))}
                  {selectedServices.length > 5 && (
                    <li className="text-sm text-muted-foreground">
                      +{selectedServices.length - 5} more services
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Generated Pages */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Generated Pages
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Homepage", "About Us", "Contact", "Terms & Conditions", "Privacy Policy"].map(
                (page) => (
                  <Badge key={page} variant="secondary" className="px-3 py-1">
                    <Check className="w-3 h-3 mr-1 text-green-500" />
                    {page}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* Theme Color */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Theme Color</h3>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-border"
                  style={{ backgroundColor: wizardData.themeColor }}
                />
                <span className="text-sm text-muted-foreground uppercase">
                  {wizardData.themeColor}
                </span>
              </div>
            </div>
          </div>

          {/* Domain Setup */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Domain Setup</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-medium">Free subdomain: </span>
                  <code className="text-primary">
                    {wizardData.businessInfo.name
                      .toLowerCase()
                      .replace(/\s+/g, "-") || "your-shop"}
                    .fastshop.io
                  </code>
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customDomain">
                  Custom domain (optional)
                </Label>
                <Input
                  id="customDomain"
                  placeholder="www.yourdomain.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can configure a custom domain later in settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Launch button */}
        <div className="text-center pt-4">
          <Button
            onClick={handleLaunch}
            size="lg"
            className="px-12 text-base"
            disabled={isLaunching}
          >
            {isLaunching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Launching...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Launch Fast Shop
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            By launching, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-start pt-4 border-t border-border">
          <Button variant="outline" onClick={onBack} disabled={isLaunching}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
