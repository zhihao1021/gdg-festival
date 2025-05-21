import { ReactNode, useMemo } from "react";

import ModifyTaskBox from "./ModifyBox";
import { Task } from "@/schemas/task";
import { useNavigate, useParams } from "react-router-dom";


type propsType = Readonly<{
    tasks: Array<Task>,
}>

export default function ModifyTaskPage(props: propsType): ReactNode {
    const { tasks } = props;

    const { taskId } = useParams();

    const router = useNavigate();

    const task = useMemo(() => {
        const task = tasks.find(task => task.uid === taskId)
        if (task === undefined) router("/manage/manage-task");
        return task;
    }, [taskId, tasks, router]);

    return task && taskId && <div>
        <ModifyTaskBox
            task={task}
            taskId={taskId}
        />
    </div>
}