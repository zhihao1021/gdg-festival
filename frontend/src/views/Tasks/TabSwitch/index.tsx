import { ReactNode, useEffect, useMemo, useState } from "react";

import styles from "./index.module.scss";
import { Link, useLocation } from "react-router-dom";

export default function TabSwitch(): ReactNode {
    const [tab, setTab] = useState<boolean>(false);
    const location = useLocation();

    const pathname = useMemo(() => location.pathname, [location]);

    useEffect(() => {
        setTab(pathname.startsWith("/tasks/my-tasks"));
    }, [pathname]);

    return <div className={styles.topBar} data-selected={tab}>
        <Link
            to="/tasks"
            className={styles.option}
            onClick={() => setTab(false)}
        >所有任務</Link>
        <Link
            to="/tasks/my-tasks"
            className={styles.option}
            onClick={() => setTab(true)}
        >我的任務</Link>
    </div >
}