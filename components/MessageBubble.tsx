import { Role } from "@/types/chat"
import MarkdownMessage from "./MarkdownMessage"

interface MessageBubbleProps {
    role: Role
    content: string
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
    const isUser = role === "user"

    return (
        <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed transition-all duration-200 ${isUser
                    ? "bg-black dark:bg-zinc-100 text-white dark:text-black shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    }`}
            >
                {role === "assistant" ? (
                    <MarkdownMessage content={content} />
                ) : (
                    <p className="whitespace-pre-wrap break-words">{content}</p>
                )}
            </div>
        </div>
    )
}
