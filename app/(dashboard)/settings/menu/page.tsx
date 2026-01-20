"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  ShoppingBag,
  Briefcase,
  Phone,
  Info,
  Settings,
  Eye,
  Loader2,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuBuilder } from "@/components/menu-builder";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  page?: string;
  icon: React.ElementType;
  visible: boolean;
  children?: MenuItem[];
  isExpanded?: boolean;
}

const initialMenuItems: MenuItem[] = [
  { id: "1", label: "Home", url: "/", page: "Homepage", icon: Home, visible: true },
  { id: "2", label: "Products", url: "/products", page: "Products", icon: ShoppingBag, visible: true },
  { id: "3", label: "Services", url: "/services", page: "Services", icon: Briefcase, visible: true },
  { id: "4", label: "About Us", url: "/about", page: "About Us", icon: Info, visible: true },
  { id: "5", label: "Contact", url: "/contact", page: "Contact", icon: Phone, visible: true },
];

const availablePages = [
  { id: "homepage", name: "Homepage", url: "/" },
  { id: "products", name: "Products", url: "/products" },
  { id: "services", name: "Services", url: "/services" },
  { id: "about", name: "About Us", url: "/about" },
  { id: "contact", name: "Contact", url: "/contact" },
  { id: "booking", name: "Booking", url: "/booking" },
  { id: "gallery", name: "Gallery", url: "/gallery" },
  { id: "testimonials", name: "Testimonials", url: "/testimonials" },
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemPage, setNewItemPage] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(true);

  // Simulate initial preview load
  useEffect(() => {
    const timer = setTimeout(() => setPreviewLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get visible menu items for preview
  const visibleMenuItems = menuItems.filter((item) => item.visible);

  const toggleVisibility = (id: string) => {
    setMenuItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== id));
  };

  const addItem = () => {
    if (!newItemLabel.trim()) return;

    const selectedPage = availablePages.find((p) => p.id === newItemPage);
    const newItem: MenuItem = {
      id: Date.now().toString(),
      label: newItemLabel,
      url: newItemUrl || selectedPage?.url || "/",
      page: selectedPage?.name,
      icon: FileText,
      visible: true,
    };

    setMenuItems((items) => [...items, newItem]);
    setNewItemLabel("");
    setNewItemPage("");
    setNewItemUrl("");
    setShowAddItem(false);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= menuItems.length) return;

    const newItems = [...menuItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setMenuItems(newItems);
  };

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Fastshop Menu Settings
          </h1>
          <p className="text-muted-foreground">
            Manage the navigation menu for your Fast Shop website
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" asChild>
                <Link href="/website-pages">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Manage Website Pages</span>
                  <span className="sm:hidden">Pages</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit, add, or rearrange your website pages</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Mode Switcher: Classic vs WordPress-style Builder */}
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="builder" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Menu Builder
          </TabsTrigger>
          <TabsTrigger value="classic" className="gap-2">
            <Settings className="w-4 h-4" />
            Classic Mode
          </TabsTrigger>
        </TabsList>

        {/* New WordPress-Style Menu Builder */}
        <TabsContent value="builder" className="mt-6">
          <MenuBuilder />
        </TabsContent>

        {/* Classic Mode (Original UI) */}
        <TabsContent value="classic" className="mt-6">
          <div className="flex items-center justify-end mb-4">
            <Button onClick={() => setShowAddItem(true)}>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Menu Item</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Menu Settings (45%) */}
        <div className="w-full lg:w-[45%] space-y-6">
          {/* Menu Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Menu Preview</h2>
              <Badge variant="secondary">Header Navigation</Badge>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-6 justify-center flex-wrap">
                {visibleMenuItems.map((item) => (
                  <span
                    key={item.id}
                    className="text-sm font-medium text-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    {item.label}
                  </span>
                ))}
                {visibleMenuItems.length === 0 && (
                  <span className="text-sm text-muted-foreground">No visible menu items</span>
                )}
              </div>
            </div>
          </Card>

      {/* Menu Items List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Menu Items
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Drag to reorder, toggle visibility, or remove menu items
        </p>

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-3 border rounded-lg transition-colors",
                item.visible ? "bg-card" : "bg-muted/50 opacity-60"
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
              
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.page ? `Page: ${item.page}` : item.url}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  checked={item.visible}
                  onCheckedChange={() => toggleVisibility(item.id)}
                  className="scale-90"
                />

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="h-7 w-7"
                  >
                    <ChevronDown className="w-3 h-3 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === menuItems.length - 1}
                    className="h-7 w-7"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Form */}
        {showAddItem && (
          <div className="mt-6 p-4 border border-dashed border-primary rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">Add New Menu Item</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  placeholder="e.g., Gallery"
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Link to Page</Label>
                <Select value={newItemPage} onValueChange={(value) => {
                  setNewItemPage(value);
                  const page = availablePages.find((p) => p.id === value);
                  if (page) setNewItemUrl(page.url);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Custom URL (optional)</Label>
                <Input
                  placeholder="e.g., /custom-page or https://external.com"
                  value={newItemUrl}
                  onChange={(e) => setNewItemUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowAddItem(false)}>
                Cancel
              </Button>
              <Button onClick={addItem}>
                Add Item
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Footer Menu */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Footer Menu</h2>
            <p className="text-sm text-muted-foreground">
              Configure links displayed in the website footer
            </p>
          </div>
          <Badge variant="outline">Coming Soon</Badge>
        </div>
        <div className="bg-muted/30 rounded-lg p-6 text-center text-muted-foreground text-sm">
          Footer menu configuration will be available in a future update.
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </div>
    </div>

        {/* Right Column: Home Page Preview (55%) */}
        <div className="w-full lg:w-[55%]">
          <Card className="h-full min-h-[600px] lg:min-h-[calc(100vh-180px)] flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">Home Page Preview</span>
                  <p className="text-xs text-muted-foreground">See how your menu appears on the website</p>
                </div>
              </div>
              <Badge variant="secondary">Live Preview</Badge>
            </div>

            {/* Preview Content */}
            <div className="flex-1 bg-muted/30 relative overflow-hidden">
              {previewLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading preview...</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Mock Preview Frame */}
                  <div className="flex-1 p-4">
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
                        <div className="px-6 py-4 flex items-center justify-between">
                          {/* Logo */}
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">FS</span>
                            </div>
                            <span className="font-semibold text-foreground">FastShop</span>
                          </div>
                          
                          {/* Navigation - Live Updated */}
                          <nav className="flex items-center gap-4">
                            {visibleMenuItems.map((item, idx) => (
                              <span
                                key={item.id}
                                className={cn(
                                  "text-sm font-medium transition-colors cursor-pointer",
                                  idx === 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {item.label}
                              </span>
                            ))}
                            {visibleMenuItems.length === 0 && (
                              <span className="text-sm text-muted-foreground italic">No menu items</span>
                            )}
                          </nav>

                          {/* Mock Cart */}
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mock Page Content */}
                      <div className="flex-1 overflow-auto p-6 space-y-6">
                        {/* Hero Section Mock */}
                        <div className="h-40 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-xl font-bold text-foreground">Welcome to FastShop</h2>
                            <p className="text-sm text-muted-foreground mt-1">Your one-stop destination</p>
                          </div>
                        </div>

                        {/* Content Blocks Mock */}
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                          ))}
                        </div>

                        {/* Text Content Mock */}
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                        </div>

                        {/* Featured Section */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-28 bg-muted/50 rounded" />
                          <div className="h-28 bg-muted/50 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}
