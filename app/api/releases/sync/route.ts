import { syncAllReleases } from "@/lib/github-sync"
import { NextResponse } from "next/server"

/**
 * Sync endpoint for GitHub releases
 * Can be called by Vercel Cron (GET) or manually (POST)
 */
async function handleSync() {
  try {
    console.log("[Release Sync API] Starting sync...")
    const result = await syncAllReleases()
    console.log("[Release Sync API] Sync completed:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[Release Sync API] Error:", error)
    return NextResponse.json(
      { error: "Failed to sync releases", message: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  return handleSync()
}

export async function POST(req: Request) {
  return handleSync()
}
