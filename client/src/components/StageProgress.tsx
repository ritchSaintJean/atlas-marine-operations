import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface Stage {
  id: string;
  name: string;
  status: "completed" | "active" | "pending";
  completedItems: number;
  totalItems: number;
}

interface StageProgressProps {
  stages: Stage[];
  currentStageId: string;
}

export default function StageProgress({ stages, currentStageId }: StageProgressProps) {
  const getStageIcon = (status: string, isActive: boolean) => {
    if (status === "completed") {
      return <CheckCircle className="w-6 h-6 text-chart-2" />;
    } else if (isActive) {
      return <Clock className="w-6 h-6 text-primary" />;
    } else {
      return <Circle className="w-6 h-6 text-muted-foreground" />;
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
    <Card data-testid="card-stage-progress">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Project Stages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStageId;
          const isCompleted = stage.status === "completed";
          const progress = stage.totalItems > 0 ? (stage.completedItems / stage.totalItems) * 100 : 0;
          
          return (
            <div key={stage.id} className="space-y-2" data-testid={`stage-${stage.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStageIcon(stage.status, isActive)}
                  <div>
                    <h3 className={`font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-chart-2' : 'text-foreground'}`} data-testid={`text-stage-name-${stage.id}`}>
                      {stage.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-stage-progress-${stage.id}`}>
                      {stage.completedItems}/{stage.totalItems} items completed
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(stage.status)} data-testid={`badge-stage-status-${stage.id}`}>
                  {stage.status}
                </Badge>
              </div>
              
              <div className="ml-9">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-chart-2' : isActive ? 'bg-primary' : 'bg-muted-foreground'}`}
                    style={{ width: `${progress}%` }}
                    data-testid={`progress-bar-${stage.id}`}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right mt-1">
                  {Math.round(progress)}%
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className="ml-3 w-px h-4 bg-border" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}