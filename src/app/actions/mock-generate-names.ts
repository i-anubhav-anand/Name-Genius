"use server"

import type { GeneratedName, NameGenerationInput } from "./generate-names"

// This is a mock implementation that doesn't require an API key
export async function mockGenerateNames(input: NameGenerationInput): Promise<GeneratedName[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const { namingType, industry, traits } = input

  // Generate mock names based on input
  const mockNames: GeneratedName[] = [
    {
      name: `Lumeno${industry.substring(0, 3)}`,
      meaning: `A modern name inspired by the Latin word for light, perfect for a ${namingType} in the ${industry} industry.`,
      styleCategory: "Modern",
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `Nexora${traits[0]?.substring(0, 2) || ""}`,
      meaning: `A powerful and dynamic name that conveys innovation and forward thinking, ideal for a ${namingType}.`,
      styleCategory: "Technical",
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `Zenvia${industry.substring(0, 2)}`,
      meaning: `A calming and trustworthy name that suggests balance and harmony, great for a ${namingType} focused on customer experience.`,
      styleCategory: "Trustworthy",
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `Avantra${traits[1]?.substring(0, 2) || ""}`,
      meaning: `A forward-thinking name that suggests advancement and progress, perfect for a ${namingType} in the ${industry} space.`,
      styleCategory: "Professional",
      domainAvailable: Math.random() > 0.3,
    },
    {
      name: `Elyxir${industry.substring(0, 2)}`,
      meaning: `A luxurious and memorable name that stands out in the ${industry} industry, ideal for a premium ${namingType}.`,
      styleCategory: "Luxurious",
      domainAvailable: Math.random() > 0.3,
    },
  ]

  return mockNames
}
