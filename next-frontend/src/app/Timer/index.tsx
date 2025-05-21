"use client";
import { ReactNode, useEffect, useMemo, useState } from "react";

import styles from "./index.module.scss";

const targetDate = new Date("2025-05-19T16:00:00Z");
const dataMap = ["天", "時", "分", "秒"];

export default function Timer(): ReactNode {
    const [time, setTime] = useState<number>();

    const displayData = useMemo(() => {
        if (!time) return [];

        const day = Math.floor(time / (1000 * 60 * 60 * 24)).toString();
        const hour = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
        const minute = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
        const second = Math.floor((time % (1000 * 60)) / 1000).toString().padStart(2, "0");

        return [day, hour, minute, second];
    }, [time]);

    useEffect(() => {
        if (!time) {
            setTime(targetDate.getTime() - Date.now());
        }
        else {
            setTimeout(() => setTime(v => v ? v - 1000 : targetDate.getTime() - Date.now()), 1000);
        }
    }, [time]);

    return <div className={styles.timer}>
        {
            displayData.map((data, index) => <div
                key={index}
                className={styles.box}
            >
                <div className={styles.time}>{data}</div>
                <div className={styles.unit}>{dataMap[index]}</div>
            </div>)
        }
    </div>
}