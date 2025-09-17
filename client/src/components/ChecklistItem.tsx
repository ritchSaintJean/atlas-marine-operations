import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, CheckCircle, AlertCircle, Upload } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  requiresPhoto: boolean;
  photoCount: number;
  requiredPhotos: number;
  onToggle: (id: string) => void;
  onPhotoUpload: (id: string) => void;
}

export default function ChecklistItem({
  id,
  title,
  description,
  isCompleted,
  requiresPhoto,
  photoCount,
  requiredPhotos,
  onToggle,
  onPhotoUpload
}: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasRequiredPhotos = photoCount >= requiredPhotos;
  const canComplete = !requiresPhoto || hasRequiredPhotos;

  return (
    <Card className={`transition-all ${isCompleted ? 'bg-chart-2/10 border-chart-2' : ''}`} data-testid={`card-checklist-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => canComplete && onToggle(id)}
            disabled={!canComplete}
            className="mt-1"
            data-testid={`checkbox-${id}`}
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`} data-testid={`text-title-${id}`}>
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1" data-testid={`text-description-${id}`}>
                  {description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-2">
                {isCompleted && <CheckCircle className="w-5 h-5 text-chart-2" />}
                {requiresPhoto && !hasRequiredPhotos && <AlertCircle className="w-5 h-5 text-chart-3" />}
              </div>
            </div>

            {requiresPhoto && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="w-4 h-4" />
                    <span data-testid={`text-photo-count-${id}`}>
                      Photos: {photoCount}/{requiredPhotos}
                    </span>
                  </div>
                  <Badge 
                    variant={hasRequiredPhotos ? "default" : "destructive"}
                    className="text-xs"
                    data-testid={`badge-photo-status-${id}`}
                  >
                    {hasRequiredPhotos ? "Complete" : "Required"}
                  </Badge>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onPhotoUpload(id)}
                  data-testid={`button-photo-upload-${id}`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {photoCount > 0 ? "Add More Photos" : "Take Photos"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}