export default function getAVatarUri(uid?: string): string {
    return `${import.meta.env.VITE_API_END_POINT}/user/avatar${uid ? `/${uid}` : ""}`;
}