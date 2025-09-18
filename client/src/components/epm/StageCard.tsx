import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import type { Stage } from "../../../../shared/contracts/epm";

interface StageCardProps {
  stage: Stage;
  onApprove?: () => void;
  onReject?: () => void;
  isApprovalPending?: boolean;
}

export function StageCard({ stage, onApprove, onReject, isApprovalPending }: StageCardProps) {
  const getApprovalIcon = () => {
    switch (stage.approvalStatus) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getApprovalVariant = () => {
    switch (stage.approvalStatus) {
      case 'approved':
        return 'default' as const;
      case 'rejected':
        return 'destructive' as const;
      case 'pending':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const canApprove = stage.completionPercentage >= 100 && stage.approvalStatus !== 'approved';
  
  return (
    <Card className="w-full" data-testid={`card-stage-${stage.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold" data-testid={`text-stage-name-${stage.id}`}>
            {stage.name}
          </CardTitle>
          <Badge variant={getApprovalVariant()} data-testid={`badge-approval-${stage.id}`}>
            <div className="flex items-center gap-1">
              {getApprovalIcon()}
              <span className="capitalize">{stage.approvalStatus || 'Not Started'}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid={`text-progress-${stage.id}`}>
              {stage.completionPercentage}%
            </span>
          </div>
          <Progress 
            value={stage.completionPercentage} 
            className="h-2" 
            data-testid={`progress-stage-${stage.id}`}
          />
        </div>

        {stage.gateRules && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Gate Requirements</h4>
            <div className="space-y-1 text-xs">
              {stage.gateRules.requiredForms?.length > 0 && (
                <div>Forms: {stage.gateRules.requiredForms.join(', ')}</div>
              )}
              {stage.gateRules.inventoryReservations?.length > 0 && (
                <div>Inventory: {stage.gateRules.inventoryReservations.join(', ')}</div>
              )}
              {stage.gateRules.equipmentCommissioning && (
                <div>Equipment commissioning required</div>
              )}
            </div>
          </div>
        )}

        {stage.requiredApproverRole && (
          <div className="text-xs text-muted-foreground">
            Requires approval from: <span className="font-medium">{stage.requiredApproverRole}</span>
          </div>
        )}

        {canApprove && (onApprove || onReject) && (
          <div className="flex gap-2 pt-2">
            {onApprove && (
              <Button 
                size="sm" 
                onClick={onApprove}
                disabled={isApprovalPending}
                data-testid={`button-approve-${stage.id}`}
              >
                Approve Stage
              </Button>
            )}
            {onReject && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onReject}
                disabled={isApprovalPending}
                data-testid={`button-reject-${stage.id}`}
              >
                Reject
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}