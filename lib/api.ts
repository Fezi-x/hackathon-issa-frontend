const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export interface ChatResponse {
  reply: string
}

export const sendMessage = async (sessionId: string, message: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (typeof data.reply !== "string") {
      throw new Error("Invalid response format from API")
    }

    return { reply: data.reply }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred")
  }
}
