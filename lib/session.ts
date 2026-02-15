const SESSION_KEY = "chat_session_id"

export const createSessionId = (): string => {
  return crypto.randomUUID()
}

export const persistSessionId = (sessionId: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, sessionId)
  }
}

export const getSessionId = (): string => {
  if (typeof window === "undefined") return ""
  
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = createSessionId()
    persistSessionId(sessionId)
  }
  return sessionId
}
