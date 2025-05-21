import axios from "axios";

const clientRequest = axios.create();
const serverRequest = axios.create();

clientRequest.interceptors.request.use(config => {
    config.baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") ?? "Bearer";
    if (token !== null) config.headers.Authorization = `${tokenType} ${token}`;

    return config;
})

serverRequest.interceptors.request.use(async config => {
    config.baseURL = process.env.INTERNAL_API_ENDPOINT;

    const { tokenContainer } = await import("@/lib/tokenContainer");
    const token = await tokenContainer.getToken();

    if (token !== null) config.headers.Authorization = `Bearer ${token}`;

    return config;
})

const request = typeof window !== "undefined" ? clientRequest : serverRequest;
export default request;
