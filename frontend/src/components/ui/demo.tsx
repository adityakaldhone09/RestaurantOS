"use client"

import { GlassReveal21st, RestaurantOSLogoReveal } from "@/components/ui/liquid-glass-logo-reveal"

export function GlassReveal21stDemo() {
  return <GlassReveal21st className="h-svh min-h-[420px] w-full" />
}

export function RestaurantOSLogoRevealDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full p-8 bg-[#400849] rounded-3xl">
      <div className="w-64 h-64 shadow-2xl rounded-3xl overflow-hidden border border-[#52155D]">
        <RestaurantOSLogoReveal className="w-full h-full" themeVariant="brand" />
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          Restaurant<span className="text-[#FF5A0A]">OS</span>
        </h3>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#E7B0DE]/80 mt-1">
          Hospitality Suite • Liquid Glass Engine
        </p>
      </div>
    </div>
  )
}

export default GlassReveal21stDemo
