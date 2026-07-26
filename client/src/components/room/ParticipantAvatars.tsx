interface Participant {
  userId: string
  userName: string
  avatarColor: string
}

export function ParticipantAvatars({ participants }: { participants: Participant[] }) {
  return (
    <div className="flex -space-x-2">
      {participants.map((p) => (
        <div
          key={p.userId}
          title={p.userName}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-mint text-xs font-bold text-white ring-2 ring-base-900"
          style={{ backgroundColor: p.avatarColor }}
        >
          {p.userName?.[0]?.toUpperCase()}
        </div>
      ))}
    </div>
  )
}
