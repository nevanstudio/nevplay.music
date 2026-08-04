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
      { source: "/screenshots.html", destination: "/screenshots", permanent: true },
      { source: "/roadmap.html", destination: "/roadmap", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/donate.html", destination: "/donate", permanent: true },
      { source: "/help.html", destination: "/help", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/terms.html", destination: "/terms", permanent: true },
    ]
  },
}

export default nextConfig
