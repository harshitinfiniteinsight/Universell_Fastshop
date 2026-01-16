"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Home,
  Link2,
  ShoppingCart,
  Package,
  Briefcase,
  CreditCard,
  Wrench,
  Users,
  BarChart3,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  expanded?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Link2, label: "Quick Links", href: "/quick-links" },
  { icon: ShoppingCart, label: "E-Commerce", href: "/ecommerce" },
  { icon: Package, label: "Marketing", href: "/marketing" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: Briefcase, label: "Business Operations", href: "/operations" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Wrench, label: "Utilities", href: "/utilities" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

export function Sidebar({ expanded = false, onToggle }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-border flex flex-col transition-all duration-300",
          isExpanded ? "w-[250px]" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-[78px] px-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          {isExpanded && (
            <span className="ml-2 font-semibold text-foreground">Universell</span>
          )}
        </div>

        {/* User */}
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary">RF</AvatarFallback>
            </Avatar>
            {isExpanded && (
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-foreground text-sm truncate">Robert Fox</span>
                <span className="text-xs text-muted-foreground truncate">47657983040...</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 text-foreground hover:bg-accent transition-colors",
                    isExpanded ? "justify-start" : "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && <span className="text-base">{item.label}</span>}
                </a>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right" className="bg-foreground text-white">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 top-11 h-8 w-8 rounded-full border-primary bg-white shadow-small hover:bg-primary hover:text-white"
          onClick={handleToggle}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </aside>
    </TooltipProvider>
  );
}
