import request from "@/config/axios";

import { User, UserUpdate } from "@/schemas/user";

export default async function updateUserData(data: UserUpdate): Promise<User> {
    const response = await request.put<User>("/user", data);

    return response.data;
}