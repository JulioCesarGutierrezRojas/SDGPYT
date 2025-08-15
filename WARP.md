# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **fullstack project management system** (SDGPYT - Sistema de Gestión de Proyectos y Tareas) built with:
- **Backend**: Spring Boot 3.5.0 with Java 21
- **Frontend**: React 19 with Vite and TailwindCSS 4
- **Database**: PostgreSQL with JPA/Hibernate
- **Authentication**: JWT with Spring Security 6

The system allows administrators to manage users and projects, while regular users can collaborate on projects, create categories, and manage tasks.

## Development Commands

### Backend (Spring Boot)
Navigate to the `backend/` directory for all backend operations:

```bash
# Build the project
./mvnw clean compile

# Run the application (development mode with hot reload)
./mvnw spring-boot:run

# Run tests
./mvnw test

# Package the application
./mvnw clean package

# Skip tests during build
./mvnw clean package -DskipTests

# Generate dependency tree
./mvnw dependency:tree
```

**Backend runs on port 8080 by default**

### Frontend (React + Vite)
Navigate to the `frontend/` directory for all frontend operations:

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run a specific component in development
# The dev server runs on http://localhost:5173 by default
```

## Architecture Overview

### Backend Architecture (Spring Boot)

**Module-Based Structure**: The backend follows a domain-driven modular architecture:

```
backend/src/main/java/com/praga/backend/
├── kernel/                 # Shared utilities and configuration
│   ├── ApiResponse.java   # Standardized API response wrapper
│   ├── Auditable.java     # Base entity for audit fields
│   ├── EmailService.java  # Email sending functionality
│   └── CustomExceptionHandler.java # Global exception handling
├── modules/               # Domain modules
│   ├── auth/             # Authentication (login, password recovery)
│   ├── users/            # User management (CRUD, roles)
│   ├── projects/         # Project management and invitations
│   ├── categories/       # Project categories
│   ├── tasks/            # Task management within categories
│   └── audit/            # Action logging and audit trails
└── security/             # JWT configuration and filters
    ├── config/
    ├── jwt/
    └── service/
```

**Each module contains**:
- `controller/` - REST endpoints and DTOs
- `service/` - Business logic
- `model/` - JPA entities and repositories

**Key Features**:
- JWT-based authentication with blacklist support
- JPA auditing for all entities (created/modified tracking)
- Email notifications (project invitations, password recovery)
- Role-based authorization (ADMIN, USER)
- OpenAPI/Swagger documentation at `/swagger-ui.html`

### Frontend Architecture (React)

**Component-Based Structure**:

```
frontend/src/
├── components/           # Reusable UI components
│   ├── Layouts/         # AdminLayout, UserLayout
│   └── Modals/          # Task/Project/Category modals
├── modules/             # Feature modules
│   ├── auth/           # Login, register, password recovery
│   ├── admin/          # Admin-specific views and adapters
│   └── user/           # User collaboration features
├── kernel/             # Utilities
│   ├── alerts.js      # SweetAlert2 toast notifications
│   └── validations.js # Form validation helpers
└── config/            # API configuration
    └── axios.js       # HTTP client setup
```

**Key Patterns**:
- **Layouts**: Role-based layouts (AdminLayout for admins, UserLayout for users)
- **Adapters**: API communication layer (e.g., `auth.controller.js`, `user.controller.js`)
- **Route Protection**: Authentication-based routing with role checks
- **State Management**: React useState/useEffect (no Redux currently)

### Authentication Flow

1. **Login**: Users authenticate via `/auth/signin` → JWT token stored in localStorage
2. **Role Detection**: Admin users (root@gmail.com, admin@gmail.com) → `/admin` routes
3. **Regular Users**: → `/user` routes for project collaboration
4. **Project Invitations**: Public invitation links allow users to join projects

### Database Schema (Key Relationships)

- **User** ↔ **Project** (Many-to-Many via ProjectUser)
- **Project** → **Category** (One-to-Many)
- **Category** → **Task** (One-to-Many)
- **PendingInvitation** → **Project** (invitation system)
- **Audit** → tracks all entity changes

## Development Workflow

### Starting Development
```bash
# Terminal 1: Start backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Making Changes

**Backend Changes**:
- Modify entities in `model/` packages
- Update business logic in `service/` classes
- Add/modify endpoints in `controller/` classes
- Spring Boot DevTools provides hot reload

**Frontend Changes**:
- Components auto-reload via Vite HMR
- Update API adapters in `modules/*/adapters/` for new endpoints
- Modify routing in `router/router.jsx`

### Testing Users
Based on the authentication logic:
- **Admin access**: root@gmail.com or admin@gmail.com
- **User access**: Any other registered email

### Key Configuration Files

- **backend/pom.xml**: Maven dependencies and build configuration
- **backend/src/main/resources/application.properties**: Database and app config
- **frontend/package.json**: NPM dependencies and scripts  
- **frontend/vite.config.js**: Build tool configuration
- **frontend/tailwind.config.js**: Styling configuration

## Common Development Tasks

### Adding a New API Endpoint
1. Create DTO in `controller/dto/`
2. Add method to Service class
3. Add endpoint to Controller class
4. Create corresponding adapter function in frontend
5. Update frontend components to use new endpoint

### Adding Authentication to New Routes
- Backend: Add `@PreAuthorize` annotations to controller methods
- Frontend: Ensure routes are wrapped in appropriate Layout components

### Database Changes
1. Modify JPA entities
2. Spring Boot will auto-generate schema changes in development
3. For production, use proper migration scripts

This architecture supports rapid development while maintaining clean separation of concerns between the Spring Boot backend and React frontend.
