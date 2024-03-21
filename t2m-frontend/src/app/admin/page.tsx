'use client'
import { useAppSelector } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo?.user?._id

  const router = useRouter()

  useEffect(() => {
    if (authState) {
      if (authInfo.user.role === "T2M ADMIN") {
        router.push("/admin/dashboard")
      }
    }
  }, [authState])

  return (
    <div></div>
  )
}
