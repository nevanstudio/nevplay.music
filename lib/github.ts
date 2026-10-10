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
      next: { revalidate: 30 }, // 30 seconds auto-revalidation
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

export function getApkAsset(input: ReleaseAsset[] | GitHubRelease | null | undefined): ReleaseAsset | null {
  if (!input) return null
  const assets = Array.isArray(input) ? input : input.assets || []
  return (
    assets.find((a) => a.name.endsWith(".apk")) ??
    assets.find((a) => !a.name.endsWith(".json") && !a.name.endsWith(".txt")) ??
    assets[0] ??
    null
  )
}

export const findApkAsset = getApkAsset

export function findImageAsset(input: ReleaseAsset[] | GitHubRelease | null | undefined): ReleaseAsset | null {
  if (!input) return null
  const assets = Array.isArray(input) ? input : input.assets || []
  return assets.find((a) => /\.(png|jpe?g|webp|gif)$/i.test(a.name)) ?? null
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

export function extractImageUrl(body: string | null): string | null {
  if (!body) return null
  const htmlMatch = body.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (htmlMatch) return htmlMatch[1]
  const mdMatch = body.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/i)
  if (mdMatch) return mdMatch[1]
  return null
}

export function extractSha256(body: string | null): string | null {
  if (!body) return null
  const match = body.match(/sha256[:\s]+([a-f0-9]{64})/i) || body.match(/\b([a-f0-9]{64})\b/i)
  return match ? match[1] : null
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-xs text-foreground">$1</code>')
    .replace(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:brightness-110">$1</a>')
}

/** Cleanly formats a release notes markdown body into styled HTML blocks (cards, headers, bullets) */
export function renderReleaseBody(body: string | null): string {
  if (!body) return ""

  // 1. Strip raw images (handled separately in UI)
  const cleanBody = body
    .replace(/<img[^>]*>/gi, "")
    .replace(/!\[.*?\]\(.*?\)/gi, "")
    .trim()

  const lines = cleanBody.split("\n")
  const htmlBlocks: string[] = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim()
    if (!rawLine) {
      if (inList) {
        htmlBlocks.push("</ul>")
        inList = false
      }
      continue
    }

    // Dividers (--- or ===)
    if (/^(---|===|\*\*\*)$/.test(rawLine)) {
      if (inList) {
        htmlBlocks.push("</ul>")
        inList = false
      }
      htmlBlocks.push('<hr class="my-4 border-glass-border opacity-50" />')
      continue
    }

    // Headers (#, ##, ###)
    if (rawLine.startsWith("#")) {
      if (inList) {
        htmlBlocks.push("</ul>")
        inList = false
      }
      const headerText = rawLine.replace(/^#+\s*/, "").trim()
      htmlBlocks.push(
        `<h3 class="mt-6 mb-3 text-base font-bold tracking-tight text-foreground flex items-center gap-2">${escapeHtml(headerText)}</h3>`
      )
      continue
    }

    // Bullet points (-, *, +, 1.)
    if (/^([*+\-]||\d+\.)\s/.test(rawLine)) {
      const itemText = rawLine.replace(/^([*+\-]||\d+\.)\s*/, "").trim()
      if (!inList) {
        htmlBlocks.push('<ul class="my-3 space-y-2 text-sm text-muted-foreground">')
        inList = true
      }
      htmlBlocks.push(
        `<li class="flex items-start gap-2.5"><span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span><span>${formatInlineMarkdown(itemText)}</span></li>`
      )
      continue
    }

    // Sub-feature title lines with emojis (e.g. "🎨 Refined UI Experience")
    if (/^[\p{Emoji}\u2600-\u27BF]/u.test(rawLine) && rawLine.length < 80) {
      if (inList) {
        htmlBlocks.push("</ul>")
        inList = false
      }
      htmlBlocks.push(
        `<h4 class="mt-5 mb-1.5 text-sm font-semibold text-foreground flex items-center gap-2">${formatInlineMarkdown(rawLine)}</h4>`
      )
      continue
    }

    // Regular paragraph
    if (inList) {
      htmlBlocks.push("</ul>")
      inList = false
    }
    htmlBlocks.push(
      `<p class="my-2 text-sm leading-relaxed text-muted-foreground">${formatInlineMarkdown(rawLine)}</p>`
    )
  }

  if (inList) {
    htmlBlocks.push("</ul>")
  }

  return htmlBlocks.join("\n")
}

// Set to true for custom count, or false for 100% real live numbers across the entire website
export const USE_CUSTOM_DOWNLOAD_COUNT = false
export const CUSTOM_DOWNLOAD_COUNT = 1658

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
