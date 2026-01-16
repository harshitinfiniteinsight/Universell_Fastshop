"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Eye,
  Save,
  Sparkles,
  Send,
  LayoutTemplate,
  Grid3X3,
  Filter,
  Star,
  ShoppingBag,
  Tag,
  Layers,
  MessageSquare,
  GripVertical,
  Trash2,
  Search,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface Block {
  id: string;
  type: string;
  name: string;
  icon: React.ElementType;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  category: string;
  image: string;
}

const availableBlocks: Block[] = [
  { id: "product-hero", type: "product-hero", name: "Product Hero Section", icon: LayoutTemplate },
  { id: "product-grid", type: "product-grid", name: "Product Grid", icon: Grid3X3 },
  { id: "category-filter", type: "category-filter", name: "Category Filter", icon: Filter },
  { id: "featured-products", type: "featured-products", name: "Featured Products", icon: Star },
  { id: "product-categories", type: "product-categories", name: "Product Categories", icon: Layers },
  { id: "cta", type: "cta", name: "Call to Action", icon: ShoppingBag },
  { id: "testimonials", type: "testimonials", name: "Testimonials", icon: MessageSquare },
  { id: "promo-banner", type: "promo-banner", name: "Promo Banner", icon: Tag },
];

const initialPageBlocks: Block[] = [
  { id: "1", type: "product-hero", name: "Product Hero Section", icon: LayoutTemplate },
  { id: "2", type: "category-filter", name: "Category Filter", icon: Filter },
  { id: "3", type: "product-grid", name: "Product Grid", icon: Grid3X3 },
];

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I can help you customize your Products page. Tell me what changes you'd like to make - for example, 'Add a featured products section' or 'Change the grid to show 4 products per row'.",
  },
];

const demoProducts: Product[] = [
  { id: "1", name: "Artisan Sourdough Bread", price: 8.99, salePrice: null, category: "Bakery", image: "🍞" },
  { id: "2", name: "Chocolate Croissant", price: 4.50, salePrice: 3.99, category: "Pastries", image: "🥐" },
  { id: "3", name: "Blueberry Muffin", price: 3.99, salePrice: null, category: "Pastries", image: "🧁" },
  { id: "4", name: "Cinnamon Roll", price: 5.50, salePrice: 4.99, category: "Pastries", image: "🥮" },
  { id: "5", name: "House Blend Coffee Beans", price: 18.99, salePrice: null, category: "Coffee", image: "☕" },
  { id: "6", name: "Espresso Roast (1lb)", price: 21.99, salePrice: 19.99, category: "Coffee", image: "☕" },
  { id: "7", name: "Avocado Toast", price: 12.99, salePrice: null, category: "Food", image: "🥑" },
  { id: "8", name: "Breakfast Burrito", price: 10.99, salePrice: null, category: "Food", image: "🌯" },
];

const categories = ["All", "Bakery", "Pastries", "Coffee", "Food"];

export default function ProductListingEditorPage() {
  const [pageBlocks, setPageBlocks] = useState<Block[]>(initialPageBlocks);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've updated your Products page based on your request: "${inputMessage}". The changes are now visible in the preview. Would you like me to make any other adjustments?`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const addBlock = (block: Block) => {
    const newBlock = {
      ...block,
      id: Date.now().toString(),
    };
    setPageBlocks((prev) => [...prev, newBlock]);
  };

  const removeBlock = (blockId: string) => {
    setPageBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const filteredProducts = selectedCategory === "All" 
    ? demoProducts 
    : demoProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col -m-6">
      {/* Editor Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/website-pages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold text-foreground">Edit: Products Page</h1>
          <Badge variant="secondary">Product Listing</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            Save As
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Chat */}
        <div className="w-80 bg-card border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">AI Assistant</h2>
                <p className="text-xs text-muted-foreground">
                  Customize your products page
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-4"
                      : "bg-muted mr-4"
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isGenerating && (
                <div className="bg-muted p-3 rounded-lg mr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Describe the changes you want..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center - Page Preview */}
        <div className="flex-1 bg-muted/30 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Preview Frame */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Fake browser bar */}
              <div className="h-10 bg-gray-100 border-b flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded px-3 py-1 text-xs text-gray-500">
                    sunrise-cafe-bakery.fastshop.io/products
                  </div>
                </div>
              </div>

              {/* Page Content Preview */}
              <div className="min-h-[700px]">
                {/* Products Hero Section */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 px-8 text-white text-center">
                  <h1 className="text-3xl font-bold mb-2">Our Products</h1>
                  <p className="text-lg opacity-90">
                    Fresh baked goods and artisan coffee, made with love daily
                  </p>
                </div>

                {/* Filter Bar */}
                <div className="bg-gray-50 border-b px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                            selectedCategory === cat
                              ? "bg-orange-500 text-white"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          className="pl-10 pr-4 py-2 border rounded-lg text-sm w-48"
                        />
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
                        Sort by
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl">
                          {product.image}
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            {product.category}
                          </p>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {product.salePrice ? (
                              <>
                                <span className="font-bold text-orange-500">
                                  ${product.salePrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center text-sm hover:bg-gray-50">
                      &lt;
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center text-sm">
                      1
                    </button>
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center text-sm hover:bg-gray-50">
                      2
                    </button>
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center text-sm hover:bg-gray-50">
                      3
                    </button>
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center text-sm hover:bg-gray-50">
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Blocks */}
        <div className="w-72 bg-card border-l border-border flex flex-col shrink-0">
          <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
            <TabsList className="m-4 grid grid-cols-2">
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="flex-1 flex flex-col m-0">
              {/* Current Page Blocks */}
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Page Blocks
                </h3>
                <div className="space-y-2">
                  {pageBlocks.map((block) => (
                    <div
                      key={block.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                        selectedBlock === block.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <block.icon className="w-4 h-4 text-primary" />
                      <span className="flex-1 text-sm">{block.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBlock(block.id);
                        }}
                        className="p-1 hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Blocks */}
              <div className="flex-1 overflow-auto p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Add Block
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableBlocks.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <block.icon className="w-6 h-6 text-primary" />
                      <span className="text-xs font-medium text-center">
                        {block.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Page Title
                  </label>
                  <Input defaultValue="Our Products" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    URL Slug
                  </label>
                  <Input defaultValue="products" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Products Per Row
                  </label>
                  <Input defaultValue="4" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Products Per Page
                  </label>
                  <Input defaultValue="12" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Meta Description
                  </label>
                  <Input
                    defaultValue="Browse our fresh baked goods and artisan coffee products"
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
