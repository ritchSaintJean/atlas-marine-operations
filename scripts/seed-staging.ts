#!/usr/bin/env tsx

import { storage } from '../server/storage.js';
import { randomUUID } from 'crypto';

async function seedStaging() {
  console.log('🌱 Seeding staging data...');
  
  try {
    // Create demo project
    const project = await storage.createProject({
      id: 'demo-proj-001',
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
    console.log('✅ Demo project created:', project.name);

    // Create 3 project stages
    const stages = [
      {
        id: 'stage-prep-001',
        projectId: project.id,
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
        id: 'stage-blast-001',
        projectId: project.id,
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
        id: 'stage-coat-001',
        projectId: project.id,
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

    // Create checklist template with 5 required + 3 optional items
    const template = await storage.createChecklistTemplate({
      id: 'template-hull-blast-001',
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
          notes: 'Must be below 85% RH for proper coating adhesion'
        },
        {
          id: 'supervisor-signature',
          text: 'Supervisor approval signature',
          type: 'signature',
          required: true,
          validations: {},
          notes: 'Required supervisor sign-off before proceeding to next stage'
        },
        // 3 Optional Items
        {
          id: 'client-rep-present',
          text: 'Client representative present during inspection',
          type: 'boolean',
          required: false,
          validations: {},
          notes: 'Optional - document if client representative witnessed inspection'
        },
        {
          id: 'special-conditions',
          text: 'Special environmental conditions or concerns',
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
    console.log(`   - Required items: 5`);
    console.log(`   - Optional items: 3`);

    // Create audit log for seed operation
    await storage.createAuditLog({
      actorId: 'system',
      entity: 'seed',
      entityId: 'staging-seed',
      action: 'create',
      before: null,
      after: {
        projectsCreated: 1,
        stagesCreated: 3,
        templatesCreated: 1,
        itemsInTemplate: 8
      }
    });

    console.log('✅ Storage connection verified');
    console.log('🌱 Staging seed completed successfully');
    console.log('\n📊 Seeded data summary:');
    console.log(`   • 1 demo project: "${project.name}"`);
    console.log(`   • 3 project stages: Preparation → Blasting → Coating`);
    console.log(`   • 1 checklist template with 8 items (5 required + 3 optional)`);
  } catch (error) {
    console.error('❌ Staging seed failed:', error);
    process.exit(1);
  }
}

seedStaging();