"use server"

import { syncAllReleases } from "@/lib/github-sync"

export async function checkForUpdates() {
  try {
    const data = await syncAllReleases()
    return {
      success: true,
      message: "Release updates checked successfully",
      data,
    }
  } catch (error) {
    console.error("[Sync Action] Error:", error)
    return {
      success: false,
      message: "Failed to check for updates",
      error: String(error),
    }
  }
}
