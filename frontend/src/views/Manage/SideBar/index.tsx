import { ReactNode } from "react";

import { Link } from "react-router-dom";

import styles from "./index.module.scss";

export default function ManageSideBar(): ReactNode {
    return <div className={styles.sideBar}>
        <h4>功能表</h4>
        <Link to="/manage/pending-task" >等待審核中</Link>
        <hr />
        <Link to="/manage/create-task" >創建任務</Link>
        <hr />
        <Link to="/manage/manage-task" >管理任務</Link>
    </div>
}