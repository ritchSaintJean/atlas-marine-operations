import type { Express } from "express";
import { EpmService } from "../domain/epm/EpmService";
import { storage } from "../storage";
import {
  stageCreateSchema,
  checklistFromTemplateSchema,
  checklistItemPatchSchema,
  stageApproveSchema
} from "../../shared/contracts/epm";
import { z } from "zod";
import { requireAuth, requireRole, canUpdateChecklistItem, canApproveStage, AuthenticatedRequest } from "../middleware/auth";

const epmService = new EpmService(storage);

export function registerEpmRoutes(app: Express) {
  // Project Stages
  app.post("/api/projects/:id/stages", async (req, res) => {
    try {
      const projectId = req.params.id;
      const stagesData = z.array(stageCreateSchema).parse(req.body.stages);
      const stages = await epmService.createStages(projectId, stagesData);
      res.json(stages);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid stage data", details: error.errors });
      }
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid stage data" });
    }
  });

  app.get("/api/projects/:id/stages", async (req, res) => {
    try {
      const projectId = req.params.id;
      const stages = await epmService.listStagesWithPct(projectId);
      res.json(stages);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Project Checklists
  app.post("/api/projects/:id/checklists", async (req, res) => {
    try {
      const projectId = req.params.id;
      const checklistData = checklistFromTemplateSchema.parse(req.body);
      const checklist = await epmService.instantiateChecklist(
        projectId, 
        checklistData.templateId, 
        checklistData.stageId
      );
      res.json(checklist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid checklist data", details: error.errors });
      }
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid checklist data" });
    }
  });

  app.get("/api/projects/:id/checklists", async (req, res) => {
    try {
      const projectId = req.params.id;
      const checklists = await storage.listProjectChecklists(projectId);
      res.json(checklists);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Individual Checklists
  app.get("/api/checklists/:id", async (req, res) => {
    try {
      const checklistId = req.params.id;
      const checklist = await epmService.getChecklist(checklistId);
      res.json(checklist);
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : "Checklist not found" });
    }
  });

  // Checklist Items - RBAC: tech can update assigned items; supervisor/admin can update any
  app.patch("/api/checklist-items/:id", requireAuth, canUpdateChecklistItem, async (req, res) => {
    try {
      const itemId = req.params.id;
      const patchData = checklistItemPatchSchema.parse(req.body);
      const item = await epmService.updateChecklistItem(itemId, patchData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid item data" });
    }
  });

  // Stage Approvals - RBAC: only supervisor/admin; log admin overrides
  app.post("/api/projects/:id/stages/:stageId/approve", requireAuth, canApproveStage, async (req, res) => {
    try {
      const { id: projectId, stageId } = req.params;
      const approvalData = stageApproveSchema.parse(req.body);
      const authReq = req as AuthenticatedRequest;
      const approverId = authReq.user.id;
      
      // Check if user has sufficient role for this stage
      const stage = await storage.getProjectStage(stageId);
      if (stage && stage.requiredApproverRole) {
        const roleHierarchy = { 'tech': 1, 'supervisor': 2, 'admin': 3 };
        const userLevel = roleHierarchy[authReq.user.role] || 0;
        const requiredLevel = roleHierarchy[stage.requiredApproverRole as keyof typeof roleHierarchy] || 0;
        
        if (userLevel < requiredLevel) {
          return res.status(403).json({ 
            error: `Insufficient role for approval. Stage requires ${stage.requiredApproverRole}, but user is ${authReq.user.role}` 
          });
        }
        
        // Log admin override when admin approves supervisor-required stage
        if (authReq.user.role === 'admin' && stage.requiredApproverRole !== 'admin') {
          console.log(`Admin override detected: ${authReq.user.username} approving stage requiring ${stage.requiredApproverRole}`);
        }
      }
      
      await epmService.approveStage(projectId, stageId, approvalData, approverId);
      res.json({ success: true, message: "Stage approval processed" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid approval data", details: error.errors });
      }
      res.status(400).json({ error: error instanceof Error ? error.message : "Approval failed" });
    }
  });

  // Project Progress
  app.get("/api/projects/:id/progress", async (req, res) => {
    try {
      const projectId = req.params.id;
      const progress = await epmService.getProjectProgress(projectId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}