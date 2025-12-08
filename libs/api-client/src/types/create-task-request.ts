/**
 * Request payload for creating a new task
 */
export interface CreateTaskRequest {
    title: string;
    description?: string | null;
    completed?: boolean;
}
