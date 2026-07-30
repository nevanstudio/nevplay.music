import { syncAllReleases } from "@/lib/github-sync"
import { NextResponse } from "next/server"

/**
 * Cron job endpoint that syncs GitHub releases to the database
 * Called every 5 minutes by Vercel Cron
 */
export async function GET(req: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const result = await syncAllReleases()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[Release Sync API] Error:", error)
    return NextResponse.json(
      { error: "Failed to sync releases", message: String(error) },
      { status: 500 }
    )
  }
}
