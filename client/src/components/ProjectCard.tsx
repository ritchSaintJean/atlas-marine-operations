import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Camera } from "lucide-react";

interface ProjectCardProps {
  id: string;
  name: string;
  location: string;
  startDate: string;
  currentStage: string;
  progress: number;
  totalPhotos: number;
  crewSize: number;
  status: "active" | "completed" | "pending";
  onViewProject: (id: string) => void;
}

export default function ProjectCard({
  id,
  name,
  location,
  startDate,
  currentStage,
  progress,
  totalPhotos,
  crewSize,
  status,
  onViewProject
}: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-chart-2 text-white";
      case "active": return "bg-primary text-primary-foreground";
      case "pending": return "bg-chart-3 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-project-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold truncate pr-2" data-testid={`text-project-name-${id}`}>
            {name}
          </CardTitle>
          <Badge className={getStatusColor(status)} data-testid={`badge-status-${id}`}>
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span data-testid={`text-location-${id}`}>{location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Current Stage:</span>
            <span data-testid={`text-stage-${id}`}>{currentStage}</span>
          </div>
          <Progress value={progress} className="h-2" data-testid={`progress-${id}`} />
          <div className="text-xs text-muted-foreground text-right">
            {progress}% Complete
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span data-testid={`text-date-${id}`}>{startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span data-testid={`text-crew-${id}`}>{crewSize}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <span data-testid={`text-photos-${id}`}>{totalPhotos}</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={() => onViewProject(id)}
          data-testid={`button-view-${id}`}
        >
          View Project
        </Button>
      </CardContent>
    </Card>
  );
}