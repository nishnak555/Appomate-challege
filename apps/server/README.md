# Todo List Server API

Express server with TypeORM and in-memory SQLite database for managing todo tasks.

## Features

- ✅ RESTful API for task management
- ✅ In-memory SQLite database (data resets on server restart)
- ✅ TypeORM for database operations
- ✅ Auto-sync schema (no migrations needed)
- ✅ Full CRUD operations

## Getting Started

### Start the server

```bash
nx serve server
```

The server will start on `http://localhost:3333`

### Build the server

```bash
nx build server
```

## API Endpoints

### Base URL

```
http://localhost:3333/api
```

### Tasks API

#### Get All Tasks

```http
GET /api/tasks
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the todo app",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Single Task

```http
GET /api/tasks/:id
```

**Response:**

```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the todo app",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "error": "Task not found"
}
```

#### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "New task",
  "description": "Optional description",
  "completed": false
}
```

**Response (201):**

```json
{
  "id": 1,
  "title": "New task",
  "description": "Optional description",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400):**

```json
{
  "error": "Title is required"
}
```

#### Update Task

```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:01:00.000Z"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

#### Delete Task

```http
DELETE /api/tasks/:id
```

**Response:** 204 No Content

**Error Response (404):**

```json
{
  "error": "Task not found"
}
```

## Task Model

```typescript
{
  id: number;              // Auto-generated primary key
  title: string;           // Required, non-empty string
  description?: string;    // Optional string
  completed: boolean;      // Default: false
  createdAt: Date;         // Auto-generated timestamp
  updatedAt: Date;         // Auto-updated timestamp
}
```

## Database

- **Type:** In-memory SQLite (`:memory:`)
- **ORM:** TypeORM
- **Schema Sync:** Automatic (no migrations)
- **Note:** All data is lost when the server restarts

## Example Usage

### Using curl

```bash
# Get all tasks
curl http://localhost:3333/api/tasks

# Create a task
curl -X POST http://localhost:3333/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'

# Update a task
curl -X PUT http://localhost:3333/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a task
curl -X DELETE http://localhost:3333/api/tasks/1
```

### Using the api-client library

```typescript
import { createApiClient } from '@appomate-challenge/api-client';

const apiClient = createApiClient({
  baseURL: 'http://localhost:3333',
});

// Get all tasks
const tasks = await apiClient.get('/api/tasks');

// Create a task
const newTask = await apiClient.post('/api/tasks', {
  title: 'New task',
  description: 'Task description',
  completed: false,
});

// Update a task
const updatedTask = await apiClient.put(`/api/tasks/${newTask.id}`, {
  completed: true,
});

// Delete a task
await apiClient.delete(`/api/tasks/${newTask.id}`);
```
