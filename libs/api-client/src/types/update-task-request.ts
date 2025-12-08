/**
 * Request payload for updating a task
 */
export interface UpdateTaskRequest {
    title?: string;
    description?: string | null;
    completed?: boolean;
}
