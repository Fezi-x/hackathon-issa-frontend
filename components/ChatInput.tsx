import React, { useState, useRef, useEffect } from "react"

interface ChatInputProps {
    onSendMessage: (message: string) => void
    disabled: boolean
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
    const [message, setMessage] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (message.trim() && !disabled) {
            onSendMessage(message.trim())
            setMessage("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [message])

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800"
        >
            <div className="relative flex items-end gap-2 p-1.5 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 bg-zinc-50 dark:bg-zinc-950">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={disabled}
                    className="flex-1 w-full p-2.5 text-sm md:text-base bg-transparent border-none focus:outline-none disabled:opacity-50 resize-none max-h-32 transition-all overflow-y-auto"
                />
                <button
                    type="submit"
                    disabled={disabled || !message.trim()}
                    className="flex h-10 px-5 items-center justify-center rounded-lg bg-black dark:bg-zinc-100 text-white dark:text-black font-medium hover:opacity-90 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {disabled ? (
                        <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        "Send"
                    )}
                </button>
            </div>
            <p className="mt-2 text-[10px] text-center text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-medium">
                Press Enter to send · Shift+Enter for new line
            </p>
        </form>
    )
}
