"use server"

export async function checkForUpdates() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BETTER_AUTH_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/releases/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Sync failed with status ${response.status}`)
    }

    const data = await response.json()
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
