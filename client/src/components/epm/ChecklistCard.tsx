import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, CheckSquare } from "lucide-react";
import type { Checklist } from "../../../../shared/contracts/epm";

interface ChecklistCardProps {
  checklist: Checklist;
  onViewDetails?: () => void;
}

export function ChecklistCard({ checklist, onViewDetails }: ChecklistCardProps) {
  const getStatusVariant = () => {
    switch (checklist.status) {
      case 'done':
        return 'default' as const;
      case 'in_progress':
        return 'secondary' as const;
      case 'blocked':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const completedItems = checklist.items?.filter(item => item.status === 'complete').length || 0;
  const totalItems = checklist.items?.length || 0;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  return (
    <Card className="w-full hover-elevate" data-testid={`card-checklist-${checklist.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span data-testid={`text-checklist-name-${checklist.id}`}>
              {checklist.templateName}
            </span>
          </CardTitle>
          <Badge variant={getStatusVariant()} data-testid={`badge-status-${checklist.id}`}>
            <span className="capitalize">{checklist.status.replace('_', ' ')}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid={`text-progress-${checklist.id}`}>
              {completedItems}/{totalItems} items ({completionPercentage}%)
            </span>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-2" 
            data-testid={`progress-checklist-${checklist.id}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Required Items: </span>
            <span className="font-medium" data-testid={`text-required-${checklist.id}`}>
              {checklist.requiredItems?.length || 0}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Optional Items: </span>
            <span className="font-medium" data-testid={`text-optional-${checklist.id}`}>
              {checklist.optionalItems?.length || 0}
            </span>
          </div>
        </div>

        {onViewDetails && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewDetails}
              className="w-full"
              data-testid={`button-view-checklist-${checklist.id}`}
            >
              View Details <ChevronRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}