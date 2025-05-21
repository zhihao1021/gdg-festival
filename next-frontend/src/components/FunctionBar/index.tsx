"use server";
import { headers } from "next/headers";
import { ReactNode } from "react";

import checkIsMobile from "@/utils/detectmobilebrowser";

import MobileFunctionBar from "./MobileFunctionBar";

export default async function FunctionBar(): Promise<ReactNode> {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const isMobile = userAgent ? checkIsMobile(userAgent) : false;

    if (!isMobile) return null;

    return <MobileFunctionBar />
}