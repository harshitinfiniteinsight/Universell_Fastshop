"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, Undo2, Save, ShoppingBag, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

import { MenuItemV2, MenuItemFlat, SourceItem } from "./types";
import { SortableMenuTree, DropIntent } from "./sortable-menu-tree";
import { AddMenuItemModal } from "./add-menu-item-modal";
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
  defaultHeaderMenuItems,
  defaultFooterMenuItems,
  reorderWithIntent,
  MenuLocation,
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
  // Header menu state
  const [headerMenuItems, setHeaderMenuItems] = useState<MenuItemV2[]>([]);
  const [headerLastSaved, setHeaderLastSaved] = useState<MenuItemFlat[] | null>(null);
  
  // Footer menu state
  const [footerMenuItems, setFooterMenuItems] = useState<MenuItemV2[]>([]);
  const [footerLastSaved, setFooterLastSaved] = useState<MenuItemFlat[] | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [footerExpanded, setFooterExpanded] = useState(true);
  
  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalTarget, setAddModalTarget] = useState<MenuLocation>("header");

  // Load menus from storage on mount
  useEffect(() => {
    const savedHeader = loadMenuFromStorage("header");
    const savedFooter = loadMenuFromStorage("footer");
    
    const headerItems = savedHeader || defaultHeaderMenuItems;
    const footerItems = savedFooter || defaultFooterMenuItems;
    
    setHeaderMenuItems(flatToTree(headerItems));
    setHeaderLastSaved(headerItems);
    setFooterMenuItems(flatToTree(footerItems));
    setFooterLastSaved(footerItems);
    setIsLoading(false);
  }, []);

  // Autosave with debounce
  useEffect(() => {
    if (!isLoading && hasChanges) {
      const timeout = setTimeout(() => {
        const headerFlat = treeToFlat(headerMenuItems);
        const footerFlat = treeToFlat(footerMenuItems);
        saveMenuToStorage(headerFlat, "header");
        saveMenuToStorage(footerFlat, "footer");
        setHeaderLastSaved(headerFlat);
        setFooterLastSaved(footerFlat);
        setHasChanges(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [headerMenuItems, footerMenuItems, hasChanges, isLoading]);

  // Header menu handlers
  const updateHeaderMenu = useCallback((newItems: MenuItemV2[]) => {
    setHeaderMenuItems(newItems);
    setHasChanges(true);
  }, []);

  const handleHeaderReorder = useCallback((activeId: string, overId: string, intent: DropIntent) => {
    const newItems = reorderWithIntent(headerMenuItems, activeId, overId, intent);
    updateHeaderMenu(newItems);
  }, [headerMenuItems, updateHeaderMenu]);

  const handleHeaderUpdateItem = (id: string, updates: Partial<MenuItemV2>) => {
    updateHeaderMenu(updateItem(headerMenuItems, id, updates));
  };

  const handleHeaderRemoveItem = (id: string) => {
    updateHeaderMenu(removeItem(headerMenuItems, id));
  };

  const handleHeaderToggleExpand = (id: string) => {
    const item = findItemById(headerMenuItems, id);
    if (item) {
      handleHeaderUpdateItem(id, { isExpanded: !item.isExpanded });
    }
  };

  // Footer menu handlers
  const updateFooterMenu = useCallback((newItems: MenuItemV2[]) => {
    setFooterMenuItems(newItems);
    setHasChanges(true);
  }, []);

  const handleFooterReorder = useCallback((activeId: string, overId: string, intent: DropIntent) => {
    const newItems = reorderWithIntent(footerMenuItems, activeId, overId, intent);
    updateFooterMenu(newItems);
  }, [footerMenuItems, updateFooterMenu]);

  const handleFooterUpdateItem = (id: string, updates: Partial<MenuItemV2>) => {
    updateFooterMenu(updateItem(footerMenuItems, id, updates));
  };

  const handleFooterRemoveItem = (id: string) => {
    updateFooterMenu(removeItem(footerMenuItems, id));
  };

  const handleFooterToggleExpand = (id: string) => {
    const item = findItemById(footerMenuItems, id);
    if (item) {
      handleFooterUpdateItem(id, { isExpanded: !item.isExpanded });
    }
  };

  // Add items from modal
  const handleAddItems = (sources: SourceItem[]) => {
    const newItems = sources.map((source) => createMenuItem(source));
    if (addModalTarget === "header") {
      updateHeaderMenu([...headerMenuItems, ...newItems]);
    } else {
      updateFooterMenu([...footerMenuItems, ...newItems]);
    }
  };

  // Open add modal for specific menu
  const openAddModal = (target: MenuLocation) => {
    setAddModalTarget(target);
    setAddModalOpen(true);
  };

  // Revert to last saved
  const handleRevert = () => {
    if (headerLastSaved) {
      setHeaderMenuItems(flatToTree(headerLastSaved));
    }
    if (footerLastSaved) {
      setFooterMenuItems(flatToTree(footerLastSaved));
    }
    setHasChanges(false);
  };

  // Get visible items for preview
  const visibleHeaderItems = getVisibleItems(headerMenuItems);
  const visibleFooterItems = getVisibleItems(footerMenuItems);

  // Count total items
  const countItems = (items: MenuItemV2[]): number => {
    return items.reduce((acc, item) => acc + 1 + countItems(item.children), 0);
  };

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
            Configure navigation menus for your website header and footer.
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

      {/* Two Column Layout - 40/60 split */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Panel: Menu Structures (40%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Header Menu Structure Card */}
          <Card>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">Header Menu Structure</h3>
                <p className="text-xs text-muted-foreground">
                  Drag and drop to reorder. Nest items to create dropdown menus.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {countItems(headerMenuItems)} item{countItems(headerMenuItems) !== 1 ? "s" : ""}
                </Badge>
                <Button size="sm" onClick={() => openAddModal("header")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="p-4 min-h-[300px]">
              {headerMenuItems.length > 0 ? (
                <SortableMenuTree
                  items={headerMenuItems}
                  onReorder={handleHeaderReorder}
                  onUpdateItem={handleHeaderUpdateItem}
                  onRemoveItem={handleHeaderRemoveItem}
                  onToggleExpand={handleHeaderToggleExpand}
                />
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground mb-2">No menu items yet</p>
                  <Button variant="outline" size="sm" onClick={() => openAddModal("header")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Footer Menu Structure Card */}
          <Card className="border-muted">
            <button
              onClick={() => setFooterExpanded(!footerExpanded)}
              className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/30 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Footer Menu Structure</h3>
                <p className="text-xs text-muted-foreground">
                  Optional footer navigation links
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {countItems(footerMenuItems)} item{countItems(footerMenuItems) !== 1 ? "s" : ""}
                </Badge>
                {footerExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {footerExpanded && (
              <>
                <div className="flex items-center justify-end p-3 border-b border-border bg-muted/20">
                  <Button size="sm" variant="outline" onClick={() => openAddModal("footer")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="p-4 min-h-[200px]">
                  {footerMenuItems.length > 0 ? (
                    <SortableMenuTree
                      items={footerMenuItems}
                      onReorder={handleFooterReorder}
                      onUpdateItem={handleFooterUpdateItem}
                      onRemoveItem={handleFooterRemoveItem}
                      onToggleExpand={handleFooterToggleExpand}
                    />
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg bg-muted/10">
                      <p className="text-sm text-muted-foreground mb-2">No footer menu items</p>
                      <p className="text-xs text-muted-foreground">
                        Footer menu is optional. Add items if needed.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Right Panel: Live Preview (60%) */}
        <div className="lg:col-span-6">
          <Card className="h-full min-h-[600px] flex flex-col sticky top-6">
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

                    {/* Header Navigation */}
                    <nav className="flex items-center gap-3">
                      {visibleHeaderItems.length > 0 ? (
                        visibleHeaderItems.map((item, idx) => (
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
                        <span className="text-xs text-muted-foreground italic">No header items</span>
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
                  <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-sm font-bold text-foreground">Welcome to FastShop</h2>
                      <p className="text-xs text-muted-foreground">Your one-stop destination</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-16 bg-muted/50 rounded" />
                </div>

                {/* Mock Website Footer with Live Menu */}
                <div className="border-t border-border bg-muted/30 px-4 py-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-primary/80 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-[8px]">FS</span>
                      </div>
                      <span className="text-xs text-muted-foreground">© 2026 FastShop</span>
                    </div>
                    
                    {/* Footer Navigation */}
                    <nav className="flex items-center gap-3">
                      {visibleFooterItems.length > 0 ? (
                        visibleFooterItems.map((item) => (
                          <span
                            key={item.id}
                            className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            {item.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-muted-foreground/50 italic">
                          No footer links
                        </span>
                      )}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      <AddMenuItemModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        pages={availablePages}
        categories={availableCategories}
        onAddItems={handleAddItems}
        menuLocation={addModalTarget}
      />
    </div>
  );
}
