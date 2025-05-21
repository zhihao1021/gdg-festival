"use client";
import { ReactNode, useEffect, useState } from "react";

import styles from "./index.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabSwitch(): ReactNode {
    const [tab, setTab] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        setTab(pathname.startsWith("/tasks/my-tasks"));
    }, [pathname]);

    return <div className={styles.topBar} data-selected={tab}>
        <Link
            href="/tasks"
            className={styles.option}
            onClick={() => setTab(false)}
        >所有任務</Link>
        <Link
            href="/tasks/my-tasks"
            className={styles.option}
            onClick={() => setTab(true)}
        >我的任務</Link>
    </div >
}