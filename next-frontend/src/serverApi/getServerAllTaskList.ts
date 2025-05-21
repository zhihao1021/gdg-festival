import useTokenCache from "@/lib/useTokenCache";

import getAllTaskList from "@/api/task/getAllTaskList";

const getServerAllTaskList = useTokenCache(
    getAllTaskList,
    [],
    { revalidate: 300, tags: ["tasklist"] }
);

export default getServerAllTaskList;
