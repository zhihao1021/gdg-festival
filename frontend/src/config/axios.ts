import axios from "axios";

const clientRequest = axios.create();

clientRequest.interceptors.request.use(config => {
    config.baseURL = import.meta.env.VITE_API_END_POINT;
    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") ?? "Bearer";
    if (token !== null) config.headers.Authorization = `${tokenType} ${token}`;

    return config;
})

export default clientRequest;
