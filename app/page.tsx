import { getLatestRelease } from "@/lib/github"
import { Hero } from "@/components/home/hero"
import { ComebackDispatch } from "@/components/home/comeback-dispatch"
import { FeatureShowcase } from "@/components/home/feature-showcase"
import { ReleaseTeaser } from "@/components/home/release-teaser"
import { FinalCta } from "@/components/home/final-cta"

export default async function HomePage() {
  const latestRelease = await getLatestRelease()

  return (
    <>
      <Hero latestRelease={latestRelease} />
      <ComebackDispatch />
      <FeatureShowcase />
      <ReleaseTeaser latestRelease={latestRelease} />
      <FinalCta />
    </>
  )
}
