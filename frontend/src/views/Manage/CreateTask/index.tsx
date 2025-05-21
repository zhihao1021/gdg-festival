import { ReactNode, useCallback } from "react";

import { TaskCreate } from "@/schemas/task";

import createTask from "@/api/task/createTask";

import EditTask from "@/components/EditTask";

export default function CreateTaskPage(): ReactNode {
    const create = useCallback((data: TaskCreate) => {
        return createTask(data);
    }, []);

    return <EditTask
        buttonText="創建任務"
        callback={create}
        successMessage="創建成功"
        failedMessage="創建失敗"
    />
}