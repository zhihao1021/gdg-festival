export interface Record {
    uid: string,
    task_id: string,
    user_id: string,
    status: "acquired" | "pending" | "finished"
}

export interface RecordUpdate {
    task_id?: string,
    user_id?: string,
    status?: "acquired" | "pending" | "finished"
}