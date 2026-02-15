"use client"

import { useState, useEffect, useRef } from "react"
import { Message } from "@/types/chat"
import { getSessionId } from "@/lib/session"
import { sendMessage } from "@/lib/api"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import ChatLayout from "./ChatLayout"

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (content: string) => {
        if (loading) return

        const userMessage: Message = { role: "user", content }
        setMessages((prev) => [...prev, userMessage])
        setLoading(true)
        setError(null)

        try {
            const sessionId = getSessionId()
            const response = await sendMessage(sessionId, content)

            const assistantMessage: Message = { role: "assistant", content: response.reply }
            setMessages((prev) => [...prev, assistantMessage])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setMessages([])
        setError(null)
    }

    return (
        <ChatLayout>
            <div className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                <div className="flex flex-col space-y-2">
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-3xl flex items-center justify-center shadow-sm">
                                <span className="text-3xl">✨</span>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 italic">How can I help you today?</h2>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mx-auto">
                                    Ask me anything about your project, data, or technical documentation.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <MessageBubble key={index} role={msg.role} content={msg.content} />
                    ))}

                    {loading && (
                        <div className="flex justify-start mb-6 animate-in fade-in duration-300">
                            <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl px-4 py-3 text-sm flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                                </div>
                                <span className="font-medium">Assistant is thinking</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mx-auto mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm text-center max-w-md animate-in zoom-in-95 duration-200">
                            <div className="font-semibold mb-1">Connection Error</div>
                            {error}
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            <ChatInput onSendMessage={handleSendMessage} disabled={loading} />

            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex justify-end">
                <button
                    onClick={handleReset}
                    className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase tracking-[0.2em] transition-colors"
                >
                    Clear History
                </button>
            </div>
        </ChatLayout>
    )
}
