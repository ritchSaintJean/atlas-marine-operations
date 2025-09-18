import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUpDown, 
  Plus, 
  Clock,
  CheckCircle,
  Package,
  Truck,
  Calendar
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

interface TransferRecord {
  id: string;
  itemId: string;
  itemName: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  quantity: number;
  unit: string;
  status: "pending" | "in_transit" | "completed" | "cancelled";
  requestedBy: string;
  requestedDate: string;
  completedDate?: string;
  notes?: string;
}

interface InventoryTransferProps {
  locations: InventoryLocation[];
  items: InventoryItem[];
}

export default function InventoryTransfer({ locations, items }: InventoryTransferProps) {
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  
  // New transfer form state
  const [selectedItem, setSelectedItem] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  // Mock transfer history - will be replaced with real API calls
  const transferHistory: TransferRecord[] = [
    {
      id: "tr-001",
      itemId: "item-001",
      itemName: "Sandblasting Abrasive - Garnet",
      fromLocationId: "loc-003",
      fromLocationName: "Warehouse",
      toLocationId: "loc-002", 
      toLocationName: "Pump Truck",
      quantity: 200,
      unit: "lbs",
      status: "completed",
      requestedBy: "Mike Rodriguez",
      requestedDate: "2024-03-15",
      completedDate: "2024-03-15",
      notes: "Restocking for upcoming project"
    },
    {
      id: "tr-002",
      itemId: "item-002",
      itemName: "Respirator Filters - P100",
      fromLocationId: "loc-003",
      fromLocationName: "Warehouse", 
      toLocationId: "loc-001",
      toLocationName: "Box Truck",
      quantity: 10,
      unit: "pieces",
      status: "pending",
      requestedBy: "Sarah Chen",
      requestedDate: "2024-03-18",
      notes: "Emergency restock - filters damaged"
    },
    {
      id: "tr-003",
      itemId: "item-003",
      itemName: "Impact Wrench - 1/2 inch",
      fromLocationId: "loc-001",
      fromLocationName: "Box Truck",
      toLocationId: "loc-003",
      toLocationName: "Warehouse",
      quantity: 1,
      unit: "pieces", 
      status: "in_transit",
      requestedBy: "Carlos Torres",
      requestedDate: "2024-03-17",
      notes: "Tool maintenance required"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-chart-2 text-white";
      case "in_transit": return "bg-primary text-primary-foreground";
      case "pending": return "bg-chart-4 text-white";
      case "cancelled": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in_transit": return <Truck className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getAvailableQuantity = (itemId: string, locationId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return 0;
    const location = item.locations.find(loc => loc.locationId === locationId);
    return location?.quantity || 0;
  };

  const selectedItemData = items.find(item => item.id === selectedItem);
  const availableQuantity = selectedItem && fromLocation 
    ? getAvailableQuantity(selectedItem, fromLocation) 
    : 0;

  const handleSubmitTransfer = () => {
    if (!selectedItem || !fromLocation || !toLocation || !quantity) {
      return;
    }

    console.log('Submit transfer:', {
      itemId: selectedItem,
      fromLocationId: fromLocation,
      toLocationId: toLocation,
      quantity: parseInt(quantity),
      notes
    });

    // TODO: Implement API call to create transfer
    
    // Reset form
    setSelectedItem("");
    setFromLocation("");
    setToLocation("");
    setQuantity("");
    setNotes("");
  };

  return (
    <div className="space-y-6" data-testid="inventory-transfer">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "new" ? "default" : "outline"}
          onClick={() => setActiveTab("new")}
          data-testid="button-tab-new-transfer"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Transfer
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "outline"}
          onClick={() => setActiveTab("history")}
          data-testid="button-tab-transfer-history"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Transfer History
        </Button>
      </div>

      {activeTab === "new" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Create New Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Item Selection */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="item-select">Select Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger data-testid="select-transfer-item">
                    <SelectValue placeholder="Choose an item to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.totalStock} {item.unit} total)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedItemData && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">{selectedItemData.name}</p>
                <p className="text-xs text-muted-foreground">{selectedItemData.description}</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span>Category: <strong>{selectedItemData.category}</strong></span>
                  <span>Unit: <strong>{selectedItemData.unit}</strong></span>
                  <span>Total Stock: <strong>{selectedItemData.totalStock}</strong></span>
                </div>
              </div>
            )}

            {/* Location Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-location">From Location</Label>
                <Select value={fromLocation} onValueChange={setFromLocation}>
                  <SelectTrigger data-testid="select-from-location">
                    <SelectValue placeholder="Source location" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedItemData?.locations
                      .filter(loc => loc.quantity > 0)
                      .map((location) => (
                        <SelectItem key={location.locationId} value={location.locationId}>
                          {location.locationName} ({location.quantity} {selectedItemData.unit})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="to-location">To Location</Label>
                <Select value={toLocation} onValueChange={setToLocation}>
                  <SelectTrigger data-testid="select-to-location">
                    <SelectValue placeholder="Destination location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter(loc => loc.id !== fromLocation)
                      .map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity to Transfer</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="1"
                  max={availableQuantity}
                  data-testid="input-transfer-quantity"
                />
                {fromLocation && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {availableQuantity} {selectedItemData?.unit}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Transfer reason or notes"
                  data-testid="input-transfer-notes"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSubmitTransfer}
                disabled={!selectedItem || !fromLocation || !toLocation || !quantity || parseInt(quantity) > availableQuantity}
                className="w-full sm:w-auto"
                data-testid="button-submit-transfer"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Create Transfer Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transfer History</h3>
            <Badge variant="outline">
              {transferHistory.length} transfers
            </Badge>
          </div>

          {/* Transfer History List */}
          <div className="space-y-4">
            {transferHistory.map((transfer) => (
              <Card key={transfer.id} data-testid={`transfer-${transfer.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium" data-testid={`transfer-item-${transfer.id}`}>
                          {transfer.itemName}
                        </h4>
                        <Badge className={getStatusColor(transfer.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(transfer.status)}
                            {transfer.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{transfer.fromLocationName}</span>
                        <ArrowUpDown className="w-3 h-3" />
                        <span>{transfer.toLocationName}</span>
                        <span className="font-medium">
                          {transfer.quantity} {transfer.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Requested by:</label>
                      <p className="font-medium">{transfer.requestedBy}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Requested:</label>
                      <p className="font-medium">{new Date(transfer.requestedDate).toLocaleDateString()}</p>
                    </div>
                    {transfer.completedDate && (
                      <div>
                        <label className="text-muted-foreground">Completed:</label>
                        <p className="font-medium">{new Date(transfer.completedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {transfer.notes && (
                    <div className="mt-3 p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {transfer.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {transferHistory.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <ArrowUpDown className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No transfers yet</h3>
                <p className="text-muted-foreground">Transfer history will appear here once you start moving inventory</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}