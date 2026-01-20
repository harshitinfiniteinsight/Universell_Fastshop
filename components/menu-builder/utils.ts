// Menu Builder Utility Functions

import { MenuItemV2, MenuItemFlat, SourceItem, MenuItemType, DropIntent } from './types';

const MAX_DEPTH = 2; // 0 = root, 1 = child, 2 = grandchild (3 levels)

// Generate unique ID
export function generateId(): string {
  return `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Convert flat list to tree structure
export function flatToTree(flatItems: MenuItemFlat[]): MenuItemV2[] {
  const itemMap = new Map<string, MenuItemV2>();
  const rootItems: MenuItemV2[] = [];

  // First pass: create all items
  flatItems.forEach((item) => {
    itemMap.set(item.id, {
      ...item,
      depth: 0,
      children: [],
      isExpanded: true,
    });
  });

  // Second pass: build tree
  flatItems.forEach((item) => {
    const treeItem = itemMap.get(item.id)!;
    if (item.parentId && itemMap.has(item.parentId)) {
      const parent = itemMap.get(item.parentId)!;
      treeItem.depth = parent.depth + 1;
      parent.children.push(treeItem);
    } else {
      treeItem.depth = 0;
      rootItems.push(treeItem);
    }
  });

  // Sort by order
  const sortByOrder = (items: MenuItemV2[]): MenuItemV2[] => {
    return items
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        ...item,
        children: sortByOrder(item.children),
      }));
  };

  return sortByOrder(rootItems);
}

// Convert tree to flat list for storage
export function treeToFlat(treeItems: MenuItemV2[]): MenuItemFlat[] {
  const flatItems: MenuItemFlat[] = [];

  const flatten = (items: MenuItemV2[], parentId: string | null = null) => {
    items.forEach((item, index) => {
      flatItems.push({
        id: item.id,
        label: item.label,
        type: item.type,
        url: item.url,
        target: item.target,
        pageId: item.pageId,
        categoryId: item.categoryId,
        productId: item.productId,
        parentId: parentId,
        order: index,
        visible: item.visible,
      });
      if (item.children.length > 0) {
        flatten(item.children, item.id);
      }
    });
  };

  flatten(treeItems);
  return flatItems;
}

// Create a new menu item from a source item
export function createMenuItem(source: SourceItem): MenuItemV2 {
  return {
    id: generateId(),
    label: source.name,
    type: source.type,
    url: source.url,
    target: '_self',
    pageId: source.type === 'page' ? source.id : undefined,
    categoryId: source.type === 'category' ? source.id : undefined,
    productId: source.type === 'product' ? source.id : undefined,
    parentId: null,
    depth: 0,
    order: 0,
    children: [],
    visible: true,
    isExpanded: true,
  };
}

// Create a custom link menu item
export function createCustomLink(label: string, url: string, target: '_self' | '_blank' = '_self'): MenuItemV2 {
  return {
    id: generateId(),
    label,
    type: 'custom_link',
    url,
    target,
    parentId: null,
    depth: 0,
    order: 0,
    children: [],
    visible: true,
    isExpanded: true,
  };
}

// Check if nesting is allowed
export function canNest(depth: number): boolean {
  return depth < MAX_DEPTH;
}

// Find an item in the tree by ID
export function findItemById(items: MenuItemV2[], id: string): MenuItemV2 | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children.length > 0) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Find parent of an item
export function findParentById(items: MenuItemV2[], id: string, parent: MenuItemV2 | null = null): MenuItemV2 | null {
  for (const item of items) {
    if (item.id === id) return parent;
    if (item.children.length > 0) {
      const found = findParentById(item.children, id, item);
      if (found !== null) return found;
    }
  }
  return null;
}

// Remove an item from the tree
export function removeItem(items: MenuItemV2[], id: string): MenuItemV2[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: removeItem(item.children, id),
    }));
}

// Update an item in the tree
export function updateItem(items: MenuItemV2[], id: string, updates: Partial<MenuItemV2>): MenuItemV2[] {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    if (item.children.length > 0) {
      return {
        ...item,
        children: updateItem(item.children, id, updates),
      };
    }
    return item;
  });
}

// Get all visible items in tree order (for preview)
export function getVisibleItems(items: MenuItemV2[]): MenuItemV2[] {
  return items
    .filter((item) => item.visible)
    .map((item) => ({
      ...item,
      children: getVisibleItems(item.children),
    }));
}

// Flatten tree for DnD (preserves visual order)
export function flattenForDnd(items: MenuItemV2[]): MenuItemV2[] {
  const result: MenuItemV2[] = [];
  
  const traverse = (items: MenuItemV2[]) => {
    items.forEach((item) => {
      result.push(item);
      if (item.isExpanded && item.children.length > 0) {
        traverse(item.children);
      }
    });
  };
  
  traverse(items);
  return result;
}

// Reorder items after drag and drop with nesting support
export function reorderItems(
  items: MenuItemV2[],
  activeId: string,
  overId: string,
  position: 'before' | 'after' | 'child'
): MenuItemV2[] {
  // Remove the active item from its current position
  const activeItem = findItemById(items, activeId);
  if (!activeItem) return items;

  let newItems = removeItem(items, activeId);

  // Find where to insert
  if (position === 'child') {
    // Insert as child of overId
    newItems = updateItem(newItems, overId, {
      children: [
        ...(findItemById(newItems, overId)?.children || []),
        { ...activeItem, parentId: overId, depth: (findItemById(newItems, overId)?.depth || 0) + 1 },
      ],
    });
  } else {
    // Insert before or after overId at the same level
    const insertAtLevel = (items: MenuItemV2[], parentId: string | null): MenuItemV2[] => {
      const overItem = findItemById(items, overId);
      if (!overItem) return items;

      const overParent = findParentById(items, overId);
      const siblings = overParent ? overParent.children : items.filter((i) => i.parentId === null);
      const overIndex = siblings.findIndex((i) => i.id === overId);

      if (overIndex === -1) {
        // Search in children
        return items.map((item) => ({
          ...item,
          children: insertAtLevel(item.children, item.id),
        }));
      }

      const newSiblings = [...siblings];
      const insertIndex = position === 'before' ? overIndex : overIndex + 1;
      const newActiveItem = {
        ...activeItem,
        parentId: overParent?.id || null,
        depth: overItem.depth,
      };
      newSiblings.splice(insertIndex, 0, newActiveItem);

      if (overParent) {
        return updateItem(items, overParent.id, { children: newSiblings });
      } else {
        return newSiblings;
      }
    };

    newItems = insertAtLevel(newItems, null);
  }

  return newItems;
}

// Enhanced reorder with DropIntent support
export function reorderWithIntent(
  items: MenuItemV2[],
  activeId: string,
  overId: string,
  intent: DropIntent
): MenuItemV2[] {
  const activeItem = findItemById(items, activeId);
  const overItem = findItemById(items, overId);
  
  if (!activeItem || !overItem) return items;

  // Remove the active item with its children
  let newItems = removeItem(items, activeId);
  
  // Clone active item with updated depth
  const movedItem: MenuItemV2 = {
    ...activeItem,
    depth: intent.projectedDepth,
    parentId: intent.targetParentId,
    children: updateChildrenDepth(activeItem.children, intent.projectedDepth + 1),
  };

  if (intent.type === 'nest') {
    // Add as child of overItem
    const targetItem = findItemById(newItems, overId);
    if (targetItem) {
      newItems = updateItem(newItems, overId, {
        children: [...targetItem.children, movedItem],
        isExpanded: true, // Auto-expand when nesting
      });
    }
  } else if (intent.type === 'unnest') {
    // Move to parent's level, after the parent
    const currentParent = findItemById(items, activeItem.parentId || '');
    if (currentParent) {
      const grandParent = findParentById(items, currentParent.id);
      if (grandParent) {
        // Insert after currentParent in grandParent's children
        const parentIndex = grandParent.children.findIndex(c => c.id === currentParent.id);
        const newChildren = [...grandParent.children];
        newChildren.splice(parentIndex + 1, 0, { ...movedItem, parentId: grandParent.id, depth: grandParent.depth + 1 });
        newItems = updateItem(newItems, grandParent.id, { children: newChildren });
      } else {
        // Move to root level, after currentParent
        const parentIndex = newItems.findIndex(i => i.id === currentParent.id);
        newItems.splice(parentIndex + 1, 0, { ...movedItem, parentId: null, depth: 0 });
      }
    }
  } else {
    // Simple reorder: insert at overItem's position
    const overParent = findParentById(newItems, overId);
    const siblings = overParent ? [...overParent.children] : [...newItems.filter(i => !i.parentId || i.parentId === null)];
    const overIndex = siblings.findIndex(i => i.id === overId);
    
    if (overIndex !== -1) {
      const insertedItem = { 
        ...movedItem, 
        parentId: overParent?.id || null, 
        depth: overItem.depth 
      };
      siblings.splice(overIndex, 0, insertedItem);
      
      if (overParent) {
        newItems = updateItem(newItems, overParent.id, { children: siblings });
      } else {
        // Update root level - need to reconstruct
        const nonRootItems = newItems.filter(i => i.parentId !== null);
        newItems = [...siblings, ...nonRootItems];
      }
    }
  }

  return newItems;
}

// Helper to update depths of all children recursively
function updateChildrenDepth(children: MenuItemV2[], newDepth: number): MenuItemV2[] {
  return children.map(child => ({
    ...child,
    depth: newDepth,
    children: updateChildrenDepth(child.children, newDepth + 1),
  }));
}

// Check if moving would create circular reference
export function wouldCreateCircularReference(
  items: MenuItemV2[],
  itemId: string,
  targetParentId: string
): boolean {
  // Check if targetParentId is a descendant of itemId
  const item = findItemById(items, itemId);
  if (!item) return false;
  
  const isDescendant = (parent: MenuItemV2, targetId: string): boolean => {
    if (parent.id === targetId) return true;
    return parent.children.some(child => isDescendant(child, targetId));
  };
  
  return isDescendant(item, targetParentId);
}

// LocalStorage helpers
const STORAGE_KEY = 'universell-menu-structure';

export function saveMenuToStorage(items: MenuItemFlat[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save menu to storage:', e);
  }
}

export function loadMenuFromStorage(): MenuItemFlat[] | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load menu from storage:', e);
  }
  return null;
}

// Default menu items
export const defaultMenuItems: MenuItemFlat[] = [
  { id: '1', label: 'Home', type: 'system', url: '/', parentId: null, order: 0, visible: true, target: '_self' },
  { id: '2', label: 'Products', type: 'page', url: '/products', pageId: 'products', parentId: null, order: 1, visible: true, target: '_self' },
  { id: '3', label: 'Services', type: 'page', url: '/services', pageId: 'services', parentId: null, order: 2, visible: true, target: '_self' },
  { id: '4', label: 'About Us', type: 'page', url: '/about', pageId: 'about', parentId: null, order: 3, visible: true, target: '_self' },
  { id: '5', label: 'Contact', type: 'page', url: '/contact', pageId: 'contact', parentId: null, order: 4, visible: true, target: '_self' },
];
