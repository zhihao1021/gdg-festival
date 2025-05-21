export interface JWT {
    access_token: string,
    token_type: string,
}

export interface JWTPayload {
    sub: string,
    iat: number,
    exp: number,
    is_admin: boolean,
}