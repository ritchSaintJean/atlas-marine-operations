import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  HardHat,
  Eye,
  Zap,
  Wind,
  Plus
} from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
  notes?: string;
}

interface SafetyChecklistData {
  id: string;
  title: string;
  type: "daily" | "pre_blast" | "confined_space" | "general";
  projectId: string;
  projectName: string;
  completedBy?: string;
  completedDate?: string;
  items: ChecklistItem[];
}

export default function SafetyChecklist() {
  const [selectedChecklist, setSelectedChecklist] = useState<string>("daily");
  
  // Mock checklist data - will be replaced with real API calls
  const checklists: SafetyChecklistData[] = [
    {
      id: "cl-001",
      title: "Daily Safety Checklist",
      type: "daily",
      projectId: "proj-001",
      projectName: "Marina Dock Restoration",
      items: [
        {
          id: "item-001",
          category: "PPE",
          description: "Hard hat properly fitted and in good condition",
          isCompleted: true,
          isRequired: true
        },
        {
          id: "item-002", 
          category: "PPE",
          description: "Safety glasses/goggles clean and undamaged",
          isCompleted: true,
          isRequired: true
        },
        {
          id: "item-003",
          category: "PPE",
          description: "High-visibility vest worn and visible",
          isCompleted: false,
          isRequired: true
        },
        {
          id: "item-004",
          category: "Equipment",
          description: "Tools inspected for damage or defects",
          isCompleted: false,
          isRequired: true
        },
        {
          id: "item-005",
          category: "Environment",
          description: "Work area clear of hazards and debris",
          isCompleted: false,
          isRequired: true
        },
        {
          id: "item-006",
          category: "Communication",
          description: "Emergency contact information posted and accessible",
          isCompleted: true,
          isRequired: false
        }
      ]
    },
    {
      id: "cl-002",
      title: "Pre-Blast Safety Checklist",
      type: "pre_blast",
      projectId: "proj-001",
      projectName: "Marina Dock Restoration",
      items: [
        {
          id: "item-101",
          category: "Respiratory",
          description: "Supplied air respirator system operational",
          isCompleted: false,
          isRequired: true
        },
        {
          id: "item-102",
          category: "Containment",
          description: "Blast containment properly erected and sealed",
          isCompleted: false,
          isRequired: true
        },
        {
          id: "item-103",
          category: "Equipment",
          description: "Blast pot pressure tested and certified",
          isCompleted: false,
          isRequired: true
        },
        {
          id: "item-104",
          category: "Environment",
          description: "Wind conditions within acceptable limits",
          isCompleted: false,
          isRequired: true
        }
      ]
    }
  ];

  const checklistTypes = [
    { id: "daily", label: "Daily Safety", icon: Shield },
    { id: "pre_blast", label: "Pre-Blast", icon: AlertTriangle },
    { id: "confined_space", label: "Confined Space", icon: HardHat },
    { id: "general", label: "General", icon: CheckCircle }
  ];

  const currentChecklist = checklists.find(cl => cl.type === selectedChecklist) || checklists[0];
  
  const getCompletionStats = (items: ChecklistItem[]) => {
    const requiredItems = items.filter(item => item.isRequired);
    const completedRequired = requiredItems.filter(item => item.isCompleted);
    const totalCompleted = items.filter(item => item.isCompleted);
    
    return {
      requiredComplete: completedRequired.length,
      requiredTotal: requiredItems.length,
      totalComplete: totalCompleted.length,
      totalItems: items.length,
      isComplete: completedRequired.length === requiredItems.length
    };
  };

  const stats = getCompletionStats(currentChecklist.items);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "ppe": return <HardHat className="w-4 h-4" />;
      case "respiratory": return <Wind className="w-4 h-4" />;
      case "equipment": return <Shield className="w-4 h-4" />;
      case "environment": return <Eye className="w-4 h-4" />;
      case "electrical": return <Zap className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const toggleItem = (itemId: string) => {
    console.log('Toggle checklist item:', itemId);
    // TODO: Implement API call to update checklist item
  };

  const groupedItems = currentChecklist.items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="space-y-6" data-testid="safety-checklist">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Safety Checklists</h2>
          <p className="text-muted-foreground">Complete daily safety checks and procedures</p>
        </div>
        <Button data-testid="button-add-checklist">
          <Plus className="w-4 h-4 mr-2" />
          New Checklist
        </Button>
      </div>

      {/* Checklist Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {checklistTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.id}
              variant={selectedChecklist === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChecklist(type.id)}
              data-testid={`button-checklist-type-${type.id}`}
            >
              <Icon className="w-3 h-3 mr-1" />
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Checklist Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg" data-testid="checklist-title">
              {currentChecklist.title}
            </CardTitle>
            <Badge 
              className={stats.isComplete ? "bg-chart-2 text-white" : "bg-chart-4 text-white"}
              data-testid="completion-badge"
            >
              {stats.requiredComplete}/{stats.requiredTotal} Required
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Project: {currentChecklist.projectName}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress ({stats.totalComplete}/{stats.totalItems} items)</span>
              <span>{Math.round((stats.totalComplete / stats.totalItems) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  stats.isComplete ? 'bg-chart-2' : 'bg-primary'
                }`}
                style={{ width: `${(stats.totalComplete / stats.totalItems) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <CardTitle className="text-base">{category}</CardTitle>
                <Badge variant="outline" size="sm">
                  {items.filter(item => item.isCompleted).length}/{items.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-start gap-3 p-3 rounded-md border transition-all ${
                    item.isCompleted ? 'bg-chart-2/10 border-chart-2' : 'hover:bg-muted/50'
                  }`}
                  data-testid={`checklist-item-${item.id}`}
                >
                  <Checkbox
                    checked={item.isCompleted}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                    data-testid={`checkbox-${item.id}`}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-medium ${
                        item.isCompleted ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {item.description}
                      </p>
                      {item.isRequired && (
                        <Badge size="sm" variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {item.isCompleted && (
                    <CheckCircle className="w-4 h-4 text-chart-2 mt-1" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Action */}
      {stats.isComplete && (
        <Card className="border-chart-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-chart-2" />
                <div>
                  <p className="font-medium text-chart-2">All required items completed!</p>
                  <p className="text-sm text-muted-foreground">Ready to submit checklist</p>
                </div>
              </div>
              <Button className="bg-chart-2 hover:bg-chart-2/90" data-testid="button-submit-checklist">
                Submit Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}