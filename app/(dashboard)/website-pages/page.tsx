"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Sparkles,
  ShoppingBag,
  Briefcase,
  Calendar,
  Package,
  X,
  Layers,
  CheckCircle2,
  PartyPopper,
  Menu,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Page {
  id: string;
  name: string;
  slug: string;
  blocks: number;
  status: "published" | "draft";
  modifiedDate: string;
}

interface PageData extends Page {
  editPath?: string;
}

type ModalType = "main" | "product" | "service" | "booking" | "product-listing" | "service-listing" | null;

const activePages: PageData[] = [
  {
    id: "1",
    name: "Homepage",
    slug: "home",
    blocks: 8,
    status: "published",
    modifiedDate: "01/09/2026",
    editPath: "/website-pages/edit/1",
  },
  {
    id: "2",
    name: "About Us",
    slug: "about",
    blocks: 5,
    status: "published",
    modifiedDate: "01/08/2026",
    editPath: "/website-pages/edit/2",
  },
  {
    id: "products",
    name: "Products",
    slug: "products",
    blocks: 4,
    status: "published",
    modifiedDate: "01/07/2026",
    editPath: "/website-pages/edit/products",
  },
  {
    id: "4",
    name: "Contact",
    slug: "contact",
    blocks: 3,
    status: "published",
    modifiedDate: "01/05/2026",
    editPath: "/website-pages/edit/4",
  },
  {
    id: "5",
    name: "Summer Sale",
    slug: "summer-sale",
    blocks: 6,
    status: "draft",
    modifiedDate: "01/09/2026",
    editPath: "/website-pages/edit/5",
  },
];

const archivedPages: PageData[] = [
  {
    id: "6",
    name: "Old Promo",
    slug: "old-promo",
    blocks: 4,
    status: "draft",
    modifiedDate: "12/15/2025",
  },
];

const demoProducts = [
  { id: "1", name: "Artisan Sourdough Bread" },
  { id: "2", name: "Chocolate Croissant" },
  { id: "3", name: "Blueberry Muffin" },
  { id: "4", name: "Cinnamon Roll" },
  { id: "5", name: "House Blend Coffee Beans" },
];

const demoServices = [
  { id: "1", name: "Catering Consultation" },
  { id: "2", name: "Private Event Catering" },
  { id: "3", name: "Corporate Breakfast Package" },
  { id: "4", name: "Baking Class - Bread Making" },
];

const demoBookingForms = [
  { id: "1", name: "Table Reservation" },
  { id: "2", name: "Private Event Booking" },
  { id: "3", name: "Catering Request" },
];

const promptExamples = [
  "Create a landing page for a new product launch.",
  "Design a user-friendly onboarding flow for mobile app users.",
  "Develop a responsive website layout for a non-profit organization.",
  "Revamp the existing e-commerce checkout process to improve conversion rates.",
];

