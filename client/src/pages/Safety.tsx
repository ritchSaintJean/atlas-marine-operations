import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import SafetyFormCard from "@/components/SafetyFormCard";
import SafetyChecklist from "@/components/SafetyChecklist";

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

export default function Safety() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Mock safety forms data - will be replaced with real API calls
  const safetyForms: SafetyForm[] = [
    {
      id: "sf-001",
      type: "confined_space",
      title: "Confined Space Entry - Tank Inspection",
      projectId: "proj-001",
      projectName: "Marina Dock Restoration",
      status: "pending",
      assignedTo: "Mike Rodriguez",
      dueDate: "2024-03-20",
      priority: "high"
    },
    {
      id: "sf-002",
      type: "respiratory",
      title: "Respiratory Protection Assessment",
      projectId: "proj-001", 
      projectName: "Marina Dock Restoration",
      status: "completed",
      assignedTo: "Sarah Chen",
      dueDate: "2024-03-18",
      completedDate: "2024-03-17",
      priority: "medium"
    },
    {
      id: "sf-003",
      type: "blast_procedure",
      title: "Blast Operations Safety Protocol",
      projectId: "proj-002",
      projectName: "Bridge Coating Renewal",
      status: "in_progress",
      assignedTo: "Carlos Torres",
      dueDate: "2024-03-19",
      priority: "critical"
    },
    {
      id: "sf-004",
      type: "daily_safety",
      title: "Daily Safety Inspection - March 18",
      projectId: "proj-001",
      projectName: "Marina Dock Restoration",
      status: "overdue",
      assignedTo: "Mike Rodriguez",
      dueDate: "2024-03-18",
      priority: "high"
    }
  ];

  const formTypes = [
    { id: "all", label: "All Forms", icon: Shield },
    { id: "confined_space", label: "Confined Space", icon: AlertTriangle },
    { id: "respiratory", label: "Respiratory", icon: Shield },
    { id: "blast_procedure", label: "Blast Procedure", icon: AlertTriangle },
    { id: "daily_safety", label: "Daily Safety", icon: CheckCircle }
  ];

  const statusFilters = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "overdue", label: "Overdue" }
  ];

  const filteredForms = safetyForms.filter(form => {
    const matchesType = selectedType === "all" || form.type === selectedType;
    const matchesStatus = selectedStatus === "all" || form.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      pending: safetyForms.filter(f => f.status === "pending").length,
      inProgress: safetyForms.filter(f => f.status === "in_progress").length,
      completed: safetyForms.filter(f => f.status === "completed").length,
      overdue: safetyForms.filter(f => f.status === "overdue").length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6" data-testid="safety-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Safety Compliance</h1>
          <p className="text-muted-foreground">Manage safety forms, inspections, and compliance tracking</p>
        </div>
        <Button data-testid="button-add-safety-form">
          <Plus className="w-4 h-4 mr-2" />
          New Safety Form
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="stat-pending">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="stat-in-progress">{statusCounts.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="stat-completed">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="stat-overdue">{statusCounts.overdue}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forms" data-testid="tab-forms">Safety Forms</TabsTrigger>
          <TabsTrigger value="checklists" data-testid="tab-checklists">Safety Checklists</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Form Type Filters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Form Type</label>
                  <div className="flex flex-wrap gap-2">
                    {formTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant={selectedType === type.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType(type.id)}
                          data-testid={`button-filter-type-${type.id}`}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Filters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusFilters.map((status) => (
                      <Button
                        key={status.id}
                        variant={selectedStatus === status.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(status.id)}
                        data-testid={`button-filter-status-${status.id}`}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Forms List */}
          <div className="grid gap-4">
            {filteredForms.map((form) => (
              <SafetyFormCard key={form.id} form={form} />
            ))}
          </div>

          {filteredForms.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No safety forms found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or create a new safety form</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="checklists" className="space-y-4">
          <SafetyChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
}