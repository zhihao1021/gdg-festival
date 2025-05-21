"use client";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { JWT, JWTPayload } from "@/schemas/jwt";

export function updateTokenAndDecode(jwt: JWT): JWTPayload {
    localStorage.setItem("token_type", jwt.token_type);
    localStorage.setItem("access_token", jwt.access_token);

    Cookies.set("token", jwt.access_token, {
        path: "/",
        sameSite: "strict",
        secure: true
    });

    const payload = jwtDecode<JWTPayload>(jwt.access_token);
    payload.exp *= 1000;
    payload.iat *= 1000;

    return payload;
}