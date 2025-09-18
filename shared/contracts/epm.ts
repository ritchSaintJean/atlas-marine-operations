import { z } from 'zod';

// Input Schemas
export const stageCreateSchema = z.object({
  name: z.string().min(1, 'Stage name is required'),
  order: z.number().int().min(0, 'Order must be non-negative'),
  requiredApproverRole: z.enum(['tech', 'supervisor', 'admin']).optional(),
  gateRules: z.object({
    requiredForms: z.array(z.string()).default([]),
    inventoryReservations: z.array(z.string()).default([]),
    equipmentCommissioning: z.boolean().default(false),
  }).default({}),
});

export const checklistFromTemplateSchema = z.object({
  templateId: z.string().uuid('Invalid template ID'),
  stageId: z.string().uuid('Invalid stage ID').optional(),
});

export const checklistItemPatchSchema = z.object({
  value: z.any().optional(),
  status: z.enum(['pending', 'complete', 'na', 'blocked']).optional(),
  assigneeId: z.string().uuid('Invalid assignee ID').optional(),
  dueAt: z.string().datetime().optional(),
});

export const stageApproveSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  note: z.string().optional(),
});

// Output Schemas
export const stageSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string(),
  order: z.number(),
  requiredApproverRole: z.string().optional(),
  gateRules: z.object({
    requiredForms: z.array(z.string()),
    inventoryReservations: z.array(z.string()),
    equipmentCommissioning: z.boolean(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  completionPercentage: z.number().min(0).max(100).optional(),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const checklistItemSchema = z.object({
  id: z.string().uuid(),
  projectChecklistId: z.string().uuid(),
  templateItemId: z.string().uuid(),
  label: z.string(),
  type: z.enum(['text', 'number', 'photo', 'signature', 'boolean', 'select']),
  required: z.boolean(),
  validations: z.any(),
  value: z.any().optional(),
  status: z.enum(['pending', 'complete', 'na', 'blocked']),
  assigneeId: z.string().uuid().optional(),
  assigneeName: z.string().optional(),
  dueAt: z.date().optional(),
  completedAt: z.date().optional(),
});

export const checklistSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  stageId: z.string().uuid().optional(),
  templateId: z.string().uuid(),
  templateName: z.string(),
  status: z.enum(['not_started', 'in_progress', 'blocked', 'done']),
  items: z.array(checklistItemSchema),
  requiredItems: z.array(checklistItemSchema),
  optionalItems: z.array(checklistItemSchema),
});

export const projectProgressSchema = z.object({
  projectId: z.string().uuid(),
  overallPercentage: z.number().min(0).max(100),
  stages: z.array(z.object({
    stageId: z.string().uuid(),
    name: z.string(),
    order: z.number(),
    percentage: z.number().min(0).max(100),
    status: z.enum(['not_started', 'in_progress', 'blocked', 'done']),
    approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  })),
});

// Type exports
export type StageCreate = z.infer<typeof stageCreateSchema>;
export type ChecklistFromTemplate = z.infer<typeof checklistFromTemplateSchema>;
export type ChecklistItemPatch = z.infer<typeof checklistItemPatchSchema>;
export type StageApprove = z.infer<typeof stageApproveSchema>;

export type Stage = z.infer<typeof stageSchema>;
export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type Checklist = z.infer<typeof checklistSchema>;
export type ProjectProgress = z.infer<typeof projectProgressSchema>;