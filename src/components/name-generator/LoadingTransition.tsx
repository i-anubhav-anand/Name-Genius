"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface LoadingTransitionProps {
  batch: number
  totalBatches: number
}

export function LoadingTransition({ batch, totalBatches }: LoadingTransitionProps) {
  const [loadingTime, setLoadingTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up the interval
    intervalRef.current = setInterval(() => {
      setLoadingTime((prev) => prev + 1)
    }, 1000)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, []) // Empty dependency array - only run once on mount

  const messages = [
    "Creating brilliant names for you...",
    "Generating new recommendations based on your preferences...",
    "Crafting final personalized name options...",
  ]

  const insights = [
    "Analyzing linguistic patterns...",
    "Checking cultural associations...",
    "Evaluating memorability factors...",
    "Assessing brand potential...",
    "Verifying uniqueness...",
    "Exploring sound symbolism...",
    "Testing pronunciation ease...",
    "Analyzing market fit...",
  ]

  const currentMessage = messages[Math.min(batch - 1, messages.length - 1)]

  // Select insights based on loading time, but don't change them on every render
  // Use a deterministic approach based on loading time
  const visibleInsightsCount = Math.min(3, Math.floor(loadingTime / 3) + 1)
  const currentInsights = insights.slice(0, visibleInsightsCount)

  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="relative w-32 h-32 mb-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-4 rounded-full border-4 border-transparent border-t-primary/70 border-r-primary/70"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        {currentMessage}
      </motion.h2>

      <p className="text-gray-400 text-center mb-8">
        Generating Batch {batch} of {totalBatches} • {loadingTime}s
      </p>

      <div className="flex flex-col gap-3 w-full max-w-md">
        {currentInsights.map((insight, index) => (
          <motion.div
            key={`${insight}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.5 }}
            className="bg-primary/10 rounded-lg border border-primary/30 p-3 flex items-center"
          >
            <div className="mr-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-gray-300">{insight}</p>
          </motion.div>
        ))}
      </div>

      {loadingTime > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-md text-center p-4 bg-primary/10 rounded-lg border border-primary/30"
        >
          <p className="text-sm text-gray-300">
            This is taking a bit longer than usual. Our AI is working hard to create the perfect names for you.
          </p>
        </motion.div>
      )}

      {batch > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 max-w-md text-center p-4 bg-primary/10 rounded-lg border border-primary/30"
        >
          <p className="text-sm text-gray-300">
            {batch === 2
              ? "We noticed you prefer shorter, modern names. Creating fresh suggestions..."
              : "Your preferences are clear! Generating final personalized name options..."}
          </p>
        </motion.div>
      )}
    </div>
  )
}
