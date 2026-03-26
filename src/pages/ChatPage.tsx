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
import { Avatar, Button, Spinner, EmptyState, LoadingScreen } from '../components/ui'



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

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participant: { id: 'u2', name: 'Tunde Adeyemi', avatar: 'TA', rating: 4.8, online: true },
    taskTitle: 'Build a React Dashboard',
    taskId: 't1',
    lastMessage: 'I can start tomorrow morning, does that work?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Hi! I saw your task for the React dashboard. I have 5 years of experience with React and have built similar projects.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'read' },
      { id: 'm2', senderId: CURRENT_USER.id, text: 'Great! Can you share some previous work?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), status: 'read' },
      { id: 'm3', senderId: 'u2', text: 'Sure! Here are links to two recent projects: github.com/tunde/dash-1 and github.com/tunde/dash-2', timestamp: new Date(Date.now() - 1000 * 60 * 60), status: 'read' },
      { id: 'm4', senderId: CURRENT_USER.id, text: "These look really good. What's your timeline for completion?", timestamp: new Date(Date.now() - 1000 * 60 * 30), status: 'read' },
      { id: 'm5', senderId: 'u2', text: 'I can start tomorrow morning, does that work?', timestamp: new Date(Date.now() - 1000 * 60 * 5), status: 'delivered' },
    ],
  },
  {
    id: 'conv-2',
    participant: { id: 'u3', name: 'Amaka Obi', avatar: 'AO', rating: 4.5, online: false },
    taskTitle: 'Design a Logo for my Startup',
    taskId: 't2',
    lastMessage: "I'll send the first draft by end of day",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'u3', text: "Hello! I'm a brand designer with 7 years of experience. I love this brief!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'read' },
      { id: 'm2', senderId: CURRENT_USER.id, text: "Hi Amaka! We're looking for something modern but approachable. Our brand color is indigo.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), status: 'read' },
      { id: 'm3', senderId: 'u3', text: "Perfect. I'll prepare 3 concepts for you to choose from.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), status: 'read' },
      { id: 'm4', senderId: 'u3', text: "I'll send the first draft by end of day", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), status: 'read' },
    ],
  },
  {
    id: 'conv-3',
    participant: { id: 'u4', name: 'Chidi Nwosu', avatar: 'CN', rating: 4.9, online: true },
    taskTitle: 'Write 5 Blog Posts on AI',
    taskId: 't3',
    lastMessage: "You: Sounds great, let's go with that!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: CURRENT_USER.id, text: 'Hi Chidi, I need 5 SEO-optimized blog posts about AI trends.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), status: 'read' },
      { id: 'm2', senderId: 'u4', text: 'I write for TechCrunch and Wired. I can do this at ₦15,000 per post.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47), status: 'read' },
      { id: 'm3', senderId: 'u4', text: 'Each post will be 1,200–1,500 words with keyword research included.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46), status: 'read' },
      { id: 'm4', senderId: CURRENT_USER.id, text: "Sounds great, let's go with that!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'read' },
    ],
  },
  {
    id: 'conv-4',
    participant: { id: 'u5', name: 'Fatima Bello', avatar: 'FB', rating: 4.6, online: false },
    taskTitle: 'Fix my WordPress Site Bug',
    taskId: 't4',
    lastMessage: 'The fix is deployed. All good!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72),
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'u5', text: 'I looked at your site. The bug is in the WooCommerce plugin version conflict.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75), status: 'read' },
      { id: 'm2', senderId: CURRENT_USER.id, text: "Can you fix it today? It's urgent.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 74), status: 'read' },
      { id: 'm3', senderId: 'u5', text: "Yes, I'm on it now.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 73.5), status: 'read' },
      { id: 'm4', senderId: 'u5', text: 'The fix is deployed. All good!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), status: 'read' },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────────────────

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
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-2)'
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
      }}
    >
      {/* Avatar with online dot */}
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

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center justify-between mb-0.5">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {conv.participant.name}
          </p>
          <span
            className="text-xs flex-shrink-0 ml-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {formatTime(conv.lastMessageTime)}
          </span>
        </div>
        <p
          className="text-xs truncate mb-0.5"
          style={{ color: 'var(--color-accent)', fontWeight: 500 }}
        >
          {conv.taskTitle}
        </p>
        <div className="flex items-center justify-between">
          <p
            className="text-xs truncate"
            style={{
              color:
                conv.unreadCount > 0
                  ? 'var(--color-text-secondary)'
                  : 'var(--color-text-muted)',
              fontWeight: conv.unreadCount > 0 ? 500 : 400,
            }}
          >
            {conv.lastMessage}
          </p>
          {conv.unreadCount > 0 && (
            <span
              className="flex-shrink-0 ml-2 flex items-center justify-center rounded-full text-xs font-bold"
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
    <div
      className="flex"
      style={{ justifyContent: isOwn ? 'flex-end' : 'flex-start', marginBottom: 4 }}
    >
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
        <div
          className="flex items-center gap-1 mt-1"
          style={{ justifyContent: isOwn ? 'flex-end' : 'flex-start' }}
        >
          <span
            className="text-xs"
            style={{ color: isOwn ? 'rgba(255,255,255,0.65)' : 'var(--color-text-muted)' }}
          >
            {formatMessageTime(msg.timestamp)}
          </span>
          {isOwn && <MessageStatus status={msg.status} />}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  // Mobile: toggle between sidebar list and chat panel
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

  // Scroll to bottom whenever messages change
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
      prev.map(c => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)),
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

    // Simulate delivered tick
    await new Promise(r => setTimeout(r, 900))
    const withDelivered: Conversation = {
      ...updatedConv,
      messages: updatedConv.messages.map(m =>
        m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m,
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
    <div
      style={{
        background: 'var(--color-background)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar variant="app" />

      <div
        className=" w-full"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Page title (visible on desktop) */}
       

        {/* Chat shell */}
        <div
          className=" overflow-hidden h-[90vh] fixed w-full"
          style={{
            flex: 1,
            display: 'flex',
        
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >

          {/* ── LEFT: Conversation list ──────────────────────────────────── */}
          <div
            className={`flex-col border-r ${
              mobileView === 'chat' ? 'hidden' : 'flex'
            } sm:flex`}
            style={{
              width: 300,
              flexShrink: 0,
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Sidebar header */}
            <div
              className="px-4 pt-5 pb-3 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              {/* Title on mobile (desktop shows above shell) */}
              <div className="mb-5 hidden sm:block">
          <h1
            className="font-display font-bold  ml-6 text-2xl sm:text-3xl"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Messages
          </h1>
        </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search conversations…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs outline-none transition-all"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                />
              </div>
            </div>

            {/* Conversation list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConvs.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    No conversations found
                  </p>
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

          {/* ── RIGHT: Chat window ───────────────────────────────────────── */}
          {activeConv ? (
            <div
              className={`flex-col flex-1 ${
                mobileView === 'list' ? 'hidden' : 'flex'
              } sm:flex`}
              style={{ minWidth: 0 }}
            >
              {/* Chat header */}
              <div
                className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                {/* Mobile back */}
                <button
                  className="sm:hidden flex-shrink-0 p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={() => setMobileView('list')}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  <ArrowLeft size={18} />
                </button>

                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar initials={activeConv.participant.avatar} size={40} />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 1,
                      right: 1,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: activeConv.participant.online ? '#10b981' : 'var(--color-border)',
                      border: '2px solid var(--color-surface)',
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {activeConv.participant.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {activeConv.participant.online ? (
                      <span style={{ color: '#10b981' }}>● Online</span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>

                <button
                  className="p-2 rounded-xl transition-all flex-shrink-0"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }}
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Task context banner */}
              <div
                className="mx-4 sm:mx-5 mt-3 mb-1 px-4 py-2.5 rounded-xl flex items-center gap-2 flex-shrink-0"
                style={{
                  background: 'var(--color-accent)08',
                  border: '1px solid var(--color-accent)20',
                }}
              >
                <span
                  className="text-xs font-semibold flex-shrink-0"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Task:
                </span>
                <span
                  className="text-xs truncate"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {activeConv.taskTitle}
                </span>
                <button
                  className="ml-auto text-xs font-semibold flex-shrink-0 transition-opacity"
                  style={{ color: 'var(--color-accent)', opacity: 0.8 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                >
                  View →
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-4 sm:px-5 py-4"
                style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                {activeConv.messages.map((msg, i) => {
                  const isOwn = msg.senderId === CURRENT_USER.id
                  const prevMsg = activeConv.messages[i - 1]
                  const showDivider =
                    !prevMsg ||
                    new Date(msg.timestamp).toDateString() !==
                      new Date(prevMsg.timestamp).toDateString()

                  return (
                    <div key={msg.id}>
                      {showDivider && (
                        <div className="flex items-center gap-3 my-4">
                          <div
                            style={{ flex: 1, height: 1, background: 'var(--color-border)' }}
                          />
                          <span
                            className="text-xs px-3 py-1 rounded-full flex-shrink-0"
                            style={{
                              background: 'var(--color-surface-2)',
                              color: 'var(--color-text-muted)',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleDateString('en-NG', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <div
                            style={{ flex: 1, height: 1, background: 'var(--color-border)' }}
                          />
                        </div>
                      )}
                      <ChatBubble msg={msg} isOwn={isOwn} />
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div
                className="px-4 sm:px-5 py-4 flex-shrink-0"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <div
                  className="flex items-end gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    transition: 'border-color 0.15s',
                  }}
                  onFocusCapture={e => {
                    ;(e.currentTarget as HTMLDivElement).style.borderColor =
                      'var(--color-accent)'
                  }}
                  onBlurCapture={e => {
                    ;(e.currentTarget as HTMLDivElement).style.borderColor =
                      'var(--color-border)'
                  }}
                >
                  <button
                    className="flex-shrink-0 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--color-accent)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--color-text-muted)')
                    }
                  >
                    <Paperclip size={17} />
                  </button>

                  <textarea
                    ref={inputRef}
                    rows={1}
                    placeholder="Type a message…"
                    value={inputText}
                    onChange={e => {
                      setInputText(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm outline-none resize-none bg-transparent"
                    style={{
                      color: 'var(--color-text-primary)',
                      lineHeight: '1.5',
                      maxHeight: 120,
                      overflow: 'auto',
                    }}
                  />

                  <button
                    className="flex-shrink-0 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--color-accent)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--color-text-muted)')
                    }
                  >
                    <Smile size={17} />
                  </button>

                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || sending}
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background:
                        inputText.trim() && !sending
                          ? 'var(--color-accent)'
                          : 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color:
                        inputText.trim() && !sending ? '#fff' : 'var(--color-text-muted)',
                      cursor: inputText.trim() && !sending ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {sending ? <Spinner size={14} /> : <Send size={15} />}
                  </button>
                </div>

                <p
                  className="text-xs text-center mt-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </div>
          ) : (
            /* Empty state — no conversation selected */
            <div
              className={`flex-1 items-center justify-center ${
                mobileView === 'list' ? 'hidden' : 'flex'
              } sm:flex`}
            >
              <EmptyState
                icon={
                  <MessageSquare size={28} style={{ color: 'var(--color-text-muted)' }} />
                }
                title="No conversation selected"
                description="Choose a conversation from the list to start chatting."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}