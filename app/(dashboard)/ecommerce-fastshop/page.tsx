"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Megaphone,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Grid,
  LayoutList,
  Monitor,
  Smartphone,
  Share2,
  Eye,
  ExternalLink,
  ShoppingCart,
  ChevronDown,
  Search,
  MoreVertical,
  Menu,
  Plus,
  GripVertical,
  Home,
  Save,
  RotateCcw,
  Trash2,
} from "lucide-react";

const sidebarTopItems = [
  { icon: Eye, label: "Live Preview" },
  { icon: Share2, label: "Share" },
];

const sidebarMainItems = [
  { icon: LayoutList, label: "All Pages", hasExternal: false },
  { icon: Grid, label: "Fastshop Menu", hasExternal: false },
  { icon: LayoutDashboard, label: "Dashboard", hasExternal: false },
  { icon: Package, label: "Products", hasExternal: true },
  { icon: Truck, label: "Delivery Settings", hasExternal: true },
  { icon: ShoppingCart, label: "Orders", hasExternal: true },
  { icon: Users, label: "Customers", hasExternal: true },
  { icon: Megaphone, label: "Marketing", hasExternal: true },
];

const sidebarConfigItems = [
  { icon: FileText, label: "T&C, Privacy Policy" },
  { icon: ImageIcon, label: "Change Logo" },
  { icon: ImageIcon, label: "Change Banner" },
  { icon: AlignLeft, label: "Scrolling Banner Text" },
  { icon: Grid, label: "Product Positioning" },
  { icon: LayoutList, label: "Product Categories" },
  { icon: LayoutList, label: "Product Subcategories" },
];

const checklistItems = [
  { label: "Add/Review your Products", col: 0 },
  { label: "Show Advanced Steps", col: 1 },
  { label: "Configure Delivery Settings", col: 0 },
  { label: "Domain Setup", col: 1 },
  { label: "Customize your Fast Shop", col: 0 },
  { label: "Sell on Google & Connect Google Analytics", col: 1 },
  { label: "Grow your Reach", col: 0 },
  { label: "Marketing", col: 1 },
];

const allPages = [
  { name: "Homepage", slug: "/home", status: "Draft" },
  { name: "Services", slug: "/services", status: "Draft" },
  { name: "Service Detail", slug: "/service-detail", status: "Draft" },
  { name: "About Us", slug: "/about", status: "Draft" },
  { name: "Contact", slug: "/contact", status: "Draft" },
];

const headerMenuItems = [
  { name: "Home", path: "System • /", system: true },
  { name: "Products", path: "Page • /products" },
  { name: "Services", path: "Page • /services" },
  { name: "About Us", path: "Page • /about" },
  { name: "Contact", path: "Page • /contact" },
];

const footerMenuItems = [
  { name: "About Us", path: "Page • /about" },
  { name: "Contact", path: "Page • /contact" },
];

