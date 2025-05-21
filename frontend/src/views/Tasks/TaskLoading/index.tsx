import { ReactNode } from "react";

import LoadingStrip from "@/components/LoadingStrip";

import styles from "./index.module.scss";

export default function TaskLoading(): ReactNode {
    return <div className={styles.loading}>
        <LoadingStrip className={styles.loadingStrip} show />
    </div>
}