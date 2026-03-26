import { useEffect, useRef } from 'react'
import { Bell, BellOff, CheckCheck, Zap, Users, MessageCircle, Star, AlertTriangle } from 'lucide-react'
import type { Notification } from '../api/mockApi'

const TYPE_ICON: Record<string, React.ReactNode> = {
  bid:      <Users size={14} style={{ color: '#f59e0b' }} />,
  assigned: <Zap size={14} style={{ color: '#8b5cf6' }} />,
  message:  <MessageCircle size={14} style={{ color: '#3b82f6' }} />,
  complete: <CheckCheck size={14} style={{ color: '#10b981' }} />,
  review:   <Star size={14} style={{ color: '#f59e0b' }} />,
  dispute:  <AlertTriangle size={14} style={{ color: '#ef4444' }} />,
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface NotificationsPanelProps {
  notifications: Notification[]
  onClose: () => void
  onMarkAllRead: () => void
  onClickNotification: (n: Notification) => void
}

export default function NotificationsPanel({
  notifications,
  onClose,
  onMarkAllRead,
  onClickNotification,
}: NotificationsPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const unread = notifications.filter(n => !n.read).length

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <Bell size={15} style={{ color: 'var(--color-accent)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
            Notifications
          </span>
          {unread > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2">
            <BellOff size={24} style={{ color: 'var(--color-text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              No notifications yet
            </span>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => onClickNotification(n)}
              className="flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--color-surface-2)]"
              style={{
                borderBottom: '1px solid var(--color-border)',
                background: !n.read ? 'var(--color-accent)08' : 'transparent',
              }}
            >
              {/* Icon dot */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
              >
                {TYPE_ICON[n.type] ?? <Bell size={14} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-xs font-semibold leading-snug"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                      style={{ background: 'var(--color-accent)' }}
                    />
                  )}
                </div>
                <p
                  className="text-xs mt-0.5 leading-relaxed line-clamp-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {n.body}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>
                  {timeAgo(n.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}