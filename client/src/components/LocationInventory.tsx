import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Warehouse, 
  Package, 
  AlertTriangle,
  MapPin,
  BarChart3,
  Search
} from "lucide-react";

interface InventoryLocation {
  id: string;
  name: string;
  type: "vehicle" | "warehouse";
  description: string;
  totalItems: number;
  lowStockItems: number;
}

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

interface LocationInventoryProps {
  locations: InventoryLocation[];
  items: InventoryItem[];
}

export default function LocationInventory({ locations, items }: LocationInventoryProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0]?.id || "");

  const getLocationIcon = (type: string) => {
    return type === "warehouse" ? <Warehouse className="w-5 h-5" /> : <Truck className="w-5 h-5" />;
  };

  const getLocationTypeColor = (type: string) => {
    return type === "warehouse" ? "bg-chart-2 text-white" : "bg-primary text-primary-foreground";
  };

  const getItemsAtLocation = (locationId: string) => {
    return items
      .map(item => {
        const locationStock = item.locations.find(loc => loc.locationId === locationId);
        return locationStock ? { ...item, locationQuantity: locationStock.quantity } : null;
      })
      .filter(item => item && item.locationQuantity > 0)
      .sort((a, b) => {
        // Sort by low stock first, then by name
        if (a!.isLowStock !== b!.isLowStock) return a!.isLowStock ? -1 : 1;
        return a!.name.localeCompare(b!.name);
      }) as (InventoryItem & { locationQuantity: number })[];
  };

  const getLocationStats = (locationId: string) => {
    const itemsAtLocation = getItemsAtLocation(locationId);
    const totalItems = itemsAtLocation.reduce((sum, item) => sum + item.locationQuantity, 0);
    const lowStockItems = itemsAtLocation.filter(item => item.isLowStock).length;
    const categories = [...new Set(itemsAtLocation.map(item => item.category))].length;
    
    return {
      totalItems,
      lowStockItems,
      categories,
      uniqueItems: itemsAtLocation.length
    };
  };

  const currentLocation = locations.find(loc => loc.id === selectedLocation);
  const itemsAtCurrentLocation = getItemsAtLocation(selectedLocation);
  const locationStats = getLocationStats(selectedLocation);

  return (
    <div className="space-y-6" data-testid="location-inventory">
      {/* Location Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {locations.map((location) => (
          <Card 
            key={location.id}
            className={`cursor-pointer hover-elevate transition-all ${
              selectedLocation === location.id 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedLocation(location.id)}
            data-testid={`card-location-${location.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                {getLocationIcon(location.type)}
                <div className="flex-1">
                  <h3 className="font-semibold" data-testid={`text-location-name-${location.id}`}>
                    {location.name}
                  </h3>
                  <Badge 
                    size="sm" 
                    className={getLocationTypeColor(location.type)}
                    data-testid={`badge-location-type-${location.id}`}
                  >
                    {location.type}
                  </Badge>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3" data-testid={`text-location-desc-${location.id}`}>
                {location.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {location.totalItems} items
                </span>
                {location.lowStockItems > 0 && (
                  <Badge variant="outline" className="text-chart-3 border-chart-3">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {location.lowStockItems} low
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Location Details */}
      {currentLocation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getLocationIcon(currentLocation.type)}
                <div>
                  <CardTitle className="text-xl" data-testid="current-location-title">
                    {currentLocation.name}
                  </CardTitle>
                  <p className="text-muted-foreground" data-testid="current-location-description">
                    {currentLocation.description}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-manage-location">
                <BarChart3 className="w-4 h-4 mr-2" />
                Manage Location
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Location Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="location-stat-total">
              {locationStats.totalItems}
            </div>
            <div className="text-sm text-muted-foreground">Total Quantity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="location-stat-unique">
              {locationStats.uniqueItems}
            </div>
            <div className="text-sm text-muted-foreground">Unique Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="location-stat-categories">
              {locationStats.categories}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="location-stat-low-stock">
              {locationStats.lowStockItems}
            </div>
            <div className="text-sm text-muted-foreground">Low Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Items at Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Items at {currentLocation?.name}
            <Badge variant="outline" data-testid="items-count-badge">
              {itemsAtCurrentLocation.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {itemsAtCurrentLocation.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-md border transition-all hover:bg-muted/50 ${
                  item.isLowStock ? 'border-chart-3 bg-chart-3/5' : ''
                }`}
                data-testid={`location-item-${item.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium" data-testid={`location-item-name-${item.id}`}>
                      {item.name}
                    </h4>
                    <Badge 
                      size="sm" 
                      variant="outline"
                      data-testid={`location-item-category-${item.id}`}
                    >
                      {item.category}
                    </Badge>
                    {item.isLowStock && (
                      <Badge size="sm" className="bg-chart-3 text-white">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`location-item-desc-${item.id}`}>
                    {item.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold" data-testid={`location-item-quantity-${item.id}`}>
                    {item.locationQuantity} {item.unit}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of {item.totalStock} total
                  </div>
                </div>
              </div>
            ))}
          </div>

          {itemsAtCurrentLocation.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No items at this location</h3>
              <p className="text-muted-foreground">This location currently has no inventory items.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}