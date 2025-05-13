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

    // Determine the base URL for the API - prioritize custom domain if available
    let baseUrl = "";
    
    // First check for custom domain or environment-specific variable
    if (process.env.NEXT_PUBLIC_APP_URL) {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    }
    // For preview deployments
    else if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    // For production deployment
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // Shorter timeout for production
    
    try {
      // Create clean input object to avoid reference issues
      const cleanInput = {
        namingType: input.namingType,
        description: input.description || "",
        industry: input.industry,
        traits: Array.isArray(input.traits) ? [...input.traits] : [input.traits]
      };
      
      console.log(`Making API request to ${baseUrl}/api/generate-names`);
      
      const response = await fetch(`${baseUrl}/api/generate-names`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanInput),
        cache: "no-store",
        signal: controller.signal,
        // Add crucial next.js fetch options for server actions
        next: { revalidate: 0 }
      });
      
      clearTimeout(timeoutId);
      
      // Check status code first
      if (!response.ok) {
        // For security in production, limit error detail
        if (process.env.NODE_ENV === 'production') {
          console.error(`API request failed with status ${response.status}`);
          return mockGenerateNames(input); // Silently fallback in production
        } else {
          // In development, show more details
          let errorMsg = `API request failed with status ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.error) errorMsg = errorData.error;
          } catch (_) {
            // Ignore JSON parse errors
          }
          throw new Error(errorMsg);
        }
      }
      
      // Parse response safely
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse API response as JSON");
        return mockGenerateNames(input);
      }
      
      // Validate response structure
      if (!data || !Array.isArray(data.names) || data.names.length === 0) {
        console.warn("Invalid response format or empty names array");
        return mockGenerateNames(input);
      }
      
      return data.names;
    } catch (fetchError: any) {
      // For timeouts or network errors, try a direct mock rather than retrying
      if (fetchError?.name === 'AbortError' || process.env.NODE_ENV === 'production') {
        console.warn("API request timed out or failed, using mock data", fetchError);
        return mockGenerateNames(input);
      }
      
      // In development, show the error and retry once
      console.warn("Initial fetch attempt failed, trying once more:", fetchError);
      
      // One retry in development only
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
            traits: Array.isArray(input.traits) ? [...input.traits] : [input.traits]
          }),
          cache: "no-store",
          next: { revalidate: 0 }
        });
        
        if (!retryResponse.ok) {
          console.error(`Retry API request failed with status ${retryResponse.status}`);
          return mockGenerateNames(input);
        }
        
        const data = await retryResponse.json();
        return Array.isArray(data.names) && data.names.length > 0 ? data.names : mockGenerateNames(input);
      } catch (retryError) {
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
