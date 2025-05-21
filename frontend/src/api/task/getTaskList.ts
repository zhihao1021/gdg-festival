import request from "@/config/axios";

import { Task } from "@/schemas/task";

export default async function getTaskList(): Promise<Array<Task>> {
    const response = await request.get<Array<Task>>("/task");

    return response.data;
}