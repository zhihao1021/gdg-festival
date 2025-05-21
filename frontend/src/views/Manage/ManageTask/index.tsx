import { ReactNode, useEffect, useState } from "react";

import Tasks from "./Tasks";
import { Task } from "@/schemas/task";
import getTaskCount from "@/api/task/getTaskCount";
import { Route, Routes } from "react-router-dom";
import ModifyTaskPage from "./TaskContent";

type propsType = Readonly<{
    tasks: Array<Task>,
}>;

export default function ManageTaskPage(props: propsType): ReactNode {
    const { tasks } = props;

    const [acquiredCount, setAcquiredCount] = useState<{ [key: string]: number }>();

    useEffect(() => {
        getTaskCount().then(setAcquiredCount);
    }, []);

    return acquiredCount && <div>
        <Routes>
            <Route path="" element={<Tasks
                allTasks={tasks}
                acquiredCount={acquiredCount}
            />} />
            <Route path="/:taskId" element={<ModifyTaskPage tasks={tasks} />} />
        </Routes>
    </div>
}