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
    const res = await fetch(`${API_BASE}/releases?per_page=20`, {
      headers: buildHeaders(),
      next: { revalidate: 43200 }, // 43,200 seconds = 12 hours (2 times per day)
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

export function findImageAsset(release: GitHubRelease): ReleaseAsset | null {
  const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]
  return (
    release.assets.find((a) => exts.some((e) => a.name.toLowerCase().endsWith(e))) ?? null
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

// Set to true for custom count (232), or false to fetch real GitHub API numbers
const USE_CUSTOM_DOWNLOAD_COUNT = true
const CUSTOM_DOWNLOAD_COUNT = 232

export function totalDownloads(releases: GitHubRelease[]): number {
  if (USE_CUSTOM_DOWNLOAD_COUNT) {
    return CUSTOM_DOWNLOAD_COUNT
  }

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

/** Extract image URL from release body if present */
export function extractImageUrl(body: string | null): string | null {
  if (!body) return null

  // 1. HTML <img ... src="..."> tags
  const imgMatch = body.match(/<img\s+[^>]*src=["']([^"']+)["']/i)
  if (imgMatch) return imgMatch[1]

  // 2. Markdown image syntax ![alt](url)
  const mdMatch = body.match(/!\[.*?\]\((.*?)\)/)
  if (mdMatch) {
    const rawUrl = mdMatch[1].trim().split(/\s+/)[0]
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl
    const cleaned = rawUrl.replace(/^\/?/, "")
    return `https://raw.githubusercontent.com/${REPO}/main/${cleaned}`
  }

  // 3. Direct GitHub attachments or image URLs
  const urlMatch = body.match(
    /(https?:\/\/(?:user-images\.githubusercontent\.com|camo\.githubusercontent\.com|github\.com\/[^\s)]+\/assets\/|github\.com\/user-attachments\/assets\/|[^\s)]+\.(?:png|jpg|jpeg|gif|webp|svg)))/i
  )
  if (urlMatch) return urlMatch[1]

  return null
}

/** Clean release body by removing image tags */
export function renderReleaseBody(body: string | null): string {
  if (!body) return ""
  // Remove markdown images and HTML img tags
  let cleanBody = body.replace(/!\[.*?\]\(.*?\)/g, "").replace(/<img.*?>/g, "")

  // Basic HTML-escape to avoid XSS
  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")

  // Convert simplified Markdown to HTML (headers, lists, bold, links, paragraphs)
  const lines = cleanBody.split(/\r?\n/)
  const htmlLines: string[] = []
  let inList = false

  const flushList = () => {
    if (inList) {
      htmlLines.push("</ul>")
      inList = false
    }
  }

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (line.length === 0) {
      flushList()
      continue
    }

    // Headers
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (hMatch) {
      flushList()
      const level = Math.min(6, hMatch[1].length)
      let content = hMatch[2]
      content = content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      htmlLines.push(`<h${level}>${content}</h${level}>`)
      continue
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line)) {
      if (!inList) {
        htmlLines.push("<ul>")
        inList = true
      }
      const item = line.replace(/^[-*+]\s+/, "")
      const content = item
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      htmlLines.push(`<li>${content}</li>`)
      continue
    }

    // Paragraph / inline formatting
    flushList()
    let text = escapeHtml(line)
    // bold
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // italics
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")
    // links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    htmlLines.push(`<p>${text}</p>`)
  }

  flushList()
  return htmlLines.join("\n")
}
