import request from "@/config/axios";

import { Task } from "@/schemas/task";

export default async function acquireTask(taskId: string): Promise<void> {
    await request.get<Task>(`/task/${taskId}/acquire`);
}