import { AxiosError } from "axios";
import { CSSProperties, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Task } from "@/schemas/task";
import { TaskLevelMap } from "@/schemas/taskLevelMap";

import acquireTask from "@/api/task/acquireTask";
import finishTask from "@/api/task/finishTask";
import dropTask from "@/api/task/dropTask";

import LoadingStrip from "@/components/LoadingStrip";

import reloadTaskDataContext from "@/context/reloadTaskData";

import styles from "./index.module.scss";

type propsType = Readonly<{
    task: Task,
    inUserTasks: boolean
    acquiredCount: number,
    status?: "acquired" | "pending" | "finished"
    inAdmin?: boolean
}>;

export default function TaskCard(porps: propsType): ReactNode {
    const {
        task,
        inUserTasks,
        acquiredCount,
        status,
        inAdmin
    } = porps;

    const [acquireLoading, setAcquireLoading] = useState<boolean>(false);
    const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
    const [cancelLoading, setCancelLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const router = useNavigate();

    const reloadTaskData = useContext(reloadTaskDataContext);

    const displayDate = useMemo(() => {
        const release_date = new Date(task.release_date * 1000);

        const month = (release_date.getMonth() + 1).toString().padStart(2, "0");
        const date = (release_date.getDate()).toString().padStart(2, "0");
        const hours = (release_date.getHours()).toString().padStart(2, "0");
        const minutes = (release_date.getMinutes()).toString().padStart(2, "0");

        return `發布於 ${month}/${date} ${hours}:${minutes}`;
    }, [task]);

    const remainCount = useMemo(() => task.total_count - acquiredCount, [task, acquiredCount]);

    const disabled = useMemo(
        () => remainCount === 0 && !inUserTasks,
        [remainCount, inUserTasks]
    );

    const acquireTaskFunc = useCallback(() => {
        setAcquireLoading(true);
        acquireTask(task.uid).then(
            () => reloadTaskData()
        ).then(() => {
            setMessage("接取成功");
            setTimeout(() => setMessage(""), 2000);
        }).catch((error: AxiosError) => {
            const status = error.response?.status;
            switch (status) {
                case 401:
                    router("/profile");
            }
        }).finally(() => setAcquireLoading(false));
    }, [task, reloadTaskData]);

    const finishTaskFunc = useCallback(() => {
        setFinishedLoading(true);
        finishTask(task.uid).then(
            () => reloadTaskData()
        ).then(() => {
            setMessage("任務已完成");
            setTimeout(() => setMessage(""), 2000);
        }).catch(() => {
            setMessage("完成失敗，請稍後再試");
            setTimeout(() => setMessage(""), 2000);
        }).finally(() => setFinishedLoading(false));
    }, [task, reloadTaskData]);

    const cancelTaskFunc = useCallback(() => {
        setCancelLoading(true);
        dropTask(task.uid).then(
            () => reloadTaskData()
        ).catch(() => {
            setMessage("取消失敗，請稍後再試");
            setTimeout(() => setMessage(""), 2000);
        }).finally(() => setCancelLoading(false));
    }, [task, reloadTaskData]);

    return <div className={styles.taskCard} data-disabled={disabled && !inAdmin} onClick={() => {
        if (!inAdmin) return;
        router(`/manage/manage-task/${task.uid}`);
    }}>
        <div className={styles.tagBox}>
            {status === "finished" && <div className={styles.finished}>已完成</div>}
            {status === "pending" && <div className={styles.pending}>審核中</div>}
            <div className={styles.level} data-level={task.level}>{TaskLevelMap[task.level]}</div>
        </div>
        <div className={styles.titleBox}>
            <div className={styles.uid}>{`#${task.uid}`}</div>
            <h2>{task.title}</h2>
        </div>
        <hr />
        <div className={styles.contextBox}>
            <div className={styles.box}>
                <div className={`ms ${styles.icon}`}>description</div>
                <div>{task.description}</div>
            </div>
            <div className={`${styles.box}`}>
                <div className={`ms ${styles.icon}`}>event</div>
                <div>{displayDate}</div>
            </div>
            <div className={`${styles.box} ${styles.half}`}>
                <div className={`ms ${styles.icon}`}>paid</div>
                <div>{`${task.points} 點`}</div>
            </div>
            <div className={`${styles.box} ${styles.half}`}>
                <div className={`ms ${styles.icon}`}>group</div>
                <div>{`${task.total_count} 人`}</div>
            </div>
        </div>
        {
            !inUserTasks && <>
                <div className={styles.progressBox}>
                    <div className={styles.remain}>剩餘名額：{remainCount} / {task.total_count}</div>
                    <div className={styles.progress} style={{
                        "--progress": (remainCount) / task.total_count,
                    } as CSSProperties} />
                </div>
            </>
        }
        {!inAdmin && <div className={styles.buttonBox} data-has-message={message !== ""}>
            <div className={styles.message}>{message}</div>
            {!inUserTasks && <button
                className={styles.acquire}
                disabled={remainCount === 0 || status !== undefined}
                onClick={acquireTaskFunc}
            >
                {status ? "已接取" : remainCount === 0 ? "任務已滿" : "接取任務"}
                <LoadingStrip show={acquireLoading} />
            </button>}
            {inUserTasks && status === "acquired" && <button
                className={styles.cancel}
                onClick={cancelTaskFunc}
            >
                取消任務
                <LoadingStrip show={cancelLoading} />
            </button>}
            {inUserTasks && status === "acquired" && <button
                className={styles.finished}
                onClick={finishTaskFunc}
            >
                完成任務
                <LoadingStrip show={finishedLoading} />
            </button>}
        </div>}
    </div>;
}