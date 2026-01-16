"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WizardData } from "../wizard-container";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Loader2,
  Home,
  Users,
  Phone,
  FileText,
  Shield,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AiGenerationStepProps {
  wizardData: WizardData;
  onUpdate: (pages: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface PageGeneration {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "pending" | "generating" | "completed" | "error";
  progress: number;
}

const initialPages: PageGeneration[] = [
  { id: "home", name: "Homepage", icon: Home, status: "pending", progress: 0 },
  { id: "about", name: "About Us", icon: Users, status: "pending", progress: 0 },
  { id: "contact", name: "Contact", icon: Phone, status: "pending", progress: 0 },
  { id: "terms", name: "Terms & Conditions", icon: FileText, status: "pending", progress: 0 },
  { id: "privacy", name: "Privacy Policy", icon: Shield, status: "pending", progress: 0 },
];

export function AiGenerationStep({
  wizardData,
  onUpdate,
  onNext,
  onBack,
}: AiGenerationStepProps) {
  const [pages, setPages] = useState<PageGeneration[]>(initialPages);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [previewPage, setPreviewPage] = useState<string | null>(null);

  const allCompleted = pages.every((p) => p.status === "completed");

  const startGeneration = async () => {
    setIsGenerating(true);

    // Simulate AI generation for each page
    for (let i = 0; i < pages.length; i++) {
      // Set current page to generating
      setPages((prev) =>
        prev.map((p, idx) =>
          idx === i ? { ...p, status: "generating", progress: 0 } : p
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setPages((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, progress } : p))
        );
      }

      // Mark as completed
      setPages((prev) =>
        prev.map((p, idx) =>
          idx === i ? { ...p, status: "completed", progress: 100 } : p
        )
      );
    }

    setIsGenerating(false);
    setIsComplete(true);
    onUpdate(pages.map((p) => p.id));
  };

  const regeneratePage = async (pageId: string) => {
    const pageIndex = pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    // Set to generating
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId ? { ...p, status: "generating", progress: 0 } : p
      )
    );

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, progress } : p))
      );
    }

    // Mark as completed
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId ? { ...p, status: "completed", progress: 100 } : p
      )
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            AI Page Generation
          </h2>
          <p className="text-muted-foreground mt-1">
            Our AI will automatically create beautiful pages for your Fast Shop
          </p>
        </div>

        {/* Custom prompt input - shown before generation */}
        {!isGenerating && !isComplete && (
          <div className="space-y-4 bg-muted/30 rounded-lg p-6 border border-border">
            <Label htmlFor="customPrompt">Customize your pages (optional)</Label>
            <Textarea
              id="customPrompt"
              placeholder="Describe any specific preferences for your website... e.g., 'I want a modern, minimalist design with emphasis on product photography' or 'Include a testimonials section on the homepage'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              AI will use your business info and selected products/services to
              generate content tailored to your brand.
            </p>
          </div>
        )}

        {/* Pages list */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Pages to generate:</h3>
          {pages.map((page) => (
            <div
              key={page.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border transition-all",
                page.status === "completed"
                  ? "bg-primary/5 border-primary/20"
                  : page.status === "generating"
                  ? "bg-muted border-primary"
                  : "bg-card border-border"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  page.status === "completed"
                    ? "bg-primary text-white"
                    : page.status === "generating"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {page.status === "completed" ? (
                  <Check className="w-5 h-5" />
                ) : page.status === "generating" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <page.icon className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="font-medium text-foreground">{page.name}</p>
                {page.status === "generating" && (
                  <div className="mt-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${page.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Generating... {page.progress}%
                    </p>
                  </div>
                )}
                {page.status === "completed" && (
                  <p className="text-sm text-muted-foreground">
                    Successfully generated
                  </p>
                )}
              </div>

              {/* Actions */}
              {page.status === "completed" && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewPage(page.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => regeneratePage(page.id)}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Generate button */}
        {!isGenerating && !isComplete && (
          <div className="text-center">
            <Button onClick={startGeneration} size="lg" className="px-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate All Pages
            </Button>
          </div>
        )}

        {/* Completion message */}
        {isComplete && (
          <div className="text-center bg-primary/5 rounded-lg p-6 border border-primary/20">
            <Check className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              All pages generated successfully!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your Fast Shop website is ready for review.
            </p>
          </div>
        )}

        {/* Preview modal placeholder */}
        {previewPage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">
                  Preview: {pages.find((p) => p.id === previewPage)?.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewPage(null)}
                >
                  Close
                </Button>
              </div>
              <div className="p-8 bg-muted/30 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Page preview would render here</p>
                  <p className="text-sm mt-1">
                    (AI-generated content based on your business info)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isGenerating}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext} disabled={!allCompleted}>
            Review & Launch
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
