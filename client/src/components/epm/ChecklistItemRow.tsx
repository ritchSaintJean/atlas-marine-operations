import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Image, PenTool } from "lucide-react";
import type { ChecklistItem } from "../../../../shared/contracts/epm";
import { useUpdateChecklistItem } from "@/hooks/useEpm";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItemRowProps {
  item: ChecklistItem;
}

export function ChecklistItemRow({ item }: ChecklistItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.value);
  const [status, setStatus] = useState(item.status);
  const updateItem = useUpdateChecklistItem();
  const { toast } = useToast();

  const getStatusVariant = () => {
    switch (item.status) {
      case 'complete':
        return 'default' as const;
      case 'blocked':
        return 'destructive' as const;
      case 'na':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'photo':
        return <Image className="h-4 w-4" />;
      case 'signature':
        return <PenTool className="h-4 w-4" />;
      case 'number':
        return <span className="text-xs font-mono">#</span>;
      case 'boolean':
        return <Checkbox disabled checked={false} />;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    try {
      await updateItem.mutateAsync({
        itemId: item.id,
        value,
        status,
      });
      setIsEditing(false);
      toast({
        title: "Item Updated",
        description: "Checklist item has been updated successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update item"
      });
    }
  };

  const handleStatusToggle = async () => {
    if (item.status === 'complete') return; // Don't allow toggling completed items
    
    const newStatus = item.status === 'pending' ? 'complete' : 'pending';
    
    try {
      await updateItem.mutateAsync({
        itemId: item.id,
        status: newStatus,
      });
      toast({
        title: "Status Updated",
        description: `Item marked as ${newStatus}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update status"
      });
    }
  };

  const renderValueInput = () => {
    if (!isEditing) {
      if (item.type === 'boolean') {
        return (
          <span className="text-sm">
            {value === true ? 'Yes' : value === false ? 'No' : 'Not set'}
          </span>
        );
      }
      return (
        <span className="text-sm" data-testid={`text-value-${item.id}`}>
          {value?.toString() || 'No value set'}
        </span>
      );
    }

    switch (item.type) {
      case 'boolean':
        return (
          <Checkbox
            checked={!!value}
            onCheckedChange={setValue}
            data-testid={`input-value-${item.id}`}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value?.toString() || ''}
            onChange={(e) => setValue(Number(e.target.value) || null)}
            data-testid={`input-value-${item.id}`}
          />
        );
      case 'select':
        return (
          <Select value={value?.toString() || ''} onValueChange={setValue}>
            <SelectTrigger data-testid={`input-value-${item.id}`}>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Options should come from validations */}
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'text':
      default:
        if (item.label?.toLowerCase().includes('note') || item.label?.toLowerCase().includes('comment')) {
          return (
            <Textarea
              value={value?.toString() || ''}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter notes..."
              data-testid={`input-value-${item.id}`}
            />
          );
        }
        return (
          <Input
            value={value?.toString() || ''}
            onChange={(e) => setValue(e.target.value)}
            data-testid={`input-value-${item.id}`}
          />
        );
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3" data-testid={`row-item-${item.id}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {getTypeIcon()}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium" data-testid={`text-label-${item.id}`}>
                {item.label}
              </h4>
              {item.required && (
                <Badge variant="secondary" size="sm">Required</Badge>
              )}
            </div>
            {item.assigneeName && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {item.assigneeName}
              </div>
            )}
            {item.dueAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(item.dueAt).toLocaleDateString()}
              </div>
            )}
            {item.completedAt && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <Clock className="h-3 w-3" />
                Completed {new Date(item.completedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <Badge variant={getStatusVariant()} data-testid={`badge-status-${item.id}`}>
          {item.status === 'na' ? 'N/A' : item.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Value:</label>
          {renderValueInput()}
        </div>

        <div className="space-y-2">
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Status:</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger data-testid={`select-status-${item.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="na">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        {!isEditing && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              data-testid={`button-edit-${item.id}`}
            >
              Edit
            </Button>
            {item.status === 'pending' && (
              <Button
                size="sm"
                onClick={handleStatusToggle}
                disabled={updateItem.isPending}
                data-testid={`button-complete-${item.id}`}
              >
                Mark Complete
              </Button>
            )}
          </>
        )}
        
        {isEditing && (
          <>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateItem.isPending}
              data-testid={`button-save-${item.id}`}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setValue(item.value);
                setStatus(item.status);
              }}
              data-testid={`button-cancel-${item.id}`}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}