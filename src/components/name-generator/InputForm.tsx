"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { generateNames } from "@/app/actions/generate-names"
import { mockGenerateNames } from "@/app/actions/mock-generate-names"
import type { GeneratedName, NameGenerationInput } from "@/app/actions/generate-names"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  ShoppingBag,
  Rocket,
  Briefcase,
  HeartPulse,
  Utensils,
  Palette,
  Music,
  Laptop,
  Zap,
} from "lucide-react"

interface InputFormProps {
  onSubmit: () => void
  onNamesGenerated: (names: GeneratedName[], input?: NameGenerationInput) => void
  onError?: (message: string) => void
  isProduction?: boolean
}

const industries = [
  { name: "Technology", icon: <Laptop size={20} /> },
  { name: "Retail", icon: <ShoppingBag size={20} /> },
  { name: "Startup", icon: <Rocket size={20} /> },
  { name: "Business", icon: <Briefcase size={20} /> },
  { name: "Healthcare", icon: <HeartPulse size={20} /> },
  { name: "Food", icon: <Utensils size={20} /> },
  { name: "Design", icon: <Palette size={20} /> },
  { name: "Music", icon: <Music size={20} /> },
  { name: "Energy", icon: <Zap size={20} /> },
  { name: "Construction", icon: <Building2 size={20} /> },
]

const traits = [
  "Modern",
  "Creative",
  "Techy",
  "Elegant",
  "Playful",
  "Serious",
  "Minimalist",
  "Bold",
  "Friendly",
  "Luxurious",
]

export function InputForm({ 
  onSubmit, 
  onNamesGenerated, 
  onError = () => {}, 
  isProduction = false 
}: InputFormProps) {
  const [namingType, setNamingType] = useState("")
  const [description, setDescription] = useState("")
  const [industry, setIndustry] = useState("")
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTraitToggle = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait))
    } else {
      if (selectedTraits.length < 5) {
        setSelectedTraits([...selectedTraits, trait])
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!namingType || !description || !industry || selectedTraits.length === 0) {
      onError("Please fill out all required fields")
      return
    }

    if (isSubmitting) return // Prevent multiple submissions
    
    setIsSubmitting(true)
    onSubmit() // Notify parent to show loading state

    // Create a safe copy of the input
    const input: NameGenerationInput = {
      namingType,
      description,
      industry,
      traits: selectedTraits.map(t => t), // Create a fresh copy
    }

    // Safely wrap the async call to prevent server component errors
    setTimeout(async () => {
      try {
        // Call the server action with proper error handling
        const names = await generateNames(input);

        if (names && names.length > 0) {
          // Pass both names and input to parent
          onNamesGenerated(names, input);
        } else {
          throw new Error("No names were generated");
        }
      } catch (error) {
        console.error("Error generating names:", error);
        
        // Always fall back to mock data if there's an error
        try {
          console.log("Falling back to mock data after error");
          const mockNames = await mockGenerateNames(input);
          onNamesGenerated(mockNames, input);
        } catch (mockError) {
          setIsSubmitting(false);
          onError(error instanceof Error ? error.message : "Failed to generate names. Please try again.");
        }
      }
    }, 0);
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Let's Create Your Perfect Name</h1>
        <p className="text-gray-400">
          Tell us a bit about what you're naming, and we'll generate brilliant options for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="naming-type">What are you naming?</Label>
          <Input
            id="naming-type"
            value={namingType}
            onChange={(e) => setNamingType(e.target.value)}
            placeholder="e.g., Company, Product, App, Service"
            className="bg-[#252525] border-none text-white focus:ring-primary focus:ring-2"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="description">Brief description</Label>
            <span className="text-xs text-gray-400">{description.length}/200</span>
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what it does, who it's for, and what makes it special..."
            className="bg-[#252525] border-none text-white focus:ring-primary focus:ring-2 min-h-[100px]"
            maxLength={200}
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Select your industry</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {industries.map((ind) => (
              <button
                key={ind.name}
                type="button"
                onClick={() => setIndustry(ind.name)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                  industry === ind.name
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-[#252525] border-2 border-transparent hover:border-primary/50"
                }`}
              >
                {ind.icon}
                <span className="mt-2 text-sm">{ind.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Select key traits (up to 5)</Label>
            <span className="text-xs text-gray-400">{selectedTraits.length}/5 selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait) => (
              <Badge
                key={trait}
                variant="outline"
                className={`cursor-pointer py-2 px-3 ${
                  selectedTraits.includes(trait) ? "bg-primary/20 border-primary" : "bg-[#252525] hover:bg-[#303030]"
                }`}
                onClick={() => handleTraitToggle(trait)}
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-6 text-lg bg-gradient-to-r from-primary to-purple-700 hover:from-purple-600 hover:to-primary transition-all duration-300 rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generating..." : "Generate Names"}
        </Button>
      </form>
    </motion.div>
  )
}
