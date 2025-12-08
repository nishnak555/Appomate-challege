/**
 * Task entity type matching the server-side Task model
 */
export interface Task {
    id: number;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
