import { getLatestRelease } from "@/lib/github"
import { Hero } from "@/components/home/hero"
import { ReleaseTeaser } from "@/components/home/release-teaser"
import { FinalCta } from "@/components/home/final-cta"

export default async function HomePage() {
  const latestRelease = await getLatestRelease()

  return (
    <>
      <Hero latestRelease={latestRelease} />
      <ReleaseTeaser latestRelease={latestRelease} />
      <FinalCta />
    </>
  )
}
