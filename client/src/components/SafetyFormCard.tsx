import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  MapPin,
  FileText,
  Edit
} from "lucide-react";

interface SafetyForm {
  id: string;
  type: "confined_space" | "respiratory" | "blast_procedure" | "daily_safety";
  title: string;
  projectId: string;
  projectName: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface SafetyFormCardProps {
  form: SafetyForm;
  onEdit?: (id: string) => void;
  onComplete?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function SafetyFormCard({ 
  form, 
  onEdit, 
  onComplete, 
  onView 
}: SafetyFormCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-chart-2 text-white";
      case "in_progress": return "bg-primary text-primary-foreground";
      case "pending": return "bg-chart-4 text-white";
      case "overdue": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-chart-3 text-white";
      case "medium": return "bg-chart-4 text-white";
      case "low": return "bg-chart-2 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "confined_space": return <AlertTriangle className="w-4 h-4" />;
      case "respiratory": return <Shield className="w-4 h-4" />;
      case "blast_procedure": return <AlertTriangle className="w-4 h-4" />;
      case "daily_safety": return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "confined_space": return "Confined Space Entry";
      case "respiratory": return "Respiratory Protection";
      case "blast_procedure": return "Blast Procedure";
      case "daily_safety": return "Daily Safety";
      default: return "Safety Form";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDaysUntilDue = () => {
    const dueDate = new Date(form.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = form.status === "overdue" || daysUntilDue < 0;

  return (
    <Card 
      className={`hover-elevate transition-all ${
        isOverdue ? 'border-destructive' : 
        form.priority === 'critical' ? 'border-chart-3' : ''
      }`}
      data-testid={`card-safety-form-${form.id}`}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getTypeIcon(form.type)}
                <h3 className="font-semibold text-lg" data-testid={`text-title-${form.id}`}>
                  {form.title}
                </h3>
                <Badge className={getStatusColor(form.status)} data-testid={`badge-status-${form.id}`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(form.status)}
                    {form.status.replace('_', ' ')}
                  </span>
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span data-testid={`text-type-${form.id}`}>{getTypeLabel(form.type)}</span>
                </span>
                <Badge 
                  size="sm" 
                  className={getPriorityColor(form.priority)}
                  data-testid={`badge-priority-${form.id}`}
                >
                  {form.priority} priority
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span data-testid={`text-project-${form.id}`}>{form.projectName}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid={`button-expand-${form.id}`}
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>

          {/* Due Date Alert */}
          {(isOverdue || daysUntilDue <= 1) && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-chart-3/10 text-chart-3'
            }`}>
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isOverdue 
                  ? `Overdue by ${Math.abs(daysUntilDue)} days`
                  : daysUntilDue === 0 
                    ? "Due today"
                    : `Due tomorrow`
                }
              </span>
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-4 pt-2 border-t">
              {/* Assignment and Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Assigned to:</span>
                    <span className="font-medium" data-testid={`text-assigned-${form.id}`}>
                      {form.assignedTo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due date:</span>
                    <span 
                      className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}
                      data-testid={`text-due-date-${form.id}`}
                    >
                      {new Date(form.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {form.completedDate && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-chart-2" />
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium text-chart-2" data-testid={`text-completed-${form.id}`}>
                        {new Date(form.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(form.id)}
                  data-testid={`button-view-${form.id}`}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                
                {form.status !== "completed" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(form.id)}
                      data-testid={`button-edit-${form.id}`}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit Form
                    </Button>
                    
                    <Button
                      variant={isOverdue || form.priority === "critical" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onComplete?.(form.id)}
                      data-testid={`button-complete-${form.id}`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {isOverdue ? "Complete Now" : "Mark Complete"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}