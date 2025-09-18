import { 
  type User, type InsertUser,
  type Project, type InsertProject,
  type Equipment, type InsertEquipment,
  type MaintenanceLog, type InsertMaintenanceLog,
  type SafetyForm, type InsertSafetyForm,
  type EquipmentAssignment, type InsertEquipmentAssignment,
  type InventoryLocation, type InsertInventoryLocation,
  type InventoryItem, type InsertInventoryItem,
  type InventoryStock, type InsertInventoryStock,
  type ProjectMaterial, type InsertProjectMaterial,
  type Photo, type InsertPhoto,
  type Certification, type InsertCertification,
  type MedicalClearance, type InsertMedicalClearance,
  type ChecklistTemplate, type InsertChecklistTemplate,
  type ChecklistInstance, type InsertChecklistInstance,
  type PersonnelEquipmentAssignment, type InsertPersonnelEquipmentAssignment,
  type CertificationWorkflow, type InsertCertificationWorkflow,
  type Notification, type InsertNotification,
  type CertificationDocument, type InsertCertificationDocument,
  type WorkflowApproval, type InsertWorkflowApproval,
  type ProjectStage, type InsertProjectStage,
  type ChecklistTemplateItem, type InsertChecklistTemplateItem,
  type ProjectChecklist, type InsertProjectChecklist,
  type ChecklistItem, type InsertChecklistItem,
  type StageApproval, type InsertStageApproval,
  type AuditLog, type InsertAuditLog
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// Equipment type definition for initial data
interface EquipmentType {
  id: string;
  name: string;
  category: string;
  dailyChecklistTemplate: any;
  maintenanceSchedule: any;
  createdAt: Date;
}

// Project type definition for initial data
interface ProjectType {
  id: string;
  name: string;
  description: string | null;
  stages: any;
  materialsTemplate: any;
  createdAt: Date;
}

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;

  // Project management
  getProject(id: string): Promise<Project | undefined>;
  listProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Project types
  listProjectTypes(): Promise<ProjectType[]>;
  getProjectType(id: string): Promise<ProjectType | undefined>;

  // Equipment management
  getEquipment(id: string): Promise<Equipment | undefined>;
  listEquipment(): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment | undefined>;
  getEquipmentByLocation(location: string): Promise<Equipment[]>;
  
  // Equipment types
  listEquipmentTypes(): Promise<EquipmentType[]>;
  getEquipmentType(id: string): Promise<EquipmentType | undefined>;

  // Equipment assignments
  getEquipmentAssignment(id: string): Promise<EquipmentAssignment | undefined>;
  listEquipmentAssignments(projectId?: string, equipmentId?: string): Promise<EquipmentAssignment[]>;
  createEquipmentAssignment(assignment: InsertEquipmentAssignment): Promise<EquipmentAssignment>;
  updateEquipmentAssignment(id: string, updates: Partial<EquipmentAssignment>): Promise<EquipmentAssignment | undefined>;

  // Maintenance logs
  getMaintenanceLog(id: string): Promise<MaintenanceLog | undefined>;
  listMaintenanceLogs(equipmentId?: string, date?: Date): Promise<MaintenanceLog[]>;
  createMaintenanceLog(log: InsertMaintenanceLog): Promise<MaintenanceLog>;
  updateMaintenanceLog(id: string, updates: Partial<MaintenanceLog>): Promise<MaintenanceLog | undefined>;

  // Safety forms
  getSafetyForm(id: string): Promise<SafetyForm | undefined>;
  listSafetyForms(projectId?: string, type?: string): Promise<SafetyForm[]>;
  createSafetyForm(form: InsertSafetyForm): Promise<SafetyForm>;
  updateSafetyForm(id: string, updates: Partial<SafetyForm>): Promise<SafetyForm | undefined>;

  // Inventory locations
  getInventoryLocation(id: string): Promise<InventoryLocation | undefined>;
  listInventoryLocations(): Promise<InventoryLocation[]>;
  createInventoryLocation(location: InsertInventoryLocation): Promise<InventoryLocation>;

  // Inventory items
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  listInventoryItems(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;

  // Inventory stock
  getInventoryStock(id: string): Promise<InventoryStock | undefined>;
  listInventoryStock(locationId?: string, itemId?: string): Promise<InventoryStock[]>;
  createInventoryStock(stock: InsertInventoryStock): Promise<InventoryStock>;
  updateInventoryStock(id: string, updates: Partial<InventoryStock>): Promise<InventoryStock | undefined>;

  // Project materials
  getProjectMaterial(id: string): Promise<ProjectMaterial | undefined>;
  listProjectMaterials(projectId?: string): Promise<ProjectMaterial[]>;
  createProjectMaterial(material: InsertProjectMaterial): Promise<ProjectMaterial>;
  updateProjectMaterial(id: string, updates: Partial<ProjectMaterial>): Promise<ProjectMaterial | undefined>;

  // Photos
  getPhoto(id: string): Promise<Photo | undefined>;
  listPhotos(relatedId?: string, relatedType?: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;

  // Certifications
  getCertification(id: string): Promise<Certification | undefined>;
  listCertifications(userId?: string, type?: string): Promise<Certification[]>;
  createCertification(cert: InsertCertification): Promise<Certification>;
  updateCertification(id: string, updates: Partial<Certification>): Promise<Certification | undefined>;
  getCertificationsExpiringSoon(days?: number): Promise<Certification[]>;
  
  // Medical Clearances
  getMedicalClearance(id: string): Promise<MedicalClearance | undefined>;
  listMedicalClearances(userId?: string, type?: string): Promise<MedicalClearance[]>;
  createMedicalClearance(clearance: InsertMedicalClearance): Promise<MedicalClearance>;
  updateMedicalClearance(id: string, updates: Partial<MedicalClearance>): Promise<MedicalClearance | undefined>;
  getMedicalClearancesExpiringSoon(days?: number): Promise<MedicalClearance[]>;

  // Personnel equipment assignments
  listPersonnelEquipmentAssignments(userId?: string): Promise<PersonnelEquipmentAssignment[]>;
  createPersonnelEquipmentAssignment(assignment: InsertPersonnelEquipmentAssignment): Promise<PersonnelEquipmentAssignment>;
  updatePersonnelEquipmentAssignment(id: string, updates: Partial<PersonnelEquipmentAssignment>): Promise<PersonnelEquipmentAssignment | undefined>;
  getActiveEquipmentAssignments(userId: string): Promise<PersonnelEquipmentAssignment[]>;
  
  // Personnel with full data
  getPersonnelWithCertifications(userId: string): Promise<{
    user: User;
    certifications: Certification[];
    medicalClearances: MedicalClearance[];
    equipmentAssignments: PersonnelEquipmentAssignment[];
  } | undefined>;
  listAllPersonnelWithCertifications(): Promise<Array<{
    user: User;
    certifications: Certification[];
    medicalClearances: MedicalClearance[];
    equipmentAssignments: PersonnelEquipmentAssignment[];
  }>>;

  // Checklist templates
  getChecklistTemplate(id: string): Promise<ChecklistTemplate | undefined>;
  listChecklistTemplates(type?: string): Promise<ChecklistTemplate[]>;
  createChecklistTemplate(template: InsertChecklistTemplate): Promise<ChecklistTemplate>;

  // Checklist instances
  getChecklistInstance(id: string): Promise<ChecklistInstance | undefined>;
  listChecklistInstances(relatedId?: string, relatedType?: string): Promise<ChecklistInstance[]>;
  createChecklistInstance(instance: InsertChecklistInstance): Promise<ChecklistInstance>;
  updateChecklistInstance(id: string, updates: Partial<ChecklistInstance>): Promise<ChecklistInstance | undefined>;

  // Certification Workflows
  getCertificationWorkflow(id: string): Promise<CertificationWorkflow | undefined>;
  listCertificationWorkflows(status?: string, assignedTo?: string): Promise<CertificationWorkflow[]>;
  createCertificationWorkflow(workflow: InsertCertificationWorkflow): Promise<CertificationWorkflow>;
  updateCertificationWorkflow(id: string, updates: Partial<CertificationWorkflow>): Promise<CertificationWorkflow | undefined>;
  getWorkflowsByDueDate(dueDate?: Date): Promise<CertificationWorkflow[]>;

  // Notifications
  getNotification(id: string): Promise<Notification | undefined>;
  listNotifications(recipientId?: string, status?: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | undefined>;
  getUnreadNotifications(recipientId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  createAutomatedNotifications(): Promise<Notification[]>; // Auto-generate expiration notifications

  // Document Management
  getCertificationDocument(id: string): Promise<CertificationDocument | undefined>;
  listCertificationDocuments(certificationId?: string, medicalClearanceId?: string): Promise<CertificationDocument[]>;
  createCertificationDocument(document: InsertCertificationDocument): Promise<CertificationDocument>;
  updateCertificationDocument(id: string, updates: Partial<CertificationDocument>): Promise<CertificationDocument | undefined>;
  getDocumentsByVerificationStatus(status: string): Promise<CertificationDocument[]>;

  // Workflow Approvals
  getWorkflowApproval(id: string): Promise<WorkflowApproval | undefined>;
  listWorkflowApprovals(workflowId?: string, approverId?: string): Promise<WorkflowApproval[]>;
  createWorkflowApproval(approval: InsertWorkflowApproval): Promise<WorkflowApproval>;

  // Enhanced Project Management (EPM) - Project Stages
  getProjectStage(id: string): Promise<ProjectStage | undefined>;
  listProjectStages(projectId: string): Promise<ProjectStage[]>;
  createProjectStage(stage: InsertProjectStage): Promise<ProjectStage>;
  updateProjectStage(id: string, updates: Partial<ProjectStage>): Promise<ProjectStage | undefined>;

  // EPM - Checklist Template Items
  getChecklistTemplateItem(id: string): Promise<ChecklistTemplateItem | undefined>;
  listChecklistTemplateItems(templateId: string): Promise<ChecklistTemplateItem[]>;
  createChecklistTemplateItem(item: InsertChecklistTemplateItem): Promise<ChecklistTemplateItem>;
  updateChecklistTemplateItem(id: string, updates: Partial<ChecklistTemplateItem>): Promise<ChecklistTemplateItem | undefined>;

  // EPM - Project Checklists
  getProjectChecklist(id: string): Promise<ProjectChecklist | undefined>;
  listProjectChecklists(projectId?: string): Promise<ProjectChecklist[]>;
  listProjectChecklistsByStage(stageId: string): Promise<ProjectChecklist[]>;
  createProjectChecklist(checklist: InsertProjectChecklist): Promise<ProjectChecklist>;
  updateProjectChecklist(id: string, updates: Partial<ProjectChecklist>): Promise<ProjectChecklist | undefined>;

  // EPM - Checklist Items
  getChecklistItem(id: string): Promise<ChecklistItem | undefined>;
  listChecklistItems(checklistId: string): Promise<ChecklistItem[]>;
  createChecklistItem(item: InsertChecklistItem): Promise<ChecklistItem>;
  updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | undefined>;

  // EPM - Stage Approvals
  getStageApproval(id: string): Promise<StageApproval | undefined>;
  listStageApprovals(projectId: string, stageId: string): Promise<StageApproval[]>;
  createStageApproval(approval: InsertStageApproval): Promise<StageApproval>;
  updateStageApproval(id: string, updates: Partial<StageApproval>): Promise<StageApproval | undefined>;

  // EPM - Audit Logs
  getAuditLog(id: string): Promise<AuditLog | undefined>;
  listAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private equipment: Map<string, Equipment>;
  private maintenanceLogs: Map<string, MaintenanceLog>;
  private safetyForms: Map<string, SafetyForm>;
  private projectTypes: Map<string, ProjectType>;
  private equipmentTypes: Map<string, EquipmentType>;
  private equipmentAssignments: Map<string, EquipmentAssignment>;
  private inventoryLocations: Map<string, InventoryLocation>;
  private inventoryItems: Map<string, InventoryItem>;
  private inventoryStock: Map<string, InventoryStock>;
  private projectMaterials: Map<string, ProjectMaterial>;
  private photos: Map<string, Photo>;
  private certifications: Map<string, Certification>;
  private medicalClearances: Map<string, MedicalClearance>;
  private personnelEquipmentAssignments: Map<string, PersonnelEquipmentAssignment>;
  private checklistTemplates: Map<string, ChecklistTemplate>;
  private checklistInstances: Map<string, ChecklistInstance>;
  private certificationWorkflows: Map<string, CertificationWorkflow>;
  private notifications: Map<string, Notification>;
  private certificationDocuments: Map<string, CertificationDocument>;
  private workflowApprovals: Map<string, WorkflowApproval>;
  
  // EPM data stores
  private projectStages: Map<string, ProjectStage>;
  private checklistTemplateItems: Map<string, ChecklistTemplateItem>;
  private projectChecklists: Map<string, ProjectChecklist>;
  private checklistItems: Map<string, ChecklistItem>;
  private stageApprovals: Map<string, StageApproval>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.equipment = new Map();
    this.maintenanceLogs = new Map();
    this.safetyForms = new Map();
    this.projectTypes = new Map();
    this.equipmentTypes = new Map();
    this.equipmentAssignments = new Map();
    this.inventoryLocations = new Map();
    this.inventoryItems = new Map();
    this.inventoryStock = new Map();
    this.projectMaterials = new Map();
    this.photos = new Map();
    this.certifications = new Map();
    this.medicalClearances = new Map();
    this.personnelEquipmentAssignments = new Map();
    this.checklistTemplates = new Map();
    this.checklistInstances = new Map();
    this.certificationWorkflows = new Map();
    this.notifications = new Map();
    this.certificationDocuments = new Map();
    this.workflowApprovals = new Map();
    
    // Initialize EPM data stores
    this.projectStages = new Map();
    this.checklistTemplateItems = new Map();
    this.projectChecklists = new Map();
    this.checklistItems = new Map();
    this.stageApprovals = new Map();
    this.auditLogs = new Map();
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize project types based on your documents
    const projectTypes: ProjectType[] = [
      {
        id: "hull-blast-coat",
        name: "Hull Blast & Coat",
        description: "Marine hull surface preparation and coating",
        stages: [
          { id: "protection", name: "Protection", requirements: ["Setup containment", "PPE verification"] },
          { id: "blasting", name: "Blasting", requirements: ["Surface preparation", "Abrasive application"] },
          { id: "painting", name: "Painting", requirements: ["Coating application", "Quality control"] },
          { id: "cleaning", name: "Cleaning", requirements: ["Area cleanup", "Equipment cleaning"] }
        ],
        materialsTemplate: {
          ppe: ["Trajes A40", "Guantes latex", "Filtro de polvo"],
          equipment: ["Compresor", "Mangueras Amarillas 2\"", "POT", "Deadman switch"],
          consumables: ["Abrasivo", "Pintura", "Trapos", "MEK"]
        },
        createdAt: new Date()
      },
      {
        id: "tank-blast-line",
        name: "Tank Blast & Line",
        description: "Tank interior blasting and lining",
        stages: [
          { id: "preparation", name: "Preparation", requirements: ["Confined space entry", "Ventilation setup"] },
          { id: "blasting", name: "Blasting", requirements: ["Interior surface preparation"] },
          { id: "coating", name: "Coating", requirements: ["Interior coating application"] },
          { id: "inspection", name: "Inspection", requirements: ["Quality verification", "Documentation"] }
        ],
        materialsTemplate: {
          ppe: ["Traje de Blasting", "Monkey Mask", "Guantes de nitrilo"],
          equipment: ["Extractor de Polvo", "BRS", "Turbina de pintar"],
          consumables: ["Abrasivo", "Pintura", "Filtros", "Alcohol Desnaturalizado"]
        },
        createdAt: new Date()
      }
    ];

    // Initialize equipment types based on your maintenance documents
    const equipmentTypes: EquipmentType[] = [
      {
        id: "compressor-900",
        name: "Compressor 900",
        category: "compressor",
        dailyChecklistTemplate: [
          { id: "oil-level", text: "Check engine oil level", type: "boolean", photoRequired: false },
          { id: "compressor-oil", text: "Check compressor oil level", type: "boolean", photoRequired: false },
          { id: "coolant-level", text: "Check coolant level", type: "boolean", photoRequired: false },
          { id: "leaks-check", text: "Check for oil or coolant leaks", type: "boolean", photoRequired: true },
          { id: "general-inspection", text: "General inspection (damage, scrapes, tires)", type: "boolean", photoRequired: true }
        ],
        maintenanceSchedule: {
          intervals: [
            { type: "hours", value: 500, tasks: ["Change compressor oil", "Clean air filter", "Grease wheel bearings"] },
            { type: "hours", value: 1000, tasks: ["Replace fuel filters", "Check belt tension"] }
          ]
        },
        createdAt: new Date()
      },
      {
        id: "blast-pot",
        name: "Blast Pot",
        category: "blasting",
        dailyChecklistTemplate: [
          { id: "depressurized", text: "Ensure pot is fully depressurized", type: "boolean", photoRequired: false },
          { id: "damage-inspection", text: "Perform general inspection for damage", type: "boolean", photoRequired: true },
          { id: "moisture-drain", text: "Drain moisture from separator", type: "boolean", photoRequired: false }
        ],
        maintenanceSchedule: {
          intervals: [
            { type: "months", value: 6, tasks: ["Inspect pressure vessel", "Clean metering valve", "Test deadman system"] }
          ]
        },
        createdAt: new Date()
      },
      {
        id: "co-detector",
        name: "Carbon Monoxide Detector",
        category: "safety",
        dailyChecklistTemplate: [
          { id: "power-check", text: "Verify detector is powered and lights functional", type: "boolean", photoRequired: false }
        ],
        maintenanceSchedule: {
          intervals: [
            { type: "months", value: 1, tasks: ["Perform calibration", "Replace batteries if needed", "Test alarms"] }
          ]
        },
        createdAt: new Date()
      }
    ];

    projectTypes.forEach(pt => this.projectTypes.set(pt.id, pt));
    equipmentTypes.forEach(et => this.equipmentTypes.set(et.id, et));
    
    this.initializePersonnelData();
  }

  private initializePersonnelData() {
    // Sample personnel data - using pre-computed password hashes to avoid async race
    const sampleUsers = [
      {
        id: "emp-001",
        username: "mike.rodriguez",
        password: "$2b$10$K8Q1V9J5F9xV9h8Q1V9J5F9xV9h8Q1V9J5F9xV9h8Q1V9J5F9xV9h", // "password123"
        firstName: "Mike",
        lastName: "Rodriguez",
        email: "mike.rodriguez@atlasmarinegroup.com",
        phone: "(555) 123-4567",
        position: "Lead Blast Technician",
        department: "operations",
        role: "worker",
        crew: "Blast Team Alpha",
        hireDate: new Date("2022-03-15"),
        emergencyContact: {
          name: "Maria Rodriguez",
          relationship: "Spouse",
          phone: "(555) 987-6543"
        },
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "emp-002",
        username: "sarah.chen",
        password: "$2b$10$K8Q1V9J5F9xV9h8Q1V9J5F9xV9h8Q1V9J5F9xV9h8Q1V9J5F9xV9h", // "password123"
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah.chen@atlasmarinegroup.com",
        phone: "(555) 234-5678",
        position: "Safety Officer",
        department: "safety",
        role: "supervisor",
        crew: null,
        hireDate: new Date("2021-11-08"),
        emergencyContact: {
          name: "David Chen",
          relationship: "Brother",
          phone: "(555) 876-5432"
        },
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "emp-003",
        username: "carlos.torres",
        password: "$2b$10$K8Q1V9J5F9xV9h8Q1V9J5F9xV9h8Q1V9J5F9xV9h8Q1V9J5F9xV9h", // "password123"
        firstName: "Carlos",
        lastName: "Torres",
        email: "carlos.torres@atlasmarinegroup.com",
        phone: "(555) 345-6789",
        position: "Equipment Operator",
        department: "operations",
        role: "worker",
        crew: "Maintenance Team",
        hireDate: new Date("2023-07-20"),
        emergencyContact: {
          name: "Isabella Torres",
          relationship: "Spouse",
          phone: "(555) 765-4321"
        },
        isActive: true,
        createdAt: new Date()
      }
    ];

    // Sample certifications
    const sampleCertifications = [
      {
        id: "cert-001",
        userId: "emp-001",
        type: "safety",
        name: "Confined Space Entry",
        issuingOrganization: "OSHA",
        certificateNumber: "CSE-2024-001",
        issueDate: new Date("2024-01-15"),
        expirationDate: new Date("2025-01-15"),
        documentUrl: null,
        renewalRequired: false,
        status: "active",
        notes: null,
        createdAt: new Date()
      },
      {
        id: "cert-002", 
        userId: "emp-001",
        type: "technical",
        name: "Abrasive Blasting Certification",
        issuingOrganization: "NACE International",
        certificateNumber: "ABC-2023-789",
        issueDate: new Date("2023-06-20"),
        expirationDate: new Date("2024-06-20"),
        documentUrl: null,
        renewalRequired: true,
        status: "expired",
        notes: "Renewal required immediately",
        createdAt: new Date()
      },
      {
        id: "cert-003",
        userId: "emp-002",
        type: "safety",
        name: "OSHA 30-Hour Construction",
        issuingOrganization: "OSHA",
        certificateNumber: "OSHA30-2023-456",
        issueDate: new Date("2023-09-12"),
        expirationDate: new Date("2026-09-12"),
        documentUrl: null,
        renewalRequired: false,
        status: "active",
        notes: null,
        createdAt: new Date()
      },
      {
        id: "cert-004",
        userId: "emp-002",
        type: "regulatory",
        name: "Hazmat Transportation",
        issuingOrganization: "DOT",
        certificateNumber: "HMT-2024-123",
        issueDate: new Date("2024-02-28"),
        expirationDate: new Date("2024-04-15"),
        documentUrl: null,
        renewalRequired: true,
        status: "expired",
        notes: "Expiring soon - renewal scheduled",
        createdAt: new Date()
      },
      {
        id: "cert-005",
        userId: "emp-003",
        type: "technical",
        name: "Crane Operator License",
        issuingOrganization: "NCCCO",
        certificateNumber: "COL-2023-987",
        issueDate: new Date("2023-08-15"),
        expirationDate: new Date("2025-08-15"),
        documentUrl: null,
        renewalRequired: false,
        status: "active",
        notes: null,
        createdAt: new Date()
      }
    ];

    // Sample medical clearances
    const sampleMedicalClearances = [
      {
        id: "med-001",
        userId: "emp-001",
        type: "respiratory",
        description: "Respirator Fit Test - Full Face",
        provider: "OccuHealth Medical",
        testDate: new Date("2024-02-10"),
        expirationDate: new Date("2025-02-10"),
        result: "cleared",
        restrictions: null,
        documentUrl: null,
        nextReminderDate: new Date("2024-12-10"),
        notes: null,
        createdAt: new Date()
      },
      {
        id: "med-002",
        userId: "emp-001",
        type: "physical",
        description: "Annual Physical Examination",
        provider: "Atlantic Medical Center",
        testDate: new Date("2024-01-08"),
        expirationDate: new Date("2025-01-08"), 
        result: "cleared",
        restrictions: null,
        documentUrl: null,
        nextReminderDate: new Date("2024-11-08"),
        notes: null,
        createdAt: new Date()
      },
      {
        id: "med-003",
        userId: "emp-002",
        type: "vision",
        description: "Vision Screening - Safety Glasses",
        provider: "VisionCare Associates",
        testDate: new Date("2024-01-22"),
        expirationDate: new Date("2025-01-22"),
        result: "cleared",
        restrictions: null,
        documentUrl: null,
        nextReminderDate: new Date("2024-11-22"),
        notes: null,
        createdAt: new Date()
      },
      {
        id: "med-004",
        userId: "emp-003",
        type: "physical",
        description: "DOT Physical Examination",
        provider: "Maritime Health Services",
        testDate: new Date("2023-12-05"),
        expirationDate: new Date("2024-04-10"), 
        result: "cleared",
        restrictions: null,
        documentUrl: null,
        nextReminderDate: new Date("2024-02-10"),
        notes: "Expiring soon",
        createdAt: new Date()
      }
    ];

    // Sample personnel equipment assignments
    const samplePersonnelEquipmentAssignments = [
      {
        id: "assign-001",
        userId: "emp-001",
        equipmentId: "eq-blast-pot-001",
        projectId: "proj-vessel-alpha",
        assignedDate: new Date("2024-09-15"),
        returnedDate: null,
        assignedBy: "emp-002",
        purpose: "project_work",
        status: "active",
        notes: "Assigned for hull blasting operations"
      },
      {
        id: "assign-002", 
        userId: "emp-001",
        equipmentId: "eq-compressor-900",
        projectId: "proj-vessel-alpha",
        assignedDate: new Date("2024-09-15"),
        returnedDate: null,
        assignedBy: "emp-002",
        purpose: "project_work", 
        status: "active",
        notes: "Primary compressor for blast operations"
      },
      {
        id: "assign-003",
        userId: "emp-002",
        equipmentId: "eq-safety-monitor",
        projectId: null,
        assignedDate: new Date("2024-09-01"),
        returnedDate: null,
        assignedBy: "supervisor-001",
        purpose: "safety_monitoring",
        status: "active",
        notes: "Permanent assignment for safety oversight"
      },
      {
        id: "assign-004",
        userId: "emp-003",
        equipmentId: "eq-crane-mobile",
        projectId: "proj-maintenance-dock",
        assignedDate: new Date("2024-09-16"),
        returnedDate: null,
        assignedBy: "emp-002",
        purpose: "project_work",
        status: "active",
        notes: "Equipment lifting and positioning"
      },
      {
        id: "assign-005",
        userId: "emp-003", 
        equipmentId: "eq-vacuum-system",
        projectId: "proj-maintenance-dock",
        assignedDate: new Date("2024-09-16"),
        returnedDate: null,
        assignedBy: "emp-002",
        purpose: "project_work",
        status: "active",
        notes: "Debris cleanup operations"
      }
    ];

    // Sample certification workflows
    const sampleWorkflows = [
      {
        id: "workflow-001",
        certificationId: "cert-001", // Mike's Confined Space Entry (expires soon)
        workflowType: "renewal",
        status: "pending",
        initiatedBy: "emp-002", // Sarah initiated the renewal
        assignedTo: "emp-001", // Assigned to Mike
        priority: "high",
        dueDate: new Date("2025-01-15"), // Due before expiration
        completedDate: null,
        notes: "Certification expires 1/15/2025. Schedule renewal training ASAP.",
        approvalNotes: null,
        createdAt: new Date("2024-09-10")
      },
      {
        id: "workflow-002", 
        certificationId: "cert-002", // Mike's Abrasive Blasting (expired)
        workflowType: "renewal",
        status: "in_progress",
        initiatedBy: "emp-002",
        assignedTo: "emp-001",
        priority: "urgent",
        dueDate: new Date("2024-09-25"), // Past due
        completedDate: null,
        notes: "EXPIRED certification. Immediate renewal required before return to blast operations.",
        approvalNotes: "Training scheduled for 9/20/2024",
        createdAt: new Date("2024-08-15")
      },
      {
        id: "workflow-003",
        certificationId: "cert-005", // Sarah's Safety Officer cert
        workflowType: "update",
        status: "completed",
        initiatedBy: "emp-002",
        assignedTo: "emp-002",
        priority: "medium",
        dueDate: new Date("2024-09-01"),
        completedDate: new Date("2024-08-28"),
        notes: "Updated safety procedures documentation",
        approvalNotes: "Documentation reviewed and approved by management",
        createdAt: new Date("2024-08-20")
      }
    ];

    // Sample notifications
    const sampleNotifications = [
      {
        id: "notif-001",
        recipientId: "emp-001", // Mike
        type: "certification_expiring",
        title: "Certification Expiring Soon",
        message: "Your Confined Space Entry certification expires on 1/15/2025. Please renew as soon as possible.",
        relatedType: "certification",
        relatedId: "cert-001",
        priority: "high",
        status: "unread",
        scheduledFor: new Date("2024-09-18"),
        readAt: null,
        actionUrl: "/personnel?certId=cert-001",
        metadata: { daysUntilExpiration: 119 },
        createdAt: new Date("2024-09-18")
      },
      {
        id: "notif-002",
        recipientId: "emp-001", // Mike 
        type: "certification_expired",
        title: "URGENT: Certification Expired",
        message: "Your Abrasive Blasting Certification has EXPIRED. You cannot perform blast operations until renewed.",
        relatedType: "certification", 
        relatedId: "cert-002",
        priority: "urgent",
        status: "read",
        scheduledFor: new Date("2024-06-21"),
        readAt: new Date("2024-06-21"),
        actionUrl: "/personnel?certId=cert-002",
        metadata: { daysOverdue: 89 },
        createdAt: new Date("2024-06-21")
      },
      {
        id: "notif-003",
        recipientId: "emp-003", // Carlos
        type: "medical_clearance_expiring",
        title: "Medical Clearance Renewal Due",
        message: "Your DOT Physical clearance expires on 12/1/2024. Please schedule renewal appointment.",
        relatedType: "medical_clearance",
        relatedId: "medical-004",
        priority: "medium",
        status: "unread",
        scheduledFor: new Date("2024-09-18"),
        readAt: null,
        actionUrl: "/personnel?medicalId=medical-004",
        metadata: { daysUntilExpiration: 74 },
        createdAt: new Date("2024-09-18")
      },
      {
        id: "notif-004",
        recipientId: "emp-002", // Sarah (supervisor notification)
        type: "workflow_assigned",
        title: "Workflow Assignment",
        message: "You have been assigned to review Mike Rodriguez's certification renewal workflow.",
        relatedType: "workflow",
        relatedId: "workflow-001",
        priority: "medium",
        status: "unread",
        scheduledFor: new Date("2024-09-10"),
        readAt: null,
        actionUrl: "/workflows?id=workflow-001",
        metadata: { workflowType: "renewal" },
        createdAt: new Date("2024-09-10")
      }
    ];

    // Sample certification documents
    const sampleDocuments = [
      {
        id: "doc-001",
        certificationId: "cert-001", // Mike's Confined Space Entry
        medicalClearanceId: null,
        filename: "confined_space_cert_mike.pdf",
        originalName: "Mike Rodriguez - Confined Space Entry Certificate.pdf",
        mimeType: "application/pdf",
        fileSize: 245760, // 240KB
        documentType: "certificate",
        uploadedBy: "emp-001", // Mike uploaded it
        verificationStatus: "verified",
        verifiedBy: "emp-002", // Sarah verified it
        verifiedAt: new Date("2024-09-15"),
        expirationDate: new Date("2025-01-15"),
        version: 1,
        notes: "Original certificate from OSHA training program",
        createdAt: new Date("2024-09-15")
      },
      {
        id: "doc-002",
        certificationId: null,
        medicalClearanceId: "medical-004", // Carlos's DOT Physical
        filename: "dot_physical_carlos.pdf",
        originalName: "Carlos Torres - DOT Physical Report.pdf",
        mimeType: "application/pdf",
        fileSize: 178432, // 174KB
        documentType: "medical_report",
        uploadedBy: "emp-003", // Carlos uploaded it
        verificationStatus: "pending",
        verifiedBy: null,
        verifiedAt: null,
        expirationDate: new Date("2024-12-01"),
        version: 1,
        notes: "Annual DOT physical examination required for marine operations",
        createdAt: new Date("2024-09-17")
      },
      {
        id: "doc-003",
        certificationId: "cert-002", // Mike's expired Abrasive Blasting cert
        medicalClearanceId: null,
        filename: "abrasive_blasting_renewal_form.pdf",
        originalName: "Abrasive Blasting Renewal Application - Mike Rodriguez.pdf",
        mimeType: "application/pdf",
        fileSize: 156672, // 153KB
        documentType: "renewal_form",
        uploadedBy: "emp-002", // Sarah uploaded renewal form
        verificationStatus: "pending",
        verifiedBy: null,
        verifiedAt: null,
        expirationDate: null, // Renewal forms don't expire
        version: 1,
        notes: "Renewal application submitted for expired certification",
        createdAt: new Date("2024-09-18")
      }
    ];

    // Initialize sample data
    sampleUsers.forEach(user => this.users.set(user.id, user));
    sampleCertifications.forEach(cert => this.certifications.set(cert.id, cert));
    sampleMedicalClearances.forEach(clearance => this.medicalClearances.set(clearance.id, clearance));
    samplePersonnelEquipmentAssignments.forEach(assignment => this.personnelEquipmentAssignments.set(assignment.id, assignment));
    sampleWorkflows.forEach(workflow => this.certificationWorkflows.set(workflow.id, workflow));
    sampleNotifications.forEach(notification => this.notifications.set(notification.id, notification));
    sampleDocuments.forEach(document => this.certificationDocuments.set(document.id, document));
  }

  // User methods  
  async getUser(id: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Return user without password for security
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
    if (!user) return undefined;
    
    // Return user without password for security
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { 
      ...insertUser, 
      id,
      password: hashedPassword,
      role: insertUser.role || "worker",
      email: insertUser.email || null,
      phone: insertUser.phone || null,
      position: insertUser.position || null,
      department: insertUser.department || null,
      crew: insertUser.crew || null,
      hireDate: insertUser.hireDate || null,
      emergencyContact: insertUser.emergencyContact || null,
      isActive: true,
      createdAt: new Date()
    };
    this.users.set(id, user);
    
    // Return user without password for security
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async listProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      status: "pending",
      progress: 0,
      startDate: null,
      endDate: null,
      currentStage: null,
      assignedCrew: insertProject.assignedCrew || null,
      supervisorId: insertProject.supervisorId || null,
      notes: insertProject.notes || null,
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async listProjectTypes(): Promise<ProjectType[]> {
    return Array.from(this.projectTypes.values());
  }

  async getProjectType(id: string): Promise<ProjectType | undefined> {
    return this.projectTypes.get(id);
  }

  // Equipment methods
  async getEquipment(id: string): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async listEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const id = randomUUID();
    const equipment: Equipment = {
      ...insertEquipment,
      id,
      status: "available",
      location: insertEquipment.location || null,
      serialNumber: insertEquipment.serialNumber || null,
      notes: insertEquipment.notes || null,
      lastMaintenanceDate: null,
      nextMaintenanceDate: null,
      hoursUsed: 0,
      mileage: 0,
      createdAt: new Date()
    };
    this.equipment.set(id, equipment);
    return equipment;
  }

  async updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment | undefined> {
    const equipment = this.equipment.get(id);
    if (!equipment) return undefined;
    
    const updatedEquipment = { ...equipment, ...updates };
    this.equipment.set(id, updatedEquipment);
    return updatedEquipment;
  }

  async getEquipmentByLocation(location: string): Promise<Equipment[]> {
    return Array.from(this.equipment.values()).filter(eq => eq.location === location);
  }

  async listEquipmentTypes(): Promise<EquipmentType[]> {
    return Array.from(this.equipmentTypes.values());
  }

  async getEquipmentType(id: string): Promise<EquipmentType | undefined> {
    return this.equipmentTypes.get(id);
  }

  // Maintenance log methods
  async getMaintenanceLog(id: string): Promise<MaintenanceLog | undefined> {
    return this.maintenanceLogs.get(id);
  }

  async listMaintenanceLogs(equipmentId?: string, date?: Date): Promise<MaintenanceLog[]> {
    let logs = Array.from(this.maintenanceLogs.values());
    
    if (equipmentId) {
      logs = logs.filter(log => log.equipmentId === equipmentId);
    }
    
    if (date) {
      const targetDate = date.toDateString();
      logs = logs.filter(log => log.date.toDateString() === targetDate);
    }
    
    return logs;
  }

  async createMaintenanceLog(insertLog: InsertMaintenanceLog): Promise<MaintenanceLog> {
    const id = randomUUID();
    const log: MaintenanceLog = {
      ...insertLog,
      id,
      issues: insertLog.issues || null,
      photosRequired: false,
      photoCount: 0,
      status: "pending",
      createdAt: new Date()
    };
    this.maintenanceLogs.set(id, log);
    return log;
  }

  async updateMaintenanceLog(id: string, updates: Partial<MaintenanceLog>): Promise<MaintenanceLog | undefined> {
    const log = this.maintenanceLogs.get(id);
    if (!log) return undefined;
    
    const updatedLog = { ...log, ...updates };
    this.maintenanceLogs.set(id, updatedLog);
    return updatedLog;
  }

  // Safety form methods
  async getSafetyForm(id: string): Promise<SafetyForm | undefined> {
    return this.safetyForms.get(id);
  }

  async listSafetyForms(projectId?: string, type?: string): Promise<SafetyForm[]> {
    let forms = Array.from(this.safetyForms.values());
    
    if (projectId) {
      forms = forms.filter(form => form.projectId === projectId);
    }
    
    if (type) {
      forms = forms.filter(form => form.type === type);
    }
    
    return forms;
  }

  async createSafetyForm(insertForm: InsertSafetyForm): Promise<SafetyForm> {
    const id = randomUUID();
    const form: SafetyForm = {
      ...insertForm,
      id,
      projectId: insertForm.projectId || null,
      entrants: insertForm.entrants || null,
      status: "draft",
      createdAt: new Date()
    };
    this.safetyForms.set(id, form);
    return form;
  }

  async updateSafetyForm(id: string, updates: Partial<SafetyForm>): Promise<SafetyForm | undefined> {
    const form = this.safetyForms.get(id);
    if (!form) return undefined;
    
    const updatedForm = { ...form, ...updates };
    this.safetyForms.set(id, updatedForm);
    return updatedForm;
  }

  // Equipment assignment methods
  async getEquipmentAssignment(id: string): Promise<EquipmentAssignment | undefined> {
    return this.equipmentAssignments.get(id);
  }

  async listEquipmentAssignments(projectId?: string, equipmentId?: string): Promise<EquipmentAssignment[]> {
    let assignments = Array.from(this.equipmentAssignments.values());
    
    if (projectId) {
      assignments = assignments.filter(a => a.projectId === projectId);
    }
    
    if (equipmentId) {
      assignments = assignments.filter(a => a.equipmentId === equipmentId);
    }
    
    return assignments;
  }

  async createEquipmentAssignment(insertAssignment: InsertEquipmentAssignment): Promise<EquipmentAssignment> {
    const id = randomUUID();
    const assignment: EquipmentAssignment = {
      ...insertAssignment,
      id,
      assignedDate: insertAssignment.assignedDate || new Date(),
      returnedDate: null
    };
    this.equipmentAssignments.set(id, assignment);
    return assignment;
  }

  async updateEquipmentAssignment(id: string, updates: Partial<EquipmentAssignment>): Promise<EquipmentAssignment | undefined> {
    const assignment = this.equipmentAssignments.get(id);
    if (!assignment) return undefined;
    
    const updatedAssignment = { ...assignment, ...updates };
    this.equipmentAssignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  // Inventory location methods
  async getInventoryLocation(id: string): Promise<InventoryLocation | undefined> {
    return this.inventoryLocations.get(id);
  }

  async listInventoryLocations(): Promise<InventoryLocation[]> {
    return Array.from(this.inventoryLocations.values());
  }

  async createInventoryLocation(insertLocation: InsertInventoryLocation): Promise<InventoryLocation> {
    const id = randomUUID();
    const location: InventoryLocation = {
      ...insertLocation,
      id,
      description: insertLocation.description || null,
      createdAt: new Date()
    };
    this.inventoryLocations.set(id, location);
    return location;
  }

  // Inventory item methods
  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async listInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const item: InventoryItem = {
      ...insertItem,
      id,
      sku: insertItem.sku || null,
      description: insertItem.description || null,
      createdAt: new Date()
    };
    this.inventoryItems.set(id, item);
    return item;
  }

  // Inventory stock methods
  async getInventoryStock(id: string): Promise<InventoryStock | undefined> {
    return this.inventoryStock.get(id);
  }

  async listInventoryStock(locationId?: string, itemId?: string): Promise<InventoryStock[]> {
    let stock = Array.from(this.inventoryStock.values());
    
    if (locationId) {
      stock = stock.filter(s => s.locationId === locationId);
    }
    
    if (itemId) {
      stock = stock.filter(s => s.itemId === itemId);
    }
    
    return stock;
  }

  async createInventoryStock(insertStock: InsertInventoryStock): Promise<InventoryStock> {
    const id = randomUUID();
    const stock: InventoryStock = {
      ...insertStock,
      id,
      quantity: insertStock.quantity || 0,
      minQuantity: insertStock.minQuantity || null,
      lastUpdated: new Date()
    };
    this.inventoryStock.set(id, stock);
    return stock;
  }

  async updateInventoryStock(id: string, updates: Partial<InventoryStock>): Promise<InventoryStock | undefined> {
    const stock = this.inventoryStock.get(id);
    if (!stock) return undefined;
    
    const updatedStock = { ...stock, ...updates, lastUpdated: new Date() };
    this.inventoryStock.set(id, updatedStock);
    return updatedStock;
  }

  // Photo methods  
  async getPhoto(id: string): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async listPhotos(relatedId?: string, relatedType?: string): Promise<Photo[]> {
    let photos = Array.from(this.photos.values());
    
    if (relatedId) {
      photos = photos.filter(p => p.relatedId === relatedId);
    }
    
    if (relatedType) {
      photos = photos.filter(p => p.relatedType === relatedType);
    }
    
    return photos;
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = {
      ...insertPhoto,
      id,
      originalName: insertPhoto.originalName || null,
      description: insertPhoto.description || null,
      takenAt: insertPhoto.takenAt || new Date()
    };
    this.photos.set(id, photo);
    return photo;
  }

  // Placeholder implementations for remaining methods (to be implemented as needed)
  async getProjectMaterial(id: string): Promise<ProjectMaterial | undefined> {
    return this.projectMaterials.get(id);
  }

  async listProjectMaterials(projectId?: string): Promise<ProjectMaterial[]> {
    let materials = Array.from(this.projectMaterials.values());
    if (projectId) {
      materials = materials.filter(m => m.projectId === projectId);
    }
    return materials;
  }

  async createProjectMaterial(material: InsertProjectMaterial): Promise<ProjectMaterial> {
    const id = randomUUID();
    const projectMaterial: ProjectMaterial = { 
      ...material, 
      id,
      status: material.status || "pending",
      notes: material.notes || null,
      loadedQuantity: material.loadedQuantity || null,
      usedQuantity: material.usedQuantity || null
    };
    this.projectMaterials.set(id, projectMaterial);
    return projectMaterial;
  }

  async updateProjectMaterial(id: string, updates: Partial<ProjectMaterial>): Promise<ProjectMaterial | undefined> {
    const material = this.projectMaterials.get(id);
    if (!material) return undefined;
    const updatedMaterial = { ...material, ...updates };
    this.projectMaterials.set(id, updatedMaterial);
    return updatedMaterial;
  }

  // Certification methods
  async getCertification(id: string): Promise<Certification | undefined> {
    return this.certifications.get(id);
  }

  async listCertifications(userId?: string, type?: string): Promise<Certification[]> {
    let certs = Array.from(this.certifications.values());
    
    if (userId) {
      certs = certs.filter(c => c.userId === userId);
    }
    
    if (type) {
      certs = certs.filter(c => c.type === type);
    }
    
    return certs;
  }

  async createCertification(cert: InsertCertification): Promise<Certification> {
    const id = randomUUID();
    const certification: Certification = { 
      ...cert, 
      id, 
      certificateNumber: cert.certificateNumber || null,
      issueDate: cert.issueDate || null,
      expirationDate: cert.expirationDate || null,
      documentUrl: cert.documentUrl || null,
      status: cert.status || "active",
      renewalRequired: cert.renewalRequired || false,
      notes: cert.notes || null,
      createdAt: new Date() 
    };
    this.certifications.set(id, certification);
    return certification;
  }

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification | undefined> {
    const cert = this.certifications.get(id);
    if (!cert) return undefined;
    const updated = { ...cert, ...updates };
    this.certifications.set(id, updated);
    return updated;
  }

  async getCertificationsExpiringSoon(days: number = 30): Promise<Certification[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return Array.from(this.certifications.values()).filter(cert => {
      if (!cert.expirationDate) return false;
      return cert.expirationDate <= cutoffDate && cert.expirationDate >= new Date();
    });
  }

  // Medical clearance methods
  async getMedicalClearance(id: string): Promise<MedicalClearance | undefined> {
    return this.medicalClearances.get(id);
  }

  async listMedicalClearances(userId?: string, type?: string): Promise<MedicalClearance[]> {
    let clearances = Array.from(this.medicalClearances.values());
    
    if (userId) {
      clearances = clearances.filter(c => c.userId === userId);
    }
    
    if (type) {
      clearances = clearances.filter(c => c.type === type);
    }
    
    return clearances;
  }

  async createMedicalClearance(clearance: InsertMedicalClearance): Promise<MedicalClearance> {
    const id = randomUUID();
    const medicalClearance: MedicalClearance = { 
      ...clearance, 
      id,
      expirationDate: clearance.expirationDate || null,
      restrictions: clearance.restrictions || null,
      documentUrl: clearance.documentUrl || null,
      nextReminderDate: clearance.nextReminderDate || null,
      notes: clearance.notes || null,
      createdAt: new Date() 
    };
    this.medicalClearances.set(id, medicalClearance);
    return medicalClearance;
  }

  async updateMedicalClearance(id: string, updates: Partial<MedicalClearance>): Promise<MedicalClearance | undefined> {
    const clearance = this.medicalClearances.get(id);
    if (!clearance) return undefined;
    const updated = { ...clearance, ...updates };
    this.medicalClearances.set(id, updated);
    return updated;
  }

  async getMedicalClearancesExpiringSoon(days: number = 30): Promise<MedicalClearance[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return Array.from(this.medicalClearances.values()).filter(clearance => {
      if (!clearance.expirationDate) return false;
      return clearance.expirationDate <= cutoffDate && clearance.expirationDate >= new Date();
    });
  }

  // Personnel equipment assignments methods
  async listPersonnelEquipmentAssignments(userId?: string): Promise<PersonnelEquipmentAssignment[]> {
    const assignments = Array.from(this.personnelEquipmentAssignments.values());
    if (userId) {
      return assignments.filter(assignment => assignment.userId === userId);
    }
    return assignments;
  }

  async createPersonnelEquipmentAssignment(assignmentData: InsertPersonnelEquipmentAssignment): Promise<PersonnelEquipmentAssignment> {
    const id = randomUUID();
    const assignment: PersonnelEquipmentAssignment = {
      ...assignmentData,
      id,
      assignedDate: assignmentData.assignedDate || new Date(),
      returnedDate: assignmentData.returnedDate || null,
      projectId: assignmentData.projectId || null,
      purpose: assignmentData.purpose || null,
      status: assignmentData.status || "active",
      notes: assignmentData.notes || null
    };
    this.personnelEquipmentAssignments.set(id, assignment);
    return assignment;
  }

  async updatePersonnelEquipmentAssignment(id: string, updates: Partial<PersonnelEquipmentAssignment>): Promise<PersonnelEquipmentAssignment | undefined> {
    const assignment = this.personnelEquipmentAssignments.get(id);
    if (!assignment) return undefined;
    
    const updatedAssignment = { ...assignment, ...updates };
    this.personnelEquipmentAssignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  async getActiveEquipmentAssignments(userId: string): Promise<PersonnelEquipmentAssignment[]> {
    return Array.from(this.personnelEquipmentAssignments.values()).filter(
      assignment => assignment.userId === userId && assignment.status === "active"
    );
  }

  // Combined personnel methods
  async getPersonnelWithCertifications(userId: string): Promise<{
    user: User;
    certifications: Certification[];
    medicalClearances: MedicalClearance[];
    equipmentAssignments: PersonnelEquipmentAssignment[];
  } | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const certifications = await this.listCertifications(userId);
    const medicalClearances = await this.listMedicalClearances(userId);
    const equipmentAssignments = await this.getActiveEquipmentAssignments(userId);
    
    return { user, certifications, medicalClearances, equipmentAssignments };
  }

  async listAllPersonnelWithCertifications(): Promise<Array<{
    user: User;
    certifications: Certification[];
    medicalClearances: MedicalClearance[];
    equipmentAssignments: PersonnelEquipmentAssignment[];
  }>> {
    const users = await this.listUsers();
    const result = [];
    
    for (const user of users) {
      const certifications = await this.listCertifications(user.id);
      const medicalClearances = await this.listMedicalClearances(user.id);
      const equipmentAssignments = await this.getActiveEquipmentAssignments(user.id);
      result.push({ user, certifications, medicalClearances, equipmentAssignments });
    }
    
    return result;
  }

  async getChecklistTemplate(id: string): Promise<ChecklistTemplate | undefined> {
    return this.checklistTemplates.get(id);
  }

  async listChecklistTemplates(type?: string): Promise<ChecklistTemplate[]> {
    return Array.from(this.checklistTemplates.values());
  }

  async createChecklistTemplate(template: InsertChecklistTemplate): Promise<ChecklistTemplate> {
    const id = randomUUID();
    const checklistTemplate: ChecklistTemplate = { 
      ...template, 
      id, 
      targetType: template.targetType || null,
      targetId: template.targetId || null,
      version: template.version || 1,
      isActive: template.isActive !== undefined ? template.isActive : true,
      createdAt: new Date() 
    };
    this.checklistTemplates.set(id, checklistTemplate);
    return checklistTemplate;
  }

  async getChecklistInstance(id: string): Promise<ChecklistInstance | undefined> {
    return this.checklistInstances.get(id);
  }

  async listChecklistInstances(relatedId?: string, relatedType?: string): Promise<ChecklistInstance[]> {
    return Array.from(this.checklistInstances.values());
  }

  async createChecklistInstance(instance: InsertChecklistInstance): Promise<ChecklistInstance> {
    const id = randomUUID();
    const checklistInstance: ChecklistInstance = { 
      ...instance, 
      id, 
      completedBy: instance.completedBy || null,
      completedData: instance.completedData || null,
      status: instance.status || "pending",
      photoCount: instance.photoCount || null,
      requiredPhotos: instance.requiredPhotos || null,
      createdAt: new Date() 
    };
    this.checklistInstances.set(id, checklistInstance);
    return checklistInstance;
  }

  async updateChecklistInstance(id: string, updates: Partial<ChecklistInstance>): Promise<ChecklistInstance | undefined> {
    const instance = this.checklistInstances.get(id);
    if (!instance) return undefined;
    const updated = { ...instance, ...updates };
    this.checklistInstances.set(id, updated);
    return updated;
  }

  // Certification Workflows
  async getCertificationWorkflow(id: string): Promise<CertificationWorkflow | undefined> {
    return this.certificationWorkflows.get(id);
  }

  async listCertificationWorkflows(status?: string, assignedTo?: string): Promise<CertificationWorkflow[]> {
    let workflows = Array.from(this.certificationWorkflows.values());
    
    if (status) {
      workflows = workflows.filter(w => w.status === status);
    }
    
    if (assignedTo) {
      workflows = workflows.filter(w => w.assignedTo === assignedTo);
    }
    
    return workflows;
  }

  async createCertificationWorkflow(workflow: InsertCertificationWorkflow): Promise<CertificationWorkflow> {
    const id = randomUUID();
    const certificationWorkflow: CertificationWorkflow = { 
      ...workflow, 
      id, 
      status: workflow.status || "pending",
      priority: workflow.priority || "medium",
      assignedTo: workflow.assignedTo || null,
      dueDate: workflow.dueDate || null,
      completedDate: workflow.completedDate || null,
      notes: workflow.notes || null,
      approvalNotes: workflow.approvalNotes || null,
      createdAt: new Date() 
    };
    this.certificationWorkflows.set(id, certificationWorkflow);
    return certificationWorkflow;
  }

  async updateCertificationWorkflow(id: string, updates: Partial<CertificationWorkflow>): Promise<CertificationWorkflow | undefined> {
    const workflow = this.certificationWorkflows.get(id);
    if (!workflow) return undefined;
    const updated = { ...workflow, ...updates };
    this.certificationWorkflows.set(id, updated);
    return updated;
  }

  async getWorkflowsByDueDate(dueDate?: Date): Promise<CertificationWorkflow[]> {
    const cutoffDate = dueDate || new Date();
    
    return Array.from(this.certificationWorkflows.values()).filter(workflow => {
      if (!workflow.dueDate) return false;
      return workflow.dueDate <= cutoffDate && workflow.status !== "completed";
    });
  }

  // Notifications
  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async listNotifications(recipientId?: string, status?: string): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values());
    
    if (recipientId) {
      notifications = notifications.filter(n => n.recipientId === recipientId);
    }
    
    if (status) {
      notifications = notifications.filter(n => n.status === status);
    }
    
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const newNotification: Notification = { 
      ...notification, 
      id, 
      priority: notification.priority || "medium",
      status: notification.status || "unread",
      relatedType: notification.relatedType || null,
      relatedId: notification.relatedId || null,
      actionUrl: notification.actionUrl || null,
      metadata: notification.metadata || null,
      scheduledFor: notification.scheduledFor || new Date(),
      readAt: notification.readAt || null,
      createdAt: new Date() 
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    const updated = { ...notification, ...updates };
    this.notifications.set(id, updated);
    return updated;
  }

  async getUnreadNotifications(recipientId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.recipientId === recipientId && n.status === "unread")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    const updated = { ...notification, status: "read", readAt: new Date() };
    this.notifications.set(id, updated);
    return updated;
  }

  async createAutomatedNotifications(): Promise<Notification[]> {
    const notifications: Notification[] = [];
    
    // Get certifications expiring soon
    const expiringCerts = await this.getCertificationsExpiringSoon(30);
    for (const cert of expiringCerts) {
      // Check if notification already exists to avoid duplicates
      const existingNotification = Array.from(this.notifications.values()).find(
        n => n.relatedType === "certification" && 
             n.relatedId === cert.id && 
             n.type === "certification_expiring" &&
             n.recipientId === cert.userId
      );
      
      if (!existingNotification) {
        const notification = await this.createNotification({
          recipientId: cert.userId,
          type: "certification_expiring",
          title: "Certification Expiring Soon",
          message: `Your ${cert.name} certification expires on ${cert.expirationDate?.toLocaleDateString()}. Please renew as soon as possible.`,
          relatedType: "certification",
          relatedId: cert.id,
          priority: "high",
          actionUrl: `/personnel?certId=${cert.id}`,
          metadata: { daysUntilExpiration: Math.ceil((cert.expirationDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) }
        });
        notifications.push(notification);
      }
    }
    
    // Get medical clearances expiring soon
    const expiringMedical = await this.getMedicalClearancesExpiringSoon(30);
    for (const medical of expiringMedical) {
      // Check if notification already exists to avoid duplicates
      const existingNotification = Array.from(this.notifications.values()).find(
        n => n.relatedType === "medical_clearance" && 
             n.relatedId === medical.id && 
             n.type === "medical_clearance_expiring" &&
             n.recipientId === medical.userId
      );
      
      if (!existingNotification) {
        const notification = await this.createNotification({
          recipientId: medical.userId,
          type: "medical_clearance_expiring",
          title: "Medical Clearance Expiring Soon",
          message: `Your ${medical.description} clearance expires on ${medical.expirationDate?.toLocaleDateString()}. Please schedule renewal appointment.`,
          relatedType: "medical_clearance",
          relatedId: medical.id,
          priority: "high",
          actionUrl: `/personnel?medicalId=${medical.id}`,
          metadata: { daysUntilExpiration: Math.ceil((medical.expirationDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) }
        });
        notifications.push(notification);
      }
    }
    
    return notifications;
  }

  // Document Management
  async getCertificationDocument(id: string): Promise<CertificationDocument | undefined> {
    return this.certificationDocuments.get(id);
  }

  async listCertificationDocuments(certificationId?: string, medicalClearanceId?: string): Promise<CertificationDocument[]> {
    let documents = Array.from(this.certificationDocuments.values());
    
    if (certificationId) {
      documents = documents.filter(d => d.certificationId === certificationId);
    }
    
    if (medicalClearanceId) {
      documents = documents.filter(d => d.medicalClearanceId === medicalClearanceId);
    }
    
    return documents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createCertificationDocument(document: InsertCertificationDocument): Promise<CertificationDocument> {
    const id = randomUUID();
    const certificationDocument: CertificationDocument = { 
      ...document, 
      id, 
      certificationId: document.certificationId || null,
      medicalClearanceId: document.medicalClearanceId || null,
      verificationStatus: document.verificationStatus || "pending",
      verifiedBy: document.verifiedBy || null,
      verifiedAt: document.verifiedAt || null,
      expirationDate: document.expirationDate || null,
      version: document.version || 1,
      notes: document.notes || null,
      createdAt: new Date() 
    };
    this.certificationDocuments.set(id, certificationDocument);
    return certificationDocument;
  }

  async updateCertificationDocument(id: string, updates: Partial<CertificationDocument>): Promise<CertificationDocument | undefined> {
    const document = this.certificationDocuments.get(id);
    if (!document) return undefined;
    const updated = { ...document, ...updates };
    this.certificationDocuments.set(id, updated);
    return updated;
  }

  async getDocumentsByVerificationStatus(status: string): Promise<CertificationDocument[]> {
    return Array.from(this.certificationDocuments.values())
      .filter(d => d.verificationStatus === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Workflow Approvals
  async getWorkflowApproval(id: string): Promise<WorkflowApproval | undefined> {
    return this.workflowApprovals.get(id);
  }

  async listWorkflowApprovals(workflowId?: string, approverId?: string): Promise<WorkflowApproval[]> {
    let approvals = Array.from(this.workflowApprovals.values());
    
    if (workflowId) {
      approvals = approvals.filter(a => a.workflowId === workflowId);
    }
    
    if (approverId) {
      approvals = approvals.filter(a => a.approverId === approverId);
    }
    
    return approvals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createWorkflowApproval(approval: InsertWorkflowApproval): Promise<WorkflowApproval> {
    const id = randomUUID();
    const workflowApproval: WorkflowApproval = { 
      ...approval, 
      id, 
      comments: approval.comments || null,
      timestamp: approval.timestamp || new Date() 
    };
    this.workflowApprovals.set(id, workflowApproval);
    return workflowApproval;
  }

  // Enhanced Project Management (EPM) Implementation

  // Project Stages
  async getProjectStage(id: string): Promise<ProjectStage | undefined> {
    return this.projectStages.get(id);
  }

  async listProjectStages(projectId: string): Promise<ProjectStage[]> {
    return Array.from(this.projectStages.values()).filter(stage => stage.projectId === projectId);
  }

  async createProjectStage(stage: InsertProjectStage): Promise<ProjectStage> {
    const id = stage.id || randomUUID();
    const newStage: ProjectStage = {
      ...stage,
      id,
      requiredApproverRole: stage.requiredApproverRole || null,
      gateRules: stage.gateRules || {},
      createdAt: stage.createdAt || new Date(),
      updatedAt: stage.updatedAt || new Date(),
    };
    
    this.projectStages.set(id, newStage);
    return newStage;
  }

  async updateProjectStage(id: string, updates: Partial<ProjectStage>): Promise<ProjectStage | undefined> {
    const stage = this.projectStages.get(id);
    if (!stage) return undefined;

    const updated: ProjectStage = { ...stage, ...updates, updatedAt: new Date() };
    this.projectStages.set(id, updated);
    return updated;
  }

  // Checklist Template Items
  async getChecklistTemplateItem(id: string): Promise<ChecklistTemplateItem | undefined> {
    return this.checklistTemplateItems.get(id);
  }

  async listChecklistTemplateItems(templateId: string): Promise<ChecklistTemplateItem[]> {
    return Array.from(this.checklistTemplateItems.values())
      .filter(item => item.templateId === templateId)
      .sort((a, b) => a.order - b.order);
  }

  async createChecklistTemplateItem(item: InsertChecklistTemplateItem): Promise<ChecklistTemplateItem> {
    const id = item.id || randomUUID();
    const newItem: ChecklistTemplateItem = {
      ...item,
      id,
      order: item.order || 0,
      required: item.required || false,
      validations: item.validations || {},
      createdAt: item.createdAt || new Date(),
    };
    
    this.checklistTemplateItems.set(id, newItem);
    return newItem;
  }

  async updateChecklistTemplateItem(id: string, updates: Partial<ChecklistTemplateItem>): Promise<ChecklistTemplateItem | undefined> {
    const item = this.checklistTemplateItems.get(id);
    if (!item) return undefined;

    const updated: ChecklistTemplateItem = { ...item, ...updates };
    this.checklistTemplateItems.set(id, updated);
    return updated;
  }

  // Project Checklists
  async getProjectChecklist(id: string): Promise<ProjectChecklist | undefined> {
    return this.projectChecklists.get(id);
  }

  async listProjectChecklists(projectId?: string): Promise<ProjectChecklist[]> {
    if (!projectId) {
      return Array.from(this.projectChecklists.values());
    }
    return Array.from(this.projectChecklists.values()).filter(checklist => checklist.projectId === projectId);
  }

  async listProjectChecklistsByStage(stageId: string): Promise<ProjectChecklist[]> {
    return Array.from(this.projectChecklists.values()).filter(checklist => checklist.stageId === stageId);
  }

  async createProjectChecklist(checklist: InsertProjectChecklist): Promise<ProjectChecklist> {
    const id = checklist.id || randomUUID();
    const newChecklist: ProjectChecklist = {
      ...checklist,
      id,
      status: checklist.status || 'not_started',
      stageId: checklist.stageId || null,
      createdAt: checklist.createdAt || new Date(),
      updatedAt: checklist.updatedAt || new Date(),
    };
    
    this.projectChecklists.set(id, newChecklist);
    return newChecklist;
  }

  async updateProjectChecklist(id: string, updates: Partial<ProjectChecklist>): Promise<ProjectChecklist | undefined> {
    const checklist = this.projectChecklists.get(id);
    if (!checklist) return undefined;

    const updated: ProjectChecklist = { ...checklist, ...updates, updatedAt: new Date() };
    this.projectChecklists.set(id, updated);
    return updated;
  }

  // Checklist Items
  async getChecklistItem(id: string): Promise<ChecklistItem | undefined> {
    return this.checklistItems.get(id);
  }

  async listChecklistItems(checklistId: string): Promise<ChecklistItem[]> {
    return Array.from(this.checklistItems.values()).filter(item => item.projectChecklistId === checklistId);
  }

  async createChecklistItem(item: InsertChecklistItem): Promise<ChecklistItem> {
    const id = item.id || randomUUID();
    const newItem: ChecklistItem = {
      ...item,
      id,
      value: item.value || null,
      status: item.status || 'pending',
      assigneeId: item.assigneeId || null,
      dueAt: item.dueAt || null,
      completedAt: item.completedAt || null,
      createdAt: item.createdAt || new Date(),
      updatedAt: item.updatedAt || new Date(),
    };
    
    this.checklistItems.set(id, newItem);
    return newItem;
  }

  async updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | undefined> {
    const item = this.checklistItems.get(id);
    if (!item) return undefined;

    const updated: ChecklistItem = { ...item, ...updates, updatedAt: new Date() };
    this.checklistItems.set(id, updated);
    return updated;
  }

  // Stage Approvals
  async getStageApproval(id: string): Promise<StageApproval | undefined> {
    return this.stageApprovals.get(id);
  }

  async listStageApprovals(projectId: string, stageId: string): Promise<StageApproval[]> {
    return Array.from(this.stageApprovals.values())
      .filter(approval => approval.projectId === projectId && approval.stageId === stageId);
  }

  async createStageApproval(approval: InsertStageApproval): Promise<StageApproval> {
    const id = approval.id || randomUUID();
    const newApproval: StageApproval = {
      ...approval,
      id,
      status: approval.status || 'pending',
      note: approval.note || null,
      decidedAt: approval.decidedAt || null,
      createdAt: approval.createdAt || new Date(),
    };
    
    this.stageApprovals.set(id, newApproval);
    return newApproval;
  }

  async updateStageApproval(id: string, updates: Partial<StageApproval>): Promise<StageApproval | undefined> {
    const approval = this.stageApprovals.get(id);
    if (!approval) return undefined;

    const updated: StageApproval = { ...approval, ...updates };
    this.stageApprovals.set(id, updated);
    return updated;
  }

  // Audit Logs
  async getAuditLog(id: string): Promise<AuditLog | undefined> {
    return this.auditLogs.get(id);
  }

  async listAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());
    
    if (entityType) {
      logs = logs.filter(log => log.entity === entityType);
    }
    
    if (entityId) {
      logs = logs.filter(log => log.entityId === entityId);
    }
    
    return logs.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const newLog: AuditLog = {
      ...log,
      id,
      before: log.before || null,
      after: log.after || null,
      at: log.at || new Date(),
    };
    
    this.auditLogs.set(id, newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