export default function EcommerceFastshopPage() {
  const [activeView, setActiveView] = useState<"preview" | "all-pages" | "menu">("preview");
  const [selectedPageName, setSelectedPageName] = useState("Homepage");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {activeView === "all-pages"
            ? "All Pages"
            : activeView === "menu"
              ? "Fastshop Menu Settings"
              : "E-Commerce Fastshop"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {activeView === "all-pages"
            ? "Manage your website pages and create new ones with AI"
            : activeView === "menu"
              ? "Manage the navigation menu for your Fast Shop website"
              : "Manage and preview your live e-commerce store"}
        </p>
      </div>

      <div className="flex h-[calc(100vh-180px)] min-h-[620px] rounded-xl border border-border overflow-hidden shadow-sm bg-background">
        {/* Left sidebar */}
        <div className="w-56 border-r border-border bg-background flex flex-col overflow-y-auto shrink-0">
          {/* Brand header */}
          <div className="px-4 py-4 border-b border-border">
            <p className="text-xs font-bold text-foreground">E-commerce Fast Shop</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Marketing · Website · Fast Shop</p>
          </div>

          {/* Live Preview / Share */}
          {sidebarTopItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}

          <div className="h-px bg-border my-1" />

          {/* Main nav */}
          {sidebarMainItems.map((item) => {
            const isActive =
              (item.label === "All Pages" && activeView === "all-pages") ||
              (item.label === "Fastshop Menu" && activeView === "menu");

            return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "All Pages") setActiveView("all-pages");
                if (item.label === "Fastshop Menu") setActiveView("menu");
                if (!["All Pages", "Fastshop Menu"].includes(item.label)) setActiveView("preview");
              }}
              className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors group ${
                isActive
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
              {item.hasExternal && (
                <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-80" />
              )}
            </button>
            );
          })}

          <div className="h-px bg-border my-1" />

          {/* Config items */}
          {sidebarConfigItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/10">
          {activeView === "all-pages" ? (
            <div className="flex-1 flex flex-col bg-background">
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-border bg-background">
                <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
                  <Menu className="w-3.5 h-3.5" />
                  Manage Website Menu
                </button>
                <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Create New Page
                </button>
              </div>

              <div className="flex-1 grid grid-cols-[0.95fr_1.4fr] gap-3 p-3 bg-muted/20 overflow-hidden">
                <div className="rounded-xl border border-border bg-background overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between gap-3 p-3 border-b border-border">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <button className="rounded-md bg-primary px-2 py-1 text-white">Active 5</button>
                      <button className="rounded-md bg-muted px-2 py-1 text-muted-foreground">Archived 1</button>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground min-w-[118px]">
                      <Search className="w-3.5 h-3.5" />
                      Search...
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto">
                    {allPages.map((page) => {
                      const isSelected = selectedPageName === page.name;

                      return (
                        <button
                          key={page.name}
                          onClick={() => setSelectedPageName(page.name)}
                          className={`w-full flex items-start justify-between gap-3 px-4 py-3 border-b border-border text-left transition-colors ${
                            isSelected ? "bg-primary/5" : "hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="mt-0.5 w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="w-3 h-3 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{page.name}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{page.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                              {page.status}
                            </span>
                            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Page Preview
                    </span>
                    <div className="flex items-center gap-2 text-foreground">
                      <span>{selectedPageName}</span>
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">Draft</span>
                    </div>
                  </div>

                  <div className="flex-1 p-4 bg-muted/10 overflow-auto">
                    <div className="min-h-full rounded-lg border border-border bg-background overflow-hidden">
                      <div className="px-3 py-2 border-b border-border bg-muted/30 text-[10px] text-center text-muted-foreground">
                        yourstore.com/home
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="h-20 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center text-center">
                          <div>
                            <p className="text-xl font-semibold text-foreground">{selectedPageName}</p>
                            <p className="text-xs text-muted-foreground mt-1">/home</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="h-12 rounded-md bg-muted/60" />
                          <div className="h-12 rounded-md bg-muted/60" />
                          <div className="h-12 rounded-md bg-muted/60" />
                        </div>

                        <div className="space-y-2">
                          <div className="h-3 w-4/5 rounded bg-muted/60" />
                          <div className="h-3 w-3/5 rounded bg-muted/50" />
                        </div>

                        <div className="h-24 rounded-md bg-muted/50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs">
                    <span className="text-muted-foreground">7 blocks · Modified 01/26/2026</span>
                    <div className="flex items-center gap-2">
                      <button className="rounded-md border border-border px-3 py-1.5 text-foreground hover:bg-muted/50 transition-colors">
                        Open in New Tab
                      </button>
                      <button className="rounded-md bg-primary px-3 py-1.5 font-semibold text-white hover:bg-primary/90 transition-colors">
                        Edit Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeView === "menu" ? (
            <div className="flex-1 flex flex-col bg-background">
              <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-border bg-background">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Menu Builder</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure navigation menus for your website header and footer.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
                    <LayoutList className="w-3.5 h-3.5" />
                    Manage Website Pages
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-border bg-background">
                <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Revert
                </button>
                <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors">
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>

              <div className="flex-1 grid grid-cols-[0.9fr_1.3fr] gap-3 p-3 bg-muted/20 overflow-hidden">
                <div className="space-y-3 overflow-auto">
                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Header Menu Structure</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Drag and drop to reorder. Nest items to create dropdown menus.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                          5 items
                        </span>
                        <button className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      {headerMenuItems.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0">
                              {item.system ? (
                                <Home className="w-3 h-3 text-primary" />
                              ) : (
                                <FileText className="w-3 h-3 text-primary" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{item.path}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>Visible</span>
                              <button className="relative h-4 w-8 rounded-full bg-primary/20">
                                <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-primary" />
                              </button>
                            </div>
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Footer Menu Structure</h3>
                        <p className="text-xs text-muted-foreground mt-1">Optional footer navigation links</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                          2 items
                        </span>
                        <button className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground">
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      {footerMenuItems.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="w-3 h-3 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{item.path}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>Visible</span>
                              <button className="relative h-4 w-8 rounded-full bg-primary/20">
                                <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-primary" />
                              </button>
                            </div>
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border text-xs text-muted-foreground">
                    <div>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Live Preview
                      </span>
                      <p className="mt-1 text-[10px]">Updates in real-time</p>
                    </div>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground">Desktop</span>
                  </div>

                  <div className="flex-1 p-4 bg-muted/10 overflow-auto">
                    <div className="min-h-full rounded-lg border border-border bg-background overflow-hidden">
                      <div className="px-3 py-2 border-b border-border bg-muted/30 text-[10px] text-center text-muted-foreground">
                        yourstore.com/
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-[9px] font-bold text-white">FS</div>
                            <span className="font-semibold text-foreground">FastShop</span>
                          </div>
                          <div className="flex items-center gap-4">
                            {headerMenuItems.map((item) => (
                              <span key={item.name} className={item.name === "Home" ? "text-primary font-medium" : ""}>
                                {item.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="h-16 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center text-center">
                          <div>
                            <p className="text-base font-semibold text-foreground">Welcome to FastShop</p>
                            <p className="text-xs text-muted-foreground mt-1">Your one-stop destination</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="h-8 rounded-md bg-muted/50" />
                          <div className="h-8 rounded-md bg-muted/50" />
                          <div className="h-8 rounded-md bg-muted/50" />
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
                        <span>© 2026 FastShop</span>
                        <div className="flex items-center gap-3">
                          {footerMenuItems.map((item) => (
                            <span key={item.name}>{item.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
          <>
          {/* Setup checklist */}
          <div className="border-b border-border bg-background px-5 py-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-foreground">Sell Online in seconds with FastShop</p>
              <button className="text-muted-foreground hover:text-foreground">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Welcome to Fast Shop - Our simple and beautiful e-commerce solution. Follow these steps or watch our{" "}
              <span className="font-semibold underline cursor-pointer">Detailed Tutorial</span>.
            </p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-1.5">
              {checklistItems.map((item) => (
                <label key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded w-3 h-3 accent-primary" readOnly />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Live preview bar */}
          <div className="flex items-center justify-between px-5 py-2 bg-background border-b border-border text-xs">
            <p className="text-muted-foreground">
              This is a preview of your Live E-commerce Fast Shop.{" "}
              <span className="text-primary cursor-pointer hover:underline font-medium">Click here</span> to open in a New Tab.
            </p>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded hover:bg-muted text-primary">
                <Monitor className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FastShop store preview */}
          <div className="flex-1 overflow-auto p-3">
            <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm min-h-full">
              {/* Store nav */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-white">C</div>
                    <span className="text-sm font-bold text-foreground">ChaiTees</span>
                  </div>
                  <nav className="flex items-center gap-5 text-sm">
                    <span className="text-primary border-b-2 border-primary pb-0.5 font-semibold">Home</span>
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">FAQs</span>
                  </nav>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 border border-border rounded px-2 py-1">
                    <span className="text-xs text-muted-foreground">Search</span>
                  </div>
                  <button className="bg-primary text-white text-xs px-3 py-1.5 rounded font-semibold">Go</button>
                  <button className="border border-border text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" /> Login
                  </button>
                  <button className="relative">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
                  </button>
                </div>
              </div>

              {/* Hero banner */}
              <div className="relative h-52 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 flex items-center justify-center overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <button className="bg-gray-900 border-2 border-white text-white font-bold text-2xl tracking-widest px-10 py-3 rounded">
                      SHOP NOW
                    </button>
                  </div>
                </div>
              </div>

              {/* Product grid */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {["Product 1", "Product 2", "Product 3", "Product 4"].map((p) => (
                  <div
                    key={p}
                    className="rounded-lg border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <Package className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-foreground">{p}</p>
                      <p className="text-xs text-primary font-bold mt-0.5">$19.99</p>
                      <button className="mt-2 w-full bg-primary text-white text-[10px] py-1.5 rounded font-semibold">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
