// Menu Builder Types - WordPress-style menu management

export type MenuItemType = 'page' | 'category' | 'product' | 'custom_link' | 'system';

export interface MenuItemV2 {
  id: string;
  label: string;
  type: MenuItemType;
  url: string;
  target: '_self' | '_blank';
  
  // Source references
  pageId?: string;
  categoryId?: string;
  productId?: string;
  
  // Hierarchy
  parentId: string | null;
  depth: number;
  order: number;
  children: MenuItemV2[];
  
  // State
  visible: boolean;
  isExpanded: boolean;
  
  // Future extensibility
  icon?: string;
  badge?: string;
  cssClass?: string;
}

// Flat storage format for persistence
export interface MenuItemFlat {
  id: string;
  label: string;
  type: MenuItemType;
  url: string;
  target: '_self' | '_blank';
  pageId?: string;
  categoryId?: string;
  productId?: string;
  parentId: string | null;
  order: number;
  visible: boolean;
}

// Menu container
export interface Menu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'mobile';
  items: MenuItemFlat[];
  createdAt: string;
  updatedAt: string;
}

// Source item for the "Add Items" panel
export interface SourceItem {
  id: string;
  name: string;
  url: string;
  type: MenuItemType;
}

// DnD related types
export interface DragData {
  id: string;
  depth: number;
  parentId: string | null;
}

// Drop intent for horizontal drag nesting
export interface DropIntent {
  type: 'reorder' | 'nest' | 'unnest';
  targetParentId: string | null;
  targetIndex: number;
  projectedDepth: number;
}
