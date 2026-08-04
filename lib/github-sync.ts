import { getDb } from "@/lib/db"
import { stableReleases, betaReleases } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getReleases, findApkAsset, extractImageUrl, findImageAsset } from "./github"

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
  "User-Agent": "NevPlaySite",
}

function buildHeaders(): HeadersInit {
  const h: HeadersInit = { ...headers }
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN
  if (token) h["Authorization"] = `token ${token}`
  return h
}

/**
 * Fetch all releases from GitHub (both stable and beta)
 */
async function fetchGitHubReleases(): Promise<GitHubRelease[]> {
  try {
    console.log("[GitHub Sync] Fetching from:", `${API_BASE}/releases?per_page=50`)
    const res = await fetch(`${API_BASE}/releases?per_page=50`, {
      headers: buildHeaders(),
    })
    if (!res.ok) {
      console.error("[GitHub Sync] Failed to fetch releases:", res.status, res.statusText)
      return []
    }
    const data = (await res.json()) as GitHubRelease[]
    console.log("[GitHub Sync] Found", data.length, "releases")
    const filtered = data.filter((r) => !r.draft)
    console.log("[GitHub Sync] After filtering drafts:", filtered.length, "releases")
    return filtered
  } catch (error) {
    console.error("[GitHub Sync] Error fetching releases:", error)
    return []
  }
}

/**
 * Image URL extraction is delegated to `lib/github.extractImageUrl`
 */

/**
 * Sync stable releases to database
 */
export async function syncStableReleases(githubReleases: GitHubRelease[]) {
  const stableReleasesList = githubReleases.filter((r) => !r.prerelease)
  console.log("[GitHub Sync] Stable releases found:", stableReleasesList.length)

  const db = await getDb()
  if (!db) {
    console.log("[GitHub Sync] Database not configured; skipping stable sync")
    return
  }

  for (const ghRelease of stableReleasesList) {
    console.log(`[GitHub Sync] Processing release: ${ghRelease.tag_name}`)
    console.log(`[GitHub Sync] Release has ${ghRelease.assets.length} assets`)
    ghRelease.assets.forEach((asset, i) => {
      console.log(`[GitHub Sync]   Asset ${i}: ${asset.name}`)
    })

    const apkAsset = findApkAsset({
      ...ghRelease,
      assets: ghRelease.assets,
    })

    if (!apkAsset) {
      console.log(`[GitHub Sync] No APK found for ${ghRelease.tag_name}, skipping`)
      continue
    }
    console.log(`[GitHub Sync] Found APK: ${apkAsset.name}`)

    const imageUrl = extractImageUrl(ghRelease.body) || findImageAsset(ghRelease)?.browser_download_url

    // Check if release already exists
    const existing = await db
      .select()
      .from(stableReleases)
      .where(eq(stableReleases.githubReleaseId, ghRelease.tag_name))
      .limit(1)

    if (existing.length > 0) {
      console.log(`[GitHub Sync] Updating existing release: ${ghRelease.tag_name}`)
      // Update existing release
      await db
        .update(stableReleases)
        .set({
          title: ghRelease.name || ghRelease.tag_name,
          description: ghRelease.body || undefined,
          releaseNotes: ghRelease.body || undefined,
          imageUrl: imageUrl || undefined,
          apkUrl: apkAsset.browser_download_url,
          updatedAt: new Date(),
        })
        .where(eq(stableReleases.githubReleaseId, ghRelease.tag_name))
    } else {
      console.log(`[GitHub Sync] Inserting new stable release: ${ghRelease.tag_name}`)
      // Insert new release
      await db.insert(stableReleases).values({
        id: ghRelease.tag_name,
        appName: "NevPlay",
        version: ghRelease.tag_name,
        title: ghRelease.name || ghRelease.tag_name,
        description: ghRelease.body || undefined,
        releaseNotes: ghRelease.body || undefined,
        imageUrl: imageUrl || undefined,
        apkUrl: apkAsset.browser_download_url,
        downloadCount: apkAsset.download_count,
        githubReleaseId: ghRelease.tag_name,
        prerelease: false,
      })
      console.log(`[GitHub Sync] Successfully inserted: ${ghRelease.tag_name}`)
    }
  }
}

/**
 * Sync beta releases to database
 */
export async function syncBetaReleases(githubReleases: GitHubRelease[]) {
  const betaReleasesList = githubReleases.filter((r) => r.prerelease)
  console.log("[GitHub Sync] Beta releases found:", betaReleasesList.length)

  const db = await getDb()
  if (!db) {
    console.log("[GitHub Sync] Database not configured; skipping beta sync")
    return
  }

  for (const ghRelease of betaReleasesList) {
    console.log(`[GitHub Sync] Processing beta release: ${ghRelease.tag_name}`)
    console.log(`[GitHub Sync] Beta release has ${ghRelease.assets.length} assets`)
    ghRelease.assets.forEach((asset, i) => {
      console.log(`[GitHub Sync]   Asset ${i}: ${asset.name}`)
    })

    const apkAsset = findApkAsset({
      ...ghRelease,
      assets: ghRelease.assets,
    })

    if (!apkAsset) {
      console.log(`[GitHub Sync] No APK found for beta ${ghRelease.tag_name}, skipping`)
      continue
    }
    console.log(`[GitHub Sync] Found APK in beta: ${apkAsset.name}`)

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
        id: ghRelease.tag_name,
        appName: "NevPlay",
        version: ghRelease.tag_name,
        title: ghRelease.name || ghRelease.tag_name,
        description: ghRelease.body || undefined,
        releaseNotes: ghRelease.body || undefined,
        imageUrl: imageUrl || undefined,
        apkUrl: apkAsset.browser_download_url,
        downloadCount: apkAsset.download_count,
        githubReleaseId: ghRelease.tag_name,
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
