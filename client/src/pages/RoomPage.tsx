import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Play, Sparkles, MessageSquare, LogOut, Loader2, Link2 } from 'lucide-react'
import { CodeEditor } from '@/components/room/CodeEditor'
import { ProblemPanel } from '@/components/room/ProblemPanel'
import { ChatPanel } from '@/components/room/ChatPanel'
import { HintPanel } from '@/components/room/HintPanel'
import { OutputConsole } from '@/components/room/OutputConsole'
import { ParticipantAvatars } from '@/components/room/ParticipantAvatars'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useRoomStore } from '@/store/roomStore'
import { useRoomSocket } from '@/hooks/useRoomSocket'
import { useAIHint } from '@/hooks/useAIHint'
import { LANGUAGES } from '@/types'

type RightTab = 'chat' | 'hint'

export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { room, participants, messages, output, isRunning, setRoom, reset } = useRoomStore()
  const { sendMessage, runCode } = useRoomSocket(roomId)
  const { hints, isStreaming, requestHint } = useAIHint(roomId)

  const [rightTab, setRightTab] = useState<RightTab>('chat')
  const [stdin, setStdin] = useState('')
  const [notFound, setNotFound] = useState(false)
  const getTextRef = useRef<() => string>(() => '')

  useEffect(() => {
    if (!roomId) return
    let mounted = true

    api
      .post(`/api/rooms/${roomId}/join`)
      .then(({ data }) => mounted && setRoom(data.room))
      .catch(() => mounted && setNotFound(true))

    return () => {
      if (roomId) api.post(`/api/rooms/${roomId}/leave`).catch(() => {})
      reset()
    }
  }, [roomId])

  if (notFound) {
    navigate('/404')
    return null
  }

  function handleRun() {
    if (!roomId) return
    const code = getTextRef.current()
    if (!code.trim()) {
      toast.error('Write some code first')
      return
    }
    runCode(code, room?.language || 'javascript')
  }

  async function handleLeave() {
    if (roomId) await api.post(`/api/rooms/${roomId}/leave`).catch(() => {})
    navigate('/dashboard')
  }

  function handleRequestHint() {
    requestHint(room?.problemDesc || '', getTextRef.current(), room?.language || 'javascript')
  }

  function copyInviteLink() {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Invite link copied — send it to your partner!')
  }

  const displayParticipants = (participants as any[]).length
    ? (participants as any[])
    : (room?.participants || []).map((p) => ({
        userId: p.user.id,
        userName: p.user.name,
        avatarColor: p.user.avatarColor,
      }))

  return (
    <div className="flex h-screen flex-col bg-base-950">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-base-border bg-base-900/60 px-5 py-3">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-white">{room?.name || 'Loading room…'}</h1>
          {room?.language && (
            <Badge color="signal">
              {LANGUAGES.find((l) => l.value === room.language)?.label || room.language}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ParticipantAvatars participants={displayParticipants} />
          <Button variant="secondary" onClick={copyInviteLink}>
            <Link2 size={16} /> Invite
          </Button>
          <Button variant="primary" onClick={handleRun} disabled={isRunning}>
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} Run
          </Button>
          <Button
            variant="secondary"
            onClick={() => setRightTab('hint')}
            className={rightTab === 'hint' ? 'ring-2 ring-signal-500' : ''}
          >
            <Sparkles size={16} /> AI Hint
          </Button>
          <Button
            variant="secondary"
            onClick={() => setRightTab('chat')}
            className={rightTab === 'chat' ? 'ring-2 ring-signal-500' : ''}
          >
            <MessageSquare size={16} /> Chat
          </Button>
          <Button variant="ghost" onClick={handleLeave}>
            <LogOut size={16} /> Leave
          </Button>
        </div>
      </div>

      {/* Main 3-zone grid */}
      <div className="flex flex-1 gap-3 overflow-hidden p-3">
        <div className="w-[22%] min-w-[220px]">
          <ProblemPanel room={room} />
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {roomId && user && (
              <CodeEditor
                roomId={roomId}
                language={room?.language || 'javascript'}
                userName={user.name}
                userColor={user.avatarColor}
                fontSize={user.fontSize}
                onReady={(getText) => (getTextRef.current = getText)}
              />
            )}
          </div>
          <div className="h-48 shrink-0">
            <OutputConsole output={output} isRunning={isRunning} stdin={stdin} onStdinChange={setStdin} />
          </div>
        </div>

        <div className="w-[24%] min-w-[280px] overflow-hidden rounded-xl border border-base-border bg-base-800/40">
          {rightTab === 'chat' ? (
            <ChatPanel messages={messages} onSend={sendMessage} />
          ) : (
            <HintPanel hints={hints} isStreaming={isStreaming} onRequestHint={handleRequestHint} />
          )}
        </div>
      </div>
    </div>
  )
}
