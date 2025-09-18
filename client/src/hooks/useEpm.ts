import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type {
  Stage,
  Checklist,
  ChecklistItem,
  StageCreate,
  ChecklistFromTemplate,
  ChecklistItemPatch,
  StageApprove,
  ProjectProgress
} from "../../../shared/contracts/epm";

// Project Stages
export function useProjectStages(projectId: string) {
  return useQuery<Stage[]>({
    queryKey: ["/api/projects", projectId, "stages"],
    enabled: !!projectId,
  });
}

export function useCreateStages() {
  const queryClient = useQueryClient();
  
  return useMutation<Stage[], Error, { projectId: string; stages: StageCreate[] }>({
    mutationFn: async ({ projectId, stages }) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/stages`, { stages });
      return response.json();
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "stages"]
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "progress"]
      });
    },
  });
}

// Project Checklists
export function useProjectChecklists(projectId: string) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "checklists"],
    enabled: !!projectId,
  });
}

export function useCreateChecklist() {
  const queryClient = useQueryClient();
  
  return useMutation<Checklist, Error, { projectId: string } & ChecklistFromTemplate>({
    mutationFn: async ({ projectId, ...checklistData }) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/checklists`, checklistData);
      return response.json();
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "checklists"]
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "stages"]
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "progress"]
      });
    },
  });
}

// Individual Checklists
export function useChecklist(checklistId: string) {
  return useQuery<Checklist>({
    queryKey: ["/api/checklists", checklistId],
    enabled: !!checklistId,
  });
}

// Checklist Items
export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();
  
  return useMutation<ChecklistItem, Error, { itemId: string } & ChecklistItemPatch>({
    mutationFn: async ({ itemId, ...patchData }) => {
      const response = await apiRequest("PATCH", `/api/checklist-items/${itemId}`, patchData);
      return response.json();
    },
    onSuccess: (updatedItem) => {
      // Invalidate the checklist this item belongs to
      queryClient.invalidateQueries({
        queryKey: ["/api/checklists", updatedItem.projectChecklistId]
      });
      
      // Also invalidate project-level queries to update progress
      // Note: We would need the projectId to be more precise here
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && 
                 queryKey.includes("stages") || 
                 queryKey.includes("checklists") ||
                 queryKey.includes("progress");
        }
      });
    },
  });
}

// Stage Approvals
export function useApproveStage() {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string }, Error, {
    projectId: string;
    stageId: string;
    approval: StageApprove;
  }>({
    mutationFn: async ({ projectId, stageId, approval }) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/stages/${stageId}/approve`, approval);
      return response.json();
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "stages"]
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "progress"]
      });
    },
  });
}

// Project Progress
export function useProjectProgress(projectId: string) {
  return useQuery<ProjectProgress>({
    queryKey: ["/api/projects", projectId, "progress"],
    enabled: !!projectId,
  });
}

// Combined hook for project EPM data
export function useProjectEpm(projectId: string) {
  const stages = useProjectStages(projectId);
  const checklists = useProjectChecklists(projectId);
  const progress = useProjectProgress(projectId);

  return {
    stages: stages.data ?? [],
    checklists: checklists.data ?? [],
    progress: progress.data,
    isLoading: stages.isLoading || checklists.isLoading || progress.isLoading,
    error: stages.error || checklists.error || progress.error,
  };
}

// Checklist templates (assuming they exist in the main API)
export function useChecklistTemplates() {
  return useQuery({
    queryKey: ["/api/checklist-templates"],
  });
}