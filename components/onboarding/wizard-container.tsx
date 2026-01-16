"use client";

import { useState } from "react";
import { ProgressIndicator } from "./progress-indicator";
import { WelcomeStep } from "./steps/welcome-step";
import { BusinessInfoStep } from "./steps/business-info-step";
import { AiChatStep } from "./steps/ai-chat-step";
import { ShopTypeStep } from "./steps/shop-type-step";
import { SelectItemsStep } from "./steps/select-items-step";
import { AiGenerationStep } from "./steps/ai-generation-step";
import { ReviewLaunchStep } from "./steps/review-launch-step";

export type ShopType = "products" | "services" | "booking" | "both" | null;

export interface BusinessInfo {
  name: string;
  description: string;
  email: string;
  phone: string;
  // Structured address fields
  country: string;
  state: string;
  city: string;
  zipcode: string;
  streetAddress: string;
  logo: File | null;
  logoPreview: string | null;
  banner: File | null;
  bannerPreview: string | null;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice: number | null;
  category: string;
  selected: boolean;
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  salePrice: number | null;
  category: string;
  selected: boolean;
}

export interface WizardData {
  businessInfo: BusinessInfo;
  shopType: ShopType;
  selectedProducts: Product[];
  selectedServices: Service[];
  generatedPages: string[];
  themeColor: string;
}

const STEPS = [
  { id: 1, name: "Welcome", description: "Get started" },
  { id: 2, name: "Business Info", description: "Your details" },
  { id: 3, name: "AI Design", description: "Chat with AI" },
  { id: 4, name: "Shop Type", description: "What you sell" },
  { id: 5, name: "Products & Services", description: "Select items" },
  { id: 6, name: "Generate Pages", description: "AI creates your site" },
  { id: 7, name: "Review & Launch", description: "Go live" },
];

// Pre-filled demo data (from user signup)
const initialBusinessInfo: BusinessInfo = {
  name: "Sunrise Cafe & Bakery",
  description: "Fresh baked goods and artisan coffee in the heart of downtown",
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
};

const initialWizardData: WizardData = {
  businessInfo: initialBusinessInfo,
  shopType: null,
  selectedProducts: [],
  selectedServices: [],
  generatedPages: [],
  themeColor: "#f04f29",
};

export function WizardContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeStep
            onNext={nextStep}
            businessInfo={wizardData.businessInfo}
            onUpdateBusinessInfo={(businessInfo) => updateWizardData({ businessInfo })}
          />
        );
      case 2:
        return (
          <BusinessInfoStep
            data={wizardData.businessInfo}
            onUpdate={(businessInfo) => updateWizardData({ businessInfo })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <AiChatStep
            businessName={wizardData.businessInfo.name || "Your Business"}
            onNext={nextStep}
            onSkip={nextStep}
          />
        );
      case 4:
        return (
          <ShopTypeStep
            selectedType={wizardData.shopType}
            onSelect={(shopType) => updateWizardData({ shopType })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <SelectItemsStep
            shopType={wizardData.shopType}
            selectedProducts={wizardData.selectedProducts}
            selectedServices={wizardData.selectedServices}
            onUpdateProducts={(selectedProducts) =>
              updateWizardData({ selectedProducts })
            }
            onUpdateServices={(selectedServices) =>
              updateWizardData({ selectedServices })
            }
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <AiGenerationStep
            wizardData={wizardData}
            onUpdate={(generatedPages) => updateWizardData({ generatedPages })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <ReviewLaunchStep
            wizardData={wizardData}
            onBack={prevStep}
            onLaunch={() => {
              // Handle launch
              console.log("Launching shop with data:", wizardData);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress indicator - hidden on welcome, business info, and AI chat steps */}
      {currentStep > 3 && (
        <ProgressIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={goToStep}
        />
      )}

      {/* Step content */}
      <div className="bg-card rounded-lg shadow-main">{renderStep()}</div>
    </div>
  );
}
