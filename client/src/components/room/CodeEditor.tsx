import Editor, { OnMount } from '@monaco-editor/react'
import { useRef } from 'react'
import { useYjsEditor } from '@/hooks/useYjsEditor'

interface CodeEditorProps {
  roomId: string
  language: string
  userName: string
  userColor: string
  fontSize?: number
  onReady?: (getText: () => string) => void
}

const MONACO_LANG_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  go: 'go',
  rust: 'rust',
}

export function CodeEditor({ roomId, language, userName, userColor, fontSize = 14, onReady }: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const { bindEditor, getCurrentText } = useYjsEditor({ roomId, userName, userColor })

  const handleMount: OnMount = (editorInstance) => {
    editorRef.current = editorInstance
    bindEditor(editorInstance)
    onReady?.(getCurrentText)
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-base-border">
      <Editor
        height="100%"
        theme="vs-dark"
        language={MONACO_LANG_MAP[language] || 'javascript'}
        defaultValue=""
        onMount={handleMount}
        options={{
          fontSize,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 },
          fontFamily: "'JetBrains Mono', monospace",
          smoothScrolling: true,
          cursorBlinking: 'smooth',
        }}
      />
    </div>
  )
}
