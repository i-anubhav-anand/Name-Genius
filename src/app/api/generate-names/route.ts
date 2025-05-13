import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  console.log("API route called: /api/generate-names")

  try {
    // Check if API key is configured - use a safer approach for production
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("OpenAI API key is not configured")
      return NextResponse.json(
        { error: "API configuration error. Please check your environment variables." },
        { status: 500 },
      )
    }

    // Parse request body safely
    let body = {}
    try {
      body = await request.json()
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Validate and extract input with fallbacks for safety
    const { namingType, description, industry, traits } = body as any
    
    // Validate required fields with better error messages
    if (!namingType) {
      return NextResponse.json({ error: "Missing naming type field" }, { status: 400 })
    }
    
    if (!industry) {
      return NextResponse.json({ error: "Missing industry field" }, { status: 400 })
    }
    
    if (!traits) {
      return NextResponse.json({ error: "Missing traits field" }, { status: 400 })
    }

    console.log("Generating names for:", {
      namingType,
      industry,
      traitsCount: Array.isArray(traits) ? traits.length : typeof traits,
    })

    // Construct a prompt for OpenAI with safe fallbacks
    const prompt = `Generate 5 unique and creative name suggestions for a ${namingType} in the ${industry} industry.
    
Description: ${description || `A ${namingType} in the ${industry} industry`}

Key traits: ${Array.isArray(traits) ? traits.join(", ") : traits.toString()}

For each name, provide:
1. The name itself (should be unique, memorable, and not a common word)
2. A brief meaning or explanation (1-2 sentences)
3. A style category (Modern, Classic, Playful, Technical, Luxurious, etc.)

Format the response as a JSON object with a "names" array containing objects with "name", "meaning", and "styleCategory" properties.
`

    console.log("Calling OpenAI API...")
    const startTime = Date.now()

    // Create OpenAI client with explicit API key from environment
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    try {
      // Set a timeout with AbortController
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106", // Use a faster model
        messages: [
          {
            role: "system",
            content:
              "You are a creative naming expert that specializes in creating unique, memorable brand names. You understand linguistics, marketing psychology, and brand positioning.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 800, // Limit token usage for faster responses
      }, {
        signal: controller.signal 
      })
      
      clearTimeout(timeoutId)
      
      const duration = Date.now() - startTime
      console.log(`OpenAI API call completed in ${duration}ms`)

      // Safely parse response content
      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No content returned from OpenAI")
      }

      // Parse content as JSON with error handling
      try {
        const parsedContent = JSON.parse(content)

        // Validate names array exists
        if (!Array.isArray(parsedContent.names) || parsedContent.names.length === 0) {
          console.error("Invalid response format from OpenAI - missing names array:", parsedContent)
          throw new Error("Invalid response format from OpenAI")
        }

        // Add simulated domain availability
        const names = parsedContent.names.map((name: any) => ({
          name: name.name || "Unnamed",
          meaning: name.meaning || "No meaning provided",
          styleCategory: name.styleCategory || "Unknown",
          domainAvailable: Math.random() > 0.3,
        }))

        console.log(`Successfully generated ${names.length} names`)
        return NextResponse.json({ names })
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)
        throw new Error("Failed to parse response from name generation service")
      }
    } catch (openAiError: any) {
      // Handle API-specific errors
      const errorMessage = openAiError.message || "An error occurred with the name generation service"
      console.error("OpenAI API error:", errorMessage)
      
      if (openAiError.name === "AbortError") {
        return NextResponse.json({ error: "Name generation timed out. Please try again." }, { status: 504 })
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  } catch (error) {
    console.error("Unhandled error in name generation API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred while generating names. Please try again." },
      { status: 500 },
    )
  }
}
