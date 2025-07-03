import { Plus, Minus, Terminal } from "lucide-react"

export default function OutputBox({ outputHeight, setOutputHeight, output }) {
    return (
        <div
            className="bg-black border-t border-gray-700 flex-shrink-0 flex flex-col"
            style={{ height: `${outputHeight}px` }}
        >
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Output</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setOutputHeight(Math.max(100, outputHeight - 50))}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setOutputHeight(Math.min(400, outputHeight + 50))}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="flex-1 p-4 text-white text-sm font-mono overflow-y-auto">
                <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
        </div>
    )
}