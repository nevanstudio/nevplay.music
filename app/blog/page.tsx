import type { Metadata } from "next"
import { Reveal } from "@/components/motion/reveal"
import { Badge, ButtonLink, GlassCard, PageHero } from "@/components/ui/primitives"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Announcements, design deep-dives, development logs, and behind-the-scenes looks at how NevPlay is built.",
}

const featured = {
  tag: "Featured · Release",
  title: "The Glassmorphism Era: Redesigning NevPlay for 2026",
  description:
    "A deep dive into how we rebuilt NevPlay's entire interface with Liquid Glass components, dynamic Material You theming, and 60 FPS parallax scrolling — without sacrificing performance.",
  meta: "July 2026 · 8 min read",
}

const posts = [
  {
    tag: "Design",
    title: "Reimagining the Now Playing Screen",
    description:
      "How we designed a player interface that feels alive — with dynamic gradients, synced lyrics, and tactile controls.",
    meta: "June 2026",
  },
  {
    tag: "Feature",
    title: "AutoEQ: Perfect Sound for Every Headphone",
    description:
      "Integrating thousands of community headphone profiles into NevPlay's equalizer engine.",
    meta: "May 2026",
  },
  {
    tag: "Development",
    title: "Building Karaoke-Style Synced Lyrics",
    description:
      "The technical story behind real-time LRC parsing, word-level highlighting, and smooth transitions.",
    meta: "April 2026",
  },
  {
    tag: "Privacy",
    title: "Local-Only Listening Stats",
    description:
      "Why we built privacy-first analytics that never leave your device — and how they still look beautiful.",
    meta: "March 2026",
  },
  {
    tag: "Design",
    title: "Material You: Colors From Your Wallpaper",
    description:
      "Dynamic theming that pulls palette colors from your Android wallpaper for a truly personal experience.",
    meta: "February 2026",
  },
  {
    tag: "Community",
    title: "Why We Went Open Source",
    description:
      "The decision to open NevPlay's codebase and what it means for trust, contributions, and the future.",
    meta: "January 2026",
  },
]

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Dev Blog"
        title="Stories From the Studio"
        description="Announcements, design deep-dives, development logs, and behind-the-scenes looks at how NevPlay is built."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <Reveal>
            <GlassCard hover className="relative overflow-hidden p-8 md:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-glow blur-3xl"
              />
              <article className="relative flex flex-col gap-4">
                <Badge>{featured.tag}</Badge>
                <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                  {featured.title}
                </h2>
                <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>
                <p className="text-sm text-muted-foreground">{featured.meta}</p>
              </article>
            </GlassCard>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.title} delay={(index % 3) * 60}>
                <GlassCard hover className="flex h-full flex-col gap-3 p-6">
                  <article className="flex h-full flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {post.tag}
                    </span>
                    <h3 className="text-balance font-bold leading-snug">{post.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{post.meta}</p>
                  </article>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-xl font-bold tracking-tight">More Posts Coming Soon</h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                We&apos;re just getting started. Follow our development journey as NevPlay grows.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ButtonLink href="/releases" variant="secondary" size="sm">
                  Version Updates
                </ButtonLink>
                <ButtonLink href="/about" variant="secondary" size="sm">
                  About NevPlay
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
