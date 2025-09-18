# Atlas Marine Group Mobile App

## Overview

Atlas Marine Group Mobile App is a field documentation and checklist management system designed for marine services projects. The application provides workers with tools to manage projects, track equipment, document safety procedures, manage inventory, and maintain personnel records. The system emphasizes efficiency and reliability for field operations, with features for photo documentation, offline capabilities, and comprehensive tracking of work progress through various project stages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture:**
- React-based single-page application using TypeScript
- Component-driven architecture with shadcn/ui design system
- Mobile-first responsive design optimized for field use
- Offline-capable Progressive Web App (PWA) features
- State management through React Query for server state and local React state
- Routing handled by Wouter library for lightweight navigation

**Backend Architecture:**
- Express.js REST API server with TypeScript
- RESTful endpoint design following resource-based patterns
- Modular route organization with centralized error handling
- Session-based authentication with secure cookie management
- File upload handling for photo documentation
- Development hot-reload via Vite integration

**Database Design:**
- PostgreSQL database with Drizzle ORM for type-safe queries
- Comprehensive schema covering users, projects, equipment, safety, inventory, and personnel
- UUID-based primary keys for distributed system compatibility
- JSON fields for flexible metadata storage (certifications, emergency contacts, etc.)
- Timestamp tracking for audit trails and data synchronization

**Component System:**
- Reusable UI components built on Radix UI primitives
- Consistent styling through Tailwind CSS with custom design tokens
- Mobile-optimized touch targets and form inputs
- Card-based layouts for content organization
- Theme support with light/dark mode switching

**Data Flow:**
- Client-side data fetching through React Query with caching
- Optimistic updates for improved user experience
- Background synchronization for offline data
- Form validation using React Hook Form with Zod schemas
- Photo upload with preview and compression capabilities

## External Dependencies

**Core Technologies:**
- React 18+ with TypeScript for frontend development
- Express.js for backend API server
- PostgreSQL via Neon Database for cloud hosting
- Drizzle ORM for database interactions and migrations

**UI Framework:**
- shadcn/ui component library built on Radix UI
- Tailwind CSS for styling and responsive design
- Lucide React for consistent iconography
- Google Fonts (Inter/Roboto) for typography

**Development Tools:**
- Vite for build tooling and development server
- ESBuild for production bundling
- TypeScript for type safety across the stack
- Replit integration for development environment

**Authentication & Security:**
- bcrypt for password hashing
- express-session with connect-pg-simple for session storage
- CORS and security middleware for API protection

**Data Management:**
- React Query (TanStack Query) for server state management
- React Hook Form for form handling and validation
- Zod for runtime type validation and schema definition
- date-fns for date manipulation and formatting

**File Handling:**
- Native File API for photo capture and upload
- Image compression and preview capabilities
- Drag-and-drop file upload interface