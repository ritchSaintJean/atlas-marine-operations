import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Gauge, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Wrench
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "active" | "maintenance" | "retired";
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  hoursOfOperation?: number;
  mileage?: number;
}

interface MaintenanceItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: "calendar" | "hours" | "mileage";
  dueDate?: string;
  dueHours?: number;
  dueMileage?: number;
  currentHours?: number;
  currentMileage?: number;
  priority: "low" | "medium" | "high" | "overdue";
  description: string;
}

interface MaintenanceScheduleProps {
  equipment: Equipment[];
}

export default function MaintenanceSchedule({ equipment }: MaintenanceScheduleProps) {
  const [selectedType, setSelectedType] = useState<"all" | "calendar" | "hours" | "mileage">("all");

  // Mock maintenance items - will be replaced with real API data
  const maintenanceItems: MaintenanceItem[] = [
    {
      id: "maint-001",
      equipmentId: "eq-001",
      equipmentName: "Pump Truck #1",
      type: "calendar",
      dueDate: "2024-04-10",
      priority: "medium",
      description: "Monthly inspection and fluid check"
    },
    {
      id: "maint-002", 
      equipmentId: "eq-001",
      equipmentName: "Pump Truck #1",
      type: "mileage",
      dueMileage: 50000,
      currentMileage: 45230,
      priority: "low",
      description: "5,000 mile service - oil change and inspection"
    },
    {
      id: "maint-003",
      equipmentId: "eq-002",
      equipmentName: "Air Compressor",
      type: "hours",
      dueHours: 1000,
      currentHours: 892,
      priority: "medium",
      description: "1,000 hour service - filter replacement"
    },
    {
      id: "maint-004",
      equipmentId: "eq-003",
      equipmentName: "Blast Pot #2",
      type: "calendar",
      dueDate: "2024-03-20",
      priority: "overdue",
      description: "Safety valve inspection (overdue)"
    }
  ];

  const filteredItems = maintenanceItems.filter(item => 
    selectedType === "all" || item.type === selectedType
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "overdue": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-chart-3 text-white";
      case "medium": return "bg-chart-4 text-white";
      case "low": return "bg-chart-2 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "calendar": return <Calendar className="w-4 h-4" />;
      case "hours": return <Clock className="w-4 h-4" />;
      case "mileage": return <Gauge className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressPercentage = (item: MaintenanceItem) => {
    if (item.type === "hours" && item.dueHours && item.currentHours) {
      return Math.min((item.currentHours / item.dueHours) * 100, 100);
    }
    if (item.type === "mileage" && item.dueMileage && item.currentMileage) {
      return Math.min((item.currentMileage / item.dueMileage) * 100, 100);
    }
    return 0;
  };

  return (
    <div className="space-y-6" data-testid="maintenance-schedule">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Maintenance Schedule</h2>
          <p className="text-muted-foreground">Track upcoming and overdue maintenance</p>
        </div>
        <Button data-testid="button-add-maintenance">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Schedule Type Filters */}
      <div className="flex gap-2">
        {["all", "calendar", "hours", "mileage"].map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type as any)}
            data-testid={`button-filter-${type}`}
          >
            {type === "all" ? (
              "All Types"
            ) : (
              <span className="flex items-center gap-1">
                {getTypeIcon(type)}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="stat-overdue">
              {maintenanceItems.filter(item => item.priority === "overdue").length}
            </div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3" data-testid="stat-due-soon">
              {maintenanceItems.filter(item => item.priority === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">Due Soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="stat-upcoming">
              {maintenanceItems.filter(item => item.priority === "medium").length}
            </div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="stat-scheduled">
              {maintenanceItems.filter(item => item.priority === "low").length}
            </div>
            <div className="text-sm text-muted-foreground">Scheduled</div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className={`${item.priority === "overdue" ? "border-destructive" : ""}`}
            data-testid={`card-maintenance-${item.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(item.type)}
                    <h3 className="font-semibold" data-testid={`text-equipment-${item.id}`}>
                      {item.equipmentName}
                    </h3>
                    <Badge className={getPriorityColor(item.priority)} data-testid={`badge-priority-${item.id}`}>
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-description-${item.id}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="space-y-2">
                {item.type === "calendar" && item.dueDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span 
                      className={item.priority === "overdue" ? "text-destructive font-medium" : ""}
                      data-testid={`text-due-date-${item.id}`}
                    >
                      {new Date(item.dueDate).toLocaleDateString()}
                      {item.priority !== "overdue" && (
                        <span className="ml-2 text-muted-foreground">
                          ({getDaysUntilDue(item.dueDate)} days)
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {item.type === "hours" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Operating Hours:</span>
                      <span data-testid={`text-hours-${item.id}`}>
                        {item.currentHours?.toLocaleString()} / {item.dueHours?.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(item)}%` }}
                      />
                    </div>
                  </div>
                )}

                {item.type === "mileage" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mileage:</span>
                      <span data-testid={`text-mileage-${item.id}`}>
                        {item.currentMileage?.toLocaleString()} / {item.dueMileage?.toLocaleString()} mi
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(item)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button 
                  variant={item.priority === "overdue" ? "default" : "outline"}
                  size="sm"
                  data-testid={`button-complete-${item.id}`}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {item.priority === "overdue" ? "Complete Now" : "Mark Complete"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid={`button-reschedule-${item.id}`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Reschedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No maintenance scheduled</h3>
            <p className="text-muted-foreground">All equipment is up to date</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}