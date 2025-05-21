import { ReactNode } from "react";

import LoadingStrip from "@/components/LoadingStrip";

import styles from "./loading.module.scss";

export default function Loading(): ReactNode {
    return <div className={styles.loading}>
        <LoadingStrip className={styles.loadingStrip} show />
    </div>
}