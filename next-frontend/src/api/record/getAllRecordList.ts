import request from "@/config/axios";

import { Record } from "@/schemas/record";

export default async function getAllRecordList(): Promise<Array<Record>> {
    const response = await request.get<Array<Record>>("/record/all");
    
    return response.data;
}