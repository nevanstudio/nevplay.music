import Image from "next/image"
import { screenshots } from "@/lib/data"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading, ButtonLink } from "@/components/ui/primitives"

export function ScreenshotMarquee() {
  const items = [...screenshots, ...screenshots]
  return (
    <section className="overflow-hidden py-24 md:py-32">
      <Reveal className="px-6">
        <SectionHeading
          eyebrow="Screenshots"
          title="See NevPlay in Action"
          description="Real screens from the app — library, player, lyrics, equalizer, and more."
        />
      </Reveal>

      <div className="relative mt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
        />
        <div className="animate-marquee flex w-max gap-6 hover:[animation-play-state:paused]">
          {items.map((shot, index) => (
            <Image
              key={`${shot.id}-${index}`}
              src={shot.image}
              alt={index < screenshots.length ? shot.title : ""}
              aria-hidden={index >= screenshots.length}
              width={220}
              height={460}
              className="w-44 rounded-2xl border border-glass-border shadow-xl md:w-52"
            />
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <ButtonLink href="/screenshots" variant="secondary">
          Browse the Full Gallery
        </ButtonLink>
      </div>
    </section>
  )
}
