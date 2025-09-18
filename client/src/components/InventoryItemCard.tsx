import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  MapPin, 
  AlertTriangle,
  TrendingDown,
  Edit,
  ArrowUpDown,
  Eye
} from "lucide-react";

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

interface InventoryItemCardProps {
  item: InventoryItem;
  onEdit?: (id: string) => void;
  onTransfer?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function InventoryItemCard({ 
  item, 
  onEdit, 
  onTransfer, 
  onViewDetails 
}: InventoryItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tools": return "bg-primary text-primary-foreground";
      case "consumables": return "bg-chart-3 text-white";
      case "materials": return "bg-chart-4 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    return <Package className="w-4 h-4" />;
  };

  const getStockLevel = () => {
    if (item.totalStock === 0) return { level: "out", color: "text-destructive", percentage: 0 };
    if (item.isLowStock) return { 
      level: "low", 
      color: "text-chart-3", 
      percentage: (item.totalStock / item.reorderPoint) * 50 
    };
    if (item.totalStock < item.reorderPoint * 2) return { 
      level: "medium", 
      color: "text-chart-4", 
      percentage: (item.totalStock / (item.reorderPoint * 2)) * 75 + 25 
    };
    return { 
      level: "good", 
      color: "text-chart-2", 
      percentage: Math.min(100, (item.totalStock / (item.reorderPoint * 3)) * 100) 
    };
  };

  const stockLevel = getStockLevel();

  const getStockLevelLabel = (level: string) => {
    switch (level) {
      case "out": return "Out of Stock";
      case "low": return "Low Stock";
      case "medium": return "Medium Stock";
      case "good": return "Good Stock";
      default: return "Unknown";
    }
  };

  return (
    <Card 
      className={`hover-elevate transition-all ${
        item.isLowStock ? 'border-chart-3' : ''
      }`}
      data-testid={`card-inventory-item-${item.id}`}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(item.category)}
                <h3 className="font-semibold text-lg" data-testid={`text-name-${item.id}`}>
                  {item.name}
                </h3>
                <Badge className={getCategoryColor(item.category)} data-testid={`badge-category-${item.id}`}>
                  {item.category}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2" data-testid={`text-description-${item.id}`}>
                {item.description}
              </p>

              {/* Stock Level Indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${stockLevel.color}`}>
                    {item.totalStock} {item.unit}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({getStockLevelLabel(stockLevel.level)})
                  </span>
                </div>
                {item.isLowStock && (
                  <AlertTriangle className="w-4 h-4 text-chart-3" />
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid={`button-expand-${item.id}`}
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>

          {/* Stock Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Stock Level</span>
              <span className={stockLevel.color}>
                {item.totalStock} / {item.reorderPoint * 2} target
              </span>
            </div>
            <Progress 
              value={stockLevel.percentage} 
              className="h-2"
              data-testid={`progress-stock-${item.id}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Reorder at {item.reorderPoint}</span>
              <span>
                {item.totalStock > item.reorderPoint 
                  ? `${item.totalStock - item.reorderPoint} above minimum`
                  : `${item.reorderPoint - item.totalStock} below minimum`
                }
              </span>
            </div>
          </div>

          {/* Low Stock Alert */}
          {item.isLowStock && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-chart-3/10 text-chart-3">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">
                Below reorder point - Consider restocking
              </span>
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-4 pt-2 border-t">
              {/* Location Breakdown */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location Breakdown
                </h4>
                <div className="space-y-2">
                  {item.locations.map((location) => (
                    <div 
                      key={location.locationId} 
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-location-${location.locationId}`}>
                          {location.locationName}
                        </span>
                      </div>
                      <Badge variant="outline" data-testid={`badge-quantity-${location.locationId}`}>
                        {location.quantity} {item.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reorder Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Reorder Point</label>
                  <p className="text-sm font-medium" data-testid={`text-reorder-point-${item.id}`}>
                    {item.reorderPoint} {item.unit}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Unit</label>
                  <p className="text-sm font-medium" data-testid={`text-unit-${item.id}`}>
                    {item.unit}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(item.id)}
                  data-testid={`button-details-${item.id}`}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(item.id)}
                  data-testid={`button-edit-${item.id}`}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit Item
                </Button>
                <Button
                  variant={item.isLowStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTransfer?.(item.id)}
                  data-testid={`button-transfer-${item.id}`}
                >
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                  Transfer
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}