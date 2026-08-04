import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { AppShell } from "@/components/shell/app-shell"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: {
    default: "NevPlay — Premium Offline Music Player for Android",
    template: "%s — NevPlay",
  },
  description:
    "NevPlay brings your local music library to life. Private offline listening with synced lyrics, AI-powered recommendations, and a beautiful Material You Liquid Glass interface. Free, always private, your music stays yours.",
  icons: { icon: "/assets/icon.png" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#101410" },
    { media: "(prefers-color-scheme: light)", color: "#fafbf9" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
