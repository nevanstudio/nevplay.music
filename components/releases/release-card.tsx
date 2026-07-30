"use client"

import { useState } from "react"
import Image from "next/image"
import { Download, ExternalLink, Info } from "lucide-react"
import { trackDownload } from "@/app/actions/releases"

interface ReleaseCardProps {
  id: string
  version: string
  title: string
  description?: string
  releaseNotes?: string
  imageUrl?: string
  apkUrl: string | null
  downloadCount: number
  releaseType: "stable" | "beta"
  isBeta?: boolean
}

export function ReleaseCard({
  id,
  version,
  title,
  description,
  releaseNotes,
  imageUrl,
  apkUrl,
  downloadCount,
  releaseType,
  isBeta = false,
}: ReleaseCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadsCount, setDownloadsCount] = useState(downloadCount)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Track download
      await trackDownload(id, releaseType)
      setDownloadsCount((prev) => prev + 1)

      // Open APK URL directly
      if (apkUrl) window.open(apkUrl, "_blank")
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to track download. The file link will still open.")
      if (apkUrl) window.open(apkUrl, "_blank")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="rounded-lg border border-[#1DB954]/20 bg-gradient-to-br from-[#121212] to-[#191414] p-6 transition-all hover:border-[#1DB954]/40 hover:shadow-lg hover:shadow-[#1DB954]/10">
      {/* Beta Badge */}
      {isBeta && (
        <div className="mb-4 inline-block rounded-full bg-[#1DB954] px-3 py-1 text-xs font-semibold text-black">
          Beta
        </div>
      )}

      {/* Version & Title */}
      <div className="mb-4">
        <p className="text-sm font-medium text-[#1DB954]">{version}</p>
        <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-[#191414]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = "none"
            }}
          />
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="mb-4 text-sm text-gray-300 line-clamp-3">{description}</p>
      )}

      {/* Release Notes Preview */}
      {releaseNotes && (
        <details className="mb-4">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-400 hover:text-white">
            <Info className="size-4" />
            Release Notes
          </summary>
          <div className="mt-2 max-h-40 overflow-y-auto rounded bg-[#0f0f0f] p-3 text-xs text-gray-400">
            <p className="whitespace-pre-wrap text-gray-300">{releaseNotes}</p>
          </div>
        </details>
      )}

      {/* Download Stats & Button */}
      {apkUrl && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-white">
              {downloadsCount.toLocaleString()} downloads
            </p>
            <a
              href={apkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#1DB954] hover:text-[#1ED760]"
            >
              <ExternalLink className="size-3" />
              GitHub
            </a>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1DB954] px-4 py-2 font-semibold text-black transition-all hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="size-4" />
            {isDownloading ? "Downloading..." : "Download APK"}
          </button>
        </div>
      )}
    </div>
  )
}
