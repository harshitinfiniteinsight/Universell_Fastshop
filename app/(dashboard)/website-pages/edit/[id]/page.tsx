"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Eye,
  Save,
  Sparkles,
  Send,
  LayoutTemplate,
  Type,
  ImageIcon,
  Grid3X3,
  Settings,
  Star,
  MessageSquare,
  Phone,
  List,
  HelpCircle,
  ChevronRight,
  GripVertical,
  Trash2,
  Copy,
  Edit,
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

const availableBlocks: Block[] = [
  { id: "hero", type: "hero", name: "Hero Section", icon: LayoutTemplate },
  { id: "text", type: "text", name: "Text Block", icon: Type },
  { id: "image", type: "image", name: "Image", icon: ImageIcon },
  { id: "gallery", type: "gallery", name: "Gallery", icon: Grid3X3 },
  { id: "services", type: "services", name: "Services", icon: Settings },
  { id: "testimonials", type: "testimonials", name: "Testimonials", icon: Star },
  { id: "cta", type: "cta", name: "Call to Action", icon: Star },
  { id: "contact", type: "contact", name: "Contact", icon: Phone },
  { id: "features", type: "features", name: "Features", icon: List },
  { id: "faqs", type: "faqs", name: "FAQs", icon: HelpCircle },
];

const initialPageBlocks: Block[] = [
  { id: "1", type: "hero", name: "Hero Section", icon: LayoutTemplate },
  { id: "2", type: "text", name: "Text Block", icon: Type },
  { id: "3", type: "cta", name: "Call to Action", icon: Star },
];

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your AI Assistant. I can help you modify your page. Just describe what changes you want to make.",
  },
];

export default function PageEditorPage() {
  const [pageBlocks, setPageBlocks] = useState<Block[]>(initialPageBlocks);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
        content: `I understand you want to "${inputMessage}". I've made the changes to your page. You can see the updated preview on the right.`,
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
          <h1 className="font-semibold text-foreground">Edit: Homepage</h1>
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
                  Ask me to modify your page
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
          <div className="max-w-4xl mx-auto">
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
                    sunrise-cafe-bakery.fastshop.io
                  </div>
                </div>
              </div>

              {/* Page Content Preview */}
              <div className="min-h-[600px]">
                {/* Hero Section */}
                <div className="relative h-80 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">
                      Sunrise Cafe & Bakery
                    </h1>
                    <p className="text-xl opacity-90 mb-6">
                      Fresh baked goods and artisan coffee
                    </p>
                    <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold">
                      View Our Menu
                    </button>
                  </div>
                </div>

                {/* Features Section */}
                <div className="py-16 px-8">
                  <h2 className="text-2xl font-bold text-center mb-8">
                    Why Choose Us
                  </h2>
                  <div className="grid grid-cols-3 gap-8">
                    {["Fresh Daily", "Local Ingredients", "Expert Bakers"].map(
                      (item) => (
                        <div key={item} className="text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Star className="w-8 h-8 text-orange-500" />
                          </div>
                          <h3 className="font-semibold mb-2">{item}</h3>
                          <p className="text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur.
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="py-12 px-8 bg-gray-50 text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Ready to Order?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Visit us today or order online for pickup
                  </p>
                  <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold">
                    Order Now
                  </button>
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
                  <Input defaultValue="Homepage" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    URL Slug
                  </label>
                  <Input defaultValue="home" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Meta Description
                  </label>
                  <Input
                    defaultValue="Welcome to Sunrise Cafe & Bakery"
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
