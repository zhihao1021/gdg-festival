"use client";
import { ReactNode } from "react";

import { Task } from "@/schemas/task";

import updateTask from "@/api/task/updateTask";

import updateTaskAction from "@/actions/updateTasksAction";

import EditTask from "@/components/EditTask";


type propsType = Readonly<{
    task: Task,
    taskId: string
}>

export default function ModifyTaskBox(props: propsType): ReactNode {
    const {
        task,
        taskId
    } = props;

    return <div>
        <EditTask
            data={task}
            buttonText="完成編輯"
            callback={data => updateTask(taskId, data).then(() => updateTaskAction())}
            failedMessage="儲存失敗"
            successMessage="儲存成功"
        />
    </div>
}