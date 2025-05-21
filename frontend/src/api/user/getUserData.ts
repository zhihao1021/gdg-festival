import request from "@/config/axios";

import { User } from "@/schemas/user";

export default async function getUserData(): Promise<User> {
    const response = await request.get<User>("/user");

    return response.data;
}