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
  type PersonnelEquipmentAssignment, type InsertPersonnelEquipmentAssignment
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

    // Initialize sample data
    sampleUsers.forEach(user => this.users.set(user.id, user));
    sampleCertifications.forEach(cert => this.certifications.set(cert.id, cert));
    sampleMedicalClearances.forEach(clearance => this.medicalClearances.set(clearance.id, clearance));
    samplePersonnelEquipmentAssignments.forEach(assignment => this.personnelEquipmentAssignments.set(assignment.id, assignment));
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
}

export const storage = new MemStorage();
