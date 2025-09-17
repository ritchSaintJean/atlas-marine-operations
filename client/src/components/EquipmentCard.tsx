import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wrench, 
  MapPin, 
  Calendar, 
  Clock, 
  Gauge, 
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react";

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

interface EquipmentCardProps {
  equipment: Equipment;
  onViewDetails?: (id: string) => void;
  onScheduleMaintenance?: (id: string) => void;
}

export default function EquipmentCard({ 
  equipment, 
  onViewDetails,
  onScheduleMaintenance 
}: EquipmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-chart-2 text-white";
      case "maintenance": return "bg-chart-3 text-white";
      case "retired": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "maintenance": return <AlertTriangle className="w-4 h-4" />;
      case "retired": return <Clock className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getDaysUntilMaintenance = () => {
    const nextDate = new Date(equipment.nextMaintenanceDate);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilMaintenance = getDaysUntilMaintenance();
  const isMaintenanceDue = daysUntilMaintenance <= 7;
  const isOverdue = daysUntilMaintenance < 0;

  return (
    <Card 
      className={`hover-elevate transition-all ${equipment.status === 'maintenance' ? 'border-chart-3' : ''}`}
      data-testid={`card-equipment-${equipment.id}`}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg" data-testid={`text-name-${equipment.id}`}>
                  {equipment.name}
                </h3>
                <Badge className={getStatusColor(equipment.status)} data-testid={`badge-status-${equipment.id}`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(equipment.status)}
                    {equipment.status}
                  </span>
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span data-testid={`text-type-${equipment.id}`}>{equipment.type}</span>
                <span data-testid={`text-serial-${equipment.id}`}>#{equipment.serialNumber}</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span data-testid={`text-location-${equipment.id}`}>{equipment.location}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid={`button-expand-${equipment.id}`}
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>

          {/* Maintenance Alert */}
          {(isMaintenanceDue || isOverdue) && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-chart-3/10 text-chart-3'
            }`}>
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isOverdue 
                  ? `Maintenance overdue by ${Math.abs(daysUntilMaintenance)} days`
                  : `Maintenance due in ${daysUntilMaintenance} days`
                }
              </span>
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-4 pt-2 border-t">
              {/* Operation Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {equipment.hoursOfOperation && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{equipment.hoursOfOperation.toLocaleString()} hrs</div>
                      <div className="text-xs text-muted-foreground">Operation Hours</div>
                    </div>
                  </div>
                )}
                {equipment.mileage && (
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{equipment.mileage.toLocaleString()} mi</div>
                      <div className="text-xs text-muted-foreground">Mileage</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Maintenance Dates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Maintenance:</span>
                  <span data-testid={`text-last-maintenance-${equipment.id}`}>
                    {new Date(equipment.lastMaintenanceDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Maintenance:</span>
                  <span 
                    className={isMaintenanceDue ? (isOverdue ? 'text-destructive' : 'text-chart-3') : ''}
                    data-testid={`text-next-maintenance-${equipment.id}`}
                  >
                    {new Date(equipment.nextMaintenanceDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(equipment.id)}
                  data-testid={`button-details-${equipment.id}`}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  variant={isMaintenanceDue ? "default" : "outline"}
                  size="sm"
                  onClick={() => onScheduleMaintenance?.(equipment.id)}
                  data-testid={`button-maintenance-${equipment.id}`}
                >
                  <Wrench className="w-3 h-3 mr-1" />
                  {isOverdue ? "Schedule Now" : "Schedule Maintenance"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}