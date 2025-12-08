# api-client

A shared API client library for making HTTP requests. Compatible with both web applications and React Native mobile apps.

## Features

- ✅ TypeScript support with full type safety
- ✅ Works in both browser and React Native environments
- ✅ Automatic JSON parsing
- ✅ Query parameter support
- ✅ Request timeout handling
- ✅ Custom error handling with `ApiError` class
- ✅ Configurable headers
- ✅ Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ Task API with static methods for todo list operations
- ✅ React Query hooks for data fetching and mutations

## Building

Run `nx build api-client` to build the library.

## Running unit tests

Run `nx test api-client` to execute the unit tests via [Jest](https://jestjs.io).

## Usage

### Basic Setup

```typescript
import { createApiClient } from '@appomate-challenge/api-client';

// Create an API client instance
const apiClient = createApiClient({
  baseURL: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer your-token-here',
  },
  timeout: 30000, // 30 seconds (optional, defaults to 30000)
});
```

### Making Requests

#### GET Request

```typescript
// Simple GET request
const users = await apiClient.get<User[]>('/users');

// GET request with query parameters
const filteredUsers = await apiClient.get<User[]>('/users', {
  params: {
    page: 1,
    limit: 10,
    active: true,
  },
});
```

#### POST Request

```typescript
const newUser = await apiClient.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

#### PUT Request

```typescript
const updatedUser = await apiClient.put<User>('/users/123', {
  name: 'Jane Doe',
  email: 'jane@example.com',
});
```

#### PATCH Request

```typescript
const patchedUser = await apiClient.patch<User>('/users/123', {
  email: 'newemail@example.com',
});
```

#### DELETE Request

```typescript
await apiClient.delete('/users/123');
```

### Error Handling

The API client throws `ApiError` for failed requests:

```typescript
import { ApiError } from '@appomate-challenge/api-client';

try {
  const user = await apiClient.get<User>('/users/123');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Data:', error.data);
  }
}
```

### Dynamic Header Management

```typescript
// Set a header
apiClient.setHeader('Authorization', 'Bearer new-token');

// Remove a header
apiClient.removeHeader('Authorization');

// Change base URL
apiClient.setBaseURL('https://api.other-domain.com');
```

### Usage in Web App (Next.js)

```typescript
// lib/api.ts
import { createApiClient } from '@appomate-challenge/api-client';

export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
});

// app/users/page.tsx
import { apiClient } from '@/lib/api';

export default async function UsersPage() {
  const users = await apiClient.get('/api/users');
  // ...
}
```

### Usage in Mobile App (React Native)

```typescript
// services/api.ts
import { createApiClient } from '@appomate-challenge/api-client';

export const apiClient = createApiClient({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// components/UserList.tsx
import { apiClient } from '../services/api';

const fetchUsers = async () => {
  try {
    const users = await apiClient.get('/users');
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};
```

## API Reference

### `createApiClient(config: ApiClientConfig): ApiClient`

Creates a new API client instance.

**Config Options:**

- `baseURL` (string, required): The base URL for all API requests
- `headers` (Record<string, string>, optional): Default headers to include with all requests
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)

### `ApiClient` Methods

- `get<T>(endpoint: string, options?: RequestOptions): Promise<T>`
- `post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T>`
- `put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T>`
- `patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T>`
- `delete<T>(endpoint: string, options?: RequestOptions): Promise<T>`
- `setHeader(key: string, value: string): void`
- `removeHeader(key: string): void`
- `setBaseURL(baseURL: string): void`
- `getBaseURL(): string`

### `ApiError` Class

Custom error class thrown for API errors.

**Properties:**

- `message: string` - Error message
- `status: number` - HTTP status code (0 for network errors)
- `data?: unknown` - Additional error data from the server

## Task API

The library includes a Task API for managing todo tasks with React Query integration.

### Setup

First, initialize the TaskAPI with an ApiClient instance:

```typescript
import { createApiClient, TaskAPI } from '@appomate-challenge/api-client';

// Create and initialize the API client
const apiClient = createApiClient({
  baseURL: 'http://localhost:3333',
});

// Initialize TaskAPI
TaskAPI.initialize(apiClient);
```

### TaskAPI Static Methods

```typescript
// Fetch all tasks
const tasks = await TaskAPI.fetchTaskList();

// Fetch a single task
const task = await TaskAPI.fetchTask(1);

// Create a new task
const newTask = await TaskAPI.createTask({
  title: 'New task',
  description: 'Task description',
  completed: false,
});

// Update a task
const updatedTask = await TaskAPI.updateTask(1, {
  completed: true,
});

// Delete a task
await TaskAPI.deleteTask(1);
```

### React Query Hooks

The library provides React Query hooks for easy data fetching and mutations.

#### Setup React Query Provider

First, wrap your app with QueryClientProvider:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskAPI, createApiClient } from '@appomate-challenge/api-client';

const queryClient = new QueryClient();

// Initialize TaskAPI
const apiClient = createApiClient({
  baseURL: 'http://localhost:3333',
});
TaskAPI.initialize(apiClient);

function App() {
  return <QueryClientProvider client={queryClient}>{/* Your app components */}</QueryClientProvider>;
}
```

#### useTaskList Hook

Fetch all tasks:

```typescript
import { useTaskList } from '@appomate-challenge/api-client';

function TaskList() {
  const { data: tasks, isLoading, error } = useTaskList();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {tasks?.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

#### useTask Hook

Fetch a single task:

```typescript
import { useTask } from '@appomate-challenge/api-client';

function TaskDetail({ taskId }: { taskId: number }) {
  const { data: task, isLoading, error } = useTask(taskId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

#### useCreateTask Hook

Create a new task:

```typescript
import { useCreateTask } from '@appomate-challenge/api-client';

function CreateTaskForm() {
  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createTask.mutate(
      {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
      },
      {
        onSuccess: () => {
          console.log('Task created successfully!');
          e.currentTarget.reset();
        },
        onError: (error) => {
          console.error('Failed to create task:', error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='title' placeholder='Task title' required />
      <textarea name='description' placeholder='Description' />
      <button type='submit' disabled={createTask.isPending}>
        {createTask.isPending ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

#### useUpdateTask Hook

Update an existing task:

```typescript
import { useUpdateTask } from '@appomate-challenge/api-client';

function TaskItem({ task }: { task: Task }) {
  const updateTask = useUpdateTask();

  const toggleComplete = () => {
    updateTask.mutate(
      {
        id: task.id,
        data: { completed: !task.completed },
      },
      {
        onSuccess: () => {
          console.log('Task updated successfully!');
        },
      }
    );
  };

  return (
    <div>
      <input type='checkbox' checked={task.completed} onChange={toggleComplete} disabled={updateTask.isPending} />
      <span>{task.title}</span>
    </div>
  );
}
```

#### useDeleteTask Hook

Delete a task:

```typescript
import { useDeleteTask } from '@appomate-challenge/api-client';

function TaskItem({ task }: { task: Task }) {
  const deleteTask = useDeleteTask();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(task.id, {
        onSuccess: () => {
          console.log('Task deleted successfully!');
        },
      });
    }
  };

  return (
    <div>
      <span>{task.title}</span>
      <button onClick={handleDelete} disabled={deleteTask.isPending}>
        {deleteTask.isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
```

### Task Types

```typescript
interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface CreateTaskRequest {
  title: string;
  description?: string | null;
  completed?: boolean;
}

interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  completed?: boolean;
}
```
