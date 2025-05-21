import getRecordList from "@/api/record/getRecordList";

import useTokenCache from "@/lib/useTokenCache";

const getServerRecordList = useTokenCache(
    getRecordList,
    [],
    { revalidate: 1200, tags: ["recordlist", "userTaskOperation"] }
);

export default getServerRecordList;
