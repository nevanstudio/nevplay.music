import { type NextRequest, NextResponse } from "next/server"
import { getLatestRelease, getReleases, findApkAsset, humanFileSize } from "@/lib/github"

export const revalidate = 30 // Revalidate every 30 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channel = searchParams.get("channel") || "stable"

    let latest;
    if (channel === "beta") {
      const releases = await getReleases()
      latest = releases[0] // Absolute latest (sorted by date in lib/github.ts)
    } else {
      latest = await getLatestRelease() // Defaults to non-prerelease
    }

    if (!latest) {
      return NextResponse.json({ error: "No releases found" }, { status: 404 })
    }

    const apk = findApkAsset(latest)

    return NextResponse.json(
      {
        version: latest.tag_name,
        name: latest.name ?? latest.tag_name,
        published_at: latest.published_at,
        html_url: latest.html_url,
        download_url: apk?.browser_download_url ?? null,
        apk_name: apk?.name ?? null,
        size_bytes: apk?.size ?? 0,
        size_human: apk ? humanFileSize(apk.size) : null,
        prerelease: latest.prerelease,
        notes: latest.body ?? "",
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=60",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch latest release" },
      { status: 500 },
    )
  }
}
