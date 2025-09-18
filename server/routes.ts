import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertProjectSchema,
  insertEquipmentSchema,
  insertMaintenanceLogSchema,
  insertSafetyFormSchema,
  insertEquipmentAssignmentSchema,
  insertInventoryLocationSchema,
  insertInventoryItemSchema,
  insertInventoryStockSchema,
  insertProjectMaterialSchema,
  insertPhotoSchema,
  insertCertificationSchema,
  insertMedicalClearanceSchema,
  insertChecklistTemplateSchema,
  insertChecklistInstanceSchema,
  insertCertificationWorkflowSchema,
  insertNotificationSchema,
  insertCertificationDocumentSchema,
  insertWorkflowApprovalSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.listProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Project types
  app.get("/api/project-types", async (req, res) => {
    try {
      const projectTypes = await storage.listProjectTypes();
      res.json(projectTypes);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/project-types/:id", async (req, res) => {
    try {
      const projectType = await storage.getProjectType(req.params.id);
      if (!projectType) {
        return res.status(404).json({ error: "Project type not found" });
      }
      res.json(projectType);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Equipment routes
  app.get("/api/equipment", async (req, res) => {
    try {
      const { location } = req.query;
      let equipment;
      
      if (location && typeof location === 'string') {
        equipment = await storage.getEquipmentByLocation(location);
      } else {
        equipment = await storage.listEquipment();
      }
      
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/equipment/:id", async (req, res) => {
    try {
      const equipment = await storage.getEquipment(req.params.id);
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/equipment", async (req, res) => {
    try {
      const equipmentData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(equipmentData);
      res.json(equipment);
    } catch (error) {
      res.status(400).json({ error: "Invalid equipment data" });
    }
  });

  app.patch("/api/equipment/:id", async (req, res) => {
    try {
      const equipment = await storage.updateEquipment(req.params.id, req.body);
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Equipment types
  app.get("/api/equipment-types", async (req, res) => {
    try {
      const equipmentTypes = await storage.listEquipmentTypes();
      res.json(equipmentTypes);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/equipment-types/:id", async (req, res) => {
    try {
      const equipmentType = await storage.getEquipmentType(req.params.id);
      if (!equipmentType) {
        return res.status(404).json({ error: "Equipment type not found" });
      }
      res.json(equipmentType);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Maintenance log routes
  app.get("/api/maintenance-logs", async (req, res) => {
    try {
      const { equipmentId, date } = req.query;
      const dateParam = date ? new Date(date as string) : undefined;
      
      const logs = await storage.listMaintenanceLogs(
        equipmentId as string | undefined,
        dateParam
      );
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/maintenance-logs/:id", async (req, res) => {
    try {
      const log = await storage.getMaintenanceLog(req.params.id);
      if (!log) {
        return res.status(404).json({ error: "Maintenance log not found" });
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/maintenance-logs", async (req, res) => {
    try {
      const logData = insertMaintenanceLogSchema.parse(req.body);
      const log = await storage.createMaintenanceLog(logData);
      res.json(log);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance log data" });
    }
  });

  app.patch("/api/maintenance-logs/:id", async (req, res) => {
    try {
      const log = await storage.updateMaintenanceLog(req.params.id, req.body);
      if (!log) {
        return res.status(404).json({ error: "Maintenance log not found" });
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Safety form routes
  app.get("/api/safety-forms", async (req, res) => {
    try {
      const { projectId, type } = req.query;
      
      const forms = await storage.listSafetyForms(
        projectId as string | undefined,
        type as string | undefined
      );
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/safety-forms/:id", async (req, res) => {
    try {
      const form = await storage.getSafetyForm(req.params.id);
      if (!form) {
        return res.status(404).json({ error: "Safety form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/safety-forms", async (req, res) => {
    try {
      const formData = insertSafetyFormSchema.parse(req.body);
      const form = await storage.createSafetyForm(formData);
      res.json(form);
    } catch (error) {
      res.status(400).json({ error: "Invalid safety form data" });
    }
  });

  app.patch("/api/safety-forms/:id", async (req, res) => {
    try {
      const form = await storage.updateSafetyForm(req.params.id, req.body);
      if (!form) {
        return res.status(404).json({ error: "Safety form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Equipment assignment routes
  app.get("/api/equipment-assignments", async (req, res) => {
    try {
      const { projectId, equipmentId } = req.query;
      const assignments = await storage.listEquipmentAssignments(
        projectId as string | undefined,
        equipmentId as string | undefined
      );
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/equipment-assignments", async (req, res) => {
    try {
      const assignmentData = insertEquipmentAssignmentSchema.parse(req.body);
      const assignment = await storage.createEquipmentAssignment(assignmentData);
      res.json(assignment);
    } catch (error) {
      res.status(400).json({ error: "Invalid equipment assignment data" });
    }
  });

  app.patch("/api/equipment-assignments/:id", async (req, res) => {
    try {
      const assignment = await storage.updateEquipmentAssignment(req.params.id, req.body);
      if (!assignment) {
        return res.status(404).json({ error: "Equipment assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Inventory location routes
  app.get("/api/inventory-locations", async (req, res) => {
    try {
      const locations = await storage.listInventoryLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/inventory-locations", async (req, res) => {
    try {
      const locationData = insertInventoryLocationSchema.parse(req.body);
      const location = await storage.createInventoryLocation(locationData);
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid inventory location data" });
    }
  });

  // Inventory item routes
  app.get("/api/inventory-items", async (req, res) => {
    try {
      const items = await storage.listInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/inventory-items", async (req, res) => {
    try {
      const itemData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid inventory item data" });
    }
  });

  // Inventory stock routes
  app.get("/api/inventory-stock", async (req, res) => {
    try {
      const { locationId, itemId } = req.query;
      const stock = await storage.listInventoryStock(
        locationId as string | undefined,
        itemId as string | undefined
      );
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/inventory-stock", async (req, res) => {
    try {
      const stockData = insertInventoryStockSchema.parse(req.body);
      const stock = await storage.createInventoryStock(stockData);
      res.json(stock);
    } catch (error) {
      res.status(400).json({ error: "Invalid inventory stock data" });
    }
  });

  app.patch("/api/inventory-stock/:id", async (req, res) => {
    try {
      const stock = await storage.updateInventoryStock(req.params.id, req.body);
      if (!stock) {
        return res.status(404).json({ error: "Inventory stock not found" });
      }
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Project material routes
  app.get("/api/project-materials", async (req, res) => {
    try {
      const { projectId } = req.query;
      const materials = await storage.listProjectMaterials(projectId as string | undefined);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/project-materials", async (req, res) => {
    try {
      const materialData = insertProjectMaterialSchema.parse(req.body);
      const material = await storage.createProjectMaterial(materialData);
      res.json(material);
    } catch (error) {
      res.status(400).json({ error: "Invalid project material data" });
    }
  });

  // Photo routes
  app.get("/api/photos", async (req, res) => {
    try {
      const { relatedId, relatedType } = req.query;
      const photos = await storage.listPhotos(
        relatedId as string | undefined,
        relatedType as string | undefined
      );
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/photos", async (req, res) => {
    try {
      const photoData = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(photoData);
      res.json(photo);
    } catch (error) {
      res.status(400).json({ error: "Invalid photo data" });
    }
  });

  // Certification routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const { userId, type } = req.query;
      const certifications = await storage.listCertifications(
        userId as string | undefined,
        type as string | undefined
      );
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const certData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(certData);
      res.json(certification);
    } catch (error) {
      res.status(400).json({ error: "Invalid certification data" });
    }
  });

  // Personnel routes
  app.get("/api/personnel", async (req, res) => {
    try {
      const personnel = await storage.listAllPersonnelWithCertifications();
      res.json(personnel);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/personnel/:id", async (req, res) => {
    try {
      const personnel = await storage.getPersonnelWithCertifications(req.params.id);
      if (!personnel) {
        return res.status(404).json({ error: "Personnel not found" });
      }
      res.json(personnel);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Certifications routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const { userId, type } = req.query;
      const certifications = await storage.listCertifications(
        userId as string | undefined,
        type as string | undefined
      );
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const certificationData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(certificationData);
      res.json(certification);
    } catch (error) {
      res.status(400).json({ error: "Invalid certification data" });
    }
  });

  app.patch("/api/certifications/:id", async (req, res) => {
    try {
      const certification = await storage.updateCertification(req.params.id, req.body);
      if (!certification) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json(certification);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/certifications/expiring-soon", async (req, res) => {
    try {
      const { days } = req.query;
      const expiringCerts = await storage.getCertificationsExpiringSoon(
        days ? parseInt(days as string) : undefined
      );
      res.json(expiringCerts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Medical clearances routes
  app.get("/api/medical-clearances", async (req, res) => {
    try {
      const { userId, type } = req.query;
      const clearances = await storage.listMedicalClearances(
        userId as string | undefined,
        type as string | undefined
      );
      res.json(clearances);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/medical-clearances", async (req, res) => {
    try {
      const clearanceData = insertMedicalClearanceSchema.parse(req.body);
      const clearance = await storage.createMedicalClearance(clearanceData);
      res.json(clearance);
    } catch (error) {
      res.status(400).json({ error: "Invalid medical clearance data" });
    }
  });

  app.patch("/api/medical-clearances/:id", async (req, res) => {
    try {
      const clearance = await storage.updateMedicalClearance(req.params.id, req.body);
      if (!clearance) {
        return res.status(404).json({ error: "Medical clearance not found" });
      }
      res.json(clearance);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/medical-clearances/expiring-soon", async (req, res) => {
    try {
      const { days } = req.query;
      const expiringClearances = await storage.getMedicalClearancesExpiringSoon(
        days ? parseInt(days as string) : undefined
      );
      res.json(expiringClearances);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Certification Workflow Management
  app.get("/api/workflows", async (req, res) => {
    try {
      const { status, assignedTo } = req.query;
      const workflows = await storage.listCertificationWorkflows(
        status as string | undefined,
        assignedTo as string | undefined
      );
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/workflows/:id", async (req, res) => {
    try {
      const workflow = await storage.getCertificationWorkflow(req.params.id);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const workflowData = insertCertificationWorkflowSchema.parse(req.body);
      const workflow = await storage.createCertificationWorkflow(workflowData);
      res.json(workflow);
    } catch (error) {
      res.status(400).json({ error: "Invalid workflow data" });
    }
  });

  app.patch("/api/workflows/:id", async (req, res) => {
    try {
      const workflow = await storage.updateCertificationWorkflow(req.params.id, req.body);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const { recipientId, status } = req.query;
      const notifications = await storage.listNotifications(
        recipientId as string | undefined,
        status as string | undefined
      );
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/notifications/unread/:userId", async (req, res) => {
    try {
      const notifications = await storage.getUnreadNotifications(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/notifications/generate", async (req, res) => {
    try {
      const notifications = await storage.createAutomatedNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Document Management
  app.get("/api/documents", async (req, res) => {
    try {
      const { certificationId, medicalClearanceId } = req.query;
      const documents = await storage.listCertificationDocuments(
        certificationId as string | undefined,
        medicalClearanceId as string | undefined
      );
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertCertificationDocumentSchema.parse(req.body);
      const document = await storage.createCertificationDocument(documentData);
      res.json(document);
    } catch (error) {
      res.status(400).json({ error: "Invalid document data" });
    }
  });

  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.updateCertificationDocument(req.params.id, req.body);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Checklist template routes
  app.get("/api/checklist-templates", async (req, res) => {
    try {
      const { type } = req.query;
      const templates = await storage.listChecklistTemplates(type as string | undefined);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/checklist-templates", async (req, res) => {
    try {
      const templateData = insertChecklistTemplateSchema.parse(req.body);
      const template = await storage.createChecklistTemplate(templateData);
      res.json(template);
    } catch (error) {
      res.status(400).json({ error: "Invalid checklist template data" });
    }
  });

  // Checklist instance routes
  app.get("/api/checklist-instances", async (req, res) => {
    try {
      const { relatedId, relatedType } = req.query;
      const instances = await storage.listChecklistInstances(
        relatedId as string | undefined,
        relatedType as string | undefined
      );
      res.json(instances);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/checklist-instances", async (req, res) => {
    try {
      const instanceData = insertChecklistInstanceSchema.parse(req.body);
      const instance = await storage.createChecklistInstance(instanceData);
      res.json(instance);
    } catch (error) {
      res.status(400).json({ error: "Invalid checklist instance data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
