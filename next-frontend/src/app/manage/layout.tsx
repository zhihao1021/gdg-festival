import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { User } from "@/schemas/user";

import getServerUserData from "@/serverApi/getServerUserData";

import styles from "./layout.module.scss";
import ManageSideBar from "./SideBar";

export default async function ManageLayout({ children }: { children: ReactNode }): Promise<ReactNode> {
    let userData: User | null = null
    try {
        userData = await getServerUserData();
    }
    catch {
        redirect("/");
    }
    if (!userData.is_admin) redirect("/");

    return <div className={styles.managePage}>
        <ManageSideBar />
        {children}
    </div>
}