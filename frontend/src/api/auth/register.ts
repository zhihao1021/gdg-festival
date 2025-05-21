import request from "@/config/axios";

import { JWT, JWTPayload } from "@/schemas/jwt";
import { UserCreate } from "@/schemas/user";

import { updateTokenAndDecode } from "./_updateToken";

export default async function register(data: UserCreate): Promise<JWTPayload> {
    const response = await request.post<JWT>("/auth/register", data);
    const jwt = response.data;

    return updateTokenAndDecode(jwt);
}