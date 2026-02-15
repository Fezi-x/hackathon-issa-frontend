"use client"

import { diffWords } from "diff"

type Props = {
    oldText: string
    newText: string
}

export default function PromptDiff({ oldText, newText }: Props) {
    const differences = diffWords(oldText || "", newText || "")

    return (
        <div className="text-xs leading-relaxed text-zinc-700">
            {differences.map((part, index) => {
                if (part.added) {
                    return (
                        <span
                            key={index}
                            className="bg-green-100 text-green-800 rounded px-0.5"
                        >
                            {part.value}
                        </span>
                    )
                }
                if (part.removed) {
                    return (
                        <span
                            key={index}
                            className="bg-red-100 text-red-700 line-through rounded px-0.5"
                        >
                            {part.value}
                        </span>
                    )
                }
                return <span key={index}>{part.value}</span>
            })}
        </div>
    )
}
