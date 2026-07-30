import Image from "next/image"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComingSoonAppCardProps {
  appName: string
  description?: string
  estimatedRelease?: Date
  imageUrl?: string
  status?: string
}

export function ComingSoonAppCard({
  appName,
  description,
  estimatedRelease,
  imageUrl,
  status = "in_development",
}: ComingSoonAppCardProps) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Coming Soon"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const getStatusColor = (stat: string) => {
    switch (stat) {
      case "in_development":
        return "bg-blue-500/10 text-blue-500"
      case "beta":
        return "bg-[#1DB954]/10 text-[#1DB954]"
      case "launching_soon":
        return "bg-orange-500/10 text-orange-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getStatusLabel = (stat: string) => {
    switch (stat) {
      case "in_development":
        return "In Development"
      case "beta":
        return "Beta Coming"
      case "launching_soon":
        return "Launching Soon"
      default:
        return "Coming Soon"
    }
  }

  return (
    <div className="group rounded-lg border border-[#1DB954]/20 bg-gradient-to-br from-[#121212] to-[#191414] overflow-hidden transition-all hover:border-[#1DB954]/40 hover:shadow-lg hover:shadow-[#1DB954]/10">
      {/* Image */}
      {imageUrl ? (
        <div className="relative aspect-video overflow-hidden bg-[#191414]">
          <Image
            src={imageUrl}
            alt={appName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = "none"
            }}
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/5 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl">🎵</p>
            <p className="mt-2 text-sm text-[#1DB954]">{appName}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Status Badge */}
        <div className="mb-3 inline-block">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
              status
            )}`}
          >
            {getStatusLabel(status)}
          </span>
        </div>

        {/* App Name */}
        <h3 className="text-xl font-bold text-white">{appName}</h3>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-3">
            {description}
          </p>
        )}

        {/* Release Date */}
        <div className="mt-4 flex items-center gap-2 text-sm text-[#1DB954]">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(estimatedRelease)}</span>
        </div>

        {/* Button */}
        <Button
          disabled
          className="mt-4 w-full bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/20 cursor-not-allowed"
        >
          Coming Soon
        </Button>
      </div>
    </div>
  )
}
