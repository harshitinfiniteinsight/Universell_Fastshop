"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Rocket,
  Store,
  Sparkles,
  Zap,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Star,
  TrendingUp,
  Package,
  ArrowRight,
  Play,
  Check,
  Clock,
  Shield,
  Upload,
  ImageIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Layers,
  Truck,
  Palette,
  Layout,
  Circle,
  Hexagon,
  Square,
  Triangle,
  Diamond,
  Gem,
  Crown,
  Coffee,
  User,
  Users,
  Wallet,
  QrCode,
  Banknote,
  PackageCheck,
  BoxSelect,
  Warehouse,
  ClipboardList,
  BadgeCheck,
  Heart,
  Tag,
  Bell,
  FolderOpen,
  MessageCircle,
  Target,
  Link,
  Type,
  Instagram,
  FileUp,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  BarChart3,
  PieChart,
  DollarSign,
  Gift,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessInfo } from "../wizard-container";
import { BrandVaultScreen, BrandVaultData } from "../brand-vault-modal";

interface WelcomeStepProps {
  onNext: () => void;
  businessInfo?: BusinessInfo;
  onUpdateBusinessInfo?: (data: BusinessInfo) => void;
}

type DesignVariant = "landing" | "guided" | "fast-start";
type GuidedStep = 1 | 2 | 3;

// Floating product card component
function FloatingProductCard({
  className,
  delay = "0",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`absolute glass rounded-2xl shadow-xl p-4 w-48 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl mb-3 flex items-center justify-center">
        <Package className="w-10 h-10 text-primary/60" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-foreground/10 rounded-full w-3/4" />
        <div className="h-2 bg-foreground/5 rounded-full w-1/2" />
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold text-primary">$49.99</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 fill-primary/80 text-primary/80"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating stats card
function FloatingStatsCard({ className }: { className?: string }) {
  return (
    <div className={`absolute glass rounded-2xl shadow-xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Monthly Sales</p>
          <p className="text-lg font-bold text-foreground">$12,847</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-2 flex-1 bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary/80 rounded-full" />
        </div>
        <span className="text-xs font-medium text-primary">+24%</span>
      </div>
    </div>
  );
}

