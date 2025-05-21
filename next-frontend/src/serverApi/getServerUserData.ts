import getUserData from "@/api/user/getUserData";

import useTokenCache from "@/lib/useTokenCache";

const getServerUserData = useTokenCache(
    getUserData,
    [],
    { revalidate: 3600, tags: ["userData"] }
);

export default getServerUserData;