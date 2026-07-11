const REPO = "nevanstudio/NevStream-Releases"
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
  html_url: string
  prerelease: boolean
  draft: boolean
  assets: ReleaseAsset[]
}

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
}

export async function getReleases(): Promise<GitHubRelease[]> {
  try {
    const res = await fetch(`${API_BASE}/releases?per_page=20`, {
      headers,
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as GitHubRelease[]
    return data.filter((r) => !r.draft)
  } catch {
    return []
  }
}

export async function getLatestRelease(): Promise<GitHubRelease | null> {
  const releases = await getReleases()
  return releases.find((r) => !r.prerelease) ?? releases[0] ?? null
}

export function findApkAsset(release: GitHubRelease): ReleaseAsset | null {
  return release.assets.find((a) => a.name.toLowerCase().endsWith(".apk")) ?? null
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

export function totalDownloads(releases: GitHubRelease[]): number {
  return releases.reduce(
    (sum, r) => sum + r.assets.reduce((s, a) => s + a.download_count, 0),
    0,
  )
}

export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** Parse a markdown release body into simple lines (bullets and paragraphs). */
export function parseChangelog(body: string | null): string[] {
  if (!body) return []
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.replace(/^[-*+]\s+/, "").replace(/\*\*/g, ""))
    .filter((line) => line.length > 0)
    .slice(0, 12)
}

/** Extract a SHA-256 hash from a release body if the publisher included one. */
export function extractSha256(body: string | null): string | null {
  if (!body) return null
  const match = body.match(/\b[a-fA-F0-9]{64}\b/)
  return match ? match[0].toLowerCase() : null
}
