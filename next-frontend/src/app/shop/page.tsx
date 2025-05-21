"use server";
import { ReactNode } from "react";

import { User } from "@/schemas/user";

import getServerUserData from "@/serverApi/getServerUserData";

import styles from "./page.module.scss";

export default async function Shop(): Promise<ReactNode> {
    let userData: User | null = null;
    try {
        userData = await getServerUserData();
    }
    catch {}

    return <>
        {
            userData && <div className={styles.score}>
                <div className={`ms ${styles.icon}`}>paid</div>
                <div className={styles.scoreInfo}>
                    <div className={styles.scoreTitle}>你的點數</div>
                    <div className={styles.value}>{userData.score}</div>
                </div>
            </div>
        }
    </>
}