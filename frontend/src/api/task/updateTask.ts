import request from "@/config/axios";

import { Task, TaskUpdate } from "@/schemas/task";

export default async function updateTask(taskId: string, data: TaskUpdate): Promise<Task> {
    const response = await request.put<Task>(`/task/${taskId}`, data);

    return response.data;
}