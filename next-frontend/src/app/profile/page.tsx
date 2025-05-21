"use server";
import { ReactNode } from "react";

import getAVatarUri from "@/utils/getAvatarUri";

import getServerUserData from "@/serverApi/getServerUserData";

import LoginBox from "./LoginBox";

import styles from "./page.module.scss";
import EditBox from "./EditBox";

export default async function Profile(): Promise<ReactNode> {
    try {
        const userData = await getServerUserData();
        return <div className={styles.profile}>
            <div className={styles.infoCard}>
                <img src={getAVatarUri()} />
                <div className={styles.info}>
                    <div className={styles.uid}>{`#${userData.uid}`}</div>
                    <div className={styles.name}>{userData.name}</div>
                    <div className={styles.department}>{userData.department}</div>
                </div>
            </div>
            <h2>個人資料</h2>
            <EditBox userData={userData} />
        </div>;
    }
    catch { }

    return <div className={styles.loginForm}>
        <h1>登入 / 註冊</h1>
        <LoginBox />
    </div>;
}