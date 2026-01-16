"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShopType, Product, Service } from "../wizard-container";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Package,
  Briefcase,
  Calendar,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectItemsStepProps {
  shopType: ShopType;
  selectedProducts: Product[];
  selectedServices: Service[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateServices: (services: Service[]) => void;
  onNext: () => void;
  onBack: () => void;
}

// Demo data - pre-filled from Universell
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Artisan Sourdough Bread",
    sku: "BRD-001",
    price: 8.99,
    salePrice: null,
    category: "Bakery",
    selected: true,
  },
  {
    id: "2",
    name: "Chocolate Croissant",
    sku: "PST-002",
    price: 4.50,
    salePrice: 3.99,
    category: "Pastries",
    selected: true,
  },
  {
    id: "3",
    name: "Blueberry Muffin",
    sku: "PST-003",
    price: 3.99,
    salePrice: null,
    category: "Pastries",
    selected: true,
  },
  {
    id: "4",
    name: "Cinnamon Roll",
    sku: "PST-004",
    price: 5.50,
    salePrice: 4.99,
    category: "Pastries",
    selected: true,
  },
  {
    id: "5",
    name: "House Blend Coffee Beans (1lb)",
    sku: "CFE-001",
    price: 18.99,
    salePrice: null,
    category: "Coffee",
    selected: true,
  },
  {
    id: "6",
    name: "Espresso Roast (1lb)",
    sku: "CFE-002",
    price: 21.99,
    salePrice: 19.99,
    category: "Coffee",
    selected: false,
  },
  {
    id: "7",
    name: "Avocado Toast",
    sku: "FD-001",
    price: 12.99,
    salePrice: null,
    category: "Food",
    selected: true,
  },
  {
    id: "8",
    name: "Breakfast Burrito",
    sku: "FD-002",
    price: 10.99,
    salePrice: null,
    category: "Food",
    selected: false,
  },
];

const mockServices: Service[] = [
  {
    id: "1",
    name: "Catering Consultation",
    duration: "30 min",
    price: 0,
    salePrice: null,
    category: "Catering",
    selected: true,
  },
  {
    id: "2",
    name: "Private Event Catering",
    duration: "4 hours",
    price: 500.0,
    salePrice: null,
    category: "Catering",
    selected: true,
  },
  {
    id: "3",
    name: "Corporate Breakfast Package",
    duration: "2 hours",
    price: 250.0,
    salePrice: 225.0,
    category: "Catering",
    selected: true,
  },
  {
    id: "4",
    name: "Baking Class - Bread Making",
    duration: "3 hours",
    price: 85.0,
    salePrice: null,
    category: "Classes",
    selected: false,
  },
  {
    id: "5",
    name: "Latte Art Workshop",
    duration: "2 hours",
    price: 65.0,
    salePrice: 55.0,
    category: "Classes",
    selected: false,
  },
];

