"use client"

import { useState, useEffect, useRef } from "react"
import { Message } from "@/types/chat"
import { getSessionId } from "@/lib/session"
import { sendMessage } from "@/lib/api"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import ChatLayout from "./ChatLayout"
import PromptDiff from "./PromptDiff"

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Prompt Update States
    const [promptVersion, setPromptVersion] = useState<number | null>(null)
    const [promptPreview, setPromptPreview] = useState<string>("")
    const [previousPromptPreview, setPreviousPromptPreview] = useState<string>("")
    const [showPromptUpdate, setShowPromptUpdate] = useState(false)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Auto-dismiss Effect
    useEffect(() => {
        if (showPromptUpdate) {
            const timer = setTimeout(() => {
                setShowPromptUpdate(false)
            }, 8000)

            return () => clearTimeout(timer)
        }
    }, [showPromptUpdate])

    const handleSendMessage = async (content: string) => {
        if (loading) return

        const userMessage: Message = { role: "user", content }
        setMessages((prev) => [...prev, userMessage])
        setLoading(true)
        setError(null)

        try {
            const sessionId = getSessionId()
            const response = await sendMessage(sessionId, content)

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.reply }
            ])

            if (response.prompt_version !== undefined) {
                if (promptVersion && response.prompt_version > promptVersion) {
                    setPreviousPromptPreview(promptPreview)
                    setShowPromptUpdate(true)
                }

                setPromptVersion(response.prompt_version)
                setPromptPreview(response.prompt_preview || "")
            }
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

            {/* Permanent Version Badge & Diff Panel */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
                {showPromptUpdate && (
                    <div className="pointer-events-auto w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-4 animate-fade-in ring-1 ring-zinc-900/5 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Version Changes (v{promptVersion})
                            </div>
                            <button
                                onClick={() => setShowPromptUpdate(false)}
                                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            <PromptDiff
                                oldText={previousPromptPreview}
                                newText={promptPreview}
                            />
                        </div>
                    </div>
                )}

                {promptVersion !== null && (
                    <button
                        onClick={() => setShowPromptUpdate(!showPromptUpdate)}
                        className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-sm transition-all duration-300 active:scale-95 group ${showPromptUpdate
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${showPromptUpdate ? 'bg-green-400' : 'bg-green-500 pulse-green'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            Prompt v{promptVersion}
                        </span>
                        <svg
                            className={`w-3 h-3 transition-transform duration-300 ${showPromptUpdate ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="Specifies if version update dropdown is active" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                )}
            </div>
        </ChatLayout>
    )
}
