"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Moon, ExternalLink, User, Search, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

interface NotificationItem {
  id: string;
  type: "notification" | "message";
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const sampleNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "notification",
    title: "Campaign created",
    description: 'Promotional campaign "Trendsetters sales" created',
    time: "1h ago",
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "New message from Jane",
    description: "Lorem ipsum dolor sit amet consectetur. Egestas proin sed risus...",
    time: "1h ago",
    read: false,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    type: "notification",
    title: "Order completed",
    description: "Order #12345 has been completed successfully",
    time: "2h ago",
    read: true,
  },
];

export function Header({ title, breadcrumbs = [], className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-white shadow-main px-8 py-5 flex items-center justify-between",
        className
      )}
    >
      {/* Left side - Title & Breadcrumbs */}
      <div className="flex flex-col gap-0.5">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <span className="w-px h-3 bg-foreground/50" />}
                {item.href ? (
                  <a href={item.href} className="hover:text-primary font-medium">
                    {item.label}
                  </a>
                ) : (
                  <span className="font-medium">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right side - Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="w-64 pl-10 bg-secondary border-0 h-10"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 p-0">
            <DropdownMenuLabel className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-medium">Notifications</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuLabel>
            <div className="max-h-80 overflow-y-auto">
              {sampleNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 p-4 border-b hover:bg-accent cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    {notification.type === "message" && notification.avatar ? (
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Check className="h-4 w-4" />
                Mark all as read
              </button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="outline" size="icon" className="rounded-full">
          <Moon className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* External Link */}
        <Button variant="outline" size="icon" className="rounded-full">
          <ExternalLink className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
