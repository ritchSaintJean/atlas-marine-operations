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
  name: text("name").notNull(),
  email: text("email"),
  crew: text("crew"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Personnel Certifications and Training
export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // respiratory_protection, confined_space, etc.
  status: text("status").notNull(), // active, expired, pending
  issuedDate: timestamp("issued_date"),
  expirationDate: timestamp("expiration_date"),
  details: jsonb("details"), // medical clearance info, fit test results, etc.
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
  name: true,
  email: true,
  role: true,
  crew: true,
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
  status: true,
  details: true,
}).extend({
  issuedDate: z.string().transform(val => new Date(val)).optional(),
  expirationDate: z.string().transform(val => new Date(val)).optional(),
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
export type ChecklistTemplate = typeof checklistTemplates.$inferSelect;
export type InsertChecklistTemplate = z.infer<typeof insertChecklistTemplateSchema>;
export type ChecklistInstance = typeof checklistInstances.$inferSelect;
export type InsertChecklistInstance = z.infer<typeof insertChecklistInstanceSchema>;
