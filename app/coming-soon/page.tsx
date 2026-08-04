import type { Metadata } from "next"
import { getComingSoonApps } from "@/app/actions/coming-soon"
import { ComingSoonAppCard } from "@/components/coming-soon/app-card"
import { Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Coming Soon",
  description:
    "Discover the upcoming apps from Nevan Studio. More powerful music and entertainment tools are on the way.",
}

export default async function ComingSoonPage() {
  const apps = await getComingSoonApps()

  return (
    <main className="space-y-12 py-12">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-6 w-6 text-[#1DB954]" />
          <span className="text-sm font-semibold text-[#1DB954]">Exciting Things Ahead</span>
        </div>
        <h1 className="text-4xl font-bold text-white">
          Coming Soon to Nevan Studio
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          We&apos;re constantly working on new apps and features. Check back soon to see what&apos;s in
          development. Subscribe to stay updated on our latest releases.
        </p>
      </div>

      {/* Coming-Soon Apps Grid */}
      {apps.length > 0 ? (
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <ComingSoonAppCard
                key={app.id}
                appName={app.appName}
                description={app.description || undefined}
                estimatedRelease={app.estimatedRelease || undefined}
                imageUrl={app.imageUrl || undefined}
                status={app.status}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-lg border border-[#1DB954]/20 bg-[#0f0f0f] py-12 text-center">
            <p className="text-lg text-gray-400">
              No upcoming apps announced yet. Check back soon!
            </p>
          </div>
        </div>
      )}

      {/* APK-Pure Teaser if not in list */}
      {!apps.find((app) => app.appName.toLowerCase().includes("apk")) && (
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-lg border border-[#1DB954]/20 bg-gradient-to-r from-[#1DB954]/10 to-transparent p-8">
            <h2 className="text-2xl font-bold text-white">
              APK-Pure
            </h2>
            <p className="mt-2 text-gray-400">
              Your ultimate source for premium APK files. Browse, download, and discover the best
              Android apps with complete privacy and security. Coming soon.
            </p>
            <p className="mt-4 text-sm text-[#1DB954] font-semibold">
              More details coming soon...
            </p>
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-lg border border-[#1DB954]/20 bg-[#0f0f0f] p-8">
          <h2 className="text-2xl font-bold text-white">
            Stay Updated
          </h2>
          <p className="mt-2 text-gray-400">
            We&apos;ll notify you when new apps are released. Follow us for the latest updates.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <a
              href="https://github.com/nevanstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-[#1DB954] px-4 py-3 text-center font-semibold text-black transition-colors hover:bg-[#1ed760]"
            >
              Follow on GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
