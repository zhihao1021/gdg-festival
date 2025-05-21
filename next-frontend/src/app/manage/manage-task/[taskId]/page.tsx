"use server";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import getServerAllTaskList from "@/serverApi/getServerAllTaskList";

import ModifyTaskBox from "./ModifyBox";


type propsType = Readonly<{
    params: Promise<{ taskId: string }>
}>

export default async function ModifyTaskPage(props: propsType): Promise<ReactNode> {
    const { params } = props;

    const { taskId } = await params;
    const allTasks = await getServerAllTaskList();
    const task = allTasks.find(task => task.uid === taskId);
    if (task === undefined) {
        redirect("/manage/manage-task");
    }

    return <div>
        <ModifyTaskBox
            task={task}
            taskId={taskId}
        />
    </div>
}