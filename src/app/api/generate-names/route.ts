import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  console.log("API route called: /api/generate-names")

  try {
    // Check if API key is configured - log more details in development
    const openaiKey = process.env.OPENAI_API_KEY
    if (process.env.NODE_ENV === "development") {
      console.log("Environment variables available:", Object.keys(process.env).filter(key => !key.includes("SECRET") && !key.includes("KEY")).join(", "))
      console.log("OpenAI API key available:", !!openaiKey)
    }
    
    if (!openaiKey) {
      console.error("OpenAI API key is not configured")
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    // Parse request body safely
    let body;
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }
    
    const { namingType, description, industry, traits } = body

    // Validate input
    if (!namingType || !industry || !traits) {
      console.warn("Invalid request body:", { namingType, industry, traits })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Generating names for:", { 
      namingType, 
      industry, 
      traitsInfo: Array.isArray(traits) ? `${traits.length} traits` : typeof traits
    })

    // Construct a prompt for OpenAI
    const prompt = `Generate 5 unique and creative name suggestions for a ${namingType} in the ${industry} industry.
    
Description: ${description || `A ${namingType} in the ${industry} industry`}

Key traits: ${Array.isArray(traits) ? traits.join(", ") : traits}

For each name, provide:
1. The name itself (should be unique, memorable, and not a common word)
2. A brief meaning or explanation (1-2 sentences)
3. A style category (Modern, Classic, Playful, Technical, Luxurious, etc.)

Format the response as a JSON object with a "names" array containing objects with "name", "meaning", and "styleCategory" properties.
`

    console.log("Calling OpenAI API...")
    const startTime = Date.now()

    // Create OpenAI client with explicit API key
    const openai = new OpenAI({
      apiKey: openaiKey,
    })

    try {
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
      });
      
      const duration = Date.now() - startTime
      console.log(`OpenAI API call completed in ${duration}ms`)

      // Parse the response
      const content = response.choices[0]?.message?.content
      if (!content) {
        console.error("No content returned from OpenAI")
        return NextResponse.json({ error: "No content returned from OpenAI" }, { status: 500 })
      }

      try {
        const parsedContent = JSON.parse(content)

        // Ensure the response has the expected format
        if (!Array.isArray(parsedContent.names)) {
          console.error("Unexpected response format from OpenAI:", parsedContent)
          return NextResponse.json({ error: "Unexpected response format from OpenAI" }, { status: 500 })
        }

        // Add simulated domain availability
        const names = parsedContent.names.map((name: any) => ({
          name: name.name,
          meaning: name.meaning,
          styleCategory: name.styleCategory,
          // We'll simulate domain availability for now
          domainAvailable: Math.random() > 0.3,
        }))

        console.log(`Successfully generated ${names.length} names`)
        return NextResponse.json({ names })
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError, "Content:", content)
        return NextResponse.json({ error: "Failed to parse OpenAI response" }, { status: 500 })
      }
    } catch (apiError) {
      console.error("OpenAI API error:", apiError)
      return NextResponse.json(
        { error: apiError instanceof Error ? `OpenAI API error: ${apiError.message}` : "Unknown OpenAI API error" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error generating names:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
