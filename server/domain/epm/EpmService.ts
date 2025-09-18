import { IStorage } from '../../storage';
import { 
  StageCreate, 
  ChecklistFromTemplate, 
  ChecklistItemPatch, 
  StageApprove,
  Stage,
  Checklist,
  ChecklistItem,
  ProjectProgress
} from '../../../shared/contracts/epm';
import {
  ProjectStage,
  InsertProjectStage,
  ProjectChecklist,
  InsertProjectChecklist,
  ChecklistItem as DBChecklistItem,
  InsertChecklistItem,
  StageApproval,
  InsertStageApproval,
  InsertAuditLog
} from '../../../shared/schema';
import { randomUUID } from 'crypto';

export class EpmService {
  constructor(private storage: IStorage) {}

  async createStages(projectId: string, stages: StageCreate[]): Promise<Stage[]> {
    // Validate project exists
    const project = await this.storage.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const createdStages: Stage[] = [];
    
    for (const stage of stages) {
      const stageData: InsertProjectStage = {
        id: randomUUID(),
        projectId,
        name: stage.name,
        order: stage.order,
        requiredApproverRole: stage.requiredApproverRole || null,
        gateRules: stage.gateRules,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdStage = await this.storage.createProjectStage(stageData);
      
      // Log stage creation
      await this.createAuditLog({
        actorId: 'system', // TODO: Get from context
        entity: 'project_stage',
        entityId: createdStage.id,
        action: 'create',
        before: null,
        after: createdStage,
      });

      createdStages.push({
        ...createdStage,
        requiredApproverRole: createdStage.requiredApproverRole || undefined,
        gateRules: createdStage.gateRules as {
          requiredForms: string[];
          inventoryReservations: string[];
          equipmentCommissioning: boolean;
        },
        completionPercentage: 0,
        approvalStatus: 'pending' as const,
      });
    }

    return createdStages;
  }

  async listStagesWithPct(projectId: string): Promise<Stage[]> {
    const stages = await this.storage.listProjectStages(projectId);
    const stagesWithProgress: Stage[] = [];

    for (const stage of stages) {
      const completion = await this.calculateStageCompletion(stage.id);
      const approvalStatus = await this.getStageApprovalStatus(projectId, stage.id);
      
      stagesWithProgress.push({
        ...stage,
        requiredApproverRole: stage.requiredApproverRole || undefined,
        gateRules: stage.gateRules as {
          requiredForms: string[];
          inventoryReservations: string[];
          equipmentCommissioning: boolean;
        },
        completionPercentage: completion,
        approvalStatus: (approvalStatus || 'pending') as 'pending' | 'approved' | 'rejected' | undefined,
      });
    }

    return stagesWithProgress.sort((a, b) => a.order - b.order);
  }

  async instantiateChecklist(
    projectId: string, 
    templateId: string, 
    stageId?: string
  ): Promise<Checklist> {
    // Validate inputs
    const project = await this.storage.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const template = await this.storage.getChecklistTemplate(templateId);
    if (!template) {
      throw new Error('Checklist template not found');
    }

    // Template found and validated

    if (stageId) {
      const stage = await this.storage.getProjectStage(stageId);
      if (!stage || stage.projectId !== projectId) {
        throw new Error('Stage not found or does not belong to project');
      }
    }

    // Create the checklist
    const checklistData: InsertProjectChecklist = {
      id: randomUUID(),
      projectId,
      stageId: stageId,
      templateId,
      status: 'not_started',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const checklist = await this.storage.createProjectChecklist(checklistData);

    // Create checklist items from template
    // Use template.items (JSON field) instead of separate checklist_template_items table
    const templateItems = template.items as any[] || [];
    const checklistItems: ChecklistItem[] = [];

    for (const templateItem of templateItems) {
      const itemData: InsertChecklistItem = {
        id: randomUUID(),
        projectChecklistId: checklist.id,
        templateItemId: templateItem.id || randomUUID(), // Use template item ID or generate new
        value: null,
        status: 'pending',
        assigneeId: null,
        dueAt: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const item = await this.storage.createChecklistItem(itemData);
      const checklistItem: ChecklistItem = {
        ...item,
        assigneeId: item.assigneeId || undefined,
        dueAt: item.dueAt || undefined,
        completedAt: item.completedAt || undefined,
        label: templateItem.text || templateItem.label || 'Checklist Item',
        type: templateItem.type as 'text' | 'number' | 'photo' | 'signature' | 'boolean' | 'select',
        required: templateItem.required || false,
        validations: templateItem.validations || null,
        status: item.status as 'pending' | 'complete' | 'na' | 'blocked',
        assigneeName: undefined,
      };
      checklistItems.push(checklistItem);
    }

    // Log checklist creation
    await this.createAuditLog({
      actorId: 'system', // TODO: Get from context
      entity: 'project_checklist',
      entityId: checklist.id,
      action: 'create',
      before: null,
      after: { ...checklist, itemsCount: checklistItems.length },
    });

    const requiredItems = checklistItems.filter(item => item.required);
    const optionalItems = checklistItems.filter(item => !item.required);

    return {
      ...checklist,
      stageId: checklist.stageId || undefined,
      status: checklist.status as 'not_started' | 'in_progress' | 'blocked' | 'done',
      templateName: template.name,
      items: checklistItems,
      requiredItems,
      optionalItems,
    };
  }

  async getChecklist(checklistId: string): Promise<Checklist> {
    const checklist = await this.storage.getProjectChecklist(checklistId);
    if (!checklist) {
      throw new Error('Checklist not found');
    }

    const template = await this.storage.getChecklistTemplate(checklist.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const items = await this.storage.listChecklistItems(checklistId);
    const templateItems = (template.items as any[]) || [];

    // Join with template data to get labels, types, etc.
    const enrichedItems: ChecklistItem[] = items.map(item => {
      const templateItem = templateItems.find(t => t.id === item.templateItemId);
      return {
        ...item,
        assigneeId: item.assigneeId || undefined,
        dueAt: item.dueAt || undefined,
        completedAt: item.completedAt || undefined,
        status: item.status as 'pending' | 'complete' | 'na' | 'blocked',
        label: templateItem?.text || templateItem?.label || 'Unknown',
        type: (templateItem?.type as 'text' | 'number' | 'photo' | 'signature' | 'boolean' | 'select') || 'text',
        required: templateItem?.required || false,
        validations: templateItem?.validations || {},
        assigneeName: undefined, // TODO: Fetch user name if assigneeId exists
      };
    });

    // Group by required/optional
    const requiredItems = enrichedItems.filter(item => item.required);
    const optionalItems = enrichedItems.filter(item => !item.required);

    return {
      ...checklist,
      stageId: checklist.stageId || undefined,
      status: checklist.status as 'not_started' | 'in_progress' | 'blocked' | 'done',
      templateName: template.name,
      items: enrichedItems,
      requiredItems,
      optionalItems,
    };
  }

  async updateChecklistItem(itemId: string, patch: ChecklistItemPatch): Promise<ChecklistItem> {
    const item = await this.storage.getChecklistItem(itemId);
    if (!item) {
      throw new Error('Checklist item not found');
    }

    const before = { ...item };
    
    // Prepare update data  
    const updateData = {
      ...patch,
      dueAt: patch.dueAt ? new Date(patch.dueAt) : undefined,
      updatedAt: new Date(),
    };

    // Set completedAt when status changes to complete
    if (patch.status === 'complete' && item.status !== 'complete') {
      (updateData as any).completedAt = new Date();
    }

    // Clear completedAt if status changes away from complete
    if (patch.status && patch.status !== 'complete' && item.status === 'complete') {
      (updateData as any).completedAt = undefined;
    }

    const updatedItem = await this.storage.updateChecklistItem(itemId, updateData);
    
    if (!updatedItem) {
      throw new Error('Failed to update checklist item');
    }

    // Log the change
    await this.createAuditLog({
      actorId: 'system', // TODO: Get from context
      entity: 'checklist_item',
      entityId: itemId,
      action: 'update',
      before,
      after: updatedItem,
    });

    // Update parent checklist status
    await this.updateChecklistStatus(updatedItem.projectChecklistId);

    // Get template info for response
    const checklist = await this.storage.getProjectChecklist(updatedItem.projectChecklistId);
    const template = checklist ? await this.storage.getChecklistTemplate(checklist.templateId) : null;
    const templateItems = (template?.items as any[]) || [];
    const templateItem = templateItems.find(t => t.id === updatedItem.templateItemId);
    
    return {
      ...updatedItem,
      assigneeId: updatedItem.assigneeId || undefined,
      dueAt: updatedItem.dueAt || undefined,
      completedAt: updatedItem.completedAt || undefined,
      status: updatedItem.status as 'pending' | 'complete' | 'na' | 'blocked',
      label: templateItem?.text || templateItem?.label || 'Unknown',
      type: (templateItem?.type as 'text' | 'number' | 'photo' | 'signature' | 'boolean' | 'select') || 'text',
      required: templateItem?.required || false,
      validations: templateItem?.validations || {},
      assigneeName: undefined,
    };
  }

  async approveStage(
    projectId: string, 
    stageId: string, 
    decision: StageApprove,
    approverId: string
  ): Promise<void> {
    // Validate stage exists
    const stage = await this.storage.getProjectStage(stageId);
    if (!stage || stage.projectId !== projectId) {
      throw new Error('Stage not found or does not belong to project');
    }

    // Check if all required items are complete (only for approval)
    if (decision.status === 'approved') {
      const isComplete = await this.areAllRequiredItemsComplete(stageId);
      if (!isComplete) {
        throw new Error('Cannot approve stage: required checklist items are not complete');
      }
    }

    // Create approval record
    const approvalData: InsertStageApproval = {
      id: randomUUID(),
      projectId,
      stageId,
      approverId,
      status: decision.status,
      note: decision.note || null,
      decidedAt: new Date(),
      createdAt: new Date(),
    };

    const approval = await this.storage.createStageApproval(approvalData);

    // Log approval
    await this.createAuditLog({
      actorId: approverId,
      entity: 'stage_approval',
      entityId: approval.id,
      action: 'create',
      before: null,
      after: approval,
    });

    // Fire hooks based on approval
    if (decision.status === 'approved') {
      await this.onStageApproved(projectId, stage);
    }

    // Generate notification
    await this.generateStageApprovalNotification(projectId, stage, decision, approverId);
  }

  async getProjectProgress(projectId: string): Promise<ProjectProgress> {
    const stages = await this.listStagesWithPct(projectId);
    
    let totalWeight = 0;
    let completedWeight = 0;
    
    const stageProgress = stages.map(stage => {
      const weight = 1; // Equal weight for all stages
      totalWeight += weight;
      completedWeight += (stage.completionPercentage || 0) * weight / 100;
      
      return {
        stageId: stage.id,
        name: stage.name,
        order: stage.order,
        percentage: stage.completionPercentage || 0,
        status: this.getStageStatus(stage),
        approvalStatus: stage.approvalStatus,
      };
    });

    const overallPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

    return {
      projectId,
      overallPercentage,
      stages: stageProgress,
    };
  }

  // Private helper methods
  private async calculateStageCompletion(stageId: string): Promise<number> {
    const checklists = await this.storage.listProjectChecklistsByStage(stageId);
    
    if (checklists.length === 0) return 0;

    let totalRequiredItems = 0;
    let completedRequiredItems = 0;

    for (const checklist of checklists) {
      const items = await this.storage.listChecklistItems(checklist.id);
      const template = await this.storage.getChecklistTemplate(checklist.templateId);
      const templateItems = (template?.items as any[]) || [];
      
      for (const item of items) {
        const templateItem = templateItems.find(t => t.id === item.templateItemId);
        if (templateItem?.required) {
          totalRequiredItems++;
          if (item.status === 'complete') {
            completedRequiredItems++;
          }
        }
      }
    }

    return totalRequiredItems > 0 ? Math.round((completedRequiredItems / totalRequiredItems) * 100) : 100;
  }

  private async getStageApprovalStatus(
    projectId: string, 
    stageId: string
  ): Promise<'pending' | 'approved' | 'rejected' | undefined> {
    const approvals = await this.storage.listStageApprovals(projectId, stageId);
    const latestApproval = approvals.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    return latestApproval?.status as any;
  }

  private getStageStatus(stage: Stage): 'not_started' | 'in_progress' | 'blocked' | 'done' {
    const completion = stage.completionPercentage || 0;
    const approval = stage.approvalStatus;
    
    if (approval === 'approved') return 'done';
    if (approval === 'rejected') return 'blocked';
    if (completion > 0) return 'in_progress';
    return 'not_started';
  }

  private async areAllRequiredItemsComplete(stageId: string): Promise<boolean> {
    const completion = await this.calculateStageCompletion(stageId);
    return completion === 100;
  }

  private async updateChecklistStatus(checklistId: string): Promise<void> {
    const checklist = await this.storage.getProjectChecklist(checklistId);
    if (!checklist) return;

    const items = await this.storage.listChecklistItems(checklistId);
    const templateItems = await this.storage.listChecklistTemplateItems(checklist.templateId);

    let totalItems = 0;
    let completedItems = 0;
    let blockedItems = 0;

    for (const item of items) {
      totalItems++;
      if (item.status === 'complete' || item.status === 'na') {
        completedItems++;
      } else if (item.status === 'blocked') {
        blockedItems++;
      }
    }

    let status: 'not_started' | 'in_progress' | 'blocked' | 'done' = 'not_started';
    
    if (blockedItems > 0) {
      status = 'blocked';
    } else if (completedItems === totalItems && totalItems > 0) {
      status = 'done';
    } else if (completedItems > 0) {
      status = 'in_progress';
    }

    await this.storage.updateProjectChecklist(checklistId, { status, updatedAt: new Date() });
  }

  private async onStageApproved(projectId: string, stage: ProjectStage): Promise<void> {
    const gateRules = stage.gateRules as any;
    
    try {
      // 1. Generate required safety forms from gate_rules.requiredForms[]
      if (gateRules?.requiredForms?.length > 0) {
        console.log(`Generating safety forms for stage ${stage.name}: ${gateRules.requiredForms.join(', ')}`);
        for (const formType of gateRules.requiredForms) {
          await this.generateSafetyForm(projectId, stage.id, formType);
        }
      }

      // 2. Reserve inventory for the stage (using existing inventory service)
      await this.reserveStageInventory(projectId, stage.id);

      // 3. If stage name includes "commissioning", seed equipment maintenance jobs
      if (stage.name.toLowerCase().includes('commissioning')) {
        console.log(`Seeding equipment maintenance jobs for commissioning stage: ${stage.name}`);
        await this.seedEquipmentMaintenanceJobs(projectId, stage.id);
      }

      // 4. Publish idempotent notifications
      await this.publishStageApprovedNotifications(projectId, stage);

    } catch (error) {
      console.error(`Error in stage approval hooks for stage ${stage.id}:`, error);
      // Don't re-throw to prevent breaking the approval process
      // Log the error and continue
      await this.createAuditLog({
        actorId: 'system',
        entity: 'stage_approval_hooks',
        entityId: stage.id,
        action: 'error',
        before: null,
        after: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }

  private async generateStageApprovalNotification(
    projectId: string,
    stage: ProjectStage,
    decision: StageApprove,
    approverId: string
  ): Promise<void> {
    // Use existing notification system
    const project = await this.storage.getProject(projectId);
    const approver = await this.storage.getUser(approverId);
    
    if (project && approver) {
      await this.storage.createNotification({
        recipientId: project.supervisorId || 'admin',
        type: 'stage_approval',
        title: `Stage ${decision.status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Stage "${stage.name}" in project "${project.name}" has been ${decision.status} by ${approver.firstName} ${approver.lastName}`,
        relatedType: 'project',
        relatedId: projectId,
        priority: 'medium',
        actionUrl: `/projects/${projectId}/stages/${stage.id}`,
        metadata: { 
          stageId: stage.id, 
          stageName: stage.name, 
          decision: decision.status,
          note: decision.note 
        }
      });
    }
  }

  private async createAuditLog(data: InsertAuditLog): Promise<void> {
    await this.storage.createAuditLog(data);
  }

  // Approve hook implementations
  private async generateSafetyForm(projectId: string, stageId: string, formType: string): Promise<void> {
    try {
      // Generate safety form using existing safety form system
      const project = await this.storage.getProject(projectId);
      if (!project) return;

      await this.storage.createSafetyForm({
        projectId,
        relatedId: stageId,
        relatedType: 'stage',
        type: formType,
        title: `${formType} - ${project.name}`,
        submittedById: 'system', // Generated automatically
        formData: { 
          stageId,
          generatedByApproval: true,
          formType 
        },
        reviewedById: null,
        reviewedAt: null,
        notes: `Auto-generated form for stage approval`
      });
      
      console.log(`✅ Generated safety form ${formType} for project ${projectId}, stage ${stageId}`);
    } catch (error) {
      console.error(`❌ Failed to generate safety form ${formType}:`, error);
    }
  }

  private async reserveStageInventory(projectId: string, stageId: string): Promise<void> {
    try {
      // Get all project materials for this stage that need reservation
      const projectMaterials = await this.storage.listProjectMaterials(projectId);
      const stageMaterials = projectMaterials.filter(material => 
        material.stageId === stageId && material.status === 'needed'
      );
      
      for (const material of stageMaterials) {
        // Reserve the required quantity
        const reservationId = randomUUID();
        await this.storage.createInventoryStock({
          itemId: material.itemId,
          locationId: 'stage-reservation', // Special location for stage reservations
          quantity: -material.quantityRequired, // Negative to indicate reservation
          unitCost: material.unitCost || 0,
          notes: `Reserved for stage ${stageId} - ${material.notes || ''}`,
          reservationId,
          createdAt: new Date(),
        });
        
        // Update material status
        await this.storage.updateProjectMaterial(material.id, {
          status: 'reserved',
          updatedAt: new Date()
        });
      }
      
      console.log(`✅ Reserved inventory for stage ${stageId}: ${stageMaterials.length} items`);
    } catch (error) {
      console.error(`❌ Failed to reserve inventory for stage ${stageId}:`, error);
    }
  }

  private async seedEquipmentMaintenanceJobs(projectId: string, stageId: string): Promise<void> {
    try {
      // Get all project equipment that needs commissioning
      const equipmentAssignments = await this.storage.listEquipmentAssignments(projectId);
      
      for (const assignment of equipmentAssignments) {
        // Create commissioning maintenance job
        await this.storage.createMaintenanceLog({
          equipmentId: assignment.equipmentId,
          projectId,
          type: 'commissioning',
          description: `Commissioning maintenance for stage: ${stageId}`,
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          performedById: null,
          performedAt: null,
          notes: `Auto-generated commissioning job for stage approval`,
          cost: null,
          partsUsed: null,
          createdAt: new Date(),
        });
      }
      
      console.log(`✅ Seeded equipment maintenance jobs for commissioning stage ${stageId}: ${equipmentAssignments.length} jobs`);
    } catch (error) {
      console.error(`❌ Failed to seed equipment maintenance jobs for stage ${stageId}:`, error);
    }
  }

  private async publishStageApprovedNotifications(projectId: string, stage: ProjectStage): Promise<void> {
    try {
      const dedupeKey = `stage.approved.${stage.id}`;
      
      // Check if notification already exists (idempotent)
      const existingNotifications = await this.storage.listNotifications();
      const existing = existingNotifications.find(n => 
        n.metadata && 
        typeof n.metadata === 'object' && 
        'dedupeKey' in n.metadata && 
        n.metadata.dedupeKey === dedupeKey
      );
      
      if (existing) {
        console.log(`Notification already exists for stage ${stage.id}, skipping`);
        return;
      }
      
      const project = await this.storage.getProject(projectId);
      if (!project) return;
      
      // Create idempotent stage.approved notification
      await this.storage.createNotification({
        recipientId: project.supervisorId || 'admin',
        type: 'stage_approved',
        title: `Stage Approved: ${stage.name}`,
        message: `Stage "${stage.name}" in project "${project.name}" has been approved and automated workflows have been triggered.`,
        relatedType: 'project',
        relatedId: projectId,
        priority: 'high',
        actionUrl: `/projects/${projectId}/stages/${stage.id}`,
        metadata: { 
          stageId: stage.id,
          stageName: stage.name,
          dedupeKey, // Ensures idempotency
          automatedWorkflows: true,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log(`✅ Published stage.approved notification for stage ${stage.id}`);
    } catch (error) {
      console.error(`❌ Failed to publish stage approved notifications for stage ${stage.id}:`, error);
    }
  }
}