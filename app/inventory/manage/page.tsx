"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  PackageOpen,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  productCode: string;
  sku: string;
  stock: number;
  price: number;
  salePrice: number | null;
  showOnFastshop: boolean;
}

// Demo data - set to empty array to show empty state
const demoProducts: InventoryItem[] = [];

const demoServices: InventoryItem[] = [];

const demoBookings: InventoryItem[] = [];

export default function InventoryManagePage() {
  const [activeTab, setActiveTab] = useState("products");
  const [showOnFastshop, setShowOnFastshop] = useState(true);
  const [products, setProducts] = useState<InventoryItem[]>(demoProducts);
  const [services, setServices] = useState<InventoryItem[]>(demoServices);
  const [bookings, setBookings] = useState<InventoryItem[]>(demoBookings);

  const getCurrentItems = () => {
    switch (activeTab) {
      case "products":
        return products;
      case "services":
        return services;
      case "bookings":
        return bookings;
      default:
        return [];
    }
  };

  const currentItems = getCurrentItems();
  const hasItems = currentItems.length > 0;

  const handleToggleFastshop = (id: string) => {
    const updateItems = (items: InventoryItem[]) =>
      items.map((item) =>
        item.id === id ? { ...item, showOnFastshop: !item.showOnFastshop } : item
      );

    switch (activeTab) {
      case "products":
        setProducts(updateItems(products));
        break;
      case "services":
        setServices(updateItems(services));
        break;
      case "bookings":
        setBookings(updateItems(bookings));
        break;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Products & Services
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your inventory for FastShop
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Inventory
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Card className="p-6">
          {/* Tabs and Toggle */}
          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Show products on fastshop
              </span>
              <Switch
                checked={showOnFastshop}
                onCheckedChange={setShowOnFastshop}
              />
            </div>
          </div>

          {/* Table or Empty State */}
          {hasItems ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Product code</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Sale Price</TableHead>
                    <TableHead className="text-center">Show on Fastshop</TableHead>
                    <TableHead className="text-center w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-center">{item.stock}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.salePrice ? formatPrice(item.salePrice) : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={item.showOnFastshop}
                          onCheckedChange={() => handleToggleFastshop(item.id)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Empty State */
            <div className="border border-border rounded-lg p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <PackageOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground max-w-md mb-6">
                  It seems no inventory is created yet. First, create an inventory to display products on your FastShop.
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Inventory
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
