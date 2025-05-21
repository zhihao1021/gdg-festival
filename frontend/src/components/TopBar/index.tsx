import { ReactNode } from "react";
import { Link } from "react-router-dom";

import whiteLogo from "@/assets/logo-white.svg";

import styles from "./index.module.scss";

export default function TopBar(): ReactNode {
    return <div className={styles.topBar}>
        <Link to="/" >
            <img src={whiteLogo} />
        </Link>
    </div>
}