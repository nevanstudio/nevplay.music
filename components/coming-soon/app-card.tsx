import Image from "next/image"
import { Calendar, Clock, Sparkles } from "lucide-react"
import { GlassCard } from "@/components/ui/primitives"

interface ComingSoonAppCardProps {
  appName: string
  description?: string
  estimatedRelease?: string
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
  const getStatusBadge = (stat: string) => {
    switch (stat) {
      case "in_development":
        return { label: "In Development", style: "border-sky-500/30 bg-sky-500/10 text-sky-400" }
      case "beta":
        return { label: "Beta Testing", style: "border-primary/30 bg-primary/10 text-primary" }
      case "launching_soon":
        return { label: "Launching Soon", style: "border-amber-500/30 bg-amber-500/10 text-amber-400" }
      default:
        return { label: "Coming Soon", style: "border-glass-border bg-secondary text-muted-foreground" }
    }
  }

  const badge = getStatusBadge(status)

  return (
    <GlassCard hover className="group flex h-full flex-col overflow-hidden p-0 transition-all duration-300">
      {/* Image Banner */}
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden bg-card border-b border-glass-border">
          <Image
            src={imageUrl}
            alt={appName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = "none"
            }}
          />
        </div>
      ) : (
        <div className="relative aspect-video w-full bg-gradient-to-br from-primary/15 via-card to-card flex items-center justify-center border-b border-glass-border">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
              <Sparkles className="size-6" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">{appName}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${badge.style}`}>
            <span className="size-1.5 rounded-full bg-current animate-pulse" />
            {badge.label}
          </span>
          {estimatedRelease && (
            <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
              <Calendar className="size-3 text-primary" />
              {estimatedRelease}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{appName}</h3>

        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {description}
          </p>
        )}

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-glass-border bg-secondary/50 py-2.5 text-xs font-semibold text-muted-foreground">
            <Clock className="size-3.5" />
            <span>Stay tuned for updates</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
