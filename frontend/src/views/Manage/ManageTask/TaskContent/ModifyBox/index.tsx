"use client";
import { ReactNode, useContext } from "react";

import { Task } from "@/schemas/task";

import updateTask from "@/api/task/updateTask";

import EditTask from "@/components/EditTask";
import reloadTaskDataContext from "@/context/reloadTaskData";


type propsType = Readonly<{
    task: Task,
    taskId: string
}>

export default function ModifyTaskBox(props: propsType): ReactNode {
    const {
        task,
        taskId
    } = props;

    const reloadTaskData = useContext(reloadTaskDataContext);

    return <div>
        <EditTask
            data={task}
            buttonText="完成編輯"
            callback={data => updateTask(taskId, data).then(() => reloadTaskData())}
            failedMessage="儲存失敗"
            successMessage="儲存成功"
        />
    </div>
}