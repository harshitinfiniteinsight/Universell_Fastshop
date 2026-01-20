"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Star,
  Layers,
  BarChart3,
  ShoppingCart,
  Calendar,
  Users,
  Settings,
  ExternalLink,
  Share2,
  FileText,
  Settings2,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
  Grid3X3,
  Menu,
  X,
  Eye,
  Palette,
  Globe,
  Image,
  Package,
  Bookmark,
  List,
  Link2,
  Mail,
  Phone,
  MessageSquare,
  FileEdit,
  PlusCircle,
  ClipboardList,
  Truck,
  Megaphone,
  FolderTree,
  LayoutGrid,
  Store,
  Sparkles,
  Briefcase,
  ShoppingBag,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
  isAccordion?: boolean;
  onClick?: () => void;
}

const bottomNavItems: NavItem[] = [
  { icon: Eye, label: "Live Preview", href: "/preview", external: true },
  { icon: Share2, label: "Share", href: "/share" },
];

// Page creation options for the modal
const pageCreationOptions = [
  {
    id: "new-page",
    icon: Sparkles,
    title: "Create New Page",
    description: "Use AI to generate a new page",
    href: "/website-pages/create",
  },
  {
    id: "booking",
    icon: Calendar,
    title: "Create Booking Page",
    description: "Create a custom page to showcase your booking options.",
    href: "/website-pages/create?type=booking",
  },
  {
    id: "product-listing",
    icon: ShoppingBag,
    title: "Create Product Listing Page",
    description: "Create a custom page to showcase your products.",
    href: "/website-pages/create?type=product-listing",
  },
  {
    id: "product",
    icon: Package,
    title: "Create Page for a Product",
    description: "Generate a dedicated page for an individual product.",
    href: "/website-pages/create?type=product",
  },
  {
    id: "service-listing",
    icon: Briefcase,
    title: "Create Service Listing Page",
    description: "Create a custom page to showcase your services.",
    href: "/website-pages/create?type=service-listing",
  },
  {
    id: "service",
    icon: Layers,
    title: "Create Page for a Service",
    description: "Design a dedicated page for a specific service.",
    href: "/website-pages/create?type=service",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createPageModalOpen, setCreatePageModalOpen] = useState(false);

  // Define mainNavItems inside component to access setCreatePageModalOpen
  const mainNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    {
      icon: Star,
      label: "Quick Links",
      isAccordion: true,
      children: [
        { icon: Package, label: "Product/Services", href: "/inventory/manage", external: true },
        { icon: Calendar, label: "Booking Forms", href: "/booking/forms", external: true },
        { icon: ClipboardList, label: "Orders", href: "/orders", external: true },
        { icon: Users, label: "Customers", href: "/customers", external: true },
        { icon: Megaphone, label: "Marketing", href: "/marketing", external: true },
        { icon: Truck, label: "Delivery Settings", href: "/delivery/settings", external: true },
      ],
    },
    {
      icon: Layers,
      label: "Website Pages",
      isAccordion: true,
      children: [
        { icon: FileText, label: "All Pages", href: "/website-pages" },
        { icon: PlusCircle, label: "Create New Page", onClick: () => setCreatePageModalOpen(true) },
      ],
    },
    {
      icon: Settings2,
      label: "Website Settings",
      isAccordion: true,
      children: [
        { icon: Image, label: "Change Logo", href: "/settings/logo" },
        { icon: Bookmark, label: "Product Positioning", href: "/settings/positioning" },
        { icon: FolderTree, label: "Categories", href: "/settings/categories" },
        { icon: LayoutGrid, label: "Subcategories", href: "/settings/subcategories" },
        { icon: Store, label: "Store Appearance", href: "/settings/appearance" },
        { icon: Palette, label: "Change Theme Color", href: "/settings/theme-color" },
        { icon: List, label: "Fastshop Menu Settings", href: "/settings/menu" },
        { icon: Globe, label: "Domain Setup", href: "/settings/domain" },
        { icon: BarChart3, label: "Connect Google Analytics", href: "/settings/analytics" },
      ],
    },
  ];
  // Single expanded accordion - only one section can be open at a time
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Check if any child route is active for a given nav item
  const hasActiveChild = useCallback((item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => {
      if (child.href) {
        return pathname === child.href || pathname.startsWith(child.href + "/");
      }
      return hasActiveChild(child);
    });
  }, [pathname]);

  // Auto-expand only the accordion section containing the active route
  useEffect(() => {
    let activeSection: string | null = null;
    for (const item of mainNavItems) {
      if (item.isAccordion && item.children && hasActiveChild(item)) {
        activeSection = item.label;
        break; // Only expand the first matching section
      }
    }
    if (activeSection) {
      setExpandedSection(activeSection);
    }
  }, [pathname, hasActiveChild]);

  const toggleExpand = (label: string) => {
    // Exclusive accordion: collapse if already expanded, otherwise expand this and collapse others
    setExpandedSection((prev) => (prev === label ? null : label));
  };

  const handleKeyDown = (e: React.KeyboardEvent, label: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpand(label);
    }
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSection === item.label;
    const active = isActive(item.href);
    const childIsActive = hasActiveChild(item);

    if (hasChildren && item.isAccordion) {
      return (
        <div key={item.label} className="space-y-1">
          <button
            onClick={() => toggleExpand(item.label)}
            onKeyDown={(e) => handleKeyDown(e, item.label)}
            aria-expanded={isExpanded}
            aria-controls={`accordion-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              childIsActive
                ? "text-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              </>
            )}
          </button>
          <div
            id={`accordion-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
            className={cn(
              "overflow-hidden transition-all duration-200",
              isExpanded && sidebarOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </div>
          </div>
        </div>
      );
    }

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpand(item.label)}
            onKeyDown={(e) => handleKeyDown(e, item.label)}
            aria-expanded={isExpanded}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="w-5 h-5" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              </>
            )}
          </button>
          {isExpanded && sidebarOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Handle onClick items (like Create New Page modal trigger)
    if (item.onClick) {
      return (
        <button
          key={item.label}
          onClick={item.onClick}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <item.icon className="w-5 h-5" />
          {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
        </button>
      );
    }

    const LinkComponent = item.external ? "a" : Link;
    const linkProps = item.external
      ? { href: item.href || "#", target: "_blank", rel: "noopener noreferrer" }
      : { href: item.href || "#" };

    return (
      <LinkComponent
        key={item.label}
        {...linkProps}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <item.icon className="w-5 h-5" />
        {sidebarOpen && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.external && <ExternalLink className="w-4 h-4" />}
          </>
        )}
      </LinkComponent>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-semibold text-foreground text-sm">
                  E-commerce Fast Shop
                </h1>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* User */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback className="bg-primary/10 text-primary">
                SC
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Sunrise Cafe
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Admin
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {/* Top actions */}
          <div className="space-y-1 mb-4 pb-4 border-b border-border">
            {bottomNavItems.map((item) => renderNavItem(item))}
          </div>

          {/* Main nav */}
          {mainNavItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Sample Fast Shop link */}
        <div className="p-4 border-t border-border">
          <Link
            href="/sample-shop"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {sidebarOpen && (
              <>
                <span className="flex-1">Sample Fast Shop</span>
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Marketing | Online Marketing | E-commerce Fast Shop
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="w-64 pl-10 bg-muted/50 border-0"
              />
            </div>

            {/* Actions */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Grid3X3 className="w-5 h-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      SC
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Create a Website Page Modal */}
      <Dialog open={createPageModalOpen} onOpenChange={setCreatePageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Create a Website Page</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mb-6">
            Create a new page with AI or view your existing pages.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {pageCreationOptions.map((option) => (
              <Link
                key={option.id}
                href={option.href}
                onClick={() => setCreatePageModalOpen(false)}
                className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <option.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{option.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
