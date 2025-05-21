"use server";
import { ReactNode } from "react";

import styles from "./index.module.scss";
import Link from "next/link";

export default async function ManageSideBar(): Promise<ReactNode> {
    return <div className={styles.sideBar}>
        <h4>功能表</h4>
        <Link href="/manage/pending-task" >等待審核中</Link>
        <hr />
        <Link href="/manage/create-task" >創建任務</Link>
        <hr />
        <Link href="/manage/manage-task" >管理任務</Link>
    </div>
}