import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  Check,
  MessageSquare,
} from 'lucide-react'
import Navbar from '../components/NavBar'
import { CURRENT_USER } from '../api/mockApi'
import { Avatar, Spinner, EmptyState, LoadingScreen } from '../components/ui'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar: string
    rating: number
    online: boolean
  }
  taskTitle: string
  taskId: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  messages: Message[]
}

// Mock data remains unchanged
const MOCK_CONVERSATIONS: Conversation[] = [
  // ... your existing mock data ...
]

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
}

function MessageStatus({ status }: { status: Message['status'] }) {
  if (status === 'read')
    return <CheckCheck size={12} style={{ color: 'var(--color-accent)' }} />
  if (status === 'delivered')
    return <CheckCheck size={12} style={{ color: 'var(--color-text-muted)' }} />
  return <Check size={12} style={{ color: 'var(--color-text-muted)' }} />
}

function ConversationItem({
  conv,
  active,
  onClick,
}: {
  conv: Conversation
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
      style={{
        background: active ? 'var(--color-accent)10' : 'transparent',
        borderLeft: `3px solid ${active ? 'var(--color-accent)' : 'transparent'}`,
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar initials={conv.participant.avatar} size={44} />
        <span
          style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: conv.participant.online ? '#10b981' : 'var(--color-border)',
            border: '2px solid var(--color-surface)',
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
            {conv.participant.name}
          </p>
          <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--color-text-muted)' }}>
            {formatTime(conv.lastMessageTime)}
          </span>
        </div>
        <p className="text-xs truncate mb-0.5" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
          {conv.taskTitle}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs truncate" style={{
            color: conv.unreadCount > 0 ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
            fontWeight: conv.unreadCount > 0 ? 500 : 400,
          }}>
            {conv.lastMessage}
          </p>
          {conv.unreadCount > 0 && (
            <span className="flex-shrink-0 ml-2 flex items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                width: 18,
                height: 18,
                fontSize: 10,
              }}
            >
              {conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function ChatBubble({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  return (
    <div className="flex" style={{ justifyContent: isOwn ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
      <div
        style={{
          maxWidth: '72%',
          padding: '10px 14px',
          borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isOwn ? 'var(--color-accent)' : 'var(--color-surface-2)',
          color: isOwn ? '#fff' : 'var(--color-text-primary)',
          border: isOwn ? 'none' : '1px solid var(--color-border)',
        }}
      >
        <p className="text-sm leading-relaxed" style={{ wordBreak: 'break-word' }}>
          {msg.text}
        </p>
        <div className="flex items-center gap-1 mt-1" style={{ justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
          <span className="text-xs" style={{ color: isOwn ? 'rgba(255,255,255,0.65)' : 'var(--color-text-muted)' }}>
            {formatMessageTime(msg.timestamp)}
          </span>
          {isOwn && <MessageStatus status={msg.status} />}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS)
      setActiveConv(MOCK_CONVERSATIONS[0])
      setLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages.length])

  const filteredConvs = conversations.filter(
    c =>
      c.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      c.taskTitle.toLowerCase().includes(search.toLowerCase()),
  )

  function selectConv(conv: Conversation) {
    setConversations(prev =>
      prev.map(c => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    )
    setActiveConv({ ...conv, unreadCount: 0 })
    setMobileView('chat')
  }

  async function handleSend() {
    if (!inputText.trim() || !activeConv || sending) return
    setSending(true)

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: CURRENT_USER.id,
      text: inputText.trim(),
      timestamp: new Date(),
      status: 'sent',
    }

    const updatedConv: Conversation = {
      ...activeConv,
      messages: [...activeConv.messages, newMsg],
      lastMessage: `You: ${newMsg.text}`,
      lastMessageTime: newMsg.timestamp,
    }

    setActiveConv(updatedConv)
    setConversations(prev => prev.map(c => (c.id === activeConv.id ? updatedConv : c)))
    setInputText('')
    inputRef.current?.focus()

    await new Promise(r => setTimeout(r, 900))
    const withDelivered: Conversation = {
      ...updatedConv,
      messages: updatedConv.messages.map(m =>
        m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m
      ),
    }
    setActiveConv(withDelivered)
    setConversations(prev => prev.map(c => (c.id === activeConv.id ? withDelivered : c)))
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="app" />

      <div className="flex-1 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

        {/* Chat Container */}
        <div className="flex flex-1 overflow-hidden border-t" style={{ borderColor: 'var(--color-border)' }}>

          {/* LEFT: Conversation List */}
          <div
            className={`flex-col border-r w-full sm:w-[320px] flex-shrink-0 overflow-y-auto bg-[var(--color-surface)] ${
              mobileView === 'chat' ? 'hidden sm:flex' : 'flex'
            }`}
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Header */}
            <div className="p-4 border-b sticky top-0 bg-[var(--color-surface)] z-10" style={{ borderColor: 'var(--color-border)' }}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search conversations…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No conversations found</p>
                </div>
              ) : (
                filteredConvs.map(conv => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    active={activeConv?.id === conv.id}
                    onClick={() => selectConv(conv)}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Chat Window */}
          {activeConv ? (
            <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden sm:flex' : 'flex'}`}>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  className="sm:hidden p-2 -ml-2"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={() => setMobileView('list')}
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="relative flex-shrink-0">
                  <Avatar initials={activeConv.participant.avatar} size={42} />
                  {activeConv.participant.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-[var(--color-surface)]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {activeConv.participant.name}
                  </p>
                  <p className="text-xs" style={{ color: activeConv.participant.online ? '#10b981' : 'var(--color-text-muted)' }}>
                    {activeConv.participant.online ? '● Online' : 'Offline'}
                  </p>
                </div>

                <button className="p-2 rounded-xl" style={{ color: 'var(--color-text-muted)' }}>
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Task Banner */}
              <div className="mx-4 mt-3 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-sm flex-shrink-0"
                style={{ background: 'var(--color-accent)08', border: '1px solid var(--color-accent)20' }}>
                <span className="font-medium text-[var(--color-accent)]">Task:</span>
                <span className="truncate" style={{ color: 'var(--color-text-secondary)' }}>
                  {activeConv.taskTitle}
                </span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-background)]">
                {activeConv.messages.map((msg) => {
                  const isOwn = msg.senderId === CURRENT_USER.id
                  return <ChatBubble key={msg.id} msg={msg} isOwn={isOwn} />
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-end gap-2 rounded-3xl px-4 py-2.5" 
                     style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                  <button className="p-2 text-[var(--color-text-muted)]">
                    <Paperclip size={18} />
                  </button>

                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent outline-none text-sm resize-none py-2 max-h-[120px]"
                    style={{ color: 'var(--color-text-primary)' }}
                  />

                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || sending}
                    className="p-2 rounded-2xl"
                    style={{
                      background: inputText.trim() && !sending ? 'var(--color-accent)' : 'transparent',
                      color: inputText.trim() && !sending ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {sending ? <Spinner size={18} /> : <Send size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden sm:flex items-center justify-center">
              <EmptyState
                icon={<MessageSquare size={32} style={{ color: 'var(--color-text-muted)' }} />}
                title="No conversation selected"
                description="Choose a conversation from the list"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}