"use client"

import { useState } from "react"
import { motion, type PanInfo } from "framer-motion"
import { Check, Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BrandNameSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<string | null>(null)
  const [likedNames, setLikedNames] = useState<string[]>([])
  const [exitX, setExitX] = useState(0)

  const brandNames = [
    {
      name: "Lumeno",
      color: "from-cyan-300 to-cyan-500",
      description: "Modern & bright",
      category: "Tech / Innovation",
      domain: "lumeno.io",
      available: true,
    },
    {
      name: "Nexora",
      color: "from-orange-300 to-orange-500",
      description: "Dynamic & powerful",
      category: "Business / Enterprise",
      domain: "nexora.com",
      available: false,
    },
    {
      name: "Zenvia",
      color: "from-purple-300 to-purple-500",
      description: "Calm & trustworthy",
      category: "Wellness / Lifestyle",
      domain: "zenvia.co",
      available: true,
    },
    {
      name: "Avantra",
      color: "from-emerald-300 to-emerald-500",
      description: "Forward-thinking & stable",
      category: "Finance / Security",
      domain: "avantra.io",
      available: true,
    },
    {
      name: "Elyxir",
      color: "from-pink-300 to-pink-500",
      description: "Luxurious & memorable",
      category: "Beauty / Luxury",
      domain: "elyxir.com",
      available: false,
    },
    // 5 new brand names
    {
      name: "Vitalix",
      color: "from-green-300 to-green-500",
      description: "Energetic & natural",
      category: "Health / Wellness",
      domain: "vitalix.co",
      available: true,
    },
    {
      name: "Quantaro",
      color: "from-blue-300 to-blue-600",
      description: "Precise & innovative",
      category: "Data / Analytics",
      domain: "quantaro.ai",
      available: true,
    },
    {
      name: "Solstice",
      color: "from-amber-300 to-amber-500",
      description: "Bright & transformative",
      category: "Sustainability / Energy",
      domain: "solstice.energy",
      available: false,
    },
    {
      name: "Novaris",
      color: "from-indigo-300 to-indigo-500",
      description: "Futuristic & reliable",
      category: "Aerospace / Engineering",
      domain: "novaris.tech",
      available: true,
    },
    {
      name: "Harmonia",
      color: "from-rose-300 to-rose-500",
      description: "Balanced & soothing",
      category: "Music / Entertainment",
      domain: "harmonia.io",
      available: true,
    },
  ]

  const handleSwipe = (dir: string) => {
    setDirection(dir)
    if (dir === "right") {
      setLikedNames([...likedNames, brandNames[currentIndex].name])
    }

    setExitX(dir === "right" ? 1000 : -1000)

    // Reset after animation completes
    setTimeout(() => {
      // Loop back to the beginning if we've reached the end
      if (currentIndex < brandNames.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex(0) // Loop back to the first name
      }
      setDirection(null)
      setExitX(0)
    }, 300)
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setLikedNames([])
    setDirection(null)
    setExitX(0)
  }

  // Drag handlers
  const onDragEnd = (e: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      const dir = info.offset.x > 0 ? "right" : "left"
      handleSwipe(dir)
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <>
        <div className="relative w-full h-full">
          {/* Show the next 3 cards in the stack, with looping */}
          {[...Array(3)].map((_, i) => {
            const brandIndex = (currentIndex + i) % brandNames.length
            const brand = brandNames[brandIndex]
            return (
              <motion.div
                key={`${brand.name}-${brandIndex}-${i}`}
                className={`absolute top-0 left-0 right-0 w-full h-[80%] rounded-3xl overflow-hidden shadow-xl ${i === 0 ? "cursor-grab active:cursor-grabbing" : ""}`}
                style={{
                  zIndex: 1000 - i,
                  transformOrigin: "bottom center",
                }}
                animate={{
                  scale: i === 0 ? 1 : 1 - i * 0.05,
                  y: i === 0 ? 0 : -30 * i,
                  x: i === 0 ? exitX : 0,
                  rotate: i === 0 ? (exitX !== 0 ? (exitX > 0 ? 10 : -10) : 0) : 0,
                  opacity: i === 0 ? 1 : 0.8 - i * 0.2,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                drag={i === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={i === 0 ? onDragEnd : undefined}
                whileDrag={{ scale: 1.05 }}
                dragElastic={0.7}
              >
                <div className="relative h-full w-full border-2 border-primary/50 rounded-3xl bg-gradient-to-br from-primary via-purple-700/80 to-primary/20 text-white p-8 flex justify-center items-center flex-col gap-4 backdrop-blur-[12px] group/card">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)]"></div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
                  </div>

                  <div className="relative z-10 transition-transform duration-300 space-y-3 text-center">
                    <div className="text-xs uppercase tracking-wider mb-2 opacity-80">{brand.category}</div>
                    <h3 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                      {brand.name}
                    </h3>
                    <p className="text-lg text-purple-100/90 leading-relaxed">{brand.description}</p>
                  </div>

                  <div className="relative z-10 flex items-center mt-4 bg-white/10 px-4 py-2 rounded-full">
                    <Globe className="size-4 mr-2" />
                    <span className="text-sm">{brand.domain}</span>
                  </div>

                  {i === 0 && (
                    <>
                      <motion.div
                        className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full font-bold"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: direction === "right" || (exitX > 50 && exitX < 1000) ? 1 : 0,
                          scale: direction === "right" || (exitX > 50 && exitX < 1000) ? 1 : 0.8,
                        }}
                      >
                        LIKE
                      </motion.div>

                      <motion.div
                        className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: direction === "left" || (exitX < -50 && exitX > -1000) ? 1 : 0,
                          scale: direction === "left" || (exitX < -50 && exitX > -1000) ? 1 : 0.8,
                        }}
                      >
                        NOPE
                      </motion.div>
                    </>
                  )}

                  <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent blur-sm"></div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Control buttons */}
        <div className="flex gap-8 mt-4">
          <Button
            onClick={() => handleSwipe("left")}
            size="icon"
            className="size-14 rounded-full bg-slate-800 hover:bg-red-600 transition-colors"
            variant="outline"
          >
            <X className="size-8" />
            <span className="sr-only">Reject</span>
          </Button>

          <Button
            onClick={() => handleSwipe("right")}
            size="icon"
            className="size-14 rounded-full bg-slate-800 hover:bg-green-600 transition-colors"
            variant="outline"
          >
            <Check className="size-8" />
            <span className="sr-only">Accept</span>
          </Button>
        </div>

        {/* Liked names counter */}
        {likedNames.length > 0 && (
          <div className="mt-4 text-center">
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              {likedNames.length} name{likedNames.length !== 1 ? "s" : ""} liked
            </span>
          </div>
        )}
      </>
    </div>
  )
}
