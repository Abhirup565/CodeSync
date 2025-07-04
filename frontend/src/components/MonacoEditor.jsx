import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { useRef, useEffect, useState } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { debounce } from "lodash";
import axios from "axios";
import toast from 'react-hot-toast';

export default function MonacoEditor({ code, setCode, language, roomId, username, color, setSaving }) {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const providerRef = useRef(null);
    const ydocRef = useRef(null);
    const bindingRef = useRef(null);
    const remoteDecorations = useRef({});
    const [providerReady, setProviderReady] = useState(false);

    let lastSaved = "";
    async function autosave(code) {
        if (code === lastSaved) return;
        lastSaved = code;
        try {
            setSaving(true);
            await axios.post("http://localhost:7500/code/save-code", { roomId, code });
            setTimeout(() => {
                setSaving(false);
            }, 2000);
        }
        catch (err) {
            console.error("Autosave failed: ", err);
            setSaving(false);
        }
    }

    useEffect(() => {
        const ydoc = new Y.Doc();
        const provider = new HocuspocusProvider({
            url: "wss://hocuspocus-server-dzhh.onrender.com",
            name: roomId,
            document: ydoc,
            maxBackoffTime: 10000, //retry every 10s
            onDisconnect: () => {
                toast.error("Failed to connect. Please check your internet connection");
                console.warn('Disconnected. Retrying...')
            },
            onConnect: () => console.log('Connected')
        });

        providerRef.current = provider;
        ydocRef.current = ydoc;

        const yText = ydoc.getText("monaco");

        const debouncedSave = debounce(() => {
            const latestCode = yText.toString();
            autosave(latestCode);
        }, 2000);

        const observer = () => {
            const latestCode = yText.toString();
            debouncedSave();
            setCode && setCode(latestCode);
        }

        yText.observe(observer);

        provider.on("synced", () => {
            setProviderReady(true);
        });

        return () => {
            yText.unobserve(observer);
            provider.awareness.setLocalState(null);
            provider.destroy();
            ydoc.destroy();
            if (bindingRef.current) {
                bindingRef.current.destroy();
                bindingRef.current = null;
            }
            setProviderReady(false);
        };
    }, [roomId]);
    useEffect(() => {
        const provider = providerRef.current;
        if (provider) {
            provider.awareness.setLocalStateField("user", {
                name: username || "Anonymous",
                color: color || "#00bfff",
            });
        }
    }, [username, color]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;

        const ydoc = ydocRef.current;
        const provider = providerRef.current;

        if (!ydoc || !provider || !editor) return;

        if (bindingRef.current) {
            bindingRef.current.destroy();
        }

        const yText = ydoc.getText("monaco");
        if (yText.length === 0 && code) {
            yText.insert(0, code);
        }

        bindingRef.current = new MonacoBinding(
            yText,
            editor.getModel(),
            new Set([editor]),
            provider.awareness
        );

        editor.onDidChangeCursorPosition((e) => {
            const pos = e.position;
            provider.awareness.setLocalStateField("cursor", {
                line: pos.lineNumber,
                column: pos.column,
            });
        });

        provider.awareness.on("change", ({ removed }) => {
            const states = Array.from(provider.awareness.getStates().entries());

            removed.forEach((clientId) => {
                const oldDecorations = remoteDecorations.current[clientId];
                if (oldDecorations) {
                    editor.deltaDecorations(oldDecorations, []);
                    delete remoteDecorations.current[clientId];
                }
                const styleId = `cursor-style-${clientId}`;
                const styleEl = document.getElementById(styleId);
                if (styleEl) styleEl.remove();
            });

            states.forEach(([clientId, state]) => {
                if (clientId === provider.awareness.clientID) return;

                const cursor = state.cursor;
                const user = state.user;
                if (!cursor || !user) return;

                const range = new monaco.Range(
                    cursor.line,
                    cursor.column,
                    cursor.line,
                    cursor.column
                );

                const options = {
                    className: `remote-cursor user-cursor-${clientId}`,
                    afterContentClassName: `remote-cursor-label user-${clientId}`,
                    stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                };
                // 💡 Inject dynamic style for this user's label
                const styleId = `cursor-style-${clientId}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement("style");
                    style.id = styleId;
                    style.innerHTML = `
                    .user-cursor-${clientId} {
                        border-left: 3px solid ${user.color};
                        height: 100%;
                        pointer-events: none;
                        position: absolute;
                        z-index: 5;
                    }
                    .user-${clientId}::after {
                    content: "${user.name}";
                    background: ${user.color};
                    color: white;
                    padding: 0px 6px;
                    font-size: 12px;
                    border-radius: 20px 20px 20px 0;
                    position: absolute;
                    transform: translateY(-100%);
                    white-space: nowrap;
                    z-index: 10;
                    }`;
                    document.head.appendChild(style);
                }

                const newDecorations = [{ range, options }];
                const oldDecorations = remoteDecorations.current[clientId] || [];

                const newIds = editor.deltaDecorations(oldDecorations, newDecorations);
                remoteDecorations.current[clientId] = newIds;
            });
        });
    }

    return (
        <div className="flex-1 bg-gray-900 relative">
            <div className="absolute inset-0">
                <div className="w-full h-full bg-gray-900 relative">
                    {providerReady && (
                        <Editor
                            key={roomId}
                            height="100%"
                            language={language.value}
                            theme="vs-dark"
                            options={{
                                fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
                                fontSize: 16,
                                minimap: { enabled: true },
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                wordWrap: "off",
                                padding: {
                                    top: 20
                                }
                            }}
                            onMount={handleEditorDidMount}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
