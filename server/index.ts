import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Startup seeding function for demo data (idempotent)
async function seedOnStartup() {
  if (process.env.EPM_SEED_ON_START !== 'true' && process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log('🌱 Starting up - checking for demo data...');
  
  try {
    // Check if demo data already exists (idempotency)
    const existingProjects = await storage.listProjects();
    const demoExists = existingProjects.some(p => p.name === 'Vessel Hull Blasting - MV Atlas');
    if (demoExists) {
      console.log('ℹ️  Demo data already exists, skipping seed');
      return;
    }
  } catch {
    // Project doesn't exist, continue with seeding
  }

  console.log('🌱 Seeding staging data...');

  // Create demo project
  const demoProject = await storage.createProject({
    name: 'Vessel Hull Blasting - MV Atlas',
    projectTypeId: 'hull-blast-coat',
    location: 'Port of Houston - Dry Dock 3',
    status: 'active',
    currentStage: 'preparation',
    progress: 25,
    startDate: new Date('2024-09-15'),
    endDate: new Date('2024-11-30'),
    assignedCrew: 'Crew Alpha',
    supervisorId: 'emp-002',
    notes: 'Large container vessel requiring full hull blast and protective coating application'
  });
  console.log('✅ Demo project created:', demoProject.name);

  // Create 3 project stages (let system generate UUIDs)
  const stages = [
    {
      projectId: demoProject.id,
      name: 'Preparation & Setup',
      order: 1,
      requiredApproverRole: 'supervisor' as const,
      gateRules: {
        requiredForms: ['safety-briefing', 'equipment-inspection'],
        inventoryReservations: ['blast-media-001', 'paint-primer-002'],
        equipmentCommissioning: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId: demoProject.id,
      name: 'Hull Blasting Operations',
      order: 2,
      requiredApproverRole: 'supervisor' as const,
      gateRules: {
        requiredForms: ['environmental-clearance', 'containment-check'],
        inventoryReservations: ['blast-media-002'],
        equipmentCommissioning: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId: demoProject.id,
      name: 'Coating Application',
      order: 3,
      requiredApproverRole: 'admin' as const,
      gateRules: {
        requiredForms: ['surface-prep-verification', 'coating-plan'],
        inventoryReservations: ['primer-001', 'topcoat-001'],
        equipmentCommissioning: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  for (const stage of stages) {
    const createdStage = await storage.createProjectStage(stage);
    console.log(`✅ Stage created: ${createdStage.name}`);
  }

  // Create checklist template
  const template = await storage.createChecklistTemplate({
    name: 'Hull Blast Inspection Checklist',
    type: 'quality-control',
    targetType: 'project',
    targetId: null,
    version: 1,
    isActive: true,
    items: [
      // 5 Required Items
      {
        id: 'surface-prep-check',
        text: 'Surface preparation completed to SA2.5 standard',
        type: 'boolean',
        required: true,
        validations: {
          mustBeTrue: true
        },
        photoRequired: true,
        notes: 'Visual inspection and photo documentation required'
      },
      {
        id: 'dust-removal',
        text: 'All dust and debris removed from surface',
        type: 'boolean', 
        required: true,
        validations: {
          mustBeTrue: true
        },
        photoRequired: true
      },
      {
        id: 'environmental-temp',
        text: 'Environmental temperature reading (°F)',
        type: 'number',
        required: true,
        validations: {
          min: 45,
          max: 100
        },
        notes: 'Must be between 45°F and 100°F for coating application'
      },
      {
        id: 'humidity-reading',
        text: 'Relative humidity percentage',
        type: 'number',
        required: true,
        validations: {
          min: 0,
          max: 85
        },
        notes: 'Must be below 85% relative humidity'
      },
      {
        id: 'equipment-inspection',
        text: 'All blasting equipment inspected and certified',
        type: 'boolean',
        required: true,
        validations: {
          mustBeTrue: true
        },
        photoRequired: false,
        notes: 'Safety inspection must be current and documented'
      },
      // 3 Optional Items
      {
        id: 'wind-speed',
        text: 'Wind speed measurement (mph)',
        type: 'number',
        required: false,
        validations: {
          min: 0,
          max: 25
        },
        notes: 'Optional - record if conditions are variable'
      },
      {
        id: 'additional-notes',
        text: 'Additional inspection notes or observations',
        type: 'text',
        required: false,
        validations: {
          maxLength: 500
        },
        notes: 'Optional - note any unusual weather, access issues, or special requirements'
      },
      {
        id: 'quality-photos',
        text: 'Additional quality documentation photos',
        type: 'photo',
        required: false,
        validations: {},
        notes: 'Optional - additional photos for quality documentation'
      }
    ],
    createdAt: new Date(),
  });
  
  console.log('✅ Checklist template created:', template.name);
  console.log('   - Required items: 5');
  console.log('   - Optional items: 3');
  console.log('🌱 Staging seed completed successfully');
}

(async () => {
  const server = await registerRoutes(app);

  // Seed demo data if requested
  await seedOnStartup();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
