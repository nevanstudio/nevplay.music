import { db } from "@/lib/db"
import { releases, betaReleases } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getReleases, findApkAsset } from "./github"

const REPO = "nevanstudio/nevplay_releases"
const API_BASE = `https://api.github.com/repos/${REPO}`

export type GitHubRelease = {
  tag_name: string
  name: string | null
  body: string | null
  published_at: string
  html_url: string
  prerelease: boolean
  draft: boolean
  assets: Array<{
    name: string
    browser_download_url: string
    size: number
    download_count: number
  }>
}

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
}

/**
 * Fetch all releases from GitHub (both stable and beta)
 */
async function fetchGitHubReleases(): Promise<GitHubRelease[]> {
  try {
    const res = await fetch(`${API_BASE}/releases?per_page=50`, {
      headers,
    })
    if (!res.ok) {
      console.error("[GitHub Sync] Failed to fetch releases:", res.status)
      return []
    }
    const data = (await res.json()) as GitHubRelease[]
    return data.filter((r) => !r.draft)
  } catch (error) {
    console.error("[GitHub Sync] Error fetching releases:", error)
    return []
  }
}

/**
 * Extract image URL from release body if present
 */
function extractImageUrl(body: string | null): string | null {
  if (!body) return null
  // Look for markdown image syntax ![alt](url)
  const match = body.match(/!\[.*?\]\((.*?)\)/)
  if (match) return match[1]
  // Look for direct image URLs
  const urlMatch = body.match(/(https?:\/\/[^\s]*\.(png|jpg|jpeg|gif|webp))/i)
  return urlMatch ? urlMatch[1] : null
}

/**
 * Sync stable releases to database
 */
export async function syncStableReleases(githubReleases: GitHubRelease[]) {
  const stableReleases = githubReleases.filter((r) => !r.prerelease)

  for (const ghRelease of stableReleases) {
    const apkAsset = findApkAsset({
      ...ghRelease,
      assets: ghRelease.assets,
    })

    if (!apkAsset) continue

    const imageUrl = extractImageUrl(ghRelease.body)

    // Check if release already exists
    const existing = await db
      .select()
      .from(releases)
      .where(eq(releases.githubReleaseId, ghRelease.tag_name))
      .limit(1)

    if (existing.length > 0) {
      // Update existing release
      await db
        .update(releases)
        .set({
          title: ghRelease.name || ghRelease.tag_name,
          description: ghRelease.body || undefined,
          releaseNotes: ghRelease.body || undefined,
          imageUrl: imageUrl || undefined,
          apkUrl: apkAsset.browser_download_url,
          updatedAt: new Date(),
        })
        .where(eq(releases.githubReleaseId, ghRelease.tag_name))
    } else {
      // Insert new release
      await db.insert(releases).values({
        appName: "NevPlay",
        version: ghRelease.tag_name,
        title: ghRelease.name || ghRelease.tag_name,
        description: ghRelease.body || undefined,
        releaseNotes: ghRelease.body || undefined,
        imageUrl: imageUrl || undefined,
        apkUrl: apkAsset.browser_download_url,
        downloadCount: apkAsset.download_count,
        githubReleaseId: ghRelease.tag_name,
        createdAt: new Date(ghRelease.published_at),
        updatedAt: new Date(),
      })
    }
  }
}

/**
 * Sync beta releases to database
 */
export async function syncBetaReleases(githubReleases: GitHubRelease[]) {
  const betaReleasesList = githubReleases.filter((r) => r.prerelease)

  for (const ghRelease of betaReleasesList) {
    const apkAsset = findApkAsset({
      ...ghRelease,
      assets: ghRelease.assets,
    })

    if (!apkAsset) continue

    const imageUrl = extractImageUrl(ghRelease.body)

    // Check if release already exists
    const existing = await db
      .select()
      .from(betaReleases)
      .where(eq(betaReleases.githubReleaseId, ghRelease.tag_name))
      .limit(1)

    if (existing.length > 0) {
      // Update existing beta release
      await db
        .update(betaReleases)
        .set({
          title: ghRelease.name || ghRelease.tag_name,
          description: ghRelease.body || undefined,
          releaseNotes: ghRelease.body || undefined,
          imageUrl: imageUrl || undefined,
          apkUrl: apkAsset.browser_download_url,
          updatedAt: new Date(),
        })
        .where(eq(betaReleases.githubReleaseId, ghRelease.tag_name))
    } else {
      // Insert new beta release
      await db.insert(betaReleases).values({
        appName: "NevPlay",
        version: ghRelease.tag_name,
        title: ghRelease.name || ghRelease.tag_name,
        description: ghRelease.body || undefined,
        releaseNotes: ghRelease.body || undefined,
        imageUrl: imageUrl || undefined,
        apkUrl: apkAsset.browser_download_url,
        downloadCount: apkAsset.download_count,
        githubReleaseId: ghRelease.tag_name,
        createdAt: new Date(ghRelease.published_at),
        updatedAt: new Date(),
      })
    }
  }
}

/**
 * Main sync function - called by cron job
 */
export async function syncAllReleases() {
  console.log("[GitHub Sync] Starting release sync...")

  const githubReleases = await fetchGitHubReleases()

  if (githubReleases.length === 0) {
    console.log("[GitHub Sync] No releases found")
    return { success: false, message: "No releases found" }
  }

  await syncStableReleases(githubReleases)
  await syncBetaReleases(githubReleases)

  console.log("[GitHub Sync] Release sync completed successfully")
  return { success: true, message: "Releases synced successfully" }
}
