import { NextResponse } from "next/server"
import { getLatestRelease, findApkAsset, humanFileSize } from "@/lib/github"

export const revalidate = 3600 // Revalidate every 1 hour

export async function GET() {
  try {
    const latest = await getLatestRelease()

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
          "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
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
