"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { screenshots } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/reveal"

const categories = ["All", ...Array.from(new Set(screenshots.map((s) => s.category)))]

export function ScreenshotGallery() {
  const [category, setCategory] = useState("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = useMemo(
    () => (category === "All" ? screenshots : screenshots.filter((s) => s.category === category)),
    [category],
  )

  const close = useCallback(() => setLightboxIndex(null), [])

  const navigate = useCallback(
    (delta: number) => {
      setLightboxIndex((current) => {
        if (current === null) return null
        return (current + delta + filtered.length) % filtered.length
      })
    },
    [filtered.length],
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = "hidden"
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") navigate(1)
      if (e.key === "ArrowLeft") navigate(-1)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [lightboxIndex, close, navigate])

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 px-6" role="group" aria-label="Filter screenshots by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === cat
                ? "bg-primary text-primary-foreground"
                : "glass-panel text-muted-foreground hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((shot, index) => (
          <Reveal key={shot.id} delay={(index % 4) * 60}>
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group flex w-full flex-col gap-3 text-left"
              aria-label={`View ${shot.title} screenshot`}
            >
              <div className="overflow-hidden rounded-xl border border-glass-border">
                <Image
                  src={shot.image}
                  alt={shot.title}
                  width={280}
                  height={580}
                  className="w-full transition-transform duration-500 will-change-transform group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-0.5 px-1">
                <span className="text-sm font-semibold">{shot.title}</span>
                <span className="text-xs text-muted-foreground">{shot.category}</span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} screenshot viewer`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-md"
          onClick={close}
        >
          <div
            className="relative flex max-h-full flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.image}
              alt={active.title}
              width={360}
              height={740}
              className="max-h-[70svh] w-auto rounded-2xl border border-glass-border shadow-2xl"
            />
            <div className="max-w-md text-center">
              <p className="font-semibold">{active.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {active.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="glass-panel flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={close}
                className="glass-panel flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                aria-label="Close viewer"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                className="glass-panel flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                aria-label="Next screenshot"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
