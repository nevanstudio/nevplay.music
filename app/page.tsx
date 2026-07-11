import { getLatestRelease } from "@/lib/github"
import { Hero } from "@/components/home/hero"
import { FeatureShowcase } from "@/components/home/feature-showcase"
import { ScreenshotMarquee } from "@/components/home/screenshot-marquee"
import { ReleaseTeaser } from "@/components/home/release-teaser"
import { FinalCta } from "@/components/home/final-cta"

export default async function HomePage() {
  const latestRelease = await getLatestRelease()

  return (
    <>
      <Hero latestRelease={latestRelease} />
      <FeatureShowcase />
      <ScreenshotMarquee />
      <ReleaseTeaser latestRelease={latestRelease} />
      <FinalCta />
    </>
  )
}
