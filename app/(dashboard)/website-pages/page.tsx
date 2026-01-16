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
  const [onboardingData, setOnboardingData] = useState<{
    selectedPages?: string[];
    customPages?: string[];
    primaryColor?: { name: string; hex: string };
    secondaryColor?: { name: string; hex: string };
  } | null>(null);

  // Check for welcome toast on mount
  useEffect(() => {
    const shouldShowToast = localStorage.getItem("universell-show-welcome-toast");
    const savedOnboardingData = localStorage.getItem("universell-onboarding-data");
    
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
  }, []);

  const filteredActivePages = activePages.filter((page) =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePage = () => {
    // Simulate page creation
    console.log("Creating page with:", { selectedItem, aiPrompt });
    setActiveModal(null);
    setSelectedItem("");
    setAiPrompt("");
  };

  const PageRow = ({ page }: { page: PageData }) => (
    <div className="flex items-center justify-between py-4 px-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{page.name}</p>
          <p className="text-sm text-muted-foreground">/{page.slug}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {page.blocks} blocks
          </p>
          <p className="text-xs text-muted-foreground">
            Modified {page.modifiedDate}
          </p>
        </div>

        <Badge
          variant={page.status === "published" ? "default" : "secondary"}
          className={
            page.status === "published"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }
        >
          {page.status === "published" ? "Published" : "Draft"}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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
        <Button onClick={() => setActiveModal("main")}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Page
        </Button>
      </div>

      {/* Tabs and Search */}
      <Card>
        <Tabs defaultValue="active" className="w-full">
          <div className="flex items-center justify-between px-4 pt-4">
            <TabsList>
              <TabsTrigger value="active" className="gap-2">
                Active Pages
                <Badge variant="secondary" className="ml-1">
                  {activePages.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="archived" className="gap-2">
                Archived Pages
                <Badge variant="secondary" className="ml-1">
                  {archivedPages.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
          </div>

          <TabsContent value="active" className="mt-4">
            <div className="divide-y divide-border">
              {filteredActivePages.map((page) => (
                <PageRow key={page.id} page={page} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="mt-4">
            <div className="divide-y divide-border">
              {archivedPages.map((page) => (
                <PageRow key={page.id} page={page} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

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
