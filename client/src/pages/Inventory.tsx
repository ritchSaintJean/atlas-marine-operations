import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Package, Truck, Warehouse, AlertTriangle, TrendingDown } from "lucide-react";
import InventoryItemCard from "@/components/InventoryItemCard";
import LocationInventory from "@/components/LocationInventory";
import InventoryTransfer from "@/components/InventoryTransfer";

interface InventoryItem {
  id: string;
  name: string;
  category: "tools" | "consumables" | "materials";
  description: string;
  unit: string;
  totalStock: number;
  reorderPoint: number;
  isLowStock: boolean;
  locations: {
    locationId: string;
    locationName: string;
    quantity: number;
  }[];
}

interface InventoryLocation {
  id: string;
  name: string;
  type: "vehicle" | "warehouse";
  description: string;
  totalItems: number;
  lowStockItems: number;
}

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Mock inventory data - will be replaced with real API calls
  const locations: InventoryLocation[] = [
    {
      id: "loc-001",
      name: "Box Truck",
      type: "vehicle",
      description: "Mobile tool and equipment storage",
      totalItems: 145,
      lowStockItems: 3
    },
    {
      id: "loc-002", 
      name: "Pump Truck",
      type: "vehicle",
      description: "Specialized blasting equipment storage",
      totalItems: 89,
      lowStockItems: 1
    },
    {
      id: "loc-003",
      name: "Warehouse",
      type: "warehouse", 
      description: "Main storage facility",
      totalItems: 456,
      lowStockItems: 8
    }
  ];

  const inventoryItems: InventoryItem[] = [
    {
      id: "item-001",
      name: "Sandblasting Abrasive - Garnet",
      category: "materials",
      description: "80 mesh garnet abrasive for blasting operations",
      unit: "lbs",
      totalStock: 2400,
      reorderPoint: 500,
      isLowStock: false,
      locations: [
        { locationId: "loc-002", locationName: "Pump Truck", quantity: 800 },
        { locationId: "loc-003", locationName: "Warehouse", quantity: 1600 }
      ]
    },
    {
      id: "item-002",
      name: "Respirator Filters - P100",
      category: "consumables", 
      description: "P100 particulate filters for supplied air respirators",
      unit: "pieces",
      totalStock: 24,
      reorderPoint: 50,
      isLowStock: true,
      locations: [
        { locationId: "loc-001", locationName: "Box Truck", quantity: 12 },
        { locationId: "loc-003", locationName: "Warehouse", quantity: 12 }
      ]
    },
    {
      id: "item-003",
      name: "Impact Wrench - 1/2 inch",
      category: "tools",
      description: "Pneumatic impact wrench with socket set",
      unit: "pieces",
      totalStock: 3,
      reorderPoint: 2,
      isLowStock: false,
      locations: [
        { locationId: "loc-001", locationName: "Box Truck", quantity: 2 },
        { locationId: "loc-003", locationName: "Warehouse", quantity: 1 }
      ]
    },
    {
      id: "item-004",
      name: "Marine Grade Primer",
      category: "materials",
      description: "Two-component epoxy primer for marine environments", 
      unit: "gallons",
      totalStock: 15,
      reorderPoint: 25,
      isLowStock: true,
      locations: [
        { locationId: "loc-003", locationName: "Warehouse", quantity: 15 }
      ]
    },
    {
      id: "item-005",
      name: "Blast Hose - 1.25 inch",
      category: "consumables",
      description: "Reinforced rubber blast hose",
      unit: "feet", 
      totalStock: 200,
      reorderPoint: 100,
      isLowStock: false,
      locations: [
        { locationId: "loc-002", locationName: "Pump Truck", quantity: 150 },
        { locationId: "loc-003", locationName: "Warehouse", quantity: 50 }
      ]
    }
  ];

  const categories = [
    { id: "all", label: "All Categories", icon: Package },
    { id: "tools", label: "Tools", icon: Package },
    { id: "consumables", label: "Consumables", icon: Package },
    { id: "materials", label: "Materials", icon: Package }
  ];

  const locationFilters = [
    { id: "all", label: "All Locations" },
    ...locations.map(loc => ({ id: loc.id, label: loc.name }))
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || 
                           item.locations.some(loc => loc.locationId === selectedLocation);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getOverallStats = () => {
    const totalItems = inventoryItems.reduce((sum, item) => sum + item.totalStock, 0);
    const lowStockItems = inventoryItems.filter(item => item.isLowStock).length;
    const totalLocations = locations.length;
    
    return {
      totalItems,
      lowStockItems,
      totalLocations,
      totalValue: 0 // TODO: Calculate based on item costs
    };
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6" data-testid="inventory-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Inventory Management</h1>
          <p className="text-muted-foreground">Track tools, consumables, and materials across all locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-transfer">
            <Truck className="w-4 h-4 mr-2" />
            Transfer Items
          </Button>
          <Button data-testid="button-add-item">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="stat-total-items">{stats.totalItems}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="stat-low-stock">
              {stats.lowStockItems}
            </div>
            <div className="text-sm text-muted-foreground">Low Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="stat-locations">
              {stats.totalLocations}
            </div>
            <div className="text-sm text-muted-foreground">Locations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="stat-categories">
              {categories.length - 1}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Low Stock Alert</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.lowStockItems} items are below reorder point
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-view-low-stock">
                <TrendingDown className="w-3 h-3 mr-1" />
                View Items
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="items" data-testid="tab-items">All Items</TabsTrigger>
          <TabsTrigger value="locations" data-testid="tab-locations">By Location</TabsTrigger>
          <TabsTrigger value="transfers" data-testid="tab-transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>

                {/* Category Filters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          data-testid={`button-filter-category-${category.id}`}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {category.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Location Filters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <div className="flex flex-wrap gap-2">
                    {locationFilters.map((location) => (
                      <Button
                        key={location.id}
                        variant={selectedLocation === location.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLocation(location.id)}
                        data-testid={`button-filter-location-${location.id}`}
                      >
                        {location.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Items List */}
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <InventoryItemCard key={item.id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <LocationInventory locations={locations} items={inventoryItems} />
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <InventoryTransfer locations={locations} items={inventoryItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}