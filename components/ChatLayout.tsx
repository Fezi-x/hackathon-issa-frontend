import React from "react"
import Header from "./Header"

interface ChatLayoutProps {
    children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-160px)]">
                    {children}
                </div>
            </main>
        </div>
    )
}