export default function WebsitePagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>("1"); // Default to Homepage
  const [previewLoading, setPreviewLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{
    selectedPages?: string[];
    customPages?: string[];
    primaryColor?: { name: string; hex: string };
    secondaryColor?: { name: string; hex: string };
  } | null>(null);
  const [generatedPages, setGeneratedPages] = useState<PageData[]>([]);

  // Check for welcome toast and generated pages on mount
  useEffect(() => {
    const shouldShowToast = localStorage.getItem("universell-show-welcome-toast");
    const savedOnboardingData = localStorage.getItem("universell-onboarding-data");
    const savedGeneratedPages = localStorage.getItem("universell-generated-pages");
    
    if (shouldShowToast === "true") {
      setShowWelcomeToast(true);
      localStorage.removeItem("universell-show-welcome-toast");
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        setShowWelcomeToast(false);
      }, 8000);
    }
    
    if (savedOnboardingData) {
      try {
        setOnboardingData(JSON.parse(savedOnboardingData));
      } catch (e) {
        console.error("Error parsing onboarding data:", e);
      }
    }

    // Load auto-generated pages from onboarding
    if (savedGeneratedPages) {
      try {
        const pages = JSON.parse(savedGeneratedPages);
        setGeneratedPages(pages.map((page: { id: string; name: string; slug: string; blocks: number; status: string; modifiedDate: string }) => ({
          ...page,
          editPath: `/website-pages/edit/${page.id}`,
        })));
      } catch (e) {
        console.error("Error parsing generated pages:", e);
      }
    }
  }, []);

  // Combine default pages with generated pages (generated pages take priority)
  const allActivePages = generatedPages.length > 0 
    ? generatedPages 
    : activePages;

  const filteredActivePages = allActivePages.filter((page) =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected page data
  const selectedPage = [...allActivePages, ...archivedPages].find(p => p.id === selectedPageId) || allActivePages[0];

  // Handle page selection with loading simulation
  const handleSelectPage = (pageId: string) => {
    if (pageId !== selectedPageId) {
      setPreviewLoading(true);
      setSelectedPageId(pageId);
      // Simulate loading delay
      setTimeout(() => setPreviewLoading(false), 500);
    }
  };

  const handleCreatePage = () => {
    // Simulate page creation
    console.log("Creating page with:", { selectedItem, aiPrompt });
    setActiveModal(null);
    setSelectedItem("");
    setAiPrompt("");
  };

  const PageRow = ({ page, isSelected, onSelect }: { page: PageData; isSelected?: boolean; onSelect?: () => void }) => (
    <div 
      onClick={onSelect}
      className={`flex items-center justify-between py-3 px-4 border-b border-border last:border-0 transition-colors cursor-pointer ${
        isSelected 
          ? "bg-primary/10 border-l-2 border-l-primary" 
          : "hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSelected ? "bg-primary/20" : "bg-primary/10"
        }`}>
          <FileText className={`w-4 h-4 ${isSelected ? "text-primary" : "text-primary"}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-medium truncate ${isSelected ? "text-primary" : "text-foreground"}`}>{page.name}</p>
          <p className="text-xs text-muted-foreground truncate">/{page.slug}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge
          variant={page.status === "published" ? "default" : "secondary"}
          className={`text-xs ${
            page.status === "published"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {page.status === "published" ? "Published" : "Draft"}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={page.editPath || `/website-pages/edit/${page.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`/${page.slug}`, "_blank")}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const pageTypeOptions = [
    {
      id: "new-page",
      icon: Sparkles,
      title: "Create New Page",
      description: "Use AI to generate a new page",
      action: () => setActiveModal(null),
      href: "/website-pages/create",
    },
    {
      id: "booking",
      icon: Calendar,
      title: "Create Booking Page",
      description: "Create a custom page to showcase your booking options.",
      action: () => setActiveModal("booking"),
    },
    {
      id: "product-listing",
      icon: ShoppingBag,
      title: "Create Product Listing Page",
      description: "Create a custom page to showcase your booking options.",
      action: () => setActiveModal("product-listing"),
    },
    {
      id: "product",
      icon: Package,
      title: "Create Page for a Product",
      description: "Generate a dedicated page for an individual product.",
      action: () => setActiveModal("product"),
    },
    {
      id: "service-listing",
      icon: Briefcase,
      title: "Create Service Listing Page",
      description: "Create a custom page to showcase your booking options.",
      action: () => setActiveModal("service-listing"),
    },
    {
      id: "service",
      icon: Layers,
      title: "Create Page for a Service",
      description: "Design a dedicated page for a specific service.",
      action: () => setActiveModal("service"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Toast from Onboarding */}
      {showWelcomeToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-card border border-border shadow-2xl rounded-2xl p-5 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                <PartyPopper className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Your website structure is ready 🎉
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You can now edit, reorder, or add pages. Your design and colors are already applied.
                </p>
                {onboardingData?.primaryColor && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">Theme:</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: onboardingData.primaryColor.hex }}
                        title={onboardingData.primaryColor.name}
                      />
                      {onboardingData.secondaryColor && (
                        <div
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: onboardingData.secondaryColor.hex }}
                          title={onboardingData.secondaryColor.name}
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    size="sm"
                    className="rounded-lg"
                    onClick={() => setShowWelcomeToast(false)}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                    Edit Pages
                  </Button>
                  <button
                    onClick={() => setShowWelcomeToast(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowWelcomeToast(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Pages</h1>
          <p className="text-muted-foreground">
            Manage your website pages and create new ones with AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/settings/menu">
              <Menu className="w-4 h-4 mr-2" />
              Manage Fastshop Menu
            </Link>
          </Button>
          <Button onClick={() => setActiveModal("main")}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Page
          </Button>
        </div>
      </div>

      {/* Split Layout: Pages List + Preview */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Pages List (40%) */}
        <div className="w-full lg:w-[40%]">
          <Card className="h-full">
            <Tabs defaultValue="active" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-4">
                <TabsList>
                  <TabsTrigger value="active" className="gap-2 text-sm">
                    Active
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {allActivePages.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="gap-2 text-sm">
                    Archived
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {archivedPages.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-48 pl-10"
                  />
                </div>
              </div>

              <TabsContent value="active" className="mt-4">
                <div className="divide-y divide-border max-h-[calc(100vh-300px)] overflow-y-auto">
                  {filteredActivePages.map((page) => (
                    <PageRow 
                      key={page.id} 
                      page={page} 
                      isSelected={selectedPageId === page.id}
                      onSelect={() => handleSelectPage(page.id)}
                    />
                  ))}
                  {filteredActivePages.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      No pages found
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="archived" className="mt-4">
                <div className="divide-y divide-border max-h-[calc(100vh-300px)] overflow-y-auto">
                  {archivedPages.map((page) => (
                    <PageRow 
                      key={page.id} 
                      page={page}
                      isSelected={selectedPageId === page.id}
                      onSelect={() => handleSelectPage(page.id)}
                    />
                  ))}
                  {archivedPages.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      No archived pages
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Panel: Page Preview (60%) */}
        <div className="w-full lg:w-[60%]">
          <Card className="h-full min-h-[500px] lg:min-h-[calc(100vh-200px)] flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Page Preview</span>
              </div>
              {selectedPage && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground font-medium">{selectedPage.name}</span>
                  <Badge
                    variant={selectedPage.status === "published" ? "default" : "secondary"}
                    className={`text-xs ${
                      selectedPage.status === "published"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                  >
                    {selectedPage.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
              )}
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
              ) : selectedPage ? (
                <div className="h-full flex flex-col">
                  {/* Mock Preview Frame */}
                  <div className="flex-1 p-4">
                    <div className="h-full bg-background rounded-lg border border-border shadow-sm overflow-hidden">
                      {/* Mock Browser Header */}
                      <div className="h-8 bg-muted/50 border-b border-border flex items-center px-3 gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground text-center">
                            yourstore.com/{selectedPage.slug}
                          </div>
                        </div>
                      </div>

                      {/* Mock Page Content */}
                      <div className="p-6 space-y-6">
                        {/* Hero Section Mock */}
                        <div className="space-y-4">
                          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <h2 className="text-xl font-bold text-foreground">{selectedPage.name}</h2>
                              <p className="text-sm text-muted-foreground mt-1">/{selectedPage.slug}</p>
                            </div>
                          </div>
                        </div>

                        {/* Content Blocks Mock */}
                        <div className="grid grid-cols-3 gap-3">
                          {Array.from({ length: Math.min(selectedPage.blocks, 6) }).map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                          ))}
                        </div>

                        {/* Text Content Mock */}
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                        </div>

                        {/* Additional Blocks */}
                        {selectedPage.blocks > 3 && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="h-24 bg-muted/50 rounded" />
                            <div className="h-24 bg-muted/50 rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preview Actions */}
                  <div className="p-4 border-t border-border bg-background flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {selectedPage.blocks} blocks • Modified {selectedPage.modifiedDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(`/${selectedPage.slug}`, "_blank")}>
                        <Eye className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={selectedPage.editPath || `/website-pages/edit/${selectedPage.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Page
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">Select a page to preview</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Main Create Page Modal */}
      <Dialog open={activeModal === "main"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a Website Page</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mb-4">
            Create a new page with AI or view your existing pages.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {pageTypeOptions.map((option) => (
              option.href ? (
                <Link
                  key={option.id}
                  href={option.href}
                  className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <option.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                </Link>
              ) : (
                <button
                  key={option.id}
                  onClick={option.action}
                  className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <option.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                </button>
              )
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Product Page Modal */}
      <Dialog open={activeModal === "product"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Product Page with AI</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Product</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {demoProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Describe what kind of page you want to create. Our AI will generate a structured page with relevant actions.</Label>
              <Textarea 
                placeholder="Describe here..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Try one of these examples:</p>
              <div className="space-y-2">
                {promptExamples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiPrompt(example)}
                    className="w-full p-3 text-left text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePage}>
                Create Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Service Page Modal */}
      <Dialog open={activeModal === "service"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Service Page with AI</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Service</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {demoServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Describe what kind of page you want to create. Our AI will generate a structured page with relevant actions.</Label>
              <Textarea 
                placeholder="Describe here..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Try one of these examples:</p>
              <div className="space-y-2">
                {promptExamples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiPrompt(example)}
                    className="w-full p-3 text-left text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePage}>
                Create Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Booking Page Modal */}
      <Dialog open={activeModal === "booking"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Bookings Page with AI</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Booking Form</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Bookings Form" />
                </SelectTrigger>
                <SelectContent>
                  {demoBookingForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Describe what kind of page you want to create. Our AI will generate a structured page with relevant actions.</Label>
              <Textarea 
                placeholder="Describe here..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Try one of these examples:</p>
              <div className="space-y-2">
                {promptExamples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiPrompt(example)}
                    className="w-full p-3 text-left text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePage}>
                Create Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Listing Page - just redirect */}
      <Dialog open={activeModal === "product-listing"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Product Listing Page</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            This will create a new product listing page where all your products will be displayed.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button asChild>
              <Link href="/website-pages/edit/products">
                Create & Edit Page
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Listing Page */}
      <Dialog open={activeModal === "service-listing"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Service Listing Page</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            This will create a new service listing page where all your services will be displayed.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setActiveModal(null);
              // Navigate to service listing editor
            }}>
              Create & Edit Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
