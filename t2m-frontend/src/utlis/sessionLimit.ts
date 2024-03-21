import { sendRequest } from "./api";
export async function sessionLimit(email: string, token: string) {

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/session-limit`,
        method: "POST",
        body: { email: email, token: token }
    })
    return  res.data
}