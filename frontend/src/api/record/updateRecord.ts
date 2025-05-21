import request from "@/config/axios";

import { Record, RecordUpdate } from "@/schemas/record";

export default async function updateRecord(record: RecordUpdate): Promise<Record> {
    const response = await request.put<Record>("/record", record);

    return response.data;
}