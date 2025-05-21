import { ReactNode, useContext } from "react";

import getAVatarUri from "@/utils/getAvatarUri";

import LoginBox from "./LoginBox";
import EditBox from "./EditBox";

import styles from "./index.module.scss";
import userDataContext from "@/context/userData";

export default function Profile(): ReactNode {
    const userData = useContext(userDataContext);

    return userData ? <div className={styles.profile}>
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
    </div> : <div className={styles.loginForm}>
        <h1>登入 / 註冊</h1>
        <LoginBox />
    </div>;
}