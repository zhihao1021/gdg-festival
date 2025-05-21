"use client";
import { ReactNode, useCallback } from "react";

import { TaskCreate } from "@/schemas/task";

import createTask from "@/api/task/createTask";

import updateTaskAction from "@/actions/updateTasksAction";

import EditTask from "@/components/EditTask";

export default function CreateTaskPage(): ReactNode {
    const create = useCallback((data: TaskCreate) => {
        return createTask(data).then(
            () => updateTaskAction()
        )
    }, []);

    return <EditTask
        buttonText="創建任務"
        callback={create}
        successMessage="創建成功"
        failedMessage="創建失敗"
    />
}