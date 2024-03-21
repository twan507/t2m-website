import { sendRequest } from "./api";
import { notification } from "antd";

export async function signOut(access_token: string) {

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
        headers: { 'Authorization': `Bearer ${access_token}` },
        method: "POST"
    })
    if (!res?.error) {
        // window.location.reload()
        notification.info({
            message: "Đăng xuất"
        })

    } else {
        notification.error({
            message: res.error
        })
    }
}