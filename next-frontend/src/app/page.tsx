"use server";
import { ReactNode } from "react";

import Timer from "./Timer";

import styles from "./page.module.scss";
import Link from "next/link";

export default async function Root(): Promise<ReactNode> {
    return <>
        <h2 className={styles.title}>距離遊戲結束</h2>
        <Timer />
        <Link href="/tasks" className={styles.start}>
            <div>開始接取任務</div>
            <div className={`ms ${styles.icon}`}>arrow_right_alt</div>
        </Link>
        <hr className={styles.split} />
        <h2 className={styles.title}>如何參與任務</h2>
        <div className={styles.howTo}>
            <div className={`ms ${styles.icon}`}>login</div>
            <div className={styles.context}>
                <h3>#1 登入帳號</h3>
                <div>先登入帳號才能夠開始任務</div>
            </div>
        </div>
        <div className={styles.howTo}>
            <div className={`ms ${styles.icon}`}>check</div>
            <div className={styles.context}>
                <h3>#2 從任務牆中選取一個任務</h3>
                <div>瀏覽多樣化的任務，選擇符合你興趣的挑戰</div>
            </div>
        </div>
        <div className={styles.howTo}>
            <div className={`ms ${styles.icon}`}>photo_camera</div>
            <div className={styles.context}>
                <h3>#3 完成挑戰並拍攝紀錄</h3>
                <div>按照任務要求完成挑戰，並用照片或影片記錄下來</div>
            </div>
        </div>
        <div className={styles.howTo}>
            <div className={`ms ${styles.icon}`}>crown</div>
            <div className={styles.context}>
                <h3>#4 查看積分與排行榜</h3>
                <div>在排行榜上查看你的排名，與其他參與者互相競爭</div>
            </div>
        </div>
        <div className={styles.howTo}>
            <div className={`ms ${styles.icon}`}>featured_seasonal_and_gifts</div>
            <div className={styles.context}>
                <h3>#5 兌換獎品</h3>
                <div>使用你獲得的積分兌換展覽專屬獎品和體驗</div>
            </div>
        </div>
    </>;
}