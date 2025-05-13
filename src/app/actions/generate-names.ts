"use server"

import { mockGenerateNames } from "./mock-generate-names"

export type NameGenerationInput = {
  namingType: string
  description: string
  industry: string
  traits: string[]
}

export type GeneratedName = {
  name: string
  meaning: string
  styleCategory: string
  domainAvailable?: boolean
}

export async function generateNames(input: NameGenerationInput): Promise<GeneratedName[]> {
  try {
    // Determine the base URL for the API
    let baseUrl = ""

    // In production on Vercel, use the NEXT_PUBLIC_VERCEL_URL
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    }
    // In development, use localhost
    else if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000"
    }

    console.log(`Using API base URL: ${baseUrl}`)

    // If no baseUrl could be determined, fall back to mock data in development
    if (!baseUrl) {
      if (process.env.NODE_ENV === "development") {
        console.warn("No base URL could be determined, falling back to mock data")
        return mockGenerateNames(input)
      } else {
        throw new Error("API URL could not be determined")
      }
    }

    // Simple fetch with one retry
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
    
    try {
      const response = await fetch(`${baseUrl}/api/generate-names`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
        cache: "no-store",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }
      
      const data = await response.json()
      return data.names
    } catch (fetchError) {
      console.warn("Initial fetch attempt failed, trying once more")
      
      // One retry in case of timeout or network issue
      const retryResponse = await fetch(`${baseUrl}/api/generate-names`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
        cache: "no-store"
      });
      
      if (!retryResponse.ok) {
        throw new Error(`API request failed with status ${retryResponse.status}`)
      }
      
      const data = await retryResponse.json()
      return data.names
    }
  } catch (error) {
    console.error("Error generating names:", error)

    // Fall back to mock data in development only
    if (process.env.NODE_ENV === "development") {
      console.warn("Falling back to mock data due to error")
      return mockGenerateNames(input)
    }

    throw error
  }
}

// Function to check domain availability (simulated for now)
export async function checkDomainAvailability(names: string[]): Promise<Record<string, boolean>> {
  // In a real implementation, you would call a domain availability API
  // For now, we'll simulate with random results
  const results: Record<string, boolean> = {}

  names.forEach((name) => {
    results[name] = Math.random() > 0.3
  })

  return results
}
