import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Plus, 
  TrendingUp, 
  CheckSquare, 
  Clock,
  AlertCircle,
  BarChart3
} from "lucide-react";

import { StageCard } from "@/components/epm/StageCard";
import { ChecklistCard } from "@/components/epm/ChecklistCard";
import { ChecklistItemRow } from "@/components/epm/ChecklistItemRow";
import { 
  useProjectEpm, 
  useCreateStages, 
  useCreateChecklist, 
  useApproveStage,
  useChecklist,
  useChecklistTemplates
} from "@/hooks/useEpm";
import { useToast } from "@/hooks/use-toast";

export default function EnhancedProjectManagement() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // For demo purposes, using a fixed project ID
  // In real app, this would come from route params
  const projectId = "project-1";
  
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);
  
  const { stages, checklists, progress, isLoading, error } = useProjectEpm(projectId);
  const createStages = useCreateStages();
  const createChecklist = useCreateChecklist();
  const approveStage = useApproveStage();
  const templates = useChecklistTemplates();
  const selectedChecklist = useChecklist(selectedChecklistId || '');

  const handleCreateDemoStages = async () => {
    try {
      await createStages.mutateAsync({
        projectId,
        stages: [
          {
            name: "Planning & Design",
            order: 1,
            gateRules: {
              requiredForms: ["design-review", "safety-assessment"],
              inventoryReservations: ["materials-list"],
              equipmentCommissioning: false
            },
            requiredApproverRole: "project-manager"
          },
          {
            name: "Fabrication",
            order: 2,
            gateRules: {
              requiredForms: ["quality-control"],
              inventoryReservations: ["raw-materials"],
              equipmentCommissioning: true
            },
            requiredApproverRole: "senior-engineer"
          },
          {
            name: "Installation",
            order: 3,
            gateRules: {
              requiredForms: ["site-safety", "installation-checklist"],
              inventoryReservations: ["installation-tools"],
              equipmentCommissioning: true
            },
            requiredApproverRole: "site-supervisor"
          }
        ]
      });
      toast({
        title: "Stages Created",
        description: "Demo project stages have been created successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create stages"
      });
    }
  };

  const handleCreateDemoChecklist = async () => {
    try {
      await createChecklist.mutateAsync({
        projectId,
        templateId: "hull-blast-inspection", // Demo template ID
        stageId: stages[0]?.id // First stage
      });
      toast({
        title: "Checklist Created",
        description: "Demo checklist has been created successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create checklist"
      });
    }
  };

  const handleApproveStage = async (stageId: string) => {
    try {
      await approveStage.mutateAsync({
        projectId,
        stageId,
        approval: {
          status: 'approved',
          note: 'Stage approved via EPM interface'
        }
      });
      toast({
        title: "Stage Approved",
        description: "Stage has been approved successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve stage"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Enhanced Project Management</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading project data: {error.message}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="page-epm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/projects')} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Enhanced Project Management</h1>
        </div>
        <div className="flex gap-2">
          {stages.length === 0 && (
            <Button onClick={handleCreateDemoStages} disabled={createStages.isPending} data-testid="button-create-demo-stages">
              <Plus className="h-4 w-4 mr-2" />
              Create Demo Stages
            </Button>
          )}
          {stages.length > 0 && checklists.length === 0 && (
            <Button onClick={handleCreateDemoChecklist} disabled={createChecklist.isPending} data-testid="button-create-demo-checklist">
              <Plus className="h-4 w-4 mr-2" />
              Create Demo Checklist
            </Button>
          )}
        </div>
      </div>

      {/* Project Progress Overview */}
      {progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Overall Progress</div>
                <div className="text-2xl font-bold" data-testid="text-overall-progress">
                  {progress.overallCompletion}%
                </div>
                <Progress value={progress.overallCompletion} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Stages</div>
                <div className="text-2xl font-bold" data-testid="text-total-stages">
                  {progress.totalStages}
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.completedStages} completed
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Checklists</div>
                <div className="text-2xl font-bold" data-testid="text-total-checklists">
                  {progress.totalChecklists}
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.completedChecklists} done
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Items</div>
                <div className="text-2xl font-bold" data-testid="text-total-items">
                  {progress.totalItems}
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.completedItems} completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="stages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stages" data-testid="tab-stages">
            <Clock className="h-4 w-4 mr-2" />
            Stages ({stages.length})
          </TabsTrigger>
          <TabsTrigger value="checklists" data-testid="tab-checklists">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklists ({checklists.length})
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedChecklistId} data-testid="tab-details">
            <TrendingUp className="h-4 w-4 mr-2" />
            Checklist Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-6">
          {stages.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Stages Found</h3>
                <p className="text-muted-foreground mb-4">
                  Create project stages to start managing your enhanced project workflow.
                </p>
                <Button onClick={handleCreateDemoStages} disabled={createStages.isPending} data-testid="button-create-first-stages">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Demo Stages
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stages.map((stage) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  onApprove={() => handleApproveStage(stage.id)}
                  isApprovalPending={approveStage.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="checklists" className="space-y-6">
          {checklists.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Checklists Found</h3>
                <p className="text-muted-foreground mb-4">
                  Create checklists from templates to track detailed progress.
                </p>
                {stages.length > 0 && (
                  <Button onClick={handleCreateDemoChecklist} disabled={createChecklist.isPending} data-testid="button-create-first-checklist">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Demo Checklist
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checklists.map((checklist: any) => (
                <ChecklistCard
                  key={checklist.id}
                  checklist={checklist}
                  onViewDetails={() => setSelectedChecklistId(checklist.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedChecklistId && selectedChecklist.data ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-checklist-detail-title">
                    {selectedChecklist.data.templateName}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" data-testid="badge-checklist-status">
                      {selectedChecklist.data.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" data-testid="badge-items-count">
                      {selectedChecklist.data.items?.length || 0} items
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedChecklist.data.items?.map((item: any) => (
                      <ChecklistItemRow key={item.id} item={item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Checklist Selected</h3>
                <p className="text-muted-foreground">
                  Select a checklist from the Checklists tab to view detailed items.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}