// Floating checkout card
function FloatingCheckoutCard({ className }: { className?: string }) {
  return (
    <div className={`absolute glass rounded-2xl shadow-xl p-4 w-52 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Quick Checkout
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">$149.97</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-primary">Free</span>
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-primary">$149.97</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ROTATING THEMED FLOATING CARDS
// ============================================

// Central Graphics for each theme
function ShippingGraphic({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
    )}>
      <div className="relative w-32 h-32">
        {/* Main truck graphic */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-3xl flex items-center justify-center">
          <Truck className="w-16 h-16 text-blue-500" />
        </div>
        {/* Animated delivery path */}
        <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300" />
            <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200" />
            <div className="w-2 h-2 rounded-full bg-blue-200 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
        {/* Flying package */}
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
          <Package className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function PaymentGraphic({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
    )}>
      <div className="relative w-36 h-28">
        {/* Stacked cards effect */}
        <div className="absolute bottom-0 left-2 w-28 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl transform rotate-[-8deg] opacity-60" />
        <div className="absolute bottom-1 left-4 w-28 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl transform rotate-[-4deg] opacity-80" />
        <div className="absolute bottom-2 left-6 w-28 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-xl flex flex-col justify-between p-3">
          <div className="flex justify-between items-start">
            <div className="w-8 h-6 bg-amber-300 rounded-sm" />
            <Sparkles className="w-4 h-4 text-white/80" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-white/30 rounded-full w-16" />
            <div className="h-1.5 bg-white/20 rounded-full w-12" />
          </div>
        </div>
        {/* Floating coins */}
        <div className="absolute -top-2 right-0 w-8 h-8 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-float">
          <span className="text-amber-800 font-bold text-xs">$</span>
        </div>
      </div>
    </div>
  );
}

function CustomerGraphic({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
    )}>
      <div className="relative w-40 h-32">
        {/* Central profile card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-24 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-xl border border-amber-200/50 flex flex-col items-center justify-center gap-2 p-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1 w-full">
            <div className="h-1.5 bg-amber-300/50 rounded-full w-full" />
            <div className="h-1.5 bg-amber-200/50 rounded-full w-3/4 mx-auto" />
          </div>
        </div>
        {/* Orbiting user icons */}
        <div className="absolute top-0 left-4 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-md animate-float">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="absolute bottom-0 right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md animate-float-delayed">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-4 right-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md animate-float-slow">
          <User className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsGraphic({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
    )}>
      <div className="relative w-40 h-36">
        {/* Dashboard mockup */}
        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl border border-indigo-200/50 shadow-xl p-3">
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-16 mb-2">
            {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          {/* Mini stats row */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white/80 rounded-lg p-1.5 text-center">
              <p className="text-[8px] text-muted-foreground">Orders</p>
              <p className="text-xs font-bold text-indigo-600">1,247</p>
            </div>
            <div className="flex-1 bg-white/80 rounded-lg p-1.5 text-center">
              <p className="text-[8px] text-muted-foreground">Revenue</p>
              <p className="text-xs font-bold text-green-600">$48K</p>
            </div>
          </div>
        </div>
        {/* Growth indicator */}
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex flex-col items-center justify-center shadow-lg">
          <TrendingUp className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-[10px]">+24%</span>
        </div>
      </div>
    </div>
  );
}

function InventoryGraphic({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
    )}>
      <div className="relative w-36 h-32">
        {/* Warehouse/shelf graphic */}
        <div className="w-full h-full bg-gradient-to-br from-teal-50 to-emerald-100 rounded-2xl border border-teal-200/50 shadow-xl p-3 flex flex-col gap-2">
          {/* Shelf rows */}
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex-1 bg-teal-100/80 rounded-lg flex items-center justify-around px-2">
              {[0, 1, 2, 3].map((item) => (
                <div 
                  key={item} 
                  className={cn(
                    "w-5 h-5 rounded",
                    row === 0 && item < 3 ? "bg-gradient-to-br from-teal-400 to-teal-500" :
                    row === 1 ? "bg-gradient-to-br from-teal-400 to-teal-500" :
                    item < 2 ? "bg-gradient-to-br from-teal-400 to-teal-500" : "bg-teal-200/50 border border-dashed border-teal-300"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Stock indicator */}
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex flex-col items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">85%</span>
          <span className="text-white/70 text-[8px]">Stock</span>
        </div>
      </div>
    </div>
  );
}

// Theme 1: Shipping
function FloatingShippingCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 w-48 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Shipping</p>
          <p className="text-sm font-bold text-foreground">In Transit</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="flex-1 h-1 bg-blue-500 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="flex-1 h-1 bg-muted rounded-full" />
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>
        <p className="text-xs text-muted-foreground">Arrives in 2-3 days</p>
      </div>
    </div>
  );
}

function FloatingDeliveryCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-500/10 flex items-center justify-center">
          <Package className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Order #4821</p>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Check className="w-3 h-3" /> Shipped
          </p>
        </div>
      </div>
    </div>
  );
}

// Theme 2: Easy Payment
function FloatingPaymentCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 w-52 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-5 h-5 text-emerald-500" />
        <span className="text-sm font-semibold text-foreground">Payment Methods</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
          <Banknote className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 h-10 rounded-lg bg-muted flex items-center justify-center">
          <QrCode className="w-5 h-5 text-foreground" />
        </div>
      </div>
    </div>
  );
}

function FloatingPaymentSuccessCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Payment Complete</p>
          <p className="text-xs text-muted-foreground">$247.50 received</p>
        </div>
      </div>
    </div>
  );
}

// Theme 3: Customer Profile
function FloatingCustomerCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 w-48 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Sarah M.</p>
          <p className="text-xs text-muted-foreground">VIP Customer</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
        <span className="text-xs text-muted-foreground ml-1">12 orders</span>
      </div>
    </div>
  );
}

function FloatingCRMCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">2,847</p>
          <p className="text-xs text-muted-foreground">Active Customers</p>
        </div>
      </div>
    </div>
  );
}

// Theme 4: Analytics Dashboard
function FloatingAnalyticsCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 w-52 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-indigo-500" />
        <span className="text-sm font-semibold text-foreground">Order Analytics</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Today</span>
          <span className="font-bold text-green-600">+127 orders</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">This Week</span>
          <span className="font-bold text-indigo-600">842 orders</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[78%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function FloatingRevenueCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-500/10 flex items-center justify-center relative">
          <DollarSign className="w-6 h-6 text-green-500" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <TrendingUp className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">$48,294</p>
          <p className="text-xs text-green-600">+18% vs last month</p>
        </div>
      </div>
    </div>
  );
}

// Theme 5: Inventory
function FloatingInventoryCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 w-52 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Warehouse className="w-5 h-5 text-teal-500" />
        <span className="text-sm font-semibold text-foreground">Inventory Status</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">In Stock</span>
          <span className="text-xs font-bold text-green-600">1,247</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[85%] bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-amber-600">23 low stock</span>
          <span className="text-muted-foreground">85% capacity</span>
        </div>
      </div>
    </div>
  );
}

function FloatingStockCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-2xl shadow-xl p-4 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
            <BadgeCheck className="w-4 h-4 text-green-500" /> All Synced
          </p>
          <p className="text-xs text-muted-foreground">Last update: 2m ago</p>
        </div>
      </div>
    </div>
  );
}

// Additional themed cards for richer visuals
// Theme 1 Extra: Store Pickup Badge
function FloatingStorePickupCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-xl shadow-lg px-3 py-2 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2">
        <Store className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-semibold text-foreground">Store Pickup</span>
      </div>
    </div>
  );
}

// Theme 2 Extra: Payment Security Badge
function FloatingSecurePayCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-xl shadow-lg px-3 py-2 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-500" />
        <span className="text-xs font-semibold text-foreground">256-bit SSL</span>
      </div>
    </div>
  );
}

// Theme 3 Extra: Customer Loyalty Badge
function FloatingLoyaltyCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-xl shadow-lg px-3 py-2 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        <span className="text-xs font-semibold text-foreground">+50 Loyalty Points</span>
      </div>
    </div>
  );
}

// Theme 4 Extra: Inventory Insights
function FloatingInsightsCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-xl shadow-lg px-3 py-2 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2">
        <PieChart className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-semibold text-foreground">Inventory Insights</span>
      </div>
    </div>
  );
}

// Theme 5 Extra: Stock Alert
function FloatingAlertCard({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <div className={cn(
      "absolute glass rounded-xl shadow-lg px-3 py-2 transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      className
    )}>
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-foreground">Restock Alert</span>
      </div>
    </div>
  );
}

// ============================================
// OPTION 1: Landing Style (Original)
// ============================================
function LandingStyleVariant({ onStartGuided }: { onStartGuided: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTheme, setActiveTheme] = useState(0);
  
  // Themes for rotating visuals
  const visualThemes = [
    "overview",
    "shipping",
    "payment", 
    "customer",
    "analytics",
    "inventory"
  ] as const;

  // Auto-rotate visual themes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTheme((prev) => (prev + 1) % visualThemes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [visualThemes.length]);

  // Feature slides - each slide contains 3 feature cards
  const featureSlides = [
    // Tier 1 – Immediate Value (What I get instantly)
    [
      {
        icon: Zap,
        title: "Launch in Minutes",
        description: "From zero to live store faster than ever before.",
      },
      {
        icon: Sparkles,
        title: "AI-Powered Design",
        description: "Generate stunning pages with intelligent automation.",
      },
      {
        icon: Store,
        title: "Professional Store",
        description: "Beautiful, conversion-optimized storefronts that sell.",
      },
    ],
    // Tier 2 – Growth & Insights (How I run and scale)
    [
      {
        icon: BarChart3,
        title: "Analytics",
        description: "Track orders, inventory, and revenue with powerful real-time insights.",
      },
      {
        icon: Layers,
        title: "Order Management",
        description: "Manage orders, inventory, and fulfillment from a single dashboard.",
      },
      {
        icon: Gift,
        title: "Integrated with Gift Card",
        description: "Built-in gift card support to boost sales and customer retention.",
      },
    ],
    // Tier 3 – Experience & Reach (How customers interact)
    [
      {
        icon: Monitor,
        title: "Compatible Website Design",
        description: "Flexible design that works seamlessly on mobile, tablet, and desktop.",
      },
      {
        icon: Truck,
        title: "Shipping & Store Pickup",
        description: "Offer local delivery, shipping, or convenient store pickup options.",
      },
      {
        icon: CreditCard,
        title: "Easy Checkout",
        description: "Fast and easy checkout for hassle-free orders.",
      },
    ],
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 py-8 px-4 md:px-8 lg:px-12">
        {/* Hero Section - Asymmetric Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left: Content */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Store Builder
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              Build Your Dream{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Online Store
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 rounded" />
              </span>{" "}
              in Minutes
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Create a stunning e-commerce experience with AI-generated pages,
              seamless checkout, and everything you need to start selling today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={onStartGuided}
                size="lg"
                className="group relative px-8 py-6 text-lg font-semibold btn-primary-enhanced animate-pulse-glow rounded-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group px-8 py-6 text-lg font-medium rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <Play className="w-5 h-5 mr-2 text-primary" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-primary/40 border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                    >
                      {["J", "S", "M", "A"][i]}
                    </div>
                  ))}
                </div>
                <span>10k+ stores launched</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right: Rotating Floating Elements */}
          <div className="relative h-[400px] lg:h-[500px] hidden md:block">
            {/* Central glow */}
            <div className="absolute inset-0 bg-primary-glow" />

            {/* Theme 0: Overview - Original Stats & Product Cards */}
            <div className={cn(
              "transition-all duration-700",
              visualThemes[activeTheme] === "overview" ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <FloatingProductCard
                className="top-8 left-8 animate-float"
                delay="0"
              />
              <FloatingStatsCard className="top-4 right-8 animate-float-delayed" />
              <FloatingCheckoutCard className="bottom-20 right-4 animate-float-slow" />
              {/* Central Store Graphic */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center">
                    <Store className="w-16 h-16 text-primary" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme 1: Shipping */}
            <FloatingShippingCard 
              className="top-4 left-4 animate-float" 
              isVisible={visualThemes[activeTheme] === "shipping"} 
            />
            <FloatingDeliveryCard 
              className="bottom-16 right-4 animate-float-delayed" 
              isVisible={visualThemes[activeTheme] === "shipping"} 
            />
            <FloatingStorePickupCard 
              className="top-1/3 right-12 animate-float-slow" 
              isVisible={visualThemes[activeTheme] === "shipping"} 
            />
            <ShippingGraphic isVisible={visualThemes[activeTheme] === "shipping"} />

            {/* Theme 2: Easy Payment */}
            <FloatingPaymentCard 
              className="top-6 left-2 animate-float" 
              isVisible={visualThemes[activeTheme] === "payment"} 
            />
            <FloatingPaymentSuccessCard 
              className="bottom-20 right-2 animate-float-slow" 
              isVisible={visualThemes[activeTheme] === "payment"} 
            />
            <FloatingSecurePayCard 
              className="top-1/4 right-16 animate-float-delayed" 
              isVisible={visualThemes[activeTheme] === "payment"} 
            />
            <PaymentGraphic isVisible={visualThemes[activeTheme] === "payment"} />

            {/* Theme 3: Customer Profile */}
            <FloatingCustomerCard 
              className="top-4 left-4 animate-float" 
              isVisible={visualThemes[activeTheme] === "customer"} 
            />
            <FloatingCRMCard 
              className="bottom-20 right-4 animate-float-delayed" 
              isVisible={visualThemes[activeTheme] === "customer"} 
            />
            <FloatingLoyaltyCard 
              className="bottom-1/3 left-12 animate-float-slow" 
              isVisible={visualThemes[activeTheme] === "customer"} 
            />
            <CustomerGraphic isVisible={visualThemes[activeTheme] === "customer"} />

            {/* Theme 4: Analytics Dashboard */}
            <FloatingAnalyticsCard 
              className="top-6 left-2 animate-float" 
              isVisible={visualThemes[activeTheme] === "analytics"} 
            />
            <FloatingRevenueCard 
              className="bottom-16 right-4 animate-float-slow" 
              isVisible={visualThemes[activeTheme] === "analytics"} 
            />
            <FloatingInsightsCard 
              className="top-4 right-2 animate-float-delayed" 
              isVisible={visualThemes[activeTheme] === "analytics"} 
            />
            <AnalyticsGraphic isVisible={visualThemes[activeTheme] === "analytics"} />

            {/* Theme 5: Inventory */}
            <FloatingInventoryCard 
              className="top-4 left-4 animate-float" 
              isVisible={visualThemes[activeTheme] === "inventory"} 
            />
            <FloatingStockCard 
              className="bottom-20 right-4 animate-float-delayed" 
              isVisible={visualThemes[activeTheme] === "inventory"} 
            />
            <FloatingAlertCard 
              className="bottom-1/3 left-12 animate-float-slow" 
              isVisible={visualThemes[activeTheme] === "inventory"} 
            />
            <InventoryGraphic isVisible={visualThemes[activeTheme] === "inventory"} />

            {/* Theme indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {visualThemes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTheme(index)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    activeTheme === index ? "w-4 bg-primary" : "bg-primary/30"
                  )}
                />
              ))}
            </div>

            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-primary/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-primary/10 rounded-full" />
          </div>
        </div>

        {/* Features Slider Section */}
        <div className="mt-8 relative">
          {/* Slider Container */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Slides Wrapper */}
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featureSlides.map((slide, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className="w-full flex-shrink-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {slide.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="group relative p-6 rounded-2xl bg-card border border-border card-hover-lift animate-fade-in-up"
                        style={{ animationDelay: `${(featureIndex + 1) * 150}ms` }}
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <feature.icon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {featureSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  currentSlide === index
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom helper text */}
        <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <p className="text-sm text-muted-foreground">
            ⏱️ Takes about{" "}
            <span className="font-semibold text-foreground">5 minutes</span> to
            complete
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION 2: Guided Onboarding Module (Stepped Flow)
// ============================================
function GuidedOnboardingVariant({
  onNext,
  businessInfo,
  onUpdateBusinessInfo,
  skipIntro = false,
}: {
  onNext: () => void;
  businessInfo?: BusinessInfo;
  onUpdateBusinessInfo?: (data: BusinessInfo) => void;
  skipIntro?: boolean;
}) {
  // Phase states for Option 2 flow
  // Phase 1: hasStartedGuidedOnboarding = false → show intro screen
  // Phase 2: hasStartedGuidedOnboarding = true, guidedStepsCompleted = false → show step flow
  // Phase 3: guidedStepsCompleted = true → show AI Guided Intro screen
  const [hasStartedGuidedOnboarding, setHasStartedGuidedOnboarding] = useState(skipIntro);
  const [guidedStepsCompleted, setGuidedStepsCompleted] = useState(false);
  const [currentGuidedStep, setCurrentGuidedStep] = useState<GuidedStep>(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(businessInfo?.logoPreview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Description Modal state
  const [isAIDescriptionModalOpen, setIsAIDescriptionModalOpen] = useState(false);
  const [aiDescriptionInput, setAIDescriptionInput] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // Business Model Modal state
  const [isBusinessModelModalOpen, setIsBusinessModelModalOpen] = useState(false);
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<string | null>(null);
  const [isCreatingWebsite, setIsCreatingWebsite] = useState(false);
  const router = useRouter();

  // Brand Vault state - now using full-screen rendering instead of modal
  const [showBrandVaultScreen, setShowBrandVaultScreen] = useState(false);
  const [brandVaultData, setBrandVaultData] = useState<BrandVaultData>({
    coreAssets: {
      inspirationLinks: [""],
      logoFile: null,
      logoPreview: null,
      primaryColor: "",
      secondaryColor: "",
      accentColor: "",
    },
    brandStyle: {
      designStyles: [],
      typographyPreference: null,
    },
    personality: {
      brandTones: [],
      targetAudience: "",
    },
    extras: {
      socialLinks: [""],
      brandGuidelinesUrl: "",
      notesForAi: "",
      dosAndDonts: "",
    },
  });
  const brandLogoInputRef = useRef<HTMLInputElement>(null);

  const handleBrandVaultSave = (data: BrandVaultData) => {
    // Update local state
    setBrandVaultData(data);

    // Clean up and save vault data
    const cleanedData = {
      ...data,
      coreAssets: {
        ...data.coreAssets,
        inspirationLinks: data.coreAssets.inspirationLinks.filter(l => l.trim()),
      },
      extras: {
        ...data.extras,
        socialLinks: data.extras.socialLinks.filter(l => l.trim()),
      },
    };
    
    // Store in localStorage
    localStorage.setItem("universell-brand-vault", JSON.stringify(cleanedData));
    
    // Store onboarding data for compatibility
    const onboardingData = {
      inspiration: cleanedData.coreAssets.inspirationLinks.join(", "),
      color: cleanedData.coreAssets.primaryColor || "",
      secondaryColor: cleanedData.coreAssets.secondaryColor || "",
      accentColor: cleanedData.coreAssets.accentColor || "",
      brandTones: cleanedData.personality.brandTones || [],
      targetAudience: cleanedData.personality.targetAudience || "",
      designStyles: cleanedData.brandStyle.designStyles || [],
      typographyPreference: cleanedData.brandStyle.typographyPreference || "",
      hasLogo: !!cleanedData.coreAssets.logoPreview,
      logoPreview: cleanedData.coreAssets.logoPreview || "",
      socialLinks: cleanedData.extras.socialLinks || [],
      notesForAi: cleanedData.extras.notesForAi || "",
      fromBrandVault: true,
    };
    localStorage.setItem("universell-onboarding-data", JSON.stringify(onboardingData));
    
    // Close Brand Vault screen and proceed to business model selection
    setShowBrandVaultScreen(false);
    setIsBusinessModelModalOpen(true);
  };

  // Page templates based on business model
  const pageTemplates: Record<string, Array<{ name: string; slug: string; blocks: number }>> = {
    products: [
      { name: "Homepage", slug: "home", blocks: 8 },
      { name: "Shop / Products", slug: "products", blocks: 6 },
      { name: "Product Detail", slug: "product-detail", blocks: 5 },
      { name: "Cart", slug: "cart", blocks: 4 },
      { name: "Checkout", slug: "checkout", blocks: 5 },
      { name: "About Us", slug: "about", blocks: 4 },
      { name: "Contact", slug: "contact", blocks: 3 },
    ],
    services: [
      { name: "Homepage", slug: "home", blocks: 7 },
      { name: "Services", slug: "services", blocks: 5 },
      { name: "Service Detail", slug: "service-detail", blocks: 4 },
      { name: "About Us", slug: "about", blocks: 4 },
      { name: "Contact", slug: "contact", blocks: 3 },
    ],
    booking: [
      { name: "Homepage", slug: "home", blocks: 7 },
      { name: "Book Appointment", slug: "booking", blocks: 5 },
      { name: "Our Services", slug: "services", blocks: 4 },
      { name: "About Us", slug: "about", blocks: 4 },
      { name: "Contact", slug: "contact", blocks: 3 },
    ],
    "products-services": [
      { name: "Homepage", slug: "home", blocks: 8 },
      { name: "Shop / Products", slug: "products", blocks: 6 },
      { name: "Services", slug: "services", blocks: 5 },
      { name: "Book Appointment", slug: "booking", blocks: 4 },
      { name: "About Us", slug: "about", blocks: 4 },
      { name: "Contact", slug: "contact", blocks: 3 },
    ],
  };

  // Function to create website pages and redirect
  const handleCreateWebsiteWithoutChat = async () => {
    if (!selectedBusinessModel) return;
    
    setIsCreatingWebsite(true);
    
    try {
      // Get pages for selected business model
      const templates = pageTemplates[selectedBusinessModel] || pageTemplates.products;
      
      // Generate pages with IDs and metadata
      const generatedPages = templates.map((template, index) => ({
        id: `auto-${Date.now()}-${index}`,
        name: template.name,
        slug: template.slug,
        blocks: template.blocks,
        status: "draft" as const,
        modifiedDate: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
        autoGenerated: true,
        businessModel: selectedBusinessModel,
      }));
      
      // Store generated pages in localStorage
      localStorage.setItem("universell-generated-pages", JSON.stringify(generatedPages));
      localStorage.setItem("universell-business-model", selectedBusinessModel);
      localStorage.setItem("universell-show-welcome-toast", "true");
      
      // Store business info
      if (onUpdateBusinessInfo && businessInfo) {
        onUpdateBusinessInfo({
          ...businessInfo,
          ...formData,
          businessModel: selectedBusinessModel,
        });
      }
      
      // Simulate brief creation delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Close modal and redirect to website pages
      setIsBusinessModelModalOpen(false);
      router.push("/website-pages");
      
    } catch (error) {
      console.error("Error creating website:", error);
      setIsCreatingWebsite(false);
    }
  };

  // Business model options
  const businessModels = [
    {
      id: "products",
      title: "Products Only",
      description: "Sell physical or digital products through an online store",
      examples: "e.g. Clothing, Electronics, Digital Downloads",
      icon: Package,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "services",
      title: "Services Only",
      description: "Offer professional services to your customers",
      examples: "e.g. Consulting, Design, Marketing",
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: "booking",
      title: "Booking Type",
      description: "Allow customers to book appointments or reservations",
      examples: "e.g. Salon, Restaurant, Medical Practice",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "products-services",
      title: "Products + Services",
      description: "Sell products and offer services together",
      examples: "e.g. Spa with Products, Auto Shop with Parts",
      icon: Layers,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  // Local form state
  const [formData, setFormData] = useState({
    name: businessInfo?.name || "",
    tagline: businessInfo?.tagline || "",
    description: businessInfo?.description || "",
    email: businessInfo?.email || "",
    phone: businessInfo?.phone || "",
    country: businessInfo?.country || "",
    state: businessInfo?.state || "",
    city: businessInfo?.city || "",
    zipcode: businessInfo?.zipcode || "",
    streetAddress: businessInfo?.streetAddress || "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmStep = () => {
    // Save current step data
    if (onUpdateBusinessInfo && businessInfo) {
      // If a recommended logo is selected on step 3, generate a preview for it
      let finalLogoPreview = logoPreview;
      if (currentGuidedStep === 3 && selectedRecommendedLogo) {
        const selectedLogo = recommendedLogos.find(l => l.id === selectedRecommendedLogo);
        if (selectedLogo) {
          // Store the logo info with current colors
          const colors = getCurrentColors();
          finalLogoPreview = `recommended:${selectedLogo.id}:${selectedLogo.style}:${colors.primary}:${colors.secondary}`;
        }
      }
      
      onUpdateBusinessInfo({
        ...businessInfo,
        ...formData,
        logoPreview: finalLogoPreview,
      });
    }

    if (currentGuidedStep < 3) {
      setCurrentGuidedStep((prev) => (prev + 1) as GuidedStep);
    } else {
      // Step 3 completed → show AI Guided Intro screen
      setGuidedStepsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentGuidedStep > 1) {
      setCurrentGuidedStep((prev) => (prev - 1) as GuidedStep);
    }
  };

  const stepTitles = {
    1: "Business Details",
    2: "Business Address",
    3: "Logo Upload",
  };

  // Get business initials for logos
  const getInitials = () => {
    if (!formData.name) return "AB";
    return formData.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  };

  // Preset color themes
  const colorThemes = [
    { id: "warm", name: "Warm", primary: "#f04f29", secondary: "#ff7043", accent: "#fbbf24" },
    { id: "modern", name: "Modern", primary: "#3b82f6", secondary: "#60a5fa", accent: "#1e40af" },
    { id: "minimal", name: "Minimal", primary: "#1f2937", secondary: "#4b5563", accent: "#9ca3af" },
    { id: "bold", name: "Bold", primary: "#7c3aed", secondary: "#a78bfa", accent: "#c4b5fd" },
    { id: "pastel", name: "Pastel", primary: "#f472b6", secondary: "#fbcfe8", accent: "#fce7f3" },
    { id: "nature", name: "Nature", primary: "#059669", secondary: "#34d399", accent: "#a7f3d0" },
  ];

  // Logo style types
  type LogoStyle = "icon-only" | "icon-text" | "badge" | "wordmark" | "minimal" | "geometric" | "elegant" | "playful";

  interface RecommendedLogo {
    id: number;
    name: string;
    style: LogoStyle;
    icon: typeof Store;
    themeId: string;
  }

  // Enhanced recommended logos with different styles
  const recommendedLogos: RecommendedLogo[] = [
    { id: 1, name: "Icon Modern", style: "icon-only", icon: Store, themeId: "warm" },
    { id: 2, name: "Text Badge", style: "badge", icon: Shield, themeId: "modern" },
    { id: 3, name: "Wordmark", style: "wordmark", icon: Building2, themeId: "minimal" },
    { id: 4, name: "Icon + Text", style: "icon-text", icon: Star, themeId: "bold" },
    { id: 5, name: "Minimal", style: "minimal", icon: Circle, themeId: "pastel" },
    { id: 6, name: "Geometric", style: "geometric", icon: Hexagon, themeId: "nature" },
    { id: 7, name: "Elegant", style: "elegant", icon: Crown, themeId: "modern" },
    { id: 8, name: "Playful", style: "playful", icon: Coffee, themeId: "warm" },
  ];

  const [selectedRecommendedLogo, setSelectedRecommendedLogo] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
  const [customPrimaryColor, setCustomPrimaryColor] = useState(colorThemes[0].primary);
  const [customSecondaryColor, setCustomSecondaryColor] = useState(colorThemes[0].secondary);

  // Get current colors (custom or from theme)
  const getCurrentColors = () => ({
    primary: customPrimaryColor,
    secondary: customSecondaryColor,
  });

  // Handle theme selection
  const handleThemeSelect = (theme: typeof colorThemes[0]) => {
    setSelectedTheme(theme);
    setCustomPrimaryColor(theme.primary);
    setCustomSecondaryColor(theme.secondary);
  };

  // Render logo preview based on style
  const renderLogoPreview = (logo: RecommendedLogo, colors: { primary: string; secondary: string }, size: "sm" | "lg" = "sm") => {
    const initials = getInitials();
    const businessName = formData.name || "Your Business";
    const sizeClasses = size === "lg" ? "w-full h-full" : "w-full h-full";
    const iconSize = size === "lg" ? "w-8 h-8" : "w-5 h-5";
    const textSize = size === "lg" ? "text-lg" : "text-xs";
    const initialsSize = size === "lg" ? "text-2xl" : "text-sm";
    
    switch (logo.style) {
      case "icon-only":
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-xl")} style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <logo.icon className={cn(iconSize, "text-white drop-shadow-sm")} />
          </div>
        );
      case "icon-text":
        return (
          <div className={cn(sizeClasses, "flex flex-col items-center justify-center gap-1 rounded-xl p-2")} style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <logo.icon className={cn(size === "lg" ? "w-6 h-6" : "w-4 h-4", "text-white drop-shadow-sm")} />
            <span className={cn(textSize, "text-white font-bold truncate max-w-full px-1")}>{initials}</span>
          </div>
        );
      case "badge":
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-xl border-2")} style={{ borderColor: colors.primary, background: `${colors.primary}10` }}>
            <div className="flex flex-col items-center">
              <span className={cn(initialsSize, "font-black")} style={{ color: colors.primary }}>{initials}</span>
              {size === "lg" && <div className="w-8 h-0.5 mt-1 rounded-full" style={{ background: colors.secondary }} />}
            </div>
          </div>
        );
      case "wordmark":
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-xl")} style={{ background: colors.primary }}>
            <span className={cn(size === "lg" ? "text-xl" : "text-[10px]", "text-white font-bold tracking-wider uppercase truncate px-2")}>
              {size === "lg" ? businessName.split(" ")[0] : initials}
            </span>
          </div>
        );
      case "minimal":
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-xl bg-white border-2")} style={{ borderColor: colors.primary }}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: colors.primary }} />
              <span className={cn(initialsSize, "font-semibold")} style={{ color: colors.primary }}>{initials}</span>
            </div>
          </div>
        );
      case "geometric":
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-xl")} style={{ background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary})` }}>
            <div className="relative">
              <Hexagon className={cn(size === "lg" ? "w-12 h-12" : "w-8 h-8", "text-white/30")} />
              <span className={cn("absolute inset-0 flex items-center justify-center font-bold text-white", size === "lg" ? "text-lg" : "text-xs")}>{initials}</span>
            </div>
          </div>
        );
      case "elegant":
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-xl")} style={{ background: `linear-gradient(135deg, ${colors.primary}ee, ${colors.primary})` }}>
            <div className="flex flex-col items-center">
              <Crown className={cn(size === "lg" ? "w-5 h-5" : "w-3 h-3", "text-white/80 mb-0.5")} />
              <span className={cn(size === "lg" ? "text-lg" : "text-[10px]", "text-white font-serif font-bold tracking-widest")}>{initials}</span>
            </div>
          </div>
        );
      case "playful":
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-2xl")} style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ background: colors.secondary }} />
              <span className={cn(initialsSize, "text-white font-black")} style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.1)" }}>{initials}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className={cn(sizeClasses, "flex items-center justify-center rounded-xl")} style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <span className={cn(initialsSize, "text-white font-bold")}>{initials}</span>
          </div>
        );
    }
  };

  // ==========================================
  // BRAND VAULT SCREEN (Full-page replacement)
  // ==========================================
  if (showBrandVaultScreen) {
    return (
      <BrandVaultScreen
        onSave={handleBrandVaultSave}
        onBack={() => setShowBrandVaultScreen(false)}
        initialData={brandVaultData}
        logoPreview={logoPreview || businessInfo?.logoPreview}
      />
    );
  }

  // ==========================================
  // PHASE 1: Intro Screen (Before "Get Started")
  // ==========================================
  if (!hasStartedGuidedOnboarding) {
    return (
      <div className="relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  Step 1 of 3 — Let&apos;s get started
                </span>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="grid lg:grid-cols-5 gap-8 items-center">
              {/* Left: Content (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                {/* Headline */}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
                  Create your store with{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    AI assistance
                  </span>
                </h1>

                {/* Short description */}
                <p className="text-lg text-muted-foreground max-w-md">
                  Answer a few quick questions and we&apos;ll design a beautiful, 
                  personalized store for your business.
                </p>

                {/* Quick benefits */}
                <div className="space-y-3 py-2">
                  {[
                    "AI generates your pages automatically",
                    "Customize everything after launch",
                    "Go live in under 5 minutes",
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Primary CTA */}
                <div className="pt-4">
                  <Button
                    onClick={() => setHasStartedGuidedOnboarding(true)}
                    size="lg"
                    className="group relative px-10 py-7 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>

                {/* Reassurance */}
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Takes ~5 minutes
                </p>
              </div>

              {/* Right: Website Builder Preview (2 cols) */}
              <div className="lg:col-span-2 hidden lg:block">
                <div className="relative">
                  {/* Browser Frame */}
                  <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-6 bg-background rounded-md flex items-center px-3">
                          <div className="w-3 h-3 rounded-full bg-muted-foreground/20 mr-2" />
                          <div className="h-2 bg-muted-foreground/20 rounded w-24" />
                        </div>
                      </div>
                    </div>

                    {/* Builder Interface */}
                    <div className="flex h-[280px]">
                      {/* Sidebar */}
                      <div className="w-14 bg-muted/30 border-r border-border/30 py-3 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <div className="w-4 h-4 rounded bg-primary/60" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <div className="w-4 h-3 rounded-sm bg-muted-foreground/30" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Canvas */}
                      <div className="flex-1 bg-background p-3 overflow-hidden">
                        {/* Website Preview Sections */}
                        <div className="space-y-2 h-full">
                          {/* Header Section */}
                          <div className="h-8 bg-muted/40 rounded-md flex items-center px-3 justify-between border border-dashed border-primary/30">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded bg-primary/40" />
                              <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
                            </div>
                            <div className="flex gap-2">
                              <div className="h-2 w-8 bg-muted-foreground/20 rounded" />
                              <div className="h-2 w-8 bg-muted-foreground/20 rounded" />
                            </div>
                          </div>

                          {/* Hero Section */}
                          <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/5 rounded-md flex items-center px-4 border border-dashed border-primary/30">
                            <div className="space-y-2">
                              <div className="h-3 w-24 bg-primary/30 rounded" />
                              <div className="h-2 w-32 bg-muted-foreground/20 rounded" />
                              <div className="h-5 w-16 bg-primary/50 rounded-md mt-1" />
                            </div>
                          </div>

                          {/* Products Section */}
                          <div className="flex-1 bg-muted/20 rounded-md p-2 border border-dashed border-muted-foreground/20">
                            <div className="grid grid-cols-3 gap-2 h-full">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-background rounded border border-border/50 p-1.5">
                                  <div className="h-10 bg-muted/50 rounded mb-1.5" />
                                  <div className="h-1.5 w-3/4 bg-muted-foreground/20 rounded mb-1" />
                                  <div className="h-1.5 w-1/2 bg-primary/30 rounded" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer Section */}
                          <div className="h-6 bg-muted/30 rounded-md flex items-center justify-center border border-dashed border-muted-foreground/20">
                            <div className="flex gap-3">
                              <div className="h-1.5 w-6 bg-muted-foreground/20 rounded" />
                              <div className="h-1.5 w-6 bg-muted-foreground/20 rounded" />
                              <div className="h-1.5 w-6 bg-muted-foreground/20 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating accent */}
                  <div className="absolute -bottom-3 -right-3 glass rounded-xl p-2.5 shadow-lg animate-float border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-medium">AI Building...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PHASE 3: AI Guided Intro Screen (After Steps Complete)
  // ==========================================
  if (guidedStepsCompleted) {
    return (
      <div className="relative overflow-hidden min-h-[650px] lg:min-h-[750px]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-400/5 rounded-full blur-3xl" />

        {/* Floating Feature Tags */}
        <div className="hidden lg:flex absolute top-24 left-[12%] glass rounded-full px-4 py-2 shadow-lg animate-float items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">AI Guided</span>
        </div>
        <div className="hidden lg:flex absolute bottom-32 left-[8%] glass rounded-full px-4 py-2 shadow-lg animate-float-delayed items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium">Instant Setup</span>
        </div>
        <div className="hidden lg:flex absolute top-28 right-[10%] glass rounded-full px-4 py-2 shadow-lg animate-float-slow items-center gap-2">
          <Star className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-medium">Custom Design</span>
        </div>
        <div className="hidden lg:flex absolute bottom-28 right-[12%] glass rounded-full px-4 py-2 shadow-lg animate-float items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-medium">Smart Layout</span>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[650px] lg:min-h-[750px] px-4">
          <div className="w-full max-w-xl animate-fade-in-up">
            {/* Main Card */}
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 lg:p-12">
              {/* AI Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  {/* Animated ring */}
                  <div className="absolute inset-0 rounded-3xl ring-4 ring-primary/20 animate-pulse" />
                  {/* Subtle glow */}
                  <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-10" />
                </div>
              </div>

              {/* Headline */}
              <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                  Bring your website to life with{" "}
                  <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                    Universell AI
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Great! We&apos;ve got your business details and logo ready—now let&apos;s turn them into a beautiful website. This is where it all comes together ✨
                </p>
              </div>

              {/* Two Path Options */}
              <div className="space-y-4 mb-6">
                {/* Option A: Brand Vault */}
                <button
                  onClick={() => setShowBrandVaultScreen(true)}
                  className="w-full group relative p-5 rounded-2xl border-2 border-border bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground text-lg">Create a Brand Vault</span>
                        <span className="text-xs font-medium text-violet-600 bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 rounded-full">New</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Add everything you already have — you can always change or refine it later.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Logo</span>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Colors</span>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Inspiration</span>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">+ More</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-2" />
                  </div>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Option B: Guided Questions */}
                <button
                  onClick={onNext}
                  className="w-full group relative p-5 rounded-2xl border-2 border-border bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-foreground text-lg block mb-1">Guided Questions</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Answer a few quick questions and we&apos;ll handle the rest.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Check className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">Takes about 2 minutes</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0 mt-2" />
                  </div>
                </button>
              </div>

              {/* Skip option */}
              <div className="pt-2 border-t border-border/50">
                <button
                  onClick={() => setIsBusinessModelModalOpen(true)}
                  className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 group"
                >
                  Skip for now and explore
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Trust indicator */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-primary/60" />
                You can always customize everything later
              </p>
            </div>
          </div>
        </div>

        {/* Business Model Selection Modal */}
        <Dialog open={isBusinessModelModalOpen} onOpenChange={setIsBusinessModelModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Choose your business model
              </DialogTitle>
              <DialogDescription className="text-base pt-1">
                      This information is required so we can create the right website structure for your business.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {businessModels.map((model) => {
                        const IconComponent = model.icon;
                        const isSelected = selectedBusinessModel === model.id;
                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => setSelectedBusinessModel(model.id)}
                            className={cn(
                              "relative p-5 rounded-2xl border-2 text-left transition-all duration-200",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                : "border-border hover:border-primary/40 hover:bg-muted/30"
                            )}
                          >
                            {/* Selection indicator */}
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                            
                            {/* Icon */}
                            <div className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
                              model.color
                            )}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            
                            {/* Content */}
                            <h3 className="font-semibold text-foreground mb-1">
                              {model.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {model.description}
                            </p>
                            <p className="text-xs text-muted-foreground/70 italic">
                              {model.examples}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsBusinessModelModalOpen(false);
                        setSelectedBusinessModel(null);
                      }}
                      className="rounded-xl"
                      disabled={isCreatingWebsite}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCreateWebsiteWithoutChat}
                      disabled={!selectedBusinessModel || isCreatingWebsite}
                      className="rounded-xl gap-2"
                    >
                      {isCreatingWebsite ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating your website…
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
      </div>
    );
  }

  // ==========================================
  // PHASE 2: Step-by-Step Flow (After "Get Started")
  // ==========================================
  return (
    <div className="relative overflow-hidden min-h-[600px]">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 py-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
            <div className="p-8 lg:p-10">
              {/* Step 1: Business Details */}
              {currentGuidedStep === 1 && (
                <div className="animate-fade-in-up">
                  {/* Engaging Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Business Details — let&apos;s build something impressive ✨
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl">
                      Tell us about your business so we can help you sell better. You can even let AI help you write the description.
                    </p>
                  </div>

                  {/* Two Column Layout: Form + Visuals */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Form Fields */}
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Business Name <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Your business name"
                          className="h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="tagline" className="text-sm font-medium">
                            Tagline
                          </Label>
                          <button
                            type="button"
                            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                            onClick={() => {
                              // AI generates a short, catchy phrase
                              const generatedTagline = "Where quality meets convenience";
                              updateField("tagline", generatedTagline.slice(0, 60));
                            }}
                          >
                            <Sparkles className="w-3 h-3" />
                            Generate with AI
                          </button>
                        </div>
                        <Input
                          id="tagline"
                          value={formData.tagline}
                          onChange={(e) => updateField("tagline", e.target.value.slice(0, 60))}
                          placeholder="A short phrase that represents your brand"
                          maxLength={60}
                          className="h-11 rounded-xl"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>A short phrase that represents your brand.</span>
                          <span className={formData.tagline.length >= 55 ? (formData.tagline.length >= 60 ? "text-destructive" : "text-amber-500") : ""}>
                            {formData.tagline.length}/60
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="description" className="text-sm font-medium">
                            Business Description
                          </Label>
                          <button
                            type="button"
                            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                            onClick={() => setIsAIDescriptionModalOpen(true)}
                          >
                            <Sparkles className="w-3 h-3" />
                            Generate with AI
                          </button>
                        </div>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => updateField("description", e.target.value.slice(0, 300))}
                          placeholder="Describe what your business does..."
                          maxLength={300}
                          className="rounded-xl resize-none"
                          rows={3}
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Describe what your business does — this will be used across your website.</span>
                          <span className={formData.description.length >= 280 ? (formData.description.length >= 300 ? "text-destructive" : "text-amber-500") : ""}>
                            {formData.description.length}/300
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            Contact Email <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="hello@example.com"
                            className="h-11 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="h-11 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Brand-in-Website Style Preview (Desktop/Tablet only) */}
                    <div className="hidden lg:flex flex-col items-center justify-center h-[320px] relative">
                      {/* Background gradient glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 rounded-3xl" />
                      
                      {/* Stacked Website Style Preview Cards */}
                      <div className="relative w-full max-w-[280px] h-[260px]">
                        {/* Back Card - Minimal Style */}
                        <div 
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-[220px] h-[150px] glass rounded-2xl shadow-lg p-3 transform rotate-[-6deg] opacity-60"
                          style={{ zIndex: 1 }}
                        >
                          <div className="w-full h-16 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-xl mb-2 flex items-center justify-center">
                            <Layout className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full w-3/4" />
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full w-1/2" />
                          </div>
                        </div>

                        {/* Middle Card - Bold Style */}
                        <div 
                          className="absolute top-6 left-1/2 -translate-x-1/2 w-[240px] h-[160px] glass rounded-2xl shadow-xl p-3 transform rotate-[3deg] opacity-80"
                          style={{ zIndex: 2 }}
                        >
                          <div className="w-full h-20 bg-gradient-to-br from-violet-500/30 to-purple-600/20 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
                            <Palette className="w-6 h-6 text-violet-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="h-2 bg-violet-200 dark:bg-violet-800 rounded-full w-20" />
                              <div className="h-1.5 bg-violet-100 dark:bg-violet-900 rounded-full w-14" />
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                              <Store className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Front Card - Active Brand Preview */}
                        <div 
                          className="absolute top-14 left-1/2 -translate-x-1/2 w-[260px] h-[180px] glass rounded-2xl shadow-2xl p-4 border border-primary/20"
                          style={{ zIndex: 3 }}
                        >
                          {/* Mini Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                <Store className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                                {formData.name || "Your Store"}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                                <ShoppingCart className="w-2.5 h-2.5 text-primary" />
                              </div>
                            </div>
                          </div>

                          {/* Hero Banner */}
                          <div className="w-full h-[70px] bg-gradient-to-br from-primary/20 via-primary/10 to-violet-500/10 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                            <div className="text-center z-10">
                              <p className="text-[10px] font-medium text-primary/80">Welcome to</p>
                              <p className="text-sm font-bold text-foreground truncate max-w-[180px]">
                                {formData.name || "Your Brand"}
                              </p>
                            </div>
                          </div>

                          {/* Mini Product Grid */}
                          <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="flex-1 h-8 bg-foreground/5 rounded-lg flex items-center justify-center">
                                <Package className="w-3 h-3 text-foreground/30" />
                              </div>
                            ))}
                          </div>

                          {/* Live Badge */}
                          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                            <span className="text-[9px] font-semibold text-white flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              PREVIEW
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Caption */}
                      <p className="text-xs text-muted-foreground mt-4 text-center">
                        Your brand, beautifully displayed
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end mt-10 pt-6 border-t border-border/50">
                    <Button
                      onClick={handleConfirmStep}
                      size="lg"
                      className="px-8 rounded-xl shadow-lg shadow-primary/20"
                      disabled={!formData.name || !formData.email}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* AI Description Generation Modal */}
                  <Dialog open={isAIDescriptionModalOpen} onOpenChange={setIsAIDescriptionModalOpen}>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          Let&apos;s get to know your business better 👋
                        </DialogTitle>
                        <DialogDescription className="text-base pt-1">
                          A few details here will help us write a great description for you.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ai-business-input" className="text-sm font-medium">
                            Tell us about your business
                          </Label>
                          <Textarea
                            id="ai-business-input"
                            value={aiDescriptionInput}
                            onChange={(e) => setAIDescriptionInput(e.target.value)}
                            placeholder="What do you sell? Who is it for? What makes you different?"
                            className="min-h-[120px] resize-none rounded-xl"
                            rows={5}
                          />
                        </div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAIDescriptionModalOpen(false);
                            setAIDescriptionInput("");
                          }}
                          className="rounded-xl"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setIsGeneratingDescription(true);
                            // Simulate AI generation (replace with actual AI call)
                            setTimeout(() => {
                              const generatedDescription = aiDescriptionInput
                                ? `${formData.name || "Our business"} - ${aiDescriptionInput.slice(0, 200)}${aiDescriptionInput.length > 200 ? "..." : ""}`
                                : `${formData.name || "Your Business"} offers exceptional products and services tailored to meet your needs.`;
                              updateField("description", generatedDescription.slice(0, 300));
                              setIsGeneratingDescription(false);
                              setIsAIDescriptionModalOpen(false);
                              setAIDescriptionInput("");
                            }, 1000);
                          }}
                          disabled={isGeneratingDescription}
                          className="rounded-xl gap-2"
                        >
                          {isGeneratingDescription ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate Description
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Step 2: Business Address */}
              {currentGuidedStep === 2 && (
                <div className="animate-fade-in-up">
                  {/* Engaging Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Business Location — the boring details 😄
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl">
                      We know it&apos;s not exciting, but we still need these details to run your business smoothly.
                    </p>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
                    {/* Left Column - Form Fields */}
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-sm font-medium">
                            Country <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => updateField("country", e.target.value)}
                            placeholder="United States"
                            className="h-11 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-sm font-medium">
                            State <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => updateField("state", e.target.value)}
                            placeholder="California"
                            className="h-11 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium">
                            City <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            placeholder="San Francisco"
                            className="h-11 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipcode" className="text-sm font-medium">
                            Zipcode <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="zipcode"
                            value={formData.zipcode}
                            onChange={(e) => updateField("zipcode", e.target.value)}
                            placeholder="94102"
                            className="h-11 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="streetAddress" className="text-sm font-medium">
                          Street Address <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="streetAddress"
                          value={formData.streetAddress}
                          onChange={(e) => updateField("streetAddress", e.target.value)}
                          placeholder="123 Main Street, Suite 100"
                          className="h-11 rounded-xl"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <Button
                          variant="ghost"
                          onClick={handleBack}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                        <Button
                          onClick={handleConfirmStep}
                          size="lg"
                          className="px-8 rounded-xl shadow-lg shadow-primary/20"
                          disabled={!formData.country || !formData.state || !formData.city || !formData.zipcode || !formData.streetAddress}
                        >
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Right Column - Map Infographic */}
                    <div className="hidden lg:block" aria-hidden="true">
                      <div className="relative h-full min-h-[320px] rounded-3xl bg-gradient-to-br from-primary/5 via-muted/30 to-primary/10 border border-border/50 overflow-hidden">
                        {/* Abstract Map Grid */}
                        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 340 320" fill="none">
                          {/* Horizontal Roads */}
                          <path d="M0 80 L340 80" stroke="currentColor" strokeWidth="2" className="text-border" />
                          <path d="M0 160 L340 160" stroke="currentColor" strokeWidth="3" className="text-muted-foreground/30" />
                          <path d="M0 240 L340 240" stroke="currentColor" strokeWidth="2" className="text-border" />
                          {/* Vertical Roads */}
                          <path d="M85 0 L85 320" stroke="currentColor" strokeWidth="2" className="text-border" />
                          <path d="M170 0 L170 320" stroke="currentColor" strokeWidth="3" className="text-muted-foreground/30" />
                          <path d="M255 0 L255 320" stroke="currentColor" strokeWidth="2" className="text-border" />
                        </svg>

                        {/* Abstract City Blocks */}
                        <div className="absolute top-6 left-6 w-16 h-14 rounded-xl bg-muted/60 shadow-sm" />
                        <div className="absolute top-6 right-8 w-20 h-12 rounded-xl bg-muted/40 shadow-sm" />
                        <div className="absolute top-24 left-24 w-14 h-10 rounded-lg bg-muted/50 shadow-sm" />
                        <div className="absolute bottom-24 left-8 w-18 h-14 rounded-xl bg-muted/50 shadow-sm" />
                        <div className="absolute bottom-8 right-6 w-16 h-12 rounded-xl bg-muted/60 shadow-sm" />
                        <div className="absolute bottom-16 left-28 w-12 h-10 rounded-lg bg-muted/40 shadow-sm" />

                        {/* Delivery Route - Dashed Line */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 320" fill="none">
                          <path 
                            d="M40 280 Q80 240 120 220 T200 180 T280 120" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeDasharray="8 4"
                            className="text-primary/40"
                            fill="none"
                          />
                          {/* Route start dot */}
                          <circle cx="40" cy="280" r="4" className="fill-primary/50" />
                        </svg>

                        {/* Location Pin - Central Focus */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          {/* Pin Shadow */}
                          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-3 bg-black/10 rounded-full blur-sm" />
                          {/* Pulse Ring */}
                          <div className="absolute inset-0 w-16 h-16 -translate-x-2 -translate-y-2 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                          <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/10" />
                          {/* Pin */}
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/30 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Store Icon - Near Pin */}
                        <div className="absolute top-[35%] right-[25%] w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/80 to-teal-500/80 shadow-lg flex items-center justify-center animate-float-slow">
                          <Store className="w-5 h-5 text-white" />
                        </div>

                        {/* Abstract Landmarks */}
                        <div className="absolute top-16 left-[45%] w-8 h-8 rounded-lg bg-violet-400/30 shadow-sm flex items-center justify-center">
                          <div className="w-3 h-3 rounded bg-violet-400/60" />
                        </div>
                        <div className="absolute bottom-20 right-[35%] w-6 h-6 rounded-full bg-amber-400/30 shadow-sm" />

                        {/* Subtle Glow Behind Pin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

                        {/* Decorative Corner Elements */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-40">
                          <div className="w-2 h-2 rounded-full bg-primary/60" />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          <div className="w-1 h-1 rounded-full bg-primary/30" />
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-1 opacity-40">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Logo Upload + Recommended Logos */}
              {currentGuidedStep === 3 && (
                <div className="animate-fade-in-up">
                  {/* Engaging Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Logo Time — let&apos;s have some fun 🎨
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl">
                      Pick a logo, play with colors, and make it feel like <em>you</em>. Don&apos;t worry, you can always change it later.
                    </p>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    {/* Left Column - Logo Selection */}
                    <div className="space-y-6">
                      {/* Logo Upload Area */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Upload Your Logo</Label>
                        <div
                          onClick={() => {
                            setSelectedRecommendedLogo(null);
                            fileInputRef.current?.click();
                          }}
                          className={cn(
                            "relative border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all duration-300",
                            logoPreview && !selectedRecommendedLogo
                              ? "border-primary/40 bg-primary/5"
                              : "border-border hover:border-primary/40 hover:bg-muted/30"
                          )}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          
                          {logoPreview && !selectedRecommendedLogo ? (
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={logoPreview}
                                  alt="Logo preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-foreground">Logo uploaded</p>
                                <p className="text-sm text-muted-foreground">Click to change</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                                <Upload className="w-6 h-6 text-muted-foreground/60" />
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-foreground">Upload your logo</p>
                                <p className="text-sm text-muted-foreground">PNG, JPG up to 2MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recommended Logos Section */}
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <Label className="text-sm font-medium">AI-Generated Logos for {formData.name || "Your Business"}</Label>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select a logo style that fits your brand. You can customize colors after selection.
                        </p>
                        
                        <div className="grid grid-cols-4 gap-3">
                          {recommendedLogos.map((logo) => {
                            const theme = colorThemes.find(t => t.id === logo.themeId) || colorThemes[0];
                            const displayColors = selectedRecommendedLogo === logo.id ? getCurrentColors() : { primary: theme.primary, secondary: theme.secondary };
                            
                            return (
                              <button
                                key={logo.id}
                                onClick={() => {
                                  setSelectedRecommendedLogo(logo.id);
                                  setLogoPreview(null);
                                  // Set initial colors from the logo's theme
                                  const logoTheme = colorThemes.find(t => t.id === logo.themeId) || colorThemes[0];
                                  handleThemeSelect(logoTheme);
                                }}
                                className={cn(
                                  "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                                  selectedRecommendedLogo === logo.id
                                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                    : "border-border hover:border-primary/40 bg-card"
                                )}
                              >
                                <div className="w-14 h-14 rounded-lg overflow-hidden">
                                  {renderLogoPreview(logo, displayColors, "sm")}
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">{logo.name}</span>
                                {selectedRecommendedLogo === logo.id && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Preview & Color Customization */}
                    <div className="space-y-6">
                      {/* Live Logo Preview */}
                      {selectedRecommendedLogo && (
                        <div className="rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50 p-5">
                          <Label className="text-sm font-medium mb-4 block">Logo Preview</Label>
                          <div className="aspect-square w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden shadow-lg">
                            {renderLogoPreview(
                              recommendedLogos.find(l => l.id === selectedRecommendedLogo)!,
                              getCurrentColors(),
                              "lg"
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground text-center mt-3">
                            {formData.name || "Your Business"}
                          </p>
                        </div>
                      )}

                      {/* Color Customization Section */}
                      {selectedRecommendedLogo && (
                        <div className="rounded-2xl bg-card border border-border/50 p-5 space-y-5">
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-primary" />
                            <Label className="text-sm font-medium">Customize Logo Colors</Label>
                          </div>

                          {/* Color Theme Presets */}
                          <div className="space-y-3">
                            <Label className="text-xs text-muted-foreground">Color Themes</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {colorThemes.map((theme) => (
                                <button
                                  key={theme.id}
                                  onClick={() => handleThemeSelect(theme)}
                                  className={cn(
                                    "flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-200",
                                    selectedTheme.id === theme.id
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/40"
                                  )}
                                >
                                  <div className="flex gap-0.5">
                                    <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
                                    <div className="w-4 h-4 rounded-full" style={{ background: theme.secondary }} />
                                  </div>
                                  <span className="text-[10px] font-medium text-muted-foreground">{theme.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Custom Color Pickers */}
                          <div className="space-y-3 pt-3 border-t border-border/50">
                            <Label className="text-xs text-muted-foreground">Custom Colors</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Primary</Label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={customPrimaryColor}
                                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                                    className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                                  />
                                  <Input
                                    value={customPrimaryColor}
                                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                                    className="h-8 text-xs font-mono uppercase"
                                    maxLength={7}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Secondary</Label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={customSecondaryColor}
                                    onChange={(e) => setCustomSecondaryColor(e.target.value)}
                                    className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                                  />
                                  <Input
                                    value={customSecondaryColor}
                                    onChange={(e) => setCustomSecondaryColor(e.target.value)}
                                    className="h-8 text-xs font-mono uppercase"
                                    maxLength={7}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Helper Text */}
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              💡 You can change your logo colors now or later. These colors will also be used as your store&apos;s theme.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Placeholder when no logo selected */}
                      {!selectedRecommendedLogo && !logoPreview && (
                        <div className="rounded-2xl bg-muted/20 border border-dashed border-border p-8 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Select a logo to preview and customize colors
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleConfirmStep}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Skip for now
                      </button>
                      <Button
                        onClick={handleConfirmStep}
                        size="lg"
                        className="px-8 rounded-xl shadow-lg shadow-primary/20"
                      >
                        Complete Setup
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom helper text */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Takes ~5 minutes to complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION 3: Fast Start Module (High-Conversion)
// ============================================
type FastStartScreen = "initial" | "complete";

function FastStartVariant({ onNext }: { onNext: () => void }) {
  const [screen, setScreen] = useState<FastStartScreen>("initial");

  // Handle Get Started - go to completion screen
  const handleGetStarted = () => {
    setScreen("complete");
  };

  // Handle Go to Website Builder - navigate to dashboard
  const handleGoToBuilder = () => {
    // In production, this would navigate to the dashboard/editor
    // For now, we call onNext to proceed in the wizard
    onNext();
  };

  // Handle Edit Setup - go back to initial or restart onboarding
  const handleEditSetup = () => {
    setScreen("initial");
  };

  // Initial "Get Started" screen
  if (screen === "initial") {
    return (
      <div className="relative overflow-hidden min-h-[550px]">
        {/* Dynamic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 h-full py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto h-full">
            {/* Split Layout */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center h-full">
              
              {/* Left: Primary Content */}
              <div className="space-y-8">
                {/* Speed Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Instant Setup</span>
                </div>

                {/* Strong Headline */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
                  Your store.{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Ready fast.
                  </span>
                </h1>

                {/* Punchy supporting line */}
                <p className="text-lg text-muted-foreground max-w-md">
                  AI sets everything up so you can start selling right away.
                </p>

                {/* Dominant CTA - Hero of the screen */}
                <div className="pt-2">
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="group h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300 animate-pulse-glow"
                  >
                    Get Started
                    <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                {/* Minimal microcopy */}
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ~5 minutes to launch
                </p>
              </div>

              {/* Right: AI Generation Visual */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Main Builder Visual */}
                  <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="h-5 bg-background/80 rounded flex items-center px-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary/30 mr-2" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-20" />
                        </div>
                      </div>
                    </div>

                    {/* AI Generation Progress Canvas */}
                    <div className="p-4 bg-gradient-to-b from-background to-muted/10 h-[320px]">
                      {/* Generation Progress Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium">AI Generating...</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-xs text-muted-foreground">Building</span>
                        </div>
                      </div>

                      {/* Sections Being Built */}
                      <div className="space-y-3">
                        {/* Header - Complete */}
                        <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-primary/30 shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Header</span>
                              <span className="text-xs text-primary">Complete</span>
                            </div>
                            <div className="h-1.5 bg-primary rounded-full mt-1.5" />
                          </div>
                        </div>

                        {/* Hero - Complete */}
                        <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-primary/30 shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Hero Section</span>
                              <span className="text-xs text-primary">Complete</span>
                            </div>
                            <div className="h-1.5 bg-primary rounded-full mt-1.5" />
                          </div>
                        </div>

                        {/* Products - In Progress */}
                        <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Package className="w-4 h-4 text-primary/60" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Products</span>
                              <span className="text-xs text-muted-foreground">78%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full w-[78%] bg-gradient-to-r from-primary to-primary/80 rounded-full animate-shimmer" />
                            </div>
                          </div>
                        </div>

                        {/* Footer - Pending */}
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                            <div className="w-4 h-4 rounded border-2 border-muted-foreground/30" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Footer</span>
                              <span className="text-xs text-muted-foreground">Pending</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full mt-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Progress Badge */}
                  <div className="absolute -top-3 -right-3 bg-primary text-white rounded-xl px-4 py-2 shadow-xl shadow-primary/30">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-bold">3 of 4</span>
                    </div>
                  </div>

                  {/* Floating Speed Indicator */}
                  <div className="absolute -bottom-3 -left-3 glass rounded-xl p-3 shadow-lg border border-white/20 animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. time</p>
                        <p className="text-sm font-bold">2 min left</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completion Screen - "You're all set!"
  return (
    <div className="relative overflow-hidden min-h-[550px]">
      {/* Celebratory background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 h-full py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 mb-8 animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            You're all set!
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            You've shared everything needed to get started. We've applied your color theme, style preferences, and business details. You can now create and customize pages exactly the way you want.
          </p>

          {/* What Happens Next */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 mb-10 text-left animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              What you can do next
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Create and manage website pages</span> — Home, Shop, Services, and more
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Customize layouts</span> using your selected color theme
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Add products, services, or bookings</span> to your store
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Edit content and images</span> with AI assistance anytime
                </span>
              </li>
            </ul>
          </div>

          {/* Primary CTA */}
          <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <Button
              onClick={handleGoToBuilder}
              size="lg"
              className="group h-16 px-14 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300"
            >
              Go to Website Builder
              <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Secondary Action */}
          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <button
              onClick={handleEditSetup}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Edit setup details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function WelcomeStep({ onNext, businessInfo, onUpdateBusinessInfo }: WelcomeStepProps) {
  const [showGuidedOnboarding, setShowGuidedOnboarding] = useState(false);

  // Handler to switch from Landing to Guided onboarding
  const handleStartGuided = () => {
    setShowGuidedOnboarding(true);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 relative">
        <div className="animate-fade-in-up">
          {!showGuidedOnboarding ? (
            <LandingStyleVariant onStartGuided={handleStartGuided} />
          ) : (
            <GuidedOnboardingVariant
              onNext={onNext}
              businessInfo={businessInfo}
              onUpdateBusinessInfo={onUpdateBusinessInfo}
              skipIntro={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
