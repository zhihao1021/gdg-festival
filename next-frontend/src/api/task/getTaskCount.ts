import request from "@/config/axios";

export default async function getTaskCount(): Promise<{ [key: string]: number }> {
    const response = await request.get<{ [key: string]: number }>("/task/count");

    return response.data;
}