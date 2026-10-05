/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/get.html", destination: "/download", permanent: true },
      { source: "/download.html", destination: "/download", permanent: true },
      { source: "/updates.html", destination: "/releases", permanent: true },
      { source: "/newupdates.html", destination: "/releases", permanent: true },
      { source: "/features.html", destination: "/features", permanent: true },
      { source: "/screenshots.html", destination: "/features", permanent: true },
      { source: "/screenshots", destination: "/features", permanent: true },
      { source: "/roadmap.html", destination: "/features", permanent: true },
      { source: "/roadmap", destination: "/features", permanent: true },
      { source: "/blog.html", destination: "/news", permanent: true },
      { source: "/blog", destination: "/news", permanent: true },
      { source: "/coming-soon", destination: "/features", permanent: true },
      { source: "/issues", destination: "https://github.com/nevanstudio/nevplay_releases/issues", permanent: false },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/donate.html", destination: "/about", permanent: true },
      { source: "/donate", destination: "/about", permanent: true },
      { source: "/help.html", destination: "/about", permanent: true },
      { source: "/help", destination: "/about", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/terms.html", destination: "/privacy", permanent: true },
      { source: "/terms", destination: "/privacy", permanent: true },
    ]
  },
}

export default nextConfig
