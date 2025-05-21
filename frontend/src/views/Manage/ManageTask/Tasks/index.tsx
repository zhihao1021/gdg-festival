"use client";
import { ReactNode, useMemo, useState } from "react";

import InputBox from "@/components/InputBox";

import TaskCard from "@/views/Tasks/TaskList/TaskCard";

import { Task } from "@/schemas/task";

import styles from "./index.module.scss";

type propsType = Readonly<{
    allTasks: Array<Task>,
    acquiredCount: { [key: string]: number }
}>;

export default function Tasks(props: propsType): ReactNode {
    const {
        allTasks,
        acquiredCount
    } = props

    const [searchText, setSearchText] = useState<string>("");

    const displayTasks = useMemo(() => allTasks.filter(task => {
        const search = searchText.trim().toLowerCase();

        return task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search) || task.uid.includes(search);
    }).sort((a, b) => parseInt(a.uid) - parseInt(b.uid)), [allTasks, searchText]);

    return <>
        <div className={styles.searchBar}>
            <span className={`ms ${styles.icon}`}>search</span>
            <InputBox
                value={searchText}
                setValue={setSearchText}
                className={styles.inputBox}
            />
        </div>
        <div>
            {
                displayTasks.map(task => <TaskCard
                    key={task.uid}
                    task={task}
                    acquiredCount={acquiredCount[task.uid] ?? 0}
                    inUserTasks={false}
                    inAdmin
                />)
            }
        </div>
    </>
}