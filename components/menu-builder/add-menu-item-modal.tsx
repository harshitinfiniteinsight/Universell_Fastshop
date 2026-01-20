"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Tag, Link as LinkIcon, ExternalLink, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceItem, MenuItemType } from "./types";

interface AddMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pages: SourceItem[];
  categories: SourceItem[];
  onAddItems: (items: SourceItem[]) => void;
  menuLocation: "header" | "footer";
}

export function AddMenuItemModal({
  open,
  onOpenChange,
  pages,
  categories,
  onAddItems,
  menuLocation,
}: AddMenuItemModalProps) {
  const [activeTab, setActiveTab] = useState("pages");
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [customLinkLabel, setCustomLinkLabel] = useState("");
  const [customLinkUrl, setCustomLinkUrl] = useState("");
  const [customLinkNewTab, setCustomLinkNewTab] = useState(false);

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

  const handleAddItems = () => {
    const itemsToAdd: SourceItem[] = [];

    // Add selected pages
    pages.forEach((p) => {
      if (selectedPages.has(p.id)) {
        itemsToAdd.push(p);
      }
    });

    // Add selected categories
    categories.forEach((c) => {
      if (selectedCategories.has(c.id)) {
        itemsToAdd.push(c);
      }
    });

    // Add custom link if filled
    if (customLinkLabel.trim() && customLinkUrl.trim()) {
      itemsToAdd.push({
        id: `custom-${Date.now()}`,
        name: customLinkLabel.trim(),
        url: customLinkUrl.trim(),
        type: "custom_link" as MenuItemType,
      });
    }

    if (itemsToAdd.length > 0) {
      onAddItems(itemsToAdd);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedPages(new Set());
    setSelectedCategories(new Set());
    setCustomLinkLabel("");
    setCustomLinkUrl("");
    setCustomLinkNewTab(false);
    onOpenChange(false);
  };

  const totalSelected = selectedPages.size + selectedCategories.size + 
    (customLinkLabel.trim() && customLinkUrl.trim() ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>
            Add items to your {menuLocation} menu. Select pages, categories, or create custom links.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages" className="text-xs">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Pages
              {selectedPages.size > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full">
                  {selectedPages.size}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              Categories
              {selectedCategories.size > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full">
                  {selectedCategories.size}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-xs">
              <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
              Custom Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="mt-4">
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-1">
                {pages.map((page) => (
                  <label
                    key={page.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedPages.has(page.id)
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50 border border-transparent"
                    )}
                  >
                    <Checkbox
                      checked={selectedPages.has(page.id)}
                      onCheckedChange={() => togglePageSelection(page.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block">{page.name}</span>
                      <span className="text-xs text-muted-foreground">{page.url}</span>
                    </div>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <ScrollArea className="h-[250px] pr-4">
              {categories.length > 0 ? (
                <div className="space-y-1">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedCategories.has(category.id)
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50 border border-transparent"
                      )}
                    >
                      <Checkbox
                        checked={selectedCategories.has(category.id)}
                        onCheckedChange={() => toggleCategorySelection(category.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block">{category.name}</span>
                        <span className="text-xs text-muted-foreground">{category.url}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No categories available</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="link-label">Link Label</Label>
                <Input
                  id="link-label"
                  placeholder="e.g., Blog, FAQ, External Site"
                  value={customLinkLabel}
                  onChange={(e) => setCustomLinkLabel(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com or /page"
                  value={customLinkUrl}
                  onChange={(e) => setCustomLinkUrl(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={customLinkNewTab}
                  onCheckedChange={(checked) => setCustomLinkNewTab(checked === true)}
                />
                <span className="text-sm flex items-center gap-1.5">
                  Open in new tab
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </span>
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddItems} disabled={totalSelected === 0}>
            <Plus className="w-4 h-4 mr-2" />
            Add to Menu
            {totalSelected > 0 && ` (${totalSelected})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
