"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Fastshop Menu Settings
          </h1>
          <p className="text-muted-foreground">
            Manage the navigation menu for your Fast Shop website
          </p>
        </div>
        <Button onClick={() => setShowAddItem(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Menu Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Menu Preview</h2>
          <Badge variant="secondary">Header Navigation</Badge>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-6 justify-center">
            {menuItems
              .filter((item) => item.visible)
              .map((item) => (
                <span
                  key={item.id}
                  className="text-sm font-medium text-foreground hover:text-primary cursor-pointer"
                >
                  {item.label}
                </span>
              ))}
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
                "flex items-center gap-4 p-4 border rounded-lg transition-colors",
                item.visible ? "bg-card" : "bg-muted/50 opacity-60"
              )}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">
                  {item.page ? `Page: ${item.page}` : item.url}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Visible</span>
                  <Switch
                    checked={item.visible}
                    onCheckedChange={() => toggleVisibility(item.id)}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === menuItems.length - 1}
                    className="h-8 w-8"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Form */}
        {showAddItem && (
          <div className="mt-6 p-4 border border-dashed border-primary rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">Add New Menu Item</h3>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="col-span-2 space-y-2">
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
        <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
          Footer menu configuration will be available in a future update.
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
