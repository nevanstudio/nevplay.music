import { GITHUB_REPO_URL } from "@/lib/nav"

export type StoreInfo = {
  name: string
  description: string
  icon: string | null
  href: string | null
  available: boolean
}

/** Check if APKPure review is complete and return dynamic stores status */
export async function getDynamicStores(): Promise<StoreInfo[]> {
  let isApkPureLive = false

  try {
    const res = await fetch("https://apkpure.com/p/com.nevanstudio.nevplay", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 }, // Check every 1 hour
    })
    isApkPureLive = res.ok && res.status === 200
  } catch {
    isApkPureLive = false
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
      description: isApkPureLive ? "Verified APKPure distribution" : "Direct APK mirror (review pending)",
      icon: "/assets/icones/apkpure.png",
      href: isApkPureLive ? "https://apkpure.com/p/com.nevanstudio.nevplay" : null,
      available: isApkPureLive,
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
