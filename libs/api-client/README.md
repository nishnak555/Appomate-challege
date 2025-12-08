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
    'Authorization': 'Bearer your-token-here',
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
