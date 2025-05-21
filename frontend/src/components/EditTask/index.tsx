import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { Task, TaskCreate } from "@/schemas/task";
import { TaskLevelMap } from "@/schemas/taskLevelMap";

import InputBox from "@/components/InputBox";

import styles from "./index.module.scss";

type propsType = Readonly<{
    data?: Task,
    buttonText: string,
    callback: (data: TaskCreate) => Promise<any>,
    successMessage: string,
    failedMessage: string,
}>;

export default function EditTask(props: propsType): ReactNode {
    const {
        data,
        buttonText,
        callback,
        successMessage,
        failedMessage
    } = props;

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [points, setPoints] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [level, setLevel] = useState<number>(0);
    const [display, setDisplay] = useState<boolean>(true);

    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const isVerify = useMemo(() => {
        if (title.length === 0) return false;
        if (description.length === 0) return false;
        if (points < 0) return false;
        if (totalCount < 0) return false;
        if (level < 0 || level >= TaskLevelMap.length) return false;

        return true;
    }, [title, description, points, totalCount, level, display]);

    const reset = useCallback(() => {
        setTitle("");
        setDescription("");
        setPoints(0);
        setTotalCount(0);
        setLevel(0);
        setDisplay(true);
    }, []);

    const next = useCallback(() => {
        setLoading(true);

        callback({
            title: title,
            description: description,
            points: points,
            total_count: totalCount,
            level: level,
            display: display,
            release_date: data?.release_date ?? Math.floor(Date.now() / 1000),
        }).then(() => {
            reset();
            setMessage(successMessage);
            setTimeout(() => setMessage(""), 2000);
        }).catch(() => {
            setMessage(failedMessage);
            setTimeout(() => setMessage(""), 2000);
        }).finally(() => setLoading(false));
    }, [reset, title, description, points, totalCount, level, display, callback, successMessage, failedMessage, data]);

    useEffect(() => {
        if (data === undefined) return;
        setTitle(data.title);
        setDescription(data.description);
        setPoints(data.points);
        setTotalCount(data.total_count);
        setLevel(data.level);
        setDisplay(data.display);
    }, [data]);

    return <div>
        <h1>創建任務</h1>
        <div className={styles.field}>
            <div className={styles.key}>標題</div>
            <InputBox
                className={styles.inputBox}
                value={title}
                setValue={setTitle}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>描述</div>
            <InputBox
                className={styles.inputBox}
                value={description}
                setValue={setDescription}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>分數</div>
            <InputBox
                className={styles.inputBox}
                type="number"
                value={points}
                setValue={setPoints}
                error={points < 0}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>可參與人數</div>
            <InputBox
                className={styles.inputBox}
                type="number"
                value={totalCount}
                setValue={setTotalCount}
                error={totalCount < 0}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>任務難度</div>
            <InputBox
                className={styles.inputBox}
                value={level}
                setValue={setLevel}
                options={TaskLevelMap}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>立即顯示</div>
            <label>
                <input type="checkbox" checked={display} onChange={event => setDisplay(event.target.checked)} />
            </label>
        </div>
        <div className={styles.buttonBox}>
            <div className={styles.message}>{message}</div>
            <button
                disabled={!isVerify || loading}
                onClick={next}
            >{buttonText}</button>
        </div>
    </div>
}