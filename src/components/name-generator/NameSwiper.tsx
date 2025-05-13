"use client"

import { useState, useEffect } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { Heart, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GeneratedName } from "@/app/actions/generate-names"

interface NameSwiperProps {
  names: GeneratedName[]
  onLike: (name: GeneratedName) => void
  onBatchComplete: () => void
  batch: number
  totalBatches: number
  likedNames: GeneratedName[]
}

export function NameSwiper({ names, onLike, onBatchComplete, batch, totalBatches, likedNames }: NameSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<string | null>(null)
  const controls = useAnimation()

  const currentName = names[currentIndex]

  useEffect(() => {
    // Reset index when new names are provided
    setCurrentIndex(0)
    setDirection(null)
  }, [names])

  useEffect(() => {
    // Check if we've gone through all names
    if (currentIndex >= names.length) {
      onBatchComplete()
    }
  }, [currentIndex, names.length, onBatchComplete])

  const handleSwipe = async (dir: "left" | "right") => {
    setDirection(dir)

    // Animate the card off screen
    await controls.start({
      x: dir === "left" ? -500 : 500,
      opacity: 0,
      transition: { duration: 0.3 },
    })

    // If swiped right (liked), add to liked names
    if (dir === "right") {
      onLike(currentName)
    }

    // Reset animation and move to next card
    controls.set({ x: 0, opacity: 1 })
    setCurrentIndex((prev) => prev + 1)
    setDirection(null)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      handleSwipe("right")
    } else if (info.offset.x < -threshold) {
      handleSwipe("left")
    } else {
      // Reset position if not swiped far enough
      controls.start({ x: 0, opacity: 1 })
    }
  }

  if (currentIndex >= names.length) {
    return null // Will be handled by the useEffect to call onBatchComplete
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Name</h2>
        <p className="text-gray-400">Swipe right to like, left to pass</p>
      </div>

      <div className="relative w-full max-w-md h-[400px] mb-8">
        {/* Background grid pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

        <motion.div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          animate={controls}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{
            x: 0,
            background: "linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(0, 0, 0, 0.8))",
            border: "2px solid rgba(139, 92, 246, 0.3)",
            boxShadow: "0 10px 30px -5px rgba(139, 92, 246, 0.2)",
          }}
          whileTap={{ scale: 1.05 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Red overlay when swiping left */}
          <motion.div
            className="absolute inset-0 bg-red-500/20 pointer-events-none"
            animate={{ opacity: direction === "left" ? 1 : 0 }}
          />

          {/* Green overlay when swiping right */}
          <motion.div
            className="absolute inset-0 bg-green-500/20 pointer-events-none"
            animate={{ opacity: direction === "right" ? 1 : 0 }}
          />

          <div className="absolute inset-0 p-8 flex flex-col">
            <div className="text-xs uppercase tracking-wider mb-2 opacity-80">{currentName.styleCategory}</div>

            <h3 className="text-5xl md:text-6xl font-bold mb-4 font-montserrat">{currentName.name}</h3>

            <p className="text-gray-300 mb-6">{currentName.meaning}</p>

            <div className="mt-auto flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full w-fit">
              <Globe className="h-4 w-4" />
              <span className="text-sm">
                {currentName.name.toLowerCase().replace(/\s+/g, "")}.com is
                <span className={currentName.domainAvailable ? " text-green-400" : " text-red-400"}>
                  {currentName.domainAvailable ? " available" : " taken"}
                </span>
              </span>
            </div>

            {/* Swipe indicators */}
            <div className="absolute top-4 right-4">
              <motion.div
                className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: direction === "right" ? 1 : 0,
                  scale: direction === "right" ? 1 : 0.8,
                }}
              >
                LIKE
              </motion.div>
            </div>

            <div className="absolute top-4 left-4">
              <motion.div
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: direction === "left" ? 1 : 0,
                  scale: direction === "left" ? 1 : 0.8,
                }}
              >
                PASS
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-8 mb-8">
        <Button
          onClick={() => handleSwipe("left")}
          size="icon"
          className="h-14 w-14 rounded-full bg-[#252525] hover:bg-red-600 transition-colors"
          variant="outline"
        >
          <X className="h-8 w-8" />
          <span className="sr-only">Dislike</span>
        </Button>

        <Button
          onClick={() => handleSwipe("right")}
          size="icon"
          className="h-14 w-14 rounded-full bg-[#252525] hover:bg-green-600 transition-colors"
          variant="outline"
        >
          <Heart className="h-8 w-8" />
          <span className="sr-only">Like</span>
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-400">
          Name {currentIndex + 1} of {names.length} • Batch {batch} of {totalBatches}
        </p>
      </div>

      {/* Liked names row */}
      {likedNames.length > 0 && (
        <div className="w-full max-w-3xl">
          <h3 className="text-lg font-medium mb-4">Your favorites so far:</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {likedNames.map((name, i) => (
              <div key={i} className="flex-shrink-0 bg-[#252525] rounded-lg p-4 border border-primary/30 min-w-[150px]">
                <p className="font-bold">{name.name}</p>
                <p className="text-xs text-gray-400">{name.styleCategory}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
