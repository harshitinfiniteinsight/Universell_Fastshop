"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, Undo2, Save, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

import { MenuItemV2, MenuItemFlat, SourceItem } from "./types";
import { SortableMenuTree, DropIntent } from "./sortable-menu-tree";
import { SourcesPanel } from "./sources-panel";
import {
  flatToTree,
  treeToFlat,
  createMenuItem,
  removeItem,
  updateItem,
  getVisibleItems,
  findItemById,
  saveMenuToStorage,
  loadMenuFromStorage,
  defaultMenuItems,
  generateId,
  reorderWithIntent,
} from "./utils";

// Available pages to add to menu
const availablePages: SourceItem[] = [
  { id: "homepage", name: "Homepage", url: "/", type: "page" },
  { id: "products", name: "Products", url: "/products", type: "page" },
  { id: "services", name: "Services", url: "/services", type: "page" },
  { id: "about", name: "About Us", url: "/about", type: "page" },
  { id: "contact", name: "Contact", url: "/contact", type: "page" },
  { id: "booking", name: "Booking", url: "/booking", type: "page" },
  { id: "gallery", name: "Gallery", url: "/gallery", type: "page" },
  { id: "testimonials", name: "Testimonials", url: "/testimonials", type: "page" },
];

// Available categories
const availableCategories: SourceItem[] = [
  { id: "bakery", name: "Bakery", url: "/products/bakery", type: "category" },
  { id: "pastries", name: "Pastries", url: "/products/pastries", type: "category" },
  { id: "coffee", name: "Coffee", url: "/products/coffee", type: "category" },
  { id: "beverages", name: "Beverages", url: "/products/beverages", type: "category" },
];

export function MenuBuilder() {
  const [menuItems, setMenuItems] = useState<MenuItemV2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<MenuItemFlat[] | null>(null);

  // Load menu from storage on mount
  useEffect(() => {
    const saved = loadMenuFromStorage();
    const items = saved || defaultMenuItems;
    setMenuItems(flatToTree(items));
    setLastSaved(items);
    setIsLoading(false);
  }, []);

  // Autosave with debounce
  useEffect(() => {
    if (!isLoading && hasChanges) {
      const timeout = setTimeout(() => {
        const flatItems = treeToFlat(menuItems);
        saveMenuToStorage(flatItems);
        setLastSaved(flatItems);
        setHasChanges(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [menuItems, hasChanges, isLoading]);

  // Mark as changed when menu updates
  const updateMenu = useCallback((newItems: MenuItemV2[]) => {
    setMenuItems(newItems);
    setHasChanges(true);
  }, []);

  // Handle reorder from drag and drop with nesting support
  const handleReorder = useCallback((activeId: string, overId: string, intent: DropIntent) => {
    const newItems = reorderWithIntent(menuItems, activeId, overId, intent);
    updateMenu(newItems);
  }, [menuItems, updateMenu]);

  // Handle item updates
  const handleUpdateItem = (id: string, updates: Partial<MenuItemV2>) => {
    updateMenu(updateItem(menuItems, id, updates));
  };

  // Handle item removal
  const handleRemoveItem = (id: string) => {
    updateMenu(removeItem(menuItems, id));
  };

  // Handle expand/collapse
  const handleToggleExpand = (id: string) => {
    const item = findItemById(menuItems, id);
    if (item) {
      handleUpdateItem(id, { isExpanded: !item.isExpanded });
    }
  };

  // Add items from sources panel
  const handleAddItems = (sources: SourceItem[]) => {
    const newItems = sources.map((source) => createMenuItem(source));
    updateMenu([...menuItems, ...newItems]);
  };

  // Revert to last saved
  const handleRevert = () => {
    if (lastSaved) {
      setMenuItems(flatToTree(lastSaved));
      setHasChanges(false);
    }
  };

  // Get visible items for preview
  const visibleItems = getVisibleItems(menuItems);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Builder</h1>
          <p className="text-muted-foreground">
            Drag and drop to reorder. Nest items to create dropdowns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleRevert} disabled={!hasChanges}>
            <Undo2 className="w-4 h-4 mr-2" />
            Revert
          </Button>
          <Button disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Sources (3 cols) */}
        <div className="lg:col-span-3">
          <SourcesPanel
            pages={availablePages}
            categories={availableCategories}
            onAddItems={handleAddItems}
          />
        </div>

        {/* Center Panel: Menu Structure (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">Menu Structure</h3>
                <p className="text-xs text-muted-foreground">
                  {menuItems.length} item{menuItems.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Badge variant="outline">Header Menu</Badge>
            </div>

            <div className="p-4 min-h-[400px]">
              {menuItems.length > 0 ? (
                <SortableMenuTree
                  items={menuItems}
                  onReorder={handleReorder}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                  onToggleExpand={handleToggleExpand}
                />
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground mb-2">No menu items yet</p>
                  <p className="text-sm text-muted-foreground">
                    Select items from the left panel to add to your menu
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel: Live Preview (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="h-full min-h-[500px] flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">Live Preview</span>
                  <p className="text-xs text-muted-foreground">Updates in real-time</p>
                </div>
              </div>
              <Badge variant="secondary">Desktop</Badge>
            </div>

            {/* Preview Content */}
            <div className="flex-1 bg-muted/30 p-4">
              <div className="h-full bg-background rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
                {/* Mock Browser Header */}
                <div className="h-8 bg-muted/50 border-b border-border flex items-center px-3 gap-2 flex-shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground text-center">
                      yourstore.com/
                    </div>
                  </div>
                </div>

                {/* Mock Website Header with Live Menu */}
                <div className="border-b border-border bg-background flex-shrink-0">
                  <div className="px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">FS</span>
                      </div>
                      <span className="font-semibold text-sm text-foreground">FastShop</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-3">
                      {visibleItems.length > 0 ? (
                        visibleItems.map((item, idx) => (
                          <div key={item.id} className="relative group">
                            <span
                              className={cn(
                                "text-xs font-medium transition-colors cursor-pointer",
                                idx === 0
                                  ? "text-primary"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {item.label}
                              {item.children.length > 0 && " ▼"}
                            </span>
                            {/* Dropdown indicator */}
                            {item.children.length > 0 && (
                              <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg py-1 min-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                {item.children.map((child) => (
                                  <div
                                    key={child.id}
                                    className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                  >
                                    {child.label}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No visible items</span>
                      )}
                    </nav>

                    {/* Cart */}
                    <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Mock Page Content */}
                <div className="flex-1 p-4 space-y-4">
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-sm font-bold text-foreground">Welcome to FastShop</h2>
                      <p className="text-xs text-muted-foreground">Your one-stop destination</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
