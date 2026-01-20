"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MenuItemV2, DropIntent } from "./types";
import { MenuItemRow } from "./menu-item-row";
import { cn } from "@/lib/utils";

interface SortableMenuItemProps {
  item: MenuItemV2;
  onUpdateItem: (id: string, updates: Partial<MenuItemV2>) => void;
  onRemoveItem: (id: string) => void;
  onToggleExpand: (id: string) => void;
  isDragging?: boolean;
  isOver?: boolean;
  dropIntent?: DropIntent | null;
}

export function SortableMenuItem({
  item,
  onUpdateItem,
  onRemoveItem,
  onToggleExpand,
  isDragging,
  isOver,
  dropIntent,
}: SortableMenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine visual feedback based on drop intent
  const getDropIndicator = () => {
    if (!isOver || !dropIntent) return null;

    if (dropIntent.type === 'nest') {
      return (
        <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg bg-primary/5 pointer-events-none z-10">
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
            Nest as child
          </div>
        </div>
      );
    }

    return (
      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded pointer-events-none z-10" />
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        (isDragging || isSortableDragging) && "opacity-40"
      )}
    >
      {getDropIndicator()}
      <MenuItemRow
        item={item}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
        onToggleExpand={onToggleExpand}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDropTarget={isOver && dropIntent?.type === 'nest'}
      />
    </div>
  );
}
