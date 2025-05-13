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
  const isDev = process.env.NODE_ENV === "development";
  
  // In development, log environment details to help debug
  if (isDev) {
    console.log("Environment:", process.env.NODE_ENV);
    console.log("VERCEL_URL available:", !!process.env.VERCEL_URL);
    console.log("NEXT_PUBLIC_VERCEL_URL available:", !!process.env.NEXT_PUBLIC_VERCEL_URL);
    console.log("OPENAI_API_KEY available:", !!process.env.OPENAI_API_KEY);
  }
  
  try {
    // Check for valid input to prevent server errors
    if (!input || !input.namingType || !input.industry || !input.traits) {
      console.error("Invalid input provided to generateNames:", input);
      throw new Error("Invalid input for name generation");
    }

    // Determine the base URL for the API
    let baseUrl = "";

    // Handle different deployment environments safely
    if (process.env.VERCEL_URL) {
      // Directly use VERCEL_URL first (server-side env var) with HTTPS
      baseUrl = `https://${process.env.VERCEL_URL}`;
      console.log(`Using Vercel URL: ${baseUrl}`);
    } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      // Fallback to NEXT_PUBLIC_VERCEL_URL if available
      baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
      console.log(`Using public Vercel URL: ${baseUrl}`);
    } else if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      // Use a custom environment variable if configured
      baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      console.log(`Using custom API base URL: ${baseUrl}`);
    } else if (isDev) {
      baseUrl = "http://localhost:3000";
      console.log(`Using localhost URL: ${baseUrl}`);
    } else {
      // Auto-detect URL (less reliable)
      baseUrl = process.env.VERCEL_ENV ? 
        `https://${process.env.VERCEL_URL || "your-app.vercel.app"}` : 
        "http://localhost:3000";
      console.log(`Using auto-detected URL: ${baseUrl}`);
    }

    console.log(`Final API base URL: ${baseUrl}`);

    // If no baseUrl could be determined, fall back to mock data in development
    if (!baseUrl) {
      if (isDev) {
        console.warn("No base URL could be determined, falling back to mock data");
        return mockGenerateNames(input);
      } else {
        // In production, try to use a default Vercel URL pattern based on the project name
        console.warn("No API URL could be determined in production, attempting to use default pattern");
        baseUrl = "https://name-genius.vercel.app"; // Replace with your actual Vercel project URL
      }
    }

    // Simple fetch with one retry, using a safer approach for production
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    try {
      console.log(`Making API request to ${baseUrl}/api/generate-names`);
      
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
          if (errorData.error) {
            errorMsg = errorData.error;
            console.error("API error response:", errorData);
          }
        } catch (_) {
          // Ignore JSON parse errors
          console.error("Could not parse error response");
        }
        throw new Error(errorMsg);
      }
      
      // Parse response safely
      const data = await response.json();
      
      if (!data || !Array.isArray(data.names) || data.names.length === 0) {
        console.error("Invalid API response:", data);
        throw new Error("Invalid response from API");
      }
      
      console.log(`Successfully received ${data.names.length} names from API`);
      return data.names;
    } catch (fetchError: any) {
      console.warn("Initial fetch attempt failed:", fetchError.message || "Unknown error");
      
      // One retry in case of timeout or network issue
      try {
        console.log("Retrying API request...");
        
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
          const errorStatus = retryResponse.status;
          let errorText = "";
          try {
            const errorData = await retryResponse.json();
            errorText = errorData.error || "";
          } catch (_) {}
          
          throw new Error(`API retry failed with status ${errorStatus}${errorText ? `: ${errorText}` : ""}`);
        }
        
        const data = await retryResponse.json();
        
        if (!data || !Array.isArray(data.names)) {
          throw new Error("Invalid response from API retry");
        }
        
        return data.names;
      } catch (retryError: any) {
        // Only use mock data in development, throw error in production for better visibility
        console.error("Both fetch attempts failed:", retryError.message || "Unknown error");
        
        if (isDev) {
          console.warn("Falling back to mock data in development");
          return mockGenerateNames(input);
        } else {
          console.error("API unavailable in production environment");
          throw new Error("Name generation service is temporarily unavailable. Please try again later.");
        }
      }
    }
  } catch (error: any) {
    console.error("Error generating names:", error.message || error);

    // Only use mock data in development, otherwise propagate the error
    if (isDev) {
      console.warn("Falling back to mock data due to error");
      return mockGenerateNames(input);
    } else {
      throw error;
    }
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
