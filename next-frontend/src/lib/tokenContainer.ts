import { JWTPayload } from "@/schemas/jwt";
import { jwtDecode } from "jwt-decode";

interface TokenContainer {
    token: string | null,
};

const tokenLocalStorage = new AsyncLocalStorage<TokenContainer>();

export const tokenContainer = {
    run<T>(container: TokenContainer, callback: () => T): T {
        try {
            if (container.token) {
                const jwtPayload = jwtDecode<JWTPayload>(container.token);
                if (Date.now() >= jwtPayload.exp * 1000) {
                    container.token = null;
                }
            }
        }
        catch {
            container.token = null;
        }

        return tokenLocalStorage.run(container, callback);
    },

    async getToken(): Promise<string | null> {
        const container = tokenLocalStorage.getStore();
        return container ? container.token : null;
    },
};