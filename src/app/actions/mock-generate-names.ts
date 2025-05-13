"use server"

import type { GeneratedName, NameGenerationInput } from "./generate-names"

// This is a mock implementation that doesn't require an API key
export async function mockGenerateNames(input: NameGenerationInput): Promise<GeneratedName[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Ensure input has valid values
  const namingType = input?.namingType || "Product"
  const industry = input?.industry || "Technology"
  const description = input?.description || `A ${namingType} in the ${industry} industry`
  
  // Safely access traits
  let traitsList: string[] = []
  if (input?.traits && Array.isArray(input.traits) && input.traits.length > 0) {
    traitsList = input.traits
  } else if (typeof input?.traits === 'string') {
    traitsList = [input.traits]
  } else {
    traitsList = ["Modern", "Innovative"]
  }

  // Add more variety based on industry
  const prefixes = [
    "Neo", "Evo", "Avi", "Lumi", "Zen", "Aura", "Viva", "Nex", "Orb", "Prim", 
    "Tera", "Zing", "Wave", "Flux", "Echo", "Pulse", "Spark", "Helix", "Apex", "Kore"
  ]
  
  const suffixes = [
    "ify", "ize", "ium", "ance", "ent", "eon", "ix", "ero", "ico", "ism",
    "ist", "ite", "ati", "ado", "ago", "ova", "era", "ium", "ius", "io"
  ]
  
  // Create some randomness for this batch
  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const industrySuffix = industry.substring(0, 3)
  
  // Dynamic style categories based on traits
  const styleCategories = [
    "Modern", "Technical", "Professional", "Luxurious", "Creative", 
    "Playful", "Minimalist", "Bold", "Traditional", "Elegant"
  ]

  // Get up to two traits to use in names
  const trait1 = traitsList[0] || "Modern"
  const trait2 = traitsList.length > 1 ? traitsList[1] : trait1
  
  // Get timestamp to ensure names are different on each call
  const timestamp = new Date().getTime().toString().slice(-3)
  
  // Generate 5 unique names
  const mockNames: GeneratedName[] = [
    {
      name: `${getRandomElement(prefixes)}${industrySuffix}`,
      meaning: `A contemporary name that embodies ${trait1.toLowerCase()} innovation, perfect for a ${namingType} in the ${industry} industry.`,
      styleCategory: getRandomElement(styleCategories),
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `${trait1.substring(0, 4)}${getRandomElement(suffixes)}`,
      meaning: `A name derived from ${trait1.toLowerCase()}, conveying the core values of your ${namingType}. It's distinctive and memorable.`,
      styleCategory: getRandomElement(styleCategories),
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `${getRandomElement(prefixes)}${trait2.substring(0, 4)}`,
      meaning: `Combines futuristic elements with ${trait2.toLowerCase()} aesthetics, ideal for a forward-thinking ${namingType}.`,
      styleCategory: getRandomElement(styleCategories),
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `${industry.substring(0, 3)}${getRandomElement(suffixes)}`,
      meaning: `Directly references the ${industry} industry while maintaining a unique identity. Perfect for establishing instant recognition.`,
      styleCategory: getRandomElement(styleCategories),
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `${getRandomElement(prefixes)}${timestamp}`,
      meaning: `A distinctive name with numerical significance, standing out in the ${industry} space while conveying ${trait1.toLowerCase()} qualities.`,
      styleCategory: getRandomElement(styleCategories),
      domainAvailable: Math.random() > 0.3,
    },
  ]

  // Ensure names are capitalized and look professional
  return mockNames.map(name => ({
    ...name,
    name: name.name.charAt(0).toUpperCase() + name.name.slice(1),
  }))
}
