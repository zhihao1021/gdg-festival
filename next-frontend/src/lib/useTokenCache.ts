import { cookies } from "next/headers";
import { tokenContainer } from "./tokenContainer";
import { unstable_cache } from "next/cache";

import { ArgsType, AsyncCallback } from "@/types/Callback";
import { cache } from "react";

const funcMap: {
    [key: string]: AsyncCallback<ArgsType>
} = {};

export default function useTokenCache<T extends ArgsType, V extends AsyncCallback<T>>(
    func: V,
    keyParts?: string[],
    options?: {
        revalidate?: number | false;
        tags?: string[];
    }
): V {
    const funcName = `${func.name}-${func.toString().slice(0, 20)}`;
    const keyPartsString = keyParts?.sort().toString() ?? "";
    const optionsString = `${options?.revalidate ?? ""}-${options?.tags?.sort().toString() ?? ""}`;

    const funcId = `${funcName}-${keyPartsString}-${optionsString}`;
    if (funcMap[funcId]) {
        return funcMap[funcId] as V;
    }

    const cacheFunc = cache(unstable_cache(
        (token: string | null, ...args: T) => tokenContainer.run({
            token: token
        }, () => func(...args)),
        keyParts,
        options
    ));

    const result = (async (...args: T) => {
        const cookiesList = await cookies();
        const token = cookiesList.get("access_token")?.value ?? null;

        return await cacheFunc(token, ...args);
    }) as V;
    funcMap[funcId] = result;

    return result;
}
