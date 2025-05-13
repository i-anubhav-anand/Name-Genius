"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

// Layout components
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

// Section components
import { HeroSection } from "@/components/sections/HeroSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { PricingSection } from "@/components/sections/PricingSection"
import { CTASection } from "@/components/sections/CTASection"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTheme("dark") // Force dark mode

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setTheme])

  // Wait until mounted to avoid hydration mismatch
  if (!mounted) return null

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header isScrolled={isScrolled} />

      <main className="flex-1">
        <HeroSection />
        <CTASection /> {/* Moved the CTA section here, between Hero and How It Works */}
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  )
}
