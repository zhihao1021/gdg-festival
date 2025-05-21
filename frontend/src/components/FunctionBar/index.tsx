
import { ReactNode, useMemo } from "react";

import checkIsMobile from "@/utils/detectmobilebrowser";

import MobileFunctionBar from "./MobileFunctionBar";

export default function FunctionBar(): ReactNode {
    const isMobile = useMemo(() => checkIsMobile(navigator.userAgent), []);

    if (!isMobile) return null;

    return <MobileFunctionBar />
}