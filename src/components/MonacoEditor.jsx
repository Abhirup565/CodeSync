import { Editor } from "@monaco-editor/react"
export default function MonacoEditor({
    code, setCode
}) {
    return (
        <div className="flex-1 bg-gray-900 relative">
            <div className="absolute inset-0">
                <div className="w-full h-full bg-gray-900 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={code}
                        onChange={(value) => setCode(value)}
                        theme="vs-dark"
                        options={{
                            fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
                            fontSize: 16,
                            minimap: { enabled: false },
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                        }}
                    />
                </div>
            </div>
        </div>
    )
}