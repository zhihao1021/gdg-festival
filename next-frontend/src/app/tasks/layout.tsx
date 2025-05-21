"use server";
import { ReactNode } from "react";

import getServerTaskList from "@/serverApi/getServerTaskList";
import getServerRecordList from "@/serverApi/getServerRecordList";

import TabSwitch from "./TabSwitch";
import TaskList from "./TaskList";
import { Record } from "@/schemas/record";
import getServerAcquiredCount from "@/serverApi/getServerAcquiredCount";

export default async function TaskLayout(): Promise<ReactNode> {
    const tasks = await getServerTaskList();
    const acquiredCount = await getServerAcquiredCount();
    let records: Array<Record> | undefined = undefined;
    try {
        records = (await getServerRecordList()).sort((a, b) => parseInt(a.uid) - parseInt(b.uid));
    }
    catch { }

    return <>
        <TabSwitch />
        <TaskList
            tasks={tasks}
            userRecords={records}
            acquiredCount={acquiredCount}
        />
    </>
}