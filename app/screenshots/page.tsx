import type { Metadata } from "next"
import { PageHero } from "@/components/ui/primitives"
import { ScreenshotGallery } from "@/components/screenshots/gallery"

export const metadata: Metadata = {
  title: "Screenshots",
  description:
    "Browse real screens from NevPlay — library, player, synced lyrics, equalizer, stats, and more.",
}

export default function ScreenshotsPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Every Screen, Beautifully Crafted"
        description="Real screenshots from NevPlay. Filter by category and tap any screen for a closer look."
      />
      <div className="pb-24">
        <ScreenshotGallery />
      </div>
    </>
  )
}
