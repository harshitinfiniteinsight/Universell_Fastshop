"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  FileText,
  Tag,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceItem, MenuItemType } from "./types";

interface SourcesPanelProps {
  pages: SourceItem[];
  categories: SourceItem[];
  onAddItems: (items: SourceItem[]) => void;
}

interface ExpandedSections {
  pages: boolean;
  categories: boolean;
  customLink: boolean;
}

export function SourcesPanel({ pages, categories, onAddItems }: SourcesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    pages: true,
    categories: false,
    customLink: false,
  });

  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  
  const [customLinkLabel, setCustomLinkLabel] = useState("");
  const [customLinkUrl, setCustomLinkUrl] = useState("");
  const [customLinkNewTab, setCustomLinkNewTab] = useState(false);

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  };

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleAddPages = () => {
    const itemsToAdd = pages.filter((p) => selectedPages.has(p.id));
    if (itemsToAdd.length > 0) {
      onAddItems(itemsToAdd);
      setSelectedPages(new Set());
    }
  };

  const handleAddCategories = () => {
    const itemsToAdd = categories.filter((c) => selectedCategories.has(c.id));
    if (itemsToAdd.length > 0) {
      onAddItems(itemsToAdd);
      setSelectedCategories(new Set());
    }
  };

  const handleAddCustomLink = () => {
    if (customLinkLabel.trim() && customLinkUrl.trim()) {
      const customItem: SourceItem = {
        id: `custom-${Date.now()}`,
        name: customLinkLabel.trim(),
        url: customLinkUrl.trim(),
        type: "custom_link" as MenuItemType,
      };
      onAddItems([customItem]);
      setCustomLinkLabel("");
      setCustomLinkUrl("");
      setCustomLinkNewTab(false);
    }
  };

  return (
    <Card className="h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Add Menu Items</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select items to add to your menu
        </p>
      </div>

      <div className="divide-y divide-border">
        {/* Pages Section */}
        <div>
          <button
            onClick={() => toggleSection("pages")}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Pages</span>
              <Badge variant="secondary" className="text-xs">
                {pages.length}
              </Badge>
            </div>
            {expandedSections.pages ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {expandedSections.pages && (
            <div className="px-4 pb-4 space-y-2">
              <div className="max-h-48 overflow-y-auto space-y-1">
                {pages.map((page) => (
                  <label
                    key={page.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                      selectedPages.has(page.id) ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={selectedPages.has(page.id)}
                      onCheckedChange={() => togglePageSelection(page.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm truncate block">{page.name}</span>
                      <span className="text-xs text-muted-foreground">{page.url}</span>
                    </div>
                  </label>
                ))}
              </div>
              {selectedPages.size > 0 && (
                <Button size="sm" className="w-full" onClick={handleAddPages}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {selectedPages.size} Page{selectedPages.size > 1 ? "s" : ""} to Menu
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div>
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Categories</span>
              <Badge variant="secondary" className="text-xs">
                {categories.length}
              </Badge>
            </div>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {expandedSections.categories && (
            <div className="px-4 pb-4 space-y-2">
              {categories.length > 0 ? (
                <>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                          selectedCategories.has(category.id) ? "bg-primary/10" : "hover:bg-muted/50"
                        )}
                      >
                        <Checkbox
                          checked={selectedCategories.has(category.id)}
                          onCheckedChange={() => toggleCategorySelection(category.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm truncate block">{category.name}</span>
                          <span className="text-xs text-muted-foreground">{category.url}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {selectedCategories.size > 0 && (
                    <Button size="sm" className="w-full" onClick={handleAddCategories}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add {selectedCategories.size} Categor{selectedCategories.size > 1 ? "ies" : "y"} to Menu
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No categories available
                </p>
              )}
            </div>
          )}
        </div>

        {/* Custom Link Section */}
        <div>
          <button
            onClick={() => toggleSection("customLink")}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Custom Link</span>
            </div>
            {expandedSections.customLink ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {expandedSections.customLink && (
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Link Label</Label>
                <Input
                  placeholder="e.g., Blog, FAQ"
                  value={customLinkLabel}
                  onChange={(e) => setCustomLinkLabel(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">URL</Label>
                <Input
                  placeholder="https://example.com or /page"
                  value={customLinkUrl}
                  onChange={(e) => setCustomLinkUrl(e.target.value)}
                  className="h-9"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={customLinkNewTab}
                  onCheckedChange={(checked) => setCustomLinkNewTab(checked === true)}
                />
                <span className="text-sm flex items-center gap-1">
                  Open in new tab
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </span>
              </label>

              <Button
                size="sm"
                className="w-full"
                onClick={handleAddCustomLink}
                disabled={!customLinkLabel.trim() || !customLinkUrl.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
