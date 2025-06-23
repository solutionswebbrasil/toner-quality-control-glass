# SGQ Sistema de Gestão da Qualidade

## Overview

This is a comprehensive Quality Management System (SGQ) built with React (frontend) and Express.js (backend), designed for managing toner returns, suppliers, warranties, audits, and quality management processes. The system features a modern, responsive UI with comprehensive data management capabilities.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **TailwindCSS** for styling with custom CSS variables for theming
- **Shadcn/ui** component library for consistent UI components
- **React Hook Form** with Zod validation for form management
- **TanStack Query** for API state management with cache invalidation
- **React Router** for client-side routing

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with organized route handlers
- **Middleware** for request logging, JSON parsing, and error handling
- **File upload** support for PDF documents and images
- **Environment-based configuration** for development and production

### Data Storage
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Neon Database** as the PostgreSQL provider
- **Migration system** through Drizzle Kit

## Key Components

### Database Schema
The system manages multiple entities:
- **Users & Profiles**: Authentication and user management
- **Toners**: Product catalog with specifications and pricing
- **Retornados**: Return tracking with weight calculations
- **Fornecedores**: Supplier management with RMA links
- **Garantias**: Warranty tracking and management
- **Auditorias**: Audit records with PDF attachments
- **Filiais**: Branch/location management
- **Certificados**: Certificate management with file uploads

### Authentication System
- **Basic authentication** with hashed passwords (SHA-256)
- **Role-based access control** with permissions system
- **Session management** with user context
- **Protected routes** requiring authentication

### Core Features
1. **Toner Management**: Complete product lifecycle tracking
2. **Return Processing**: Automated weight-based categorization
3. **Supplier Management**: RMA tracking and communication
4. **Warranty System**: Multi-step workflow management
5. **Audit Management**: Document-based audit trails
6. **Quality Control**: Non-conformity tracking and resolution
7. **Reporting & KPIs**: Data visualization and export capabilities

## Data Flow

### Request Flow
1. Client requests pass through Vite dev server (development)
2. API requests routed to Express server at `/api/*`
3. Authentication middleware validates user sessions
4. Route handlers process business logic
5. Drizzle ORM manages database operations
6. Responses formatted and sent back to client

### State Management
- **TanStack Query** manages server state with automatic refetching
- **React Context** for authentication and theme state
- **Form state** managed by React Hook Form
- **Local storage** for user preferences and temporary data

### File Handling
- PDF and image uploads through dedicated upload service
- Files stored with timestamped naming convention
- Public URL generation for file access
- Integration with document management workflows

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Unstyled, accessible UI primitives
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **class-variance-authority**: Utility for component variants
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Icon library
- **xlsx**: Excel file processing for imports/exports

### Backend Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for Neon
- **drizzle-orm**: Type-safe ORM
- **connect-pg-simple**: PostgreSQL session store
- **express**: Web framework
- **ws**: WebSocket support for Neon connection

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production
- **Vite**: Development server with HMR
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development Environment
- **Replit integration** with automatic environment setup
- **Hot Module Replacement** for rapid development
- **PostgreSQL-16** module for database services
- **Node.js-20** runtime environment

### Production Build
- **Vite build** for optimized frontend assets
- **ESBuild** for backend bundling with Node.js targeting
- **Static file serving** through Express
- **Environment variable** configuration for database connections

### Deployment Configuration
- **Autoscale deployment** target on Replit
- **Port 5000** for local development, port 80 for external access
- **Build pipeline** with npm scripts for CI/CD
- **Database migrations** through Drizzle push commands

## Changelog
- June 23, 2025: Initial system setup with comprehensive database and authentication
- June 23, 2025: Enhanced KPIs module with professional chart styling and full-screen expansion
- June 23, 2025: Improved filter system with fixed positioning and better UX
- June 23, 2025: Created Ishikawa and Pareto analysis modules with interactive diagrams
- June 23, 2025: Implemented complete database storage layer with proper CRUD operations
- June 23, 2025: Added custom favicon with "Q" logo for quality management branding
- June 23, 2025: Restructured navigation - separated "Início" (welcome) from "Dashboard" (charts)
- June 23, 2025: Fixed sidebar layout with improved styling and alignment

## User Preferences

Preferred communication style: Simple, everyday language.
Chart styling: Professional, sober design suitable for business presentations.
Filter preferences: Fixed positioning with clean, organized layout.
Database: Real data integration preferred over mock data for production use.