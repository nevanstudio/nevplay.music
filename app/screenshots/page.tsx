import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Screenshots",
  description: "This page has been removed. Redirecting to home.",
}

export default function ScreenshotsPage() {
  redirect("/")
}
