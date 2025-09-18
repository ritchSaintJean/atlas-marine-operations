import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users and Roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("worker"), // admin, supervisor, worker
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  position: text("position"),
  department: text("department"), // operations, safety, maintenance, administration
  crew: text("crew"),
  hireDate: timestamp("hire_date"),
  emergencyContact: jsonb("emergency_contact"), // {name, relationship, phone}
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Personnel Certifications and Training
export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // safety, technical, medical, regulatory
  name: text("name").notNull(),
  issuingOrganization: text("issuing_organization").notNull(),
  certificateNumber: text("certificate_number"),
  issueDate: timestamp("issue_date"),
  expirationDate: timestamp("expiration_date"),
  documentUrl: text("document_url"), // path to certificate file
  renewalRequired: boolean("renewal_required").notNull().default(false),
  status: text("status").notNull().default("active"), // active, expired, pending, suspended
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Medical Clearances and Health Monitoring
export const medicalClearances = pgTable("medical_clearances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // physical, respiratory, vision, hearing, psychological
  description: text("description").notNull(),
  provider: text("provider").notNull(),
  testDate: timestamp("test_date").notNull(),
  expirationDate: timestamp("expiration_date"),
  result: text("result").notNull(), // cleared, restricted, not_cleared
  restrictions: jsonb("restrictions"), // array of restriction strings
  documentUrl: text("document_url"), // path to medical report
  nextReminderDate: timestamp("next_reminder_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project Types and Templates
export const projectTypes = pgTable("project_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Hull Blast & Coat, Tank Blast & Line, etc.
  description: text("description"),
  stages: jsonb("stages").notNull(), // array of stage definitions
  materialsTemplate: jsonb("materials_template").notNull(), // required materials list
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  projectTypeId: varchar("project_type_id").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("pending"), // pending, active, completed, cancelled
  currentStage: text("current_stage"),
  progress: integer("progress").notNull().default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  assignedCrew: text("assigned_crew"),
  supervisorId: varchar("supervisor_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Equipment Types and Inventory
export const equipmentTypes = pgTable("equipment_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Compressor 900, Blast Pot, etc.
  category: text("category").notNull(), // compressor, vehicle, tool, etc.
  dailyChecklistTemplate: jsonb("daily_checklist_template").notNull(),
  maintenanceSchedule: jsonb("maintenance_schedule").notNull(), // intervals and requirements
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentTypeId: varchar("equipment_type_id").notNull(),
  serialNumber: text("serial_number"),
  status: text("status").notNull().default("available"), // available, in_use, maintenance, out_of_service
  location: text("location"), // which truck, warehouse, etc.
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  hoursUsed: integer("hours_used").default(0),
  mileage: integer("mileage").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Equipment Assignments to Projects
export const equipmentAssignments = pgTable("equipment_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  equipmentId: varchar("equipment_id").notNull(),
  assignedDate: timestamp("assigned_date").defaultNow().notNull(),
  returnedDate: timestamp("returned_date"),
  assignedBy: varchar("assigned_by").notNull(),
});

// Personnel Assignments to Equipment
export const personnelEquipmentAssignments = pgTable("personnel_equipment_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  equipmentId: varchar("equipment_id").notNull(),
  projectId: varchar("project_id"), // Optional - equipment may be assigned for general use
  assignedDate: timestamp("assigned_date").defaultNow().notNull(),
  returnedDate: timestamp("returned_date"),
  assignedBy: varchar("assigned_by").notNull(),
  purpose: text("purpose"), // "project_work", "training", "maintenance", etc.
  status: text("status").notNull().default("active"), // active, completed, returned
  notes: text("notes"),
});

// Daily Maintenance Logs
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").notNull(),
  date: timestamp("date").notNull(),
  performedBy: varchar("performed_by").notNull(),
  checklistData: jsonb("checklist_data").notNull(), // completed checklist items
  issues: text("issues"),
  photosRequired: boolean("photos_required").default(false),
  photoCount: integer("photo_count").default(0),
  status: text("status").notNull().default("pending"), // pending, completed, issues_found
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Safety Forms and Compliance
export const safetyForms = pgTable("safety_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // confined_space, blast_start, blast_finish, etc.
  projectId: varchar("project_id"),
  date: timestamp("date").notNull(),
  formData: jsonb("form_data").notNull(), // form fields and responses
  supervisorId: varchar("supervisor_id").notNull(),
  entrants: jsonb("entrants"), // for confined space forms
  status: text("status").notNull().default("draft"), // draft, submitted, approved
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Inventory and Materials
export const inventoryLocations = pgTable("inventory_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Box Truck, Pump Truck, Warehouse
  type: text("type").notNull(), // vehicle, warehouse
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // ppe, tools, consumables, abrasives
  sku: text("sku"),
  unit: text("unit").notNull(), // each, box, gallon, etc.
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inventoryStock = pgTable("inventory_stock", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  locationId: varchar("location_id").notNull(),
  itemId: varchar("item_id").notNull(),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Project Materials Lists
export const projectMaterials = pgTable("project_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  itemId: varchar("item_id").notNull(),
  requiredQuantity: integer("required_quantity").notNull(),
  loadedQuantity: integer("loaded_quantity").default(0),
  usedQuantity: integer("used_quantity").default(0),
  status: text("status").notNull().default("pending"), // pending, loaded, in_use, completed
  notes: text("notes"),
});

// Photos
export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  relatedId: varchar("related_id").notNull(), // project, maintenance log, safety form, etc.
  relatedType: text("related_type").notNull(), // project, maintenance, safety
  filename: text("filename").notNull(),
  originalName: text("original_name"),
  url: text("url").notNull(),
  description: text("description"),
  takenBy: varchar("taken_by").notNull(),
  takenAt: timestamp("taken_at").defaultNow().notNull(),
});

// Workflow Management for Certifications
export const certificationWorkflows = pgTable("certification_workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificationId: varchar("certification_id").notNull(),
  workflowType: text("workflow_type").notNull(), // renewal, initial, update
  status: text("status").notNull().default("pending"), // pending, in_progress, approved, rejected, completed
  initiatedBy: varchar("initiated_by").notNull(),
  assignedTo: varchar("assigned_to"), // supervisor or admin handling the workflow
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  notes: text("notes"),
  approvalNotes: text("approval_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Automated Notification System
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientId: varchar("recipient_id").notNull(), // user to receive notification
  type: text("type").notNull(), // certification_expiring, workflow_assigned, document_required, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedType: text("related_type"), // certification, medical_clearance, workflow
  relatedId: varchar("related_id"), // ID of related record
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  status: text("status").notNull().default("unread"), // unread, read, dismissed, acted
  scheduledFor: timestamp("scheduled_for").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  actionUrl: text("action_url"), // Link to take action on the notification
  metadata: jsonb("metadata"), // Additional data for the notification
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Document Management for Certifications
export const certificationDocuments = pgTable("certification_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificationId: varchar("certification_id"),
  medicalClearanceId: varchar("medical_clearance_id"),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  documentType: text("document_type").notNull(), // certificate, medical_report, renewal_form
  uploadedBy: varchar("uploaded_by").notNull(),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, rejected
  verifiedBy: varchar("verified_by"),
  verifiedAt: timestamp("verified_at"),
  expirationDate: timestamp("expiration_date"), // for certificates with expiry
  version: integer("version").notNull().default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Workflow Approval History
export const workflowApprovals = pgTable("workflow_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowId: varchar("workflow_id").notNull(),
  approverId: varchar("approver_id").notNull(),
  action: text("action").notNull(), // approved, rejected, requested_changes
  comments: text("comments"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Checklist Templates and Instances
export const checklistTemplates = pgTable("checklist_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // daily_maintenance, safety, project_stage
  targetType: text("target_type"), // equipment_type, project_type
  targetId: varchar("target_id"),
  items: jsonb("items").notNull(), // array of checklist items
  version: integer("version").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const checklistInstances = pgTable("checklist_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull(),
  relatedId: varchar("related_id").notNull(), // project, equipment, etc.
  relatedType: text("related_type").notNull(),
  date: timestamp("date").notNull(),
  completedBy: varchar("completed_by"),
  completedData: jsonb("completed_data"), // responses to checklist items
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  photoCount: integer("photo_count").default(0),
  requiredPhotos: integer("required_photos").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  position: true,
  department: true,
  role: true,
  crew: true,
  emergencyContact: true,
}).extend({
  hireDate: z.string().transform(val => new Date(val)).optional(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  projectTypeId: true,
  location: true,
  assignedCrew: true,
  supervisorId: true,
  notes: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).pick({
  equipmentTypeId: true,
  serialNumber: true,
  location: true,
  notes: true,
});

export const insertMaintenanceLogSchema = createInsertSchema(maintenanceLogs).pick({
  equipmentId: true,
  checklistData: true,
  issues: true,
}).extend({
  date: z.string().transform(val => new Date(val)),
  performedBy: z.string(),
});

export const insertSafetyFormSchema = createInsertSchema(safetyForms).pick({
  type: true,
  projectId: true,
  formData: true,
  supervisorId: true,
  entrants: true,
}).extend({
  date: z.string().transform(val => new Date(val)),
});

export const insertEquipmentAssignmentSchema = createInsertSchema(equipmentAssignments).pick({
  projectId: true,
  equipmentId: true,
  assignedBy: true,
}).extend({
  assignedDate: z.string().transform(val => new Date(val)).optional(),
});

export const insertInventoryLocationSchema = createInsertSchema(inventoryLocations).pick({
  name: true,
  type: true,
  description: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  category: true,
  sku: true,
  unit: true,
  description: true,
});

export const insertInventoryStockSchema = createInsertSchema(inventoryStock).pick({
  locationId: true,
  itemId: true,
  quantity: true,
  minQuantity: true,
});

export const insertProjectMaterialSchema = createInsertSchema(projectMaterials).pick({
  projectId: true,
  itemId: true,
  requiredQuantity: true,
  loadedQuantity: true,
  usedQuantity: true,
  status: true,
  notes: true,
});

export const insertPhotoSchema = createInsertSchema(photos).pick({
  relatedId: true,
  relatedType: true,
  filename: true,
  originalName: true,
  url: true,
  description: true,
  takenBy: true,
}).extend({
  takenAt: z.string().transform(val => new Date(val)).optional(),
});

export const insertCertificationSchema = createInsertSchema(certifications).pick({
  userId: true,
  type: true,
  name: true,
  issuingOrganization: true,
  certificateNumber: true,
  documentUrl: true,
  renewalRequired: true,
  status: true,
  notes: true,
}).extend({
  issueDate: z.string().transform(val => new Date(val)).optional(),
  expirationDate: z.string().transform(val => new Date(val)).optional(),
});

export const insertMedicalClearanceSchema = createInsertSchema(medicalClearances).pick({
  userId: true,
  type: true,
  description: true,
  provider: true,
  result: true,
  restrictions: true,
  documentUrl: true,
  notes: true,
}).extend({
  testDate: z.string().transform(val => new Date(val)),
  expirationDate: z.string().transform(val => new Date(val)).optional(),
  nextReminderDate: z.string().transform(val => new Date(val)).optional(),
});

export const insertChecklistTemplateSchema = createInsertSchema(checklistTemplates).pick({
  name: true,
  type: true,
  targetType: true,
  targetId: true,
  items: true,
  version: true,
  isActive: true,
});

export const insertChecklistInstanceSchema = createInsertSchema(checklistInstances).pick({
  templateId: true,
  relatedId: true,
  relatedType: true,
  completedBy: true,
  completedData: true,
  status: true,
  photoCount: true,
  requiredPhotos: true,
}).extend({
  date: z.string().transform(val => new Date(val)),
});

export const insertPersonnelEquipmentAssignmentSchema = createInsertSchema(personnelEquipmentAssignments).pick({
  userId: true,
  equipmentId: true,
  projectId: true,
  assignedBy: true,
  purpose: true,
  status: true,
  notes: true,
}).extend({
  assignedDate: z.string().transform(val => new Date(val)).optional(),
  returnedDate: z.string().transform(val => new Date(val)).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;
export type InsertMaintenanceLog = z.infer<typeof insertMaintenanceLogSchema>;
export type SafetyForm = typeof safetyForms.$inferSelect;
export type InsertSafetyForm = z.infer<typeof insertSafetyFormSchema>;
export type EquipmentAssignment = typeof equipmentAssignments.$inferSelect;
export type InsertEquipmentAssignment = z.infer<typeof insertEquipmentAssignmentSchema>;
export type InventoryLocation = typeof inventoryLocations.$inferSelect;
export type InsertInventoryLocation = z.infer<typeof insertInventoryLocationSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryStock = typeof inventoryStock.$inferSelect;
export type InsertInventoryStock = z.infer<typeof insertInventoryStockSchema>;
export type ProjectMaterial = typeof projectMaterials.$inferSelect;
export type InsertProjectMaterial = z.infer<typeof insertProjectMaterialSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type MedicalClearance = typeof medicalClearances.$inferSelect;
export type InsertMedicalClearance = z.infer<typeof insertMedicalClearanceSchema>;
export type ChecklistTemplate = typeof checklistTemplates.$inferSelect;
export type InsertChecklistTemplate = z.infer<typeof insertChecklistTemplateSchema>;
export type ChecklistInstance = typeof checklistInstances.$inferSelect;
export type InsertChecklistInstance = z.infer<typeof insertChecklistInstanceSchema>;
export type PersonnelEquipmentAssignment = typeof personnelEquipmentAssignments.$inferSelect;
export type InsertPersonnelEquipmentAssignment = z.infer<typeof insertPersonnelEquipmentAssignmentSchema>;

// Workflow management schemas
export const insertCertificationWorkflowSchema = createInsertSchema(certificationWorkflows).pick({
  certificationId: true,
  workflowType: true,
  status: true,
  initiatedBy: true,
  assignedTo: true,
  priority: true,
  notes: true,
  approvalNotes: true,
}).extend({
  dueDate: z.string().transform(val => new Date(val)).optional(),
  completedDate: z.string().transform(val => new Date(val)).optional(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  recipientId: true,
  type: true,
  title: true,
  message: true,
  relatedType: true,
  relatedId: true,
  priority: true,
  status: true,
  actionUrl: true,
  metadata: true,
}).extend({
  scheduledFor: z.string().transform(val => new Date(val)).optional(),
  readAt: z.string().transform(val => new Date(val)).optional(),
});

export const insertCertificationDocumentSchema = createInsertSchema(certificationDocuments).pick({
  certificationId: true,
  medicalClearanceId: true,
  filename: true,
  originalName: true,
  mimeType: true,
  fileSize: true,
  documentType: true,
  uploadedBy: true,
  verificationStatus: true,
  verifiedBy: true,
  version: true,
  notes: true,
}).extend({
  verifiedAt: z.string().transform(val => new Date(val)).optional(),
  expirationDate: z.string().transform(val => new Date(val)).optional(),
});

export const insertWorkflowApprovalSchema = createInsertSchema(workflowApprovals).pick({
  workflowId: true,
  approverId: true,
  action: true,
  comments: true,
}).extend({
  timestamp: z.string().transform(val => new Date(val)).optional(),
});

// Workflow management types
export type CertificationWorkflow = typeof certificationWorkflows.$inferSelect;
export type InsertCertificationWorkflow = z.infer<typeof insertCertificationWorkflowSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type CertificationDocument = typeof certificationDocuments.$inferSelect;
export type InsertCertificationDocument = z.infer<typeof insertCertificationDocumentSchema>;
export type WorkflowApproval = typeof workflowApprovals.$inferSelect;
export type InsertWorkflowApproval = z.infer<typeof insertWorkflowApprovalSchema>;
