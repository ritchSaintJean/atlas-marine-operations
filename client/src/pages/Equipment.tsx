import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Wrench, Calendar, Clock, Gauge } from "lucide-react";
import EquipmentCard from "@/components/EquipmentCard";
import MaintenanceSchedule from "@/components/MaintenanceSchedule";

interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  location: string;
  status: "active" | "maintenance" | "retired";
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  hoursOfOperation?: number;
  mileage?: number;
}

export default function Equipment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Mock data - will be replaced with real API calls
  const equipment: Equipment[] = [
    {
      id: "eq-001",
      name: "Pump Truck #1",
      type: "Vehicle",
      serialNumber: "PT2024001",
      location: "Box Truck",
      status: "active",
      lastMaintenanceDate: "2024-03-10",
      nextMaintenanceDate: "2024-04-10",
      hoursOfOperation: 1248,
      mileage: 45230
    },
    {
      id: "eq-002", 
      name: "Air Compressor",
      type: "Compressor",
      serialNumber: "AC2023045",
      location: "Warehouse",
      status: "active",
      lastMaintenanceDate: "2024-03-15",
      nextMaintenanceDate: "2024-04-15",
      hoursOfOperation: 892
    },
    {
      id: "eq-003",
      name: "Blast Pot #2",
      type: "Blasting Equipment", 
      serialNumber: "BP2024012",
      location: "Pump Truck",
      status: "maintenance",
      lastMaintenanceDate: "2024-03-01",
      nextMaintenanceDate: "2024-03-20",
      hoursOfOperation: 567
    }
  ];

  const locations = ["all", "Box Truck", "Pump Truck", "Warehouse"];

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || eq.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-chart-2 text-white";
      case "maintenance": return "bg-chart-3 text-white";
      case "retired": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6" data-testid="equipment-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Equipment Management</h1>
          <p className="text-muted-foreground">Track equipment, maintenance schedules, and assignments</p>
        </div>
        <Button data-testid="button-add-equipment">
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-2">
              {locations.map((location) => (
                <Button
                  key={location}
                  variant={selectedLocation === location ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLocation(location)}
                  data-testid={`button-filter-${location}`}
                >
                  {location === "all" ? "All Locations" : location}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="equipment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="equipment" data-testid="tab-equipment">Equipment List</TabsTrigger>
          <TabsTrigger value="maintenance" data-testid="tab-maintenance">Maintenance Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          {/* Equipment Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary" data-testid="stat-total">{equipment.length}</div>
                <div className="text-sm text-muted-foreground">Total Equipment</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-chart-2" data-testid="stat-active">
                  {equipment.filter(eq => eq.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-chart-3" data-testid="stat-maintenance">
                  {equipment.filter(eq => eq.status === "maintenance").length}
                </div>
                <div className="text-sm text-muted-foreground">In Maintenance</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-muted-foreground" data-testid="stat-retired">
                  {equipment.filter(eq => eq.status === "retired").length}
                </div>
                <div className="text-sm text-muted-foreground">Retired</div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment List */}
          <div className="grid gap-4">
            {filteredEquipment.map((eq) => (
              <EquipmentCard key={eq.id} equipment={eq} />
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No equipment found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <MaintenanceSchedule equipment={equipment} />
        </TabsContent>
      </Tabs>
    </div>
  );
}