export default function getAVatarUri(uid?: string): string {
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}user/avatar${uid ? `/${uid}` : ""}`;
}