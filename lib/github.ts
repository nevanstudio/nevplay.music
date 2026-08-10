const REPO = "nevanstudio/nevplay_releases"
const API_BASE = `https://api.github.com/repos/${REPO}`

export type ReleaseAsset = {
  name: string
  browser_download_url: string
  size: number
  download_count: number
}

export type GitHubRelease = {
  tag_name: string
  name: string | null
  body: string | null
  published_at: string
  created_at?: string
  html_url: string
  prerelease: boolean
  draft: boolean
  assets: ReleaseAsset[]
}

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "NevPlaySite",
}

// Add Authorization header when a token is provided to increase rate limits
function buildHeaders(): Record<string, string> {
  const h: Record<string, string> = { ...(headers as Record<string, string>) }
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN
  if (token) h["Authorization"] = `token ${token}`
  return h
}

export async function getReleases(): Promise<GitHubRelease[]> {
  try {
    const res = await fetch(`${API_BASE}/releases?per_page=100`, {
      headers: buildHeaders(),
      next: { revalidate: 3600 }, // 3,600 seconds = 1 hour (24 times per day)
    })
    if (!res.ok) return []
    const data = (await res.json()) as GitHubRelease[]
    return data
      .filter((r) => !r.draft)
      .sort((a, b) => {
        const timeA = new Date(a.published_at || a.created_at || 0).getTime()
        const timeB = new Date(b.published_at || b.created_at || 0).getTime()
        return timeB - timeA
      })
  } catch {
    return []
  }
}

export async function getLatestRelease(): Promise<GitHubRelease | null> {
  const releases = await getReleases()
  return releases.find((r) => !r.prerelease) ?? releases[0] ?? null
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function getApkAsset(assets: ReleaseAsset[]): ReleaseAsset | null {
  return (
    assets.find((a) => a.name.endsWith(".apk")) ??
    assets.find((a) => !a.name.endsWith(".json") && !a.name.endsWith(".txt")) ??
    assets[0] ??
    null
  )
}

export function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes
  let unit = ""
  for (const u of units) {
    value /= 1024
    unit = u
    if (value < 1024) break
  }
  return `${value.toFixed(1)} ${unit}`
}

// Set to true for custom count, or false for 100% real live numbers across the entire website
export const USE_CUSTOM_DOWNLOAD_COUNT = false
export const CUSTOM_DOWNLOAD_COUNT = 500

/** Calculates live total download count across ALL releases on GitHub */
export function totalDownloads(releases: GitHubRelease[]): number {
  if (USE_CUSTOM_DOWNLOAD_COUNT) {
    return CUSTOM_DOWNLOAD_COUNT
  }

  return releases.reduce(
    (sum, r) => sum + r.assets.reduce((s, a) => s + a.download_count, 0),
    0
  )
}

export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** Parse a markdown release body into simple clean lines (bullets and paragraphs). */
export function parseChangelog(body: string | null): string[] {
  if (!body) return []

  const clean = body
    .replace(/<img[^>]*>/gi, "")
    .replace(/!\[.*?\]\(.*?\)/gi, "")
    .replace(/\[.*?\]\(.*?\)/gi, (match) => {
      const text = match.match(/\[(.*?)\]/)
      return text ? text[1] : match
    })

  const lines = clean.split("\n")
  const result: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("---") ||
      trimmed.startsWith("===") ||
      trimmed.startsWith("```")
    ) {
      continue
    }

    if (
      trimmed.startsWith("*") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("+")
    ) {
      const text = trimmed.replace(/^[*+\-]\s*/, "").trim()
      if (text) result.push(text)
    } else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s*/, "").trim()
      if (text) result.push(text)
    } else if (trimmed.length > 5 && !trimmed.endsWith(":")) {
      result.push(trimmed)
    }
  }

  return result
}
