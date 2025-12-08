# Todo List Application

A modern, full-stack todo list application built with Nx monorepo, featuring a Next.js web application and an Express backend API.

## 🏗️ Architecture

This is an Nx monorepo containing:

- **Web Application** (`webapp`) - Next.js frontend with React Query for data fetching
- **Backend Server** (`server`) - Express API with TypeORM and in-memory SQLite database
- **Shared Libraries**:
  - `api-client` - TypeScript library with API client and React Query hooks
  - `core` - Shared TypeScript utilities

## 📁 Project Structure

```
AppomateChallenge/
├── apps/
│   ├── webapp/              # Next.js frontend application
│   ├── webapp-e2e/          # E2E tests for webapp
│   ├── server/              # Express backend API
│   └── server-e2e/          # E2E tests for server
├── libs/
│   ├── api-client/          # Shared API client and React Query hooks
│   └── core/                # Shared utilities
└── ...
```

## 🛠️ Technologies

### Frontend

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Query (@tanstack/react-query)** - Data fetching and caching

### Backend

- **Express** - Web framework
- **TypeORM** - ORM for database operations
- **SQLite (in-memory)** - Database (data resets on server restart)
- **TypeScript** - Type safety

### Shared

- **Nx** - Monorepo tooling and build system
- **TypeScript** - Shared type definitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Start both the backend server and frontend webapp:

**Terminal 1 - Start the backend server:**

```bash
nx serve server
```

The server will start on `http://localhost:3333`

**Terminal 2 - Start the webapp:**

```bash
nx dev webapp
```

The webapp will start on `http://localhost:3000`

### Building

Build all projects:

```bash
nx run-many --target=build --all
```

Build specific projects:

```bash
nx build server
nx build webapp
```

### Testing

Run tests for all projects:

```bash
nx run-many --target=test --all
```

Run tests for specific projects:

```bash
nx test server
nx test webapp
nx test api-client
```

Run E2E tests:

```bash
nx e2e webapp-e2e
nx e2e server-e2e
```

### Linting

Lint all projects:

```bash
nx run-many --target=lint --all
```

## 📦 Projects Overview

### `webapp` - Frontend Application

Next.js application with a clean, modern UI for managing tasks.

**Features:**

- Create, update, and delete tasks
- Mark tasks as complete/incomplete
- Real-time data synchronization with React Query
- Responsive design with shadcn/ui components

**Key Files:**

- `src/app/page.tsx` - Main page component
- `src/components/tasks/` - Task management components
- `src/components/ui/` - Reusable UI components (shadcn)

### `server` - Backend API

Express server providing RESTful API for task management.

**API Endpoints:**

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

**Database:**

- In-memory SQLite database (data resets on server restart)
- TypeORM with automatic schema synchronization

**Key Files:**

- `src/main.ts` - Server entry point
- `src/routes/tasks.ts` - Task API routes
- `src/entities/Task.ts` - Task entity definition

### `api-client` - Shared API Library

TypeScript library providing:

- **API Client** (`api/`) - HTTP client for making API requests
- **Task API** (`api/task-api.ts`) - Static methods for task operations
- **React Query Hooks** (`hooks/`) - Custom hooks for data fetching and mutations
- **Types** (`types/`) - TypeScript type definitions

**Usage:**

```typescript
import { TaskAPI, useTaskList, useCreateTask } from '@appomate-challenge/api-client';

// Initialize TaskAPI (done in ApiProvider)
TaskAPI.initialize(apiClient);

// Use hooks in components
const { data: tasks } = useTaskList();
const createTask = useCreateTask();
```

### `core` - Shared Utilities

Shared TypeScript library for common utilities and helpers.

## 🔧 Available Commands

### Development

- `nx serve server` - Start the backend server
- `nx dev webapp` - Start the webapp in development mode
- `nx serve webapp` - Start the webapp (production build)

### Building

- `nx build server` - Build the server
- `nx build webapp` - Build the webapp
- `nx build api-client` - Build the API client library
- `nx build core` - Build the core library

### Testing

- `nx test <project>` - Run unit tests
- `nx e2e <project>-e2e` - Run E2E tests

### Code Quality

- `nx lint <project>` - Lint a project
- `nx typecheck <project>` - Type check a project

### Utilities

- `nx graph` - Visualize the project dependency graph
- `nx show project <project>` - Show project details

## 🌐 Environment Variables

### Server

- `PORT` - Server port (default: 3333)
- `FRONTEND_URL` - CORS allowed origin (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production)

### Webapp

- `NEXT_PUBLIC_API_URL` - API server URL (default: http://localhost:3333)

## 📝 Code Style

This project uses Prettier for code formatting with the following configuration:

- 2-space indentation
- Single quotes
- 120 character line width
- Semicolons enabled

Format code:

```bash
npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"
```

## 🧪 Testing Strategy

- **Unit Tests** - Jest for testing individual components and functions
- **E2E Tests** - Playwright for end-to-end testing of the webapp
- **Integration Tests** - Jest for testing server endpoints

## 📚 Learn More

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeORM Documentation](https://typeorm.io)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🏃 Quick Start Example

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the backend:**

   ```bash
   nx serve server
   ```

3. **In another terminal, start the frontend:**

   ```bash
   nx dev webapp
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` and start managing your tasks!

## 📄 License

MIT
