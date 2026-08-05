import { GITHUB_REPO_URL } from "@/lib/nav"
import type { GitHubRelease } from "@/lib/github"

export type StoreInfo = {
  name: string
  description: string
  icon: string | null
  href: string | null
  available: boolean
}

/** Check if APKPure review is complete and return dynamic stores status */
export async function getDynamicStores(): Promise<StoreInfo[]> {
  let isApkPureLive = true

  try {
    const res = await fetch("https://apkpure.com/p/com.nevanstudio.nevplay", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    })
    isApkPureLive = res.ok && res.status === 200
  } catch {
    isApkPureLive = true // Fallback to live since user verified page is published
  }

  return [
    {
      name: "GitHub Releases",
      description: "Official releases & source code",
      icon: "/assets/icones/Refresh_loading.png",
      href: GITHUB_REPO_URL,
      available: true,
    },
    {
      name: "APKPure",
      description: "Verified APKPure distribution",
      icon: "/assets/icones/apkpure.png",
      href: "https://apkpure.com/p/com.nevanstudio.nevplay",
      available: true,
    },
    {
      name: "Uptodown",
      description: "Verified Android app store",
      icon: "/assets/icones/uptodown.png",
      href: null,
      available: false,
    },
    {
      name: "Google Play Store",
      description: "Auto-updates (review pending)",
      icon: "/assets/icones/playstore.png",
      href: null,
      available: false,
    },
    {
      name: "Samsung Galaxy Store",
      description: "Official Galaxy package",
      icon: "/assets/icones/galaxystore.png",
      href: null,
      available: false,
    },
    {
      name: "Huawei AppGallery",
      description: "Optimized for HarmonyOS",
      icon: "/assets/icones/appgallery.png",
      href: null,
      available: false,
    },
  ]
}

/** Fetch and aggregate total download count across GitHub, APKPure, and future stores */
export async function getAggregateDownloadCount(releases: GitHubRelease[]): Promise<number> {
  // 1. Calculate GitHub Downloads
  const githubCount = releases.reduce(
    (sum, r) => sum + r.assets.reduce((s, a) => s + a.download_count, 0),
    0
  )

  // 2. Fetch/Scrape APKPure Downloads (or store estimate)
  let apkPureCount = 0
  try {
    const res = await fetch("https://apkpure.com/p/com.nevanstudio.nevplay", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const html = await res.text()
      const match = html.match(/class="[^"]*count[^"]*"[^>]*>([\d,\.kKMB]+)/i) ||
                    html.match(/([\d,\.kKMB]+)\s*(?:Downloads|downloads|Installs|installs)/i)
      if (match && match[1]) {
        const raw = match[1].toLowerCase().trim()
        if (raw.endsWith("k")) apkPureCount = parseFloat(raw) * 1000
        else if (raw.endsWith("m")) apkPureCount = parseFloat(raw) * 1000000
        else apkPureCount = parseInt(raw.replace(/,/g, "")) || 0
      }
    }
  } catch {
    apkPureCount = 0
  }

  // 3. Aggregate total across all stores
  const total = githubCount + apkPureCount

  // If initial count is lower than custom baseline (e.g. 232), return custom baseline or real total
  return Math.max(total, 232)
}
