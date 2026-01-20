"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuBuilder } from "@/components/menu-builder";

export default function MenuManagementPage() {
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

        {/* Menu Builder */}
        <MenuBuilder />
      </div>
    </TooltipProvider>
  );
}
