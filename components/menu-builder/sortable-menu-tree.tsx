"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MenuItemV2, DropIntent } from "./types";
import { SortableMenuItem } from "./sortable-menu-item";
import { MenuItemRow } from "./menu-item-row";
import { flattenForDnd, canNest, findItemById } from "./utils";

// Constants for nesting behavior
const INDENT_WIDTH = 32; // pixels per depth level
const NEST_THRESHOLD = 24; // horizontal drag distance to trigger nesting

interface SortableMenuTreeProps {
  items: MenuItemV2[];
  onReorder: (activeId: string, overId: string, intent: DropIntent) => void;
  onUpdateItem: (id: string, updates: Partial<MenuItemV2>) => void;
  onRemoveItem: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

// Re-export DropIntent for consumers
export type { DropIntent } from "./types";

export function SortableMenuTree({
  items,
  onReorder,
  onUpdateItem,
  onRemoveItem,
  onToggleExpand,
}: SortableMenuTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [dropIntent, setDropIntent] = useState<DropIntent | null>(null);
  
  const dragStartX = useRef<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Flatten tree for DnD while preserving depth info
  const flatItems = flattenForDnd(items);
  const itemIds = flatItems.map((item) => item.id);

  // Calculate projected depth based on horizontal drag offset
  const calculateDropIntent = useCallback((
    activeItem: MenuItemV2,
    overItem: MenuItemV2 | null,
    horizontalOffset: number
  ): DropIntent => {
    if (!overItem) {
      return {
        type: 'reorder',
        targetParentId: null,
        targetIndex: 0,
        projectedDepth: 0,
      };
    }

    const activeDepth = activeItem.depth;
    const overDepth = overItem.depth;
    
    // Calculate depth change based on horizontal offset
    const depthDelta = Math.round(horizontalOffset / NEST_THRESHOLD);
    let projectedDepth = Math.max(0, Math.min(2, activeDepth + depthDelta));

    // Determine intent based on projected depth vs over item
    if (projectedDepth > overDepth && canNest(overDepth)) {
      // Nesting under the over item
      return {
        type: 'nest',
        targetParentId: overItem.id,
        targetIndex: overItem.children?.length || 0,
        projectedDepth: overDepth + 1,
      };
    } else if (projectedDepth < activeDepth && activeItem.parentId) {
      // Unnesting to parent's level
      const parent = findItemById(items, activeItem.parentId);
      return {
        type: 'unnest',
        targetParentId: parent?.parentId || null,
        targetIndex: 0, // Will be calculated in handler
        projectedDepth: Math.max(0, activeDepth - 1),
      };
    } else {
      // Simple reorder at same level
      return {
        type: 'reorder',
        targetParentId: overItem.parentId,
        targetIndex: 0,
        projectedDepth: overDepth,
      };
    }
  }, [items]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    dragStartX.current = 0;
    setOffsetX(0);
    setDropIntent(null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over, delta } = event;
    
    setOffsetX(delta.x);
    setOverId(over?.id as string || null);
    
    const activeItem = flatItems.find(item => item.id === active.id);
    const overItem = over ? flatItems.find(item => item.id === over.id) : null;
    
    if (activeItem) {
      const intent = calculateDropIntent(activeItem, overItem || null, delta.x);
      setDropIntent(intent);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && dropIntent) {
      onReorder(active.id as string, over.id as string, dropIntent);
    }
    
    setActiveId(null);
    setOverId(null);
    setOffsetX(0);
    setDropIntent(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetX(0);
    setDropIntent(null);
  };

  const activeItem = activeId ? flatItems.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {flatItems.map((item) => (
            <SortableMenuItem
              key={item.id}
              item={item}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
              onToggleExpand={onToggleExpand}
              isDragging={activeId === item.id}
              isOver={overId === item.id}
              dropIntent={overId === item.id ? dropIntent : null}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div 
            className="opacity-90 shadow-lg"
            style={{
              transform: dropIntent ? `translateX(${(dropIntent.projectedDepth - activeItem.depth) * INDENT_WIDTH}px)` : undefined,
            }}
          >
            <MenuItemRow
              item={{
                ...activeItem,
                depth: dropIntent?.projectedDepth ?? activeItem.depth,
              }}
              onUpdateItem={() => {}}
              onRemoveItem={() => {}}
              onToggleExpand={() => {}}
              isDragOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
