import getTaskList from "@/api/task/getTaskList";

import { unstable_cache } from "next/cache";

const getServerTaskList = unstable_cache(
    getTaskList,
    [],
    { revalidate: 300, tags: ["tasklist"] }
);

export default getServerTaskList;
