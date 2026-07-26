import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import type { editor } from 'monaco-editor'

interface UseYjsEditorOptions {
  roomId: string
  userName: string
  userColor: string
}

/**
 * Sets up a Y.Doc + WebsocketProvider for the given room and binds it to a
 * Monaco editor instance once it mounts. Call `bindEditor` from the Monaco
 * `onMount` callback.
 */
export function useYjsEditor({ roomId, userName, userColor }: UseYjsEditorOptions) {
  const ydocRef = useRef<Y.Doc>()
  const providerRef = useRef<WebsocketProvider>()
  const bindingRef = useRef<MonacoBinding>()

  useEffect(() => {
    const ydoc = new Y.Doc()
    const wsUrl = import.meta.env.VITE_YJS_WS_URL || 'ws://localhost:1234'
    const provider = new WebsocketProvider(wsUrl, `syncspace-room-${roomId}`, ydoc)

    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: userColor,
    })

    ydocRef.current = ydoc
    providerRef.current = provider

    return () => {
      bindingRef.current?.destroy()
      provider.destroy()
      ydoc.destroy()
    }
  }, [roomId, userName, userColor])

  function bindEditor(editorInstance: editor.IStandaloneCodeEditor) {
    if (!ydocRef.current || !providerRef.current) return
    const yText = ydocRef.current.getText('monaco')
    bindingRef.current = new MonacoBinding(
      yText,
      editorInstance.getModel()!,
      new Set([editorInstance]),
      providerRef.current.awareness
    )
  }

  function getCurrentText(): string {
    return ydocRef.current?.getText('monaco').toString() || ''
  }

  return { bindEditor, getCurrentText }
}
