"use server";
import { ReactNode } from "react";

import whiteLogo from "@/assets/logo-white.svg";

import styles from "./index.module.scss";
import Link from "next/link";

export default async function TopBar(): Promise<ReactNode> {
    return <div className={styles.topBar}>
        <Link href="/" >
            <img src={whiteLogo.src} />
        </Link>
    </div>
}