import getTaskCount from "@/api/task/getTaskCount";

import { unstable_cache } from "next/cache";

const getServerAcquiredCount = unstable_cache(
    getTaskCount,
    [],
    { revalidate: 300, tags: ["acquireCount", "userTaskOperation"] }
);

export default getServerAcquiredCount;
