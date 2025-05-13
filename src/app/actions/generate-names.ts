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

// Server action for name generation
export async function generateNames(input: NameGenerationInput): Promise<GeneratedName[]> {
  // Remove the production mode bypass
  // if (process.env.NODE_ENV === "production") {
  //   console.log("Production environment detected - using mock data directly");
  //   return mockGenerateNames(input);
  // }
  
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

    // Create clean input object to avoid reference issues
    const cleanInput = {
      namingType: input.namingType,
      description: input.description || "",
      industry: input.industry,
      traits: Array.isArray(input.traits) ? [...input.traits] : [input.traits]
    };
    
    console.log(`Making API request to ${baseUrl}/api/generate-names`);
    
    // Use proper fetch with retry logic
    try {
      const response = await fetch(`${baseUrl}/api/generate-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanInput),
        // Adding a timeout using AbortController
        signal: AbortSignal.timeout(25000), // 25 second timeout
      });
        
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed with status: ${response.status}`);
      }
        
      const data = await response.json();
        
      if (data.names && Array.isArray(data.names) && data.names.length > 0) {
        return data.names;
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (fetchError: any) {
      console.warn("API request failed, falling back to mock data", fetchError);
      
      // Only use mock data if we have a connection issue or timeout
      if (fetchError?.name === "AbortError" || fetchError?.name === "TypeError") {
        return mockGenerateNames(input);
      }
      
      // Otherwise propagate the error
      throw fetchError;
    }
  } catch (error) {
    console.error("Error generating names:", error);
    
    // Only fall back to mock data for certain types of errors
    if (error instanceof TypeError || error instanceof ReferenceError) {
      console.warn("Falling back to mock data due to error");
      return mockGenerateNames(input);
    }
    
    // Otherwise propagate the error
    throw error;
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
