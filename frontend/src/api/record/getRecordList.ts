import request from "@/config/axios";

import { Record } from "@/schemas/record";

export default async function getRecordList(): Promise<Array<Record>> {
    const response = await request.get<Array<Record>>("/record");
    
    return response.data;
}