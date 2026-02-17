"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";
import type { OnboardState } from "@/lib/onboard-types";

const stats = [
  {
    title: "Total Orders",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Total Products",
    value: "86",
    change: "+3",
    trend: "up",
    icon: Package,
  },
  {
    title: "Total Customers",
    value: "3,456",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "$24,500",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
  },
];

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", amount: "$125.00", status: "Completed" },
  { id: "#ORD-002", customer: "Jane Smith", amount: "$89.00", status: "Processing" },
  { id: "#ORD-003", customer: "Bob Wilson", amount: "$245.00", status: "Completed" },
  { id: "#ORD-004", customer: "Alice Brown", amount: "$67.00", status: "Pending" },
];

const quickActions = [
  { label: "Add Product", icon: Package, href: "/settings/products" },
  { label: "View Orders", icon: ShoppingCart, href: "/orders" },
  { label: "Edit Homepage", icon: Eye, href: "/website-pages/edit/homepage" },
];

export default function DashboardPage() {
  const [onboardState, setOnboardState] = useState<OnboardState | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("universell-onboard-result");
      if (saved) {
        setOnboardState(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalModules = onboardState?.recommendations.filter((r) => r.score > 0).length || 0;
  const completedModules = Object.values(onboardState?.moduleProgress || {}).filter(
    (p) => p.stepsCompleted && p.stepsCompleted.length > 0
  ).length || 0;
  const setupProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Onboarding Banner */}
      {onboardState && totalModules > 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground mb-1">
                  Welcome, {onboardState.answers.businessName}!
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete your setup to unlock all features. You&apos;re {setupProgress}% done!
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${setupProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {completedModules}/{totalModules}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/setup" className="shrink-0">
              <Button className="gap-2">
                Continue Setup
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Quick Action
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Orders
            </h2>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{order.amount}</p>
                  <Badge
                    variant={
                      order.status === "Completed"
                        ? "default"
                        : order.status === "Processing"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      order.status === "Completed"
                        ? "bg-green-500"
                        : order.status === "Processing"
                        ? "bg-blue-500 text-white"
                        : ""
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href={action.href}>
                  <action.icon className="w-4 h-4 mr-3" />
                  {action.label}
                </a>
              </Button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-medium text-foreground mb-2">
              Your Shop is Live!
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Visit your Fast Shop to see how it looks to customers.
            </p>
            <Button size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View Live Shop
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
