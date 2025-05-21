"use server";
import { ReactNode } from "react";

import getServerAcquiredCount from "@/serverApi/getServerAcquiredCount";
import getServerAllTaskList from "@/serverApi/getServerAllTaskList";

import Tasks from "./Tasks";

export default async function ManageTaskPage(): Promise<ReactNode> {
    const allTasks = await getServerAllTaskList();
    const acquiredCount = await getServerAcquiredCount();

    return <div>
        <Tasks
            allTasks={allTasks}
            acquiredCount={acquiredCount}
        />
    </div>
}