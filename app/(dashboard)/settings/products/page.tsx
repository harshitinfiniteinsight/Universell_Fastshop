"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  productCode: string;
  sku: string;
  stock: number;
  price: number;
  salePrice: number | null;
  showOnFastshop: boolean;
}

const products: Product[] = [
  { id: "1234", name: "T-shirt", productCode: "AB123", sku: "XYZ5678", stock: 100, price: 100.00, salePrice: 80.00, showOnFastshop: true },
  { id: "1235", name: "T-shirt", productCode: "AB123", sku: "XYZ5678", stock: 100, price: 100.00, salePrice: 80.00, showOnFastshop: true },
  { id: "1236", name: "Jeans", productCode: "CD456", sku: "XYZ5679", stock: 50, price: 60.00, salePrice: 45.00, showOnFastshop: true },
  { id: "1237", name: "Sneakers", productCode: "EF789", sku: "XYZ5680", stock: 75, price: 120.00, salePrice: 90.00, showOnFastshop: true },
  { id: "1238", name: "Hat", productCode: "GH012", sku: "XYZ5681", stock: 200, price: 25.00, salePrice: 20.00, showOnFastshop: true },
  { id: "1239", name: "Jacket", productCode: "IJ345", sku: "XYZ5682", stock: 60, price: 150.00, salePrice: 120.00, showOnFastshop: true },
  { id: "1240", name: "Socks", productCode: "KL678", sku: "XYZ5683", stock: 300, price: 10.00, salePrice: 8.00, showOnFastshop: true },
  { id: "1241", name: "Belt", productCode: "MN901", sku: "XYZ5684", stock: 120, price: 35.00, salePrice: 27.00, showOnFastshop: true },
  { id: "1242", name: "Shorts", productCode: "OP234", sku: "XYZ5685", stock: 80, price: 40.00, salePrice: 30.00, showOnFastshop: true },
];

const services = [
  { id: "1", name: "Catering Consultation", duration: "30 min", price: 0, showOnFastshop: true },
  { id: "2", name: "Private Event Catering", duration: "4 hours", price: 500.00, showOnFastshop: true },
  { id: "3", name: "Corporate Breakfast", duration: "2 hours", price: 250.00, showOnFastshop: true },
];

export default function ProductsServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnFastshop, setShowOnFastshop] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Products & Services
          </h1>
          <p className="text-muted-foreground">
            Manage which products and services appear on your Fast Shop
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Show products on fastshop
          </span>
          <Switch
            checked={showOnFastshop}
            onCheckedChange={setShowOnFastshop}
          />
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          Display your physical products on your website so customers can browse,
          add items to their cart, and complete their purchase smoothly.
        </p>
      </div>

      {/* Tabs and Table */}
      <Card>
        <Tabs defaultValue="products" className="w-full">
          <div className="flex items-center justify-between px-4 pt-4">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={entriesPerPage}
                  onValueChange={setEntriesPerPage}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-10"
                />
              </div>

              <Button variant="default" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="products" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Product code</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Show on Fastshop</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.productCode}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.salePrice
                        ? `$${product.salePrice.toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.showOnFastshop}
                        className="data-[state=checked]:bg-primary"
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing 1 to 10 of 19,420 entries
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled>
                  &lt;
                </Button>
                <Button variant="default" size="icon">
                  1
                </Button>
                <Button variant="outline" size="icon">
                  2
                </Button>
                <Button variant="outline" size="icon">
                  3
                </Button>
                <span className="px-2">...</span>
                <Button variant="outline" size="icon">
                  47
                </Button>
                <Button variant="outline" size="icon">
                  &gt;
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Show on Fastshop</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>{service.duration}</TableCell>
                    <TableCell>
                      {service.price === 0
                        ? "Free"
                        : `$${service.price.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.showOnFastshop}
                        className="data-[state=checked]:bg-primary"
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
          </TabsContent>

          <TabsContent value="bookings" className="mt-4 p-8 text-center">
            <p className="text-muted-foreground">
              No bookings configured yet.
            </p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
