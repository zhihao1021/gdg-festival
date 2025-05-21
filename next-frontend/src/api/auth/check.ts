import request from "@/config/axios";

import { AxiosError } from "axios";

export default async function check_account_exist(email: string): Promise<boolean> {
    try {
        await request.post("/auth/check", { email: email });
        return true;
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status;
            switch (status) {
                case 404:
                    return false;
                default:
                    throw error;
            }
        }
        else {
            throw error;
        }
    }
}