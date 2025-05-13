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

// Mark the server action with 'use server' to ensure it's treated as a server action
export async function generateNames(input: NameGenerationInput): Promise<GeneratedName[]> {
  try {
    // Check for valid input to prevent server errors
    if (!input || !input.namingType || !input.industry || !input.traits) {
      console.error("Invalid input provided to generateNames:", input);
      throw new Error("Invalid input for name generation");
    }

    // Determine the base URL for the API
    let baseUrl = "";

    // Handle different deployment environments safely
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      // Use HTTPS for all Vercel deployments to prevent mixed-content issues
      baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    } else if (process.env.VERCEL_URL) {
      // Fallback to VERCEL_URL if NEXT_PUBLIC_VERCEL_URL isn't available
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    } else if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      // Use a custom environment variable if configured
      baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    }

    console.log(`Using API base URL: ${baseUrl}`);

    // If no baseUrl could be determined, fall back to mock data in development
    if (!baseUrl) {
      if (process.env.NODE_ENV === "development") {
        console.warn("No base URL could be determined, falling back to mock data");
        return mockGenerateNames(input);
      } else {
        // In production, return an empty array instead of throwing to prevent server errors
        console.error("No API URL could be determined in production");
        return [];
      }
    }

    // Simple fetch with one retry, using a safer approach for production
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // Shorter timeout for production
    
    try {
      const response = await fetch(`${baseUrl}/api/generate-names`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namingType: input.namingType,
          description: input.description || "",
          industry: input.industry,
          traits: Array.isArray(input.traits) ? input.traits : [input.traits]
        }),
        cache: "no-store",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Handle error responses more safely
        let errorMsg = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (_) {
          // Ignore JSON parse errors
        }
        throw new Error(errorMsg);
      }
      
      // Parse response safely
      const data = await response.json();
      return Array.isArray(data.names) ? data.names : [];
    } catch (fetchError) {
      console.warn("Initial fetch attempt failed, trying once more");
      
      // One retry in case of timeout or network issue
      try {
        const retryResponse = await fetch(`${baseUrl}/api/generate-names`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            namingType: input.namingType,
            description: input.description || "",
            industry: input.industry,
            traits: Array.isArray(input.traits) ? input.traits : [input.traits]
          }),
          cache: "no-store"
        });
        
        if (!retryResponse.ok) {
          throw new Error(`API request failed with status ${retryResponse.status}`);
        }
        
        const data = await retryResponse.json();
        return Array.isArray(data.names) ? data.names : [];
      } catch (retryError) {
        // In production, return mock data rather than failing completely
        console.error("Both fetch attempts failed:", retryError);
        return mockGenerateNames(input);
      }
    }
  } catch (error) {
    console.error("Error generating names:", error);

    // Always return mock data instead of throwing to prevent server rendering errors
    console.warn("Falling back to mock data due to error");
    return mockGenerateNames(input);
  }
}

// Function to check domain availability (simulated for now)
export async function checkDomainAvailability(names: string[]): Promise<Record<string, boolean>> {
  // In a real implementation, you would call a domain availability API
  // For now, we'll simulate with random results
  const results: Record<string, boolean> = {};

  names.forEach((name) => {
    results[name] = Math.random() > 0.3;
  });

  return results;
}
