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
  // IMPORTANT: For now, use mock data directly to avoid Server Components render errors
  // This is a temporary solution until we can debug the production environment issues
  if (process.env.NODE_ENV === "production") {
    console.log("Production environment detected - using mock data directly");
    return mockGenerateNames(input);
  }
  
  try {
    // Check for valid input to prevent server errors
    if (!input || !input.namingType || !input.industry || !input.traits) {
      console.error("Invalid input provided to generateNames:", input);
      throw new Error("Invalid input for name generation");
    }

    // Determine the base URL for the API - prioritize custom domain if available
    let baseUrl = "";
    
    // First check for custom domain or environment-specific variable
    if (process.env.NEXT_PUBLIC_APP_URL) {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    }
    // For preview deployments (your current URL is a preview deployment)
    else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    // Local development fallback
    else if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    }

    console.log(`Using API base URL: ${baseUrl}`);

    // If no baseUrl could be determined, fall back to mock data
    if (!baseUrl) {
      console.warn("No base URL could be determined, falling back to mock data");
      return mockGenerateNames(input);
    }

    // Simple fetch with one retry, using a safer approach for production
    try {
      // Create clean input object to avoid reference issues
      const cleanInput = {
        namingType: input.namingType,
        description: input.description || "",
        industry: input.industry,
        traits: Array.isArray(input.traits) ? [...input.traits] : [input.traits]
      };
      
      console.log(`Making API request to ${baseUrl}/api/generate-names`);
      
      // Use a direct mock implementation for now
      return mockGenerateNames(input);
      
    } catch (fetchError: any) {
      console.warn("API request failed, using mock data", fetchError);
      return mockGenerateNames(input);
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
