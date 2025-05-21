import request from "@/config/axios";

export default async function deleteTask(taskId: string): Promise<void> {
    await request.delete(`/task/${taskId}`);
}