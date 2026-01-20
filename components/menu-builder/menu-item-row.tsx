"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Check,
  X,
  Home,
  FileText,
  ShoppingBag,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItemV2, MenuItemType } from "./types";

interface MenuItemRowProps {
  item: MenuItemV2;
  onUpdateItem: (id: string, updates: Partial<MenuItemV2>) => void;
  onRemoveItem: (id: string) => void;
  onToggleExpand: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
  isDragOverlay?: boolean;
  isDropTarget?: boolean;
}

const typeIcons: Record<MenuItemType, React.ElementType> = {
  page: FileText,
  category: Tag,
  product: ShoppingBag,
  custom_link: LinkIcon,
  system: Home,
};

const typeLabels: Record<MenuItemType, string> = {
  page: "Page",
  category: "Category",
  product: "Product",
  custom_link: "Custom Link",
  system: "System",
};

export function MenuItemRow({
  item,
  onUpdateItem,
  onRemoveItem,
  onToggleExpand,
  dragHandleProps,
  isDragOverlay,
  isDropTarget,
}: MenuItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(item.label);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const Icon = typeIcons[item.type] || FileText;
  const hasChildren = item.children && item.children.length > 0;
  const indentPx = item.depth * 32;

  const handleSaveLabel = () => {
    if (editLabel.trim()) {
      onUpdateItem(item.id, { label: editLabel.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditLabel(item.label);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveLabel();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    onRemoveItem(item.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 p-3 bg-card border rounded-lg transition-all group",
          !item.visible && "opacity-50 bg-muted/50",
          isDragOverlay && "shadow-lg border-primary",
          isDropTarget && "ring-2 ring-primary ring-offset-2 bg-primary/5"
        )}
        style={{ marginLeft: indentPx }}
      >
        {/* Depth indicator line for nested items */}
        {item.depth > 0 && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-border"
            style={{ marginLeft: (item.depth - 1) * 32 + 16 }}
          />
        )}

        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Expand/Collapse for items with children */}
        <button
          onClick={() => onToggleExpand(item.id)}
          className={cn(
            "p-1 hover:bg-muted rounded transition-colors",
            !hasChildren && "invisible"
          )}
        >
          {item.isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Icon */}
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveLabel}>
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{item.label}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground truncate">
            {typeLabels[item.type]} • {item.url}
          </p>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {item.visible ? "Visible" : "Hidden"}
          </span>
          <Switch
            checked={item.visible}
            onCheckedChange={(visible) => onUpdateItem(item.id, { visible })}
            className="scale-90"
          />
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{item.label}&quot;?
              {hasChildren && (
                <span className="block mt-2 text-orange-600">
                  This item has {item.children.length} nested item(s) that will also be removed.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
