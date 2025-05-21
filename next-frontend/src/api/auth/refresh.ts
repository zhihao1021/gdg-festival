import request from "@/config/axios";

import { JWT, JWTPayload } from "@/schemas/jwt";

import { updateTokenAndDecode } from "./_updateToken";

export default async function refresh(): Promise<JWTPayload> {
    const response = await request.put<JWT>("/auth/refresh");
    const jwt = response.data;

    localStorage.setItem("token_type", jwt.token_type);
    localStorage.setItem("access_token", jwt.access_token);

    return updateTokenAndDecode(jwt);
}