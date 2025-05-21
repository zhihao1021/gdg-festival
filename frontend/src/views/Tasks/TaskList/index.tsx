import { CSSProperties, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Record } from "@/schemas/record";
import { Task } from "@/schemas/task";

import TaskCard from "./TaskCard";

import styles from "./index.module.scss";

type propsType = Readonly<{
    tasks: Array<Task>,
    userRecords: Array<Record> | null,
    acquiredCount: { [key: string]: number },
}>;


function taskToDate(task: Task): string {
    const date = new Date(task.release_date * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}


export default function TaskList(props: propsType): ReactNode {
    const {
        tasks,
        userRecords,
        acquiredCount
    } = props;

    const location = useLocation();
    const router = useNavigate();

    const [dateList, setDateList] = useState<Array<string>>([]);
    const [dateIndex, setDateIndex] = useState<number>(0);

    const pathname = useMemo(() => location.pathname, [location]);

    const displayTasks = useMemo(() => {
        if (!pathname.includes("my-tasks")) {
            if (dateList.length === 0) return [];
            const targetDate = dateList[dateIndex];

            return tasks.filter(
                task => taskToDate(task) === targetDate
            ).sort((a, b) => a.release_date - b.release_date);
        }

        if (userRecords === null) return [];

        return tasks.filter(
            task => userRecords.some(record => record.task_id === task.uid)
        ).sort((a, b) => a.release_date - b.release_date);
    }, [tasks, userRecords, pathname, dateList, dateIndex]);

    useEffect(() => {
        if (userRecords === undefined && pathname.includes("my-tasks"))
            router("/profile");
    }, [pathname, userRecords]);

    useEffect(() => {
        setDateList(Array.from(new Set(tasks.map(taskToDate))).sort());
    }, [tasks]);

    return <div className="">
        {
            !pathname.includes("my-tasks") && <div className={styles.dateList} style={{
                "--index": dateIndex
            } as CSSProperties}>
                <button
                    className="ms"
                    onClick={() => setDateIndex(v => Math.max(0, v - 1))}
                    disabled={dateIndex <= 0}
                >chevron_left</button>
                <div className={styles.dateMask}>
                    <div className={styles.date}>
                        {dateList.map((date, index) => <div
                            key={date}
                            className={styles.dateItem}
                            data-selected={index === dateIndex}
                            onClick={() => setDateIndex(index)}
                        >{date}</div>)}
                    </div>
                </div>
                <button
                    className="ms"
                    onClick={() => setDateIndex(v => Math.min(dateList.length - 1, v + 1))}
                    disabled={dateIndex >= dateList.length - 1}
                >chevron_right</button>
            </div>
        }
        {
            displayTasks.map(task => <TaskCard
                key={task.uid}
                task={task}
                inUserTasks={pathname.includes("my-tasks")}
                acquiredCount={acquiredCount[task.uid] ?? 0}
                status={userRecords ? userRecords.find(record => record.task_id === task.uid)?.status : undefined}
            />)
        }
    </div>
}