export function SelectItemsStep({
  shopType,
  selectedProducts,
  selectedServices,
  onUpdateProducts,
  onUpdateServices,
  onNext,
  onBack,
}: SelectItemsStepProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("products");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data from Universell
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Use mock data with pre-selected items for demo
      // If parent already has selections, use those; otherwise use mock defaults
      const hasExistingProducts = selectedProducts.length > 0;
      const hasExistingServices = selectedServices.length > 0;

      const mergedProducts = mockProducts.map((p) => ({
        ...p,
        selected: hasExistingProducts 
          ? selectedProducts.some((sp) => sp.id === p.id && sp.selected)
          : p.selected, // Use mock default selection
      }));
      const mergedServices = mockServices.map((s) => ({
        ...s,
        selected: hasExistingServices
          ? selectedServices.some((ss) => ss.id === s.id && ss.selected)
          : s.selected, // Use mock default selection
      }));

      setProducts(mergedProducts);
      setServices(mergedServices);
      
      // Sync pre-selected items to parent state
      if (!hasExistingProducts) {
        onUpdateProducts(mergedProducts.filter((p) => p.selected));
      }
      if (!hasExistingServices) {
        onUpdateServices(mergedServices.filter((s) => s.selected));
      }
      
      setIsLoading(false);
    }, 500);
  }, []);

  // Set default tab based on shop type
  useEffect(() => {
    if (shopType === "services") {
      setActiveTab("services");
    } else if (shopType === "booking") {
      setActiveTab("bookings");
    } else {
      setActiveTab("products");
    }
  }, [shopType]);

  const toggleProductSelection = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, selected: !p.selected } : p
    );
    setProducts(updated);
    onUpdateProducts(updated.filter((p) => p.selected));
  };

  const toggleServiceSelection = (serviceId: string) => {
    const updated = services.map((s) =>
      s.id === serviceId ? { ...s, selected: !s.selected } : s
    );
    setServices(updated);
    onUpdateServices(updated.filter((s) => s.selected));
  };

  const selectAllProducts = () => {
    const allSelected = products.every((p) => p.selected);
    const updated = products.map((p) => ({ ...p, selected: !allSelected }));
    setProducts(updated);
    onUpdateProducts(updated.filter((p) => p.selected));
  };

  const selectAllServices = () => {
    const allSelected = services.every((s) => s.selected);
    const updated = services.map((s) => ({ ...s, selected: !allSelected }));
    setServices(updated);
    onUpdateServices(updated.filter((s) => s.selected));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProductCount = products.filter((p) => p.selected).length;
  const selectedServiceCount = services.filter((s) => s.selected).length;

  const canProceed =
    (shopType === "products" && selectedProductCount > 0) ||
    (shopType === "services" && selectedServiceCount > 0) ||
    (shopType === "booking" && selectedServiceCount > 0) ||
    (shopType === "both" &&
      (selectedProductCount > 0 || selectedServiceCount > 0));

  const showProducts =
    shopType === "products" || shopType === "both" || shopType === "booking";
  const showServices =
    shopType === "services" || shopType === "both" || shopType === "booking";

  // Empty state component
  const EmptyState = ({ type }: { type: "products" | "services" }) => (
    <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-border">
      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No {type} found
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        You don&apos;t have any {type} in Universell yet. Create some first to
        add them to your Fast Shop.
      </p>
      <Button variant="outline" asChild>
        <a href={`/universell/${type}`} target="_blank" rel="noopener">
          Create {type} in Universell
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </Button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Select Products & Services
          </h2>
          <p className="text-muted-foreground mt-1">
            Choose which items from Universell to include in your Fast Shop
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selection summary */}
        <div className="flex gap-4 flex-wrap">
          {showProducts && (
            <Badge
              variant={selectedProductCount > 0 ? "default" : "secondary"}
              className="px-3 py-1"
            >
              <Package className="w-3 h-3 mr-1" />
              {selectedProductCount} products selected
            </Badge>
          )}
          {showServices && (
            <Badge
              variant={selectedServiceCount > 0 ? "default" : "secondary"}
              className="px-3 py-1"
            >
              <Briefcase className="w-3 h-3 mr-1" />
              {selectedServiceCount} services selected
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {showProducts && (
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
            )}
            {showServices && (
              <TabsTrigger value="services" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Services
              </TabsTrigger>
            )}
            {shopType === "booking" && (
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="w-4 h-4" />
                Bookings
              </TabsTrigger>
            )}
          </TabsList>

          {/* Products Tab */}
          {showProducts && (
            <TabsContent value="products" className="mt-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <EmptyState type="products" />
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={products.every((p) => p.selected)}
                            onCheckedChange={selectAllProducts}
                          />
                        </TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow
                          key={product.id}
                          className={cn(
                            "cursor-pointer",
                            product.selected && "bg-primary/5"
                          )}
                          onClick={() => toggleProductSelection(product.id)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={product.selected}
                              onCheckedChange={() =>
                                toggleProductSelection(product.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {product.sku}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {product.salePrice ? (
                              <div>
                                <span className="text-destructive font-medium">
                                  ${product.salePrice.toFixed(2)}
                                </span>
                                <span className="text-muted-foreground line-through ml-2 text-sm">
                                  ${product.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          )}

          {/* Services Tab */}
          {showServices && (
            <TabsContent value="services" className="mt-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <EmptyState type="services" />
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={services.every((s) => s.selected)}
                            onCheckedChange={selectAllServices}
                          />
                        </TableHead>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow
                          key={service.id}
                          className={cn(
                            "cursor-pointer",
                            service.selected && "bg-primary/5"
                          )}
                          onClick={() => toggleServiceSelection(service.id)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={service.selected}
                              onCheckedChange={() =>
                                toggleServiceSelection(service.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {service.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {service.duration}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{service.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {service.salePrice ? (
                              <div>
                                <span className="text-destructive font-medium">
                                  ${service.salePrice.toFixed(2)}
                                </span>
                                <span className="text-muted-foreground line-through ml-2 text-sm">
                                  ${service.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium">
                                ${service.price.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          )}

          {/* Bookings Tab - uses services */}
          {shopType === "booking" && (
            <TabsContent value="bookings" className="mt-4">
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Booking Services
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Services selected in the Services tab will be available for
                  booking. Customers can schedule appointments directly on your
                  Fast Shop.
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext} disabled={!canProceed}>
            Continue to AI Generation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
