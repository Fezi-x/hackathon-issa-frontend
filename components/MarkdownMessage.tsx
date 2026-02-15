"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
    content: string
}

export default function MarkdownMessage({ content }: Props) {
    return (
        <div className="prose prose-sm max-w-none prose-zinc dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
