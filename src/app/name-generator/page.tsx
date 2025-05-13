"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { InputForm } from "@/components/name-generator/InputForm"
import { NameSwiper } from "@/components/name-generator/NameSwiper"
import { ResultsDashboard } from "@/components/name-generator/ResultsDashboard"
import { LoadingTransition } from "@/components/name-generator/LoadingTransition"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GeneratedName, NameGenerationInput } from "@/app/actions/generate-names"
import { generateNames } from "@/app/actions/generate-names"

type Step = "input" | "loading" | "swiper" | "results"

export default function NameGeneratorPage() {
  const [step, setStep] = useState<Step>("input")
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])
  const [likedNames, setLikedNames] = useState<GeneratedName[]>([])
  const [currentBatch, setCurrentBatch] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Store the input form data for reuse across batches
  const [lastInput, setLastInput] = useState<NameGenerationInput | null>(null)

  // Use useRef instead of state for the timeout to avoid re-renders
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set up a timeout for the loading state
  useEffect(() => {
    // Clear any existing timeout first
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }

    // Only set a new timeout if we're in the loading state
    if (step === "loading") {
      loadingTimeoutRef.current = setTimeout(() => {
        setError("The name generation is taking longer than expected. Please try again.")
        setStep("input")
        setIsLoading(false)
      }, 45000) // Extended to 45 seconds to allow for API call + retry
    }

    // Cleanup function to clear the timeout when the component unmounts or step changes
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }, [step]) // Only depend on step, not on the timeout ref itself

  const handleNamesGenerated = (names: GeneratedName[], input?: NameGenerationInput) => {
    setGeneratedNames(names)
    setIsLoading(false)
    setError(null)
    setStep("swiper")
    
    // Save the input for future batches if provided
    if (input) {
      setLastInput(input)
    }
  }

  const handleStartLoading = () => {
    setIsLoading(true)
    setError(null)
    setStep("loading")
  }

  const handleNameLiked = (name: GeneratedName) => {
    setLikedNames((prev) => [...prev, name])
  }

  const handleBatchComplete = () => {
    if (currentBatch < 3) {
      setCurrentBatch((prev) => prev + 1)
      handleStartLoading()
      
      // Instead of calling the server action directly, let's create a wrapper component
      // that has the same API as InputForm to keep things consistent
      if (lastInput) {
        // Create a fake event object to prevent issues
        const generateNextBatch = async () => {
          try {
            console.log(`Generating names for batch ${currentBatch + 1}...`)
            const newNames = await generateNames({...lastInput})
            handleNamesGenerated(newNames)
          } catch (error) {
            console.error("Error generating names for next batch:", error)
            setIsLoading(false)
            setError(error instanceof Error ? error.message : "Failed to generate names. Please try again.")
            setStep("input")
          }
        }
        
        // Call the function safely
        generateNextBatch().catch((error) => {
          console.error("Unhandled error in generateNextBatch:", error)
          setIsLoading(false)
          setError("An unexpected error occurred. Please try again.")
          setStep("input")
        })
      } else {
        // Fallback in case input wasn't saved
        setError("Unable to generate more names. Please start over.")
        setStep("input")
        setIsLoading(false)
      }
    } else {
      setStep("results")
    }
  }

  const handleStartOver = () => {
    setStep("input")
    setGeneratedNames([])
    setLikedNames([])
    setCurrentBatch(1)
    setError(null)
    setLastInput(null)
  }

  const handleError = (errorMessage: string) => {
    setIsLoading(false)
    setError(errorMessage)
    setStep("input")
  }

  const handleRetry = () => {
    setError(null)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-black text-white">
      <Header isScrolled={true} />

      <main className="flex-1 container px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <Alert variant="destructive" className="bg-red-950/50 border-red-900">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                  <p>{error}</p>
                  <Button variant="outline" size="sm" className="w-fit flex items-center gap-2" onClick={handleRetry}>
                    <RefreshCw className="h-4 w-4" /> Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InputForm onSubmit={handleStartLoading} onNamesGenerated={handleNamesGenerated} onError={handleError} />
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingTransition batch={currentBatch} totalBatches={3} />
            </motion.div>
          )}

          {step === "swiper" && (
            <motion.div
              key="swiper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NameSwiper
                names={generatedNames}
                onLike={handleNameLiked}
                onBatchComplete={handleBatchComplete}
                batch={currentBatch}
                totalBatches={3}
                likedNames={likedNames}
              />
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDashboard likedNames={likedNames} onStartOver={handleStartOver} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
