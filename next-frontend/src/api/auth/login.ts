import request from "@/config/axios";

import { JWT, JWTPayload } from "@/schemas/jwt";
import { LoginData } from "@/schemas/loginData";

import { updateTokenAndDecode } from "./_updateToken";

export default async function login(data: LoginData): Promise<JWTPayload> {
    const response = await request.post<JWT>("/auth/login", data);
    const jwt = response.data;

    return updateTokenAndDecode(jwt);
}