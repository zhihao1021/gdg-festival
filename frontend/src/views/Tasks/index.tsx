import { ReactNode, useCallback, useEffect, useState } from "react";

import { Record } from "@/schemas/record";
import { Task } from "@/schemas/task";

import getTaskList from "@/api/task/getTaskList";
import getTaskCount from "@/api/task/getTaskCount";

import TabSwitch from "./TabSwitch";
import TaskList from "./TaskList";
import getRecordList from "@/api/record/getRecordList";
import TaskLoading from "./TaskLoading";
import reloadTaskDataContext from "@/context/reloadTaskData";

export default function TaskPage(): ReactNode {
    const [tasks, setTasks] = useState<Array<Task>>();
    const [acquiredCount, setAcquiredCount] = useState<{ [key: string]: number }>();
    const [records, setRecords] = useState<Array<Record> | null>();

    const updateTask = useCallback(() => {
        return Promise.all([
            getTaskList().then(setTasks),
            getTaskCount().then(setAcquiredCount),
            getRecordList().then(
                v => setRecords(v.sort((a, b) => parseInt(a.uid) - parseInt(b.uid)))
            ).catch(() => setRecords(null))
        ])
    }, []);

    useEffect(() => {
        updateTask();
    }, []);

    return tasks === undefined || records === undefined || acquiredCount === undefined ? <TaskLoading /> : <reloadTaskDataContext.Provider value={updateTask}>
        <TabSwitch />
        <TaskList
            tasks={tasks}
            userRecords={records}
            acquiredCount={acquiredCount}
        />
    </reloadTaskDataContext.Provider>
}