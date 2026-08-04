import Image from "next/image"
import { Download, Github, Play, Sparkles } from "lucide-react"
import { hero } from "@/lib/data"
import { GITHUB_REPO_URL } from "@/lib/nav"
import { Badge, ButtonLink } from "@/components/ui/primitives"
import type { GitHubRelease } from "@/lib/github"

export function Hero({ latestRelease }: { latestRelease: GitHubRelease | null }) {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-20 md:pt-28 lg:pb-28">
      {/* Ambient glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-10rem] h-120 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-glow blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-pulse-glow pointer-events-none absolute bottom-0 right-[-10rem] h-90 w-90 rounded-full bg-glow blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 lg:flex-row lg:items-center lg:gap-10">
        {/* Copy column */}
        <div className="flex max-w-xl flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <Badge className="blur-in">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {latestRelease
              ? `Now available — ${latestRelease.tag_name}`
              : "First release coming soon"}
          </Badge>

          <h1 className="blur-in text-balance text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl [animation-delay:100ms]">
            {hero.heading.prefix}{" "}
            <span className="text-primary">{hero.heading.highlight}</span>
          </h1>

          <p className="blur-in text-pretty text-lg leading-relaxed text-muted-foreground [animation-delay:200ms]">
            {hero.description}
          </p>

          <div className="blur-in flex flex-wrap items-center justify-center gap-4 lg:justify-start [animation-delay:300ms]">
            <ButtonLink href="/download" size="lg">
              <Download className="size-4.5" aria-hidden="true" />
              Download Now
            </ButtonLink>
            <ButtonLink href={GITHUB_REPO_URL} variant="secondary" size="lg" external>
              <Github className="size-4.5" aria-hidden="true" />
              GitHub
            </ButtonLink>
          </div>

          <ul className="blur-in flex flex-wrap justify-center gap-2 lg:justify-start [animation-delay:400ms]">
            {hero.pills.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-glass-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>

        {/* Mockup column */}
        <div className="relative flex flex-1 items-center justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-80 w-80 rounded-full bg-glow blur-3xl"
          />
          <div className="relative">
            <div className="flex size-64 items-center justify-center rounded-3xl border border-primary/30 bg-gradient-to-br from-card/90 via-card to-primary/10 p-8 shadow-2xl shadow-primary/20 backdrop-blur-2xl ring-1 ring-primary/20 md:size-80">
              <Image
                src="/assets/icon_full.png"
                alt="NevPlay Logo"
                width={256}
                height={256}
                priority
                className="size-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Floating: Now Playing */}
            <div className="animate-float glass-panel absolute -left-28 top-16 z-20 hidden w-52 rounded-xl p-4 sm:block">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Play className="size-4 fill-current" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{hero.nowPlaying.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{hero.nowPlaying.artist}</p>
                </div>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${hero.nowPlaying.progress}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>{hero.nowPlaying.timeCurrent}</span>
                <span>{hero.nowPlaying.timeTotal}</span>
              </div>
            </div>

            {/* Floating: Lyrics */}
            <div className="animate-float-delayed glass-panel absolute -right-24 top-40 z-20 hidden w-56 rounded-xl p-4 sm:block">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Synced Lyrics
              </p>
              <ul className="flex flex-col gap-1.5">
                {hero.lyrics.map((line) => (
                  <li
                    key={line.text}
                    className={
                      line.active
                        ? "text-sm font-semibold text-primary"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {line.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Floating: AI recommendation */}
            <div className="animate-float glass-panel absolute -bottom-4 -left-16 z-20 hidden rounded-xl p-4 sm:block [animation-delay:2s]">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground">
                <Sparkles className="size-3" aria-hidden="true" />
                AI Recommendation
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-end gap-0.5" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="animate-eq-bar w-1 origin-bottom rounded-full bg-primary"
                      style={{ height: `${12 + (i % 2) * 8}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">{hero.aiRecommendation.title}</p>
                  <p className="text-xs text-primary">{hero.aiRecommendation.match}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
        {hero.stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-panel flex flex-col items-center gap-1 rounded-xl px-4 py-5 text-center"
          >
            <span className="text-xl font-bold tracking-tight text-primary md:text-2xl">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground md:text-sm">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
