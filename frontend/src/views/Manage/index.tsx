import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import userDataContext from "@/context/userData";

import ManageSideBar from "./SideBar";

import styles from "./index.module.scss";
import CreateTaskPage from "./CreateTask";
import reloadTaskDataContext from "@/context/reloadTaskData";
import { Task } from "@/schemas/task";
import getAllTaskList from "@/api/task/getAllTaskList";
import ManageTaskPage from "./ManageTask";

export default function ManagePage(): ReactNode {
    const [tasks, setTasks] = useState<Array<Task>>();

    const updateTask = useCallback(() => getAllTaskList().then(setTasks), []);

    const userData = useContext(userDataContext);

    useEffect(() => {
        updateTask()
    }, [updateTask]);

    return userData === undefined ? <></> : userData.is_admin ?
        <reloadTaskDataContext.Provider value={updateTask} > <div className={styles.managePage}>
            <ManageSideBar />
            <Routes>
                <Route path="/pending-task" element={<div>等待審核中</div>} />
                <Route path="/create-task" element={<CreateTaskPage />} />
                <Route path="/manage-task/*" element={<ManageTaskPage tasks={tasks ?? []} />} />
            </Routes>
        </div></reloadTaskDataContext.Provider> : <Navigate to="/" />
}