import request from "@/config/axios";

import { Task, TaskCreate } from "@/schemas/task";

export default async function createTask(data: TaskCreate): Promise<Task> {
    const response = await request.post<Task>("/task", data);

    return response.data;
}