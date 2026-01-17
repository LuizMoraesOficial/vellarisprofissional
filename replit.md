# VELLARIS Professional Hair Care

## Overview

VELLARIS is a professional hair care product website built as a full-stack TypeScript application. It serves as a marketing and contact platform for a premium cosmetics brand, featuring product showcases, company information, and a contact form system. The application is designed with a modern, elegant aesthetic appropriate for luxury beauty products.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Feature components in `client/src/components/`
- Theme support with light/dark mode via ThemeProvider

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Pattern**: RESTful endpoints under `/api/`
- **Build**: esbuild for production bundling

The server handles:
- Static file serving in production
- Vite dev server integration in development
- API routes for products and contacts

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's pgTable
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Storage**: In-memory storage implementation (MemStorage class)
- **Database Ready**: Schema configured for PostgreSQL migration

The schema includes:
- `products` table: id, name, description, category, price, image, benefits array, featured flag
- `contacts` table: id, name, email, phone, message, createdAt timestamp
- `siteSettings` table: id, contactEmail, contactPhone, whatsapp, instagram, facebook, youtube, tiktok, address

## Admin Panel

The admin panel is accessible via hidden routes (no public links):
- `/admin` - Login page (requires ADMIN_PASSWORD secret)
- `/admin/dashboard` - Product management (CRUD)
- `/admin/mensagens` - View and manage contact form submissions
- `/admin/configuracoes` - Edit site settings (contact info, social media links)

Admin authentication uses bearer tokens stored in localStorage with 24-hour expiry. The admin navigation provides seamless movement between sections with a premium dark theme and golden accents.

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- Database schema definitions
- TypeScript types for products and contacts
- Zod validation schemas

### Build Process
- Development: `npm run dev` runs tsx with Vite middleware
- Production build: Custom build script using esbuild (server) and Vite (client)
- Database migrations: `npm run db:push` via drizzle-kit

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Drizzle Kit**: Database migration and schema push tool
- **connect-pg-simple**: Session storage for PostgreSQL (available but not currently used)

### Frontend Libraries
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/***: Headless UI primitives for accessible components
- **embla-carousel-react**: Carousel/slider functionality
- **date-fns**: Date formatting utilities
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility

### Build and Development
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server-side bundling
- **tsx**: TypeScript execution for Node.js
- **@replit/vite-plugin-***: Replit-specific development plugins

### Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for react-hook-form
- **zod**: Schema validation
- **drizzle-zod**: Generates Zod schemas from Drizzle tables