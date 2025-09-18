CREATE TABLE "audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" varchar NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certification_documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certification_id" varchar,
	"medical_clearance_id" varchar,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"document_type" text NOT NULL,
	"uploaded_by" varchar NOT NULL,
	"verification_status" text DEFAULT 'pending' NOT NULL,
	"verified_by" varchar,
	"verified_at" timestamp,
	"expiration_date" timestamp,
	"version" integer DEFAULT 1 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certification_workflows" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certification_id" varchar NOT NULL,
	"workflow_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"initiated_by" varchar NOT NULL,
	"assigned_to" varchar,
	"priority" text DEFAULT 'medium' NOT NULL,
	"due_date" timestamp,
	"completed_date" timestamp,
	"notes" text,
	"approval_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"issuing_organization" text NOT NULL,
	"certificate_number" text,
	"issue_date" timestamp,
	"expiration_date" timestamp,
	"document_url" text,
	"renewal_required" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_instances" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" varchar NOT NULL,
	"related_id" varchar NOT NULL,
	"related_type" text NOT NULL,
	"date" timestamp NOT NULL,
	"completed_by" varchar,
	"completed_data" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"photo_count" integer DEFAULT 0,
	"required_photos" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_checklist_id" varchar NOT NULL,
	"template_item_id" varchar NOT NULL,
	"value" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"assignee_id" varchar,
	"due_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_template_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" varchar NOT NULL,
	"label" text NOT NULL,
	"type" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"validations" jsonb DEFAULT '{}',
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"target_type" text,
	"target_id" varchar,
	"items" jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_type_id" varchar NOT NULL,
	"serial_number" text,
	"status" text DEFAULT 'available' NOT NULL,
	"location" text,
	"last_maintenance_date" timestamp,
	"next_maintenance_date" timestamp,
	"hours_used" integer DEFAULT 0,
	"mileage" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_assignments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"equipment_id" varchar NOT NULL,
	"assigned_date" timestamp DEFAULT now() NOT NULL,
	"returned_date" timestamp,
	"assigned_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_types" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"daily_checklist_template" jsonb NOT NULL,
	"maintenance_schedule" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"sku" text,
	"unit" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_locations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_stock" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"min_quantity" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"performed_by" varchar NOT NULL,
	"checklist_data" jsonb NOT NULL,
	"issues" text,
	"photos_required" boolean DEFAULT false,
	"photo_count" integer DEFAULT 0,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_clearances" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"provider" text NOT NULL,
	"test_date" timestamp NOT NULL,
	"expiration_date" timestamp,
	"result" text NOT NULL,
	"restrictions" jsonb,
	"document_url" text,
	"next_reminder_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" varchar NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"related_type" text,
	"related_id" varchar,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'unread' NOT NULL,
	"scheduled_for" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp,
	"action_url" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personnel_equipment_assignments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"equipment_id" varchar NOT NULL,
	"project_id" varchar,
	"assigned_date" timestamp DEFAULT now() NOT NULL,
	"returned_date" timestamp,
	"assigned_by" varchar NOT NULL,
	"purpose" text,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"related_id" varchar NOT NULL,
	"related_type" text NOT NULL,
	"filename" text NOT NULL,
	"original_name" text,
	"url" text NOT NULL,
	"description" text,
	"taken_by" varchar NOT NULL,
	"taken_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_checklists" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"stage_id" varchar,
	"template_id" varchar NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_materials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"required_quantity" integer NOT NULL,
	"loaded_quantity" integer DEFAULT 0,
	"used_quantity" integer DEFAULT 0,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "project_stages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"required_approver_role" text,
	"gate_rules" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_types" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"stages" jsonb NOT NULL,
	"materials_template" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"project_type_id" varchar NOT NULL,
	"location" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"current_stage" text,
	"progress" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"assigned_crew" text,
	"supervisor_id" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safety_forms" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"project_id" varchar,
	"date" timestamp NOT NULL,
	"form_data" jsonb NOT NULL,
	"supervisor_id" varchar NOT NULL,
	"entrants" jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stage_approvals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"stage_id" varchar NOT NULL,
	"approver_id" varchar NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"note" text,
	"decided_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'worker' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"position" text,
	"department" text,
	"crew" text,
	"hire_date" timestamp,
	"emergency_contact" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "workflow_approvals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" varchar NOT NULL,
	"approver_id" varchar NOT NULL,
	"action" text NOT NULL,
	"comments" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
