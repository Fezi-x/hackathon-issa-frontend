export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
            <div className="max-w-3xl mx-auto h-14 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white dark:bg-black rotate-45" />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">AI Assistant</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">System Ready</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
