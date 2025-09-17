import { useState } from "react";
import ChecklistView from "@/components/ChecklistView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, CheckCircle } from "lucide-react";

// Mock data - TODO: Remove when implementing real data
const mockStages = [
  {
    id: "protection",
    name: "Protection", 
    status: "completed",
    items: 5,
    completedItems: 5,
  },
  {
    id: "blasting",
    name: "Blasting",
    status: "active",
    items: 6,
    completedItems: 3,
  },
  {
    id: "painting", 
    name: "Painting",
    status: "pending",
    items: 4,
    completedItems: 0,
  },
  {
    id: "cleaning",
    name: "Cleaning", 
    status: "pending",
    items: 3,
    completedItems: 0,
  }
];

const mockChecklist = [
  {
    id: "check-001",
    title: "Surface Preparation",
    description: "Clean and prepare surface area for blasting operations",
    isCompleted: true,
    requiresPhoto: true,
    photoCount: 3,
    requiredPhotos: 2,
  },
  {
    id: "check-002",
    title: "Safety Equipment Check",
    description: "Verify all safety equipment is in place and functioning", 
    isCompleted: false,
    requiresPhoto: true,
    photoCount: 1,
    requiredPhotos: 2,
  },
  {
    id: "check-003",
    title: "Weather Conditions",
    description: "Check weather conditions are suitable for work",
    isCompleted: false,
    requiresPhoto: false,
    photoCount: 0,
    requiredPhotos: 0,
  },
  {
    id: "check-004",
    title: "Area Isolation",
    description: "Isolate work area and secure perimeter",
    isCompleted: false,
    requiresPhoto: true,
    photoCount: 0,
    requiredPhotos: 3,
  }
];

export default function Checklists() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  if (selectedStage) {
    const stage = mockStages.find(s => s.id === selectedStage);
    return (
      <ChecklistView
        projectName="Marina Dock Restoration"
        stageName={stage?.name || ""}
        checklist={mockChecklist}
        onBack={() => setSelectedStage(null)}
        onComplete={() => {
          console.log('Stage completed:', selectedStage);
          setSelectedStage(null);
        }}
      />
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-chart-2" />;
      case "active":
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-chart-2 text-white";
      case "active": return "bg-primary text-primary-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6" data-testid="checklists-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" data-testid="page-title">Task Checklists</h1>
        <p className="text-muted-foreground">Complete tasks for each project stage</p>
      </div>

      {/* Current Project */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marina Dock Restoration</CardTitle>
          <p className="text-muted-foreground">Harbor Bay Marina</p>
        </CardHeader>
      </Card>

      {/* Stage List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Project Stages</h2>
        {mockStages.map((stage) => {
          const progress = stage.items > 0 ? (stage.completedItems / stage.items) * 100 : 0;
          const canAccess = stage.status === "active" || stage.status === "completed";
          
          return (
            <Card key={stage.id} className={`transition-all ${canAccess ? 'hover-elevate cursor-pointer' : 'opacity-60'}`}>
              <CardContent className="p-4">
                <div 
                  className="flex items-center justify-between"
                  onClick={() => canAccess && setSelectedStage(stage.id)}
                  data-testid={`stage-card-${stage.id}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(stage.status)}
                    <div className="flex-1">
                      <h3 className="font-medium" data-testid={`text-stage-name-${stage.id}`}>
                        {stage.name}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-stage-progress-${stage.id}`}>
                        {stage.completedItems}/{stage.items} tasks completed
                      </p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            stage.status === "completed" ? 'bg-chart-2' : 
                            stage.status === "active" ? 'bg-primary' : 'bg-muted-foreground'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(stage.status)} data-testid={`badge-status-${stage.id}`}>
                      {stage.status}
                    </Badge>
                    {canAccess && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}