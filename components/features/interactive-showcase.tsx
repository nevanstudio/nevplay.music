"use client"

import { useState } from "react"
import {
  AudioLines,
  Mic2,
  Palette,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Zap,
} from "lucide-react"

export function InteractiveFeatureShowcase() {
  const [activeTab, setActiveTab] = useState<"eq" | "lyrics" | "m3">("eq")

  // EQ state
  const [bands, setBands] = useState([4, 2, -1, 3, 6])
  const [preset, setPreset] = useState("Custom")

  // Lyric offset state
  const [offsetMs, setOffsetMs] = useState(0)

  // M3 Theme preview state
  const [selectedTheme, setSelectedTheme] = useState<{
    name: string
    primary: string
    surface: string
    accent: string
  }>({
    name: "Material Liquid Glass",
    primary: "#22c55e",
    surface: "#101410",
    accent: "#4ade80",
  })

  const themes = [
    { name: "Liquid Emerald", primary: "#22c55e", surface: "#0c1810", accent: "#4ade80" },
    { name: "Deep Violet", primary: "#a855f7", surface: "#150d2a", accent: "#c084fc" },
    { name: "Ocean Glass", primary: "#06b6d4", surface: "#08192b", accent: "#38bdf8" },
    { name: "Crimson Amber", primary: "#f97316", surface: "#1f1008", accent: "#fb923c" },
  ]

  const bandLabels = ["60Hz", "230Hz", "910Hz", "3.6kHz", "14kHz"]

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-glass-border bg-card p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
      {/* Material 3 Expressive Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-glass-border pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Material 3 Interactive Playground
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-2">
            Try NevPlay Audio & Theme Engine
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Experience real-time equalizer tuning, lyric sync offset control, and Material You dynamic color shifts.
          </p>
        </div>

        {/* M3 Segmented Switcher */}
        <div className="flex items-center gap-1 rounded-2xl bg-secondary/40 p-1 border border-glass-border">
          <button
            type="button"
            onClick={() => setActiveTab("eq")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "eq"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AudioLines className="size-4" aria-hidden="true" />
            10-Band EQ
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lyrics")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "lyrics"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic2 className="size-4" aria-hidden="true" />
            Synced Lyrics
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("m3")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "m3"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Palette className="size-4" aria-hidden="true" />
            Material You
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {/* ── TAB 1: 10-Band EQ & AutoEQ ── */}
        {activeTab === "eq" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Preset:</span>
                {["Flat", "Bass Boost", "Vocal Clarity", "AutoEQ Sony WH-1000XM5"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPreset(p)
                      if (p === "Flat") setBands([0, 0, 0, 0, 0])
                      if (p === "Bass Boost") setBands([8, 6, 2, 0, 1])
                      if (p === "Vocal Clarity") setBands([-2, 1, 6, 5, 2])
                      if (p.includes("AutoEQ")) setBands([5, 3, -1, 4, 6])
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      preset === p
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-surface border border-glass-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setBands([0, 0, 0, 0, 0])
                  setPreset("Flat")
                }}
                className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <RotateCcw className="size-3" aria-hidden="true" /> Reset
              </button>
            </div>

            {/* EQ Sliders */}
            <div className="grid grid-cols-5 gap-3 sm:gap-6 bg-secondary/15 p-6 rounded-2xl border border-glass-border">
              {bands.map((val, idx) => (
                <div key={bandLabels[idx]} className="flex flex-col items-center gap-3">
                  <span className="text-xs font-mono font-bold text-primary">
                    {val > 0 ? `+${val}` : val} dB
                  </span>

                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={val}
                    onChange={(e) => {
                      const newBands = [...bands]
                      newBands[idx] = parseInt(e.target.value)
                      setBands(newBands)
                      setPreset("Custom")
                    }}
                    className="h-32 w-2 accent-primary cursor-pointer appearance-none bg-secondary/80 rounded-lg"
                    style={{ writingMode: "vertical-lr", direction: "rtl" }}
                  />

                  <span className="text-[11px] font-mono text-muted-foreground">
                    {bandLabels[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: Synced Lyrics Offset ── */}
        {activeTab === "lyrics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-2xl border border-glass-border">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Mic2 className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Synced LRC Karaoke Engine</h4>
                  <p className="text-xs text-muted-foreground">LRCLIB API & Local LRC Offset Editor</p>
                </div>
              </div>

              {/* Offset Adjuster */}
              <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-glass-border">
                <span className="text-xs font-mono text-muted-foreground">Offset:</span>
                <button
                  type="button"
                  onClick={() => setOffsetMs((prev) => prev - 250)}
                  className="p-1 rounded bg-secondary hover:bg-primary/20 text-foreground hover:text-primary transition-colors"
                  title="Decrease offset (-250ms)"
                >
                  <Minus className="size-3.5" aria-hidden="true" />
                </button>
                <span className="text-xs font-mono font-bold text-primary w-16 text-center">
                  {offsetMs > 0 ? `+${offsetMs}` : offsetMs} ms
                </span>
                <button
                  type="button"
                  onClick={() => setOffsetMs((prev) => prev + 250)}
                  className="p-1 rounded bg-secondary hover:bg-primary/20 text-foreground hover:text-primary transition-colors"
                  title="Increase offset (+250ms)"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Lyric Card Simulation */}
            <div className="relative overflow-hidden rounded-2xl border border-glass-border bg-gradient-to-b from-card to-background p-6 space-y-3 text-center">
              <p className="text-xs text-muted-foreground font-mono">[00:42.10] NevPlay — Midnight Symphony</p>
              <p className="text-sm text-muted-foreground/60 transition-all">[00:45.00] Echoes in the quiet night</p>
              <div className="py-2">
                <p className="text-lg md:text-xl font-bold text-primary drop-shadow-md animate-pulse">
                  ♪ Streaming high-res audio straight from local storage ♪
                </p>
                <span className="text-[10px] font-mono text-primary/80">
                  Synced perfectly ({offsetMs}ms applied)
                </span>
              </div>
              <p className="text-sm text-muted-foreground/60 transition-all">[00:52.40] Liquid glass visuals in harmony</p>
            </div>
          </div>
        )}

        {/* ── TAB 3: Material You Theme Preview ── */}
        {activeTab === "m3" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground">Select Palette:</span>
              <div className="flex flex-wrap gap-2">
                {themes.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setSelectedTheme(t)}
                    className="flex items-center gap-2 rounded-full border border-glass-border px-3 py-1 text-xs font-medium transition-all hover:scale-105"
                    style={{
                      borderColor: selectedTheme.name === t.name ? t.primary : undefined,
                      backgroundColor: selectedTheme.name === t.name ? `${t.primary}20` : undefined,
                    }}
                  >
                    <span className="size-3 rounded-full" style={{ backgroundColor: t.primary }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Player Card with Selected Palette */}
            <div
              className="rounded-2xl p-6 border transition-all duration-500 shadow-xl space-y-4"
              style={{
                backgroundColor: selectedTheme.surface,
                borderColor: `${selectedTheme.primary}40`,
                boxShadow: `0 20px 40px -15px ${selectedTheme.primary}25`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-xl flex items-center justify-center font-bold text-black"
                    style={{ backgroundColor: selectedTheme.primary }}
                  >
                    M3
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedTheme.name}</h4>
                    <p className="text-xs text-white/70">Android Material You Dynamic Color Engine</p>
                  </div>
                </div>

                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold"
                  style={{ backgroundColor: `${selectedTheme.primary}30`, color: selectedTheme.accent }}
                >
                  Active Shader
                </span>
              </div>

              <div className="h-2 rounded-full overflow-hidden bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: "65%", backgroundColor: selectedTheme.primary }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
