import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PlusCircle,
  LogOut,
  Search,
  Briefcase,
  AlertTriangle,
} from 'lucide-react'
import Navbar from '../components/NavBar'
import { api, CURRENT_USER } from '../api/mockApi'
import type { Task, Notification } from '../api/mockApi'
import { LoadingScreen, EmptyState, SectionCard, Button } from '../components/ui'
import StatsBar from '../components/StatsBar'
import TaskCard from '../components/TaskCard'
import PostTaskModal from '../components/PostTaskModal'
import TaskDetailPanel from '../components/Taskdetailpanel'
import WalletSetupModal from '../components/WalletSetupModal'
import { MOCK_WALLET } from '../api/walletUtils'

type DashTab = 'my-tasks' | 'browse'

const CATEGORY_FILTERS = ['All', 'Web & Tech', 'Design', 'Writing', 'Business', 'Local Tasks']

const WALLET_SETUP_KEY = 'taskly_wallet_setup_completed'

export default function DashboardPage() {
  const navigate = useNavigate()

  // ── Data state ──────────────────────────────────────────────────────────────
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [browseTasks, setBrowseTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DashTab>('my-tasks')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showWalletSetup, setShowWalletSetup] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  // Persistent wallet setup state (survives refresh)
  const [isWalletSetup, setIsWalletSetup] = useState(() => {
    const saved = localStorage.getItem(WALLET_SETUP_KEY)
    return saved === 'true' || MOCK_WALLET.verified
  })

  // ── Load data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)
      const [mine, browse, notifs] = await Promise.all([
        api.getMyTasks(),
        api.getBrowseTasks(),
        api.getNotifications(),
      ])
      setMyTasks(mine)
      setBrowseTasks(browse)
      setNotifications(notifs)
      setLoading(false)
    }
    load()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // ── Derived lists ───────────────────────────────────────────────────────────
  const displayedTasks = (activeTab === 'my-tasks' ? myTasks : browseTasks).filter(t => {
    const matchSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = categoryFilter === 'All' || t.category === categoryFilter
    return matchSearch && matchCat
  })

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleTaskUpdated(updated: Task) {
    setMyTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
    setBrowseTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
    setSelectedTask(updated)
  }

  function handleTaskCreated(task: Task) {
    setMyTasks(prev => [task, ...prev])
    setShowPostModal(false)
    setSelectedTask(task)
    setActiveTab('my-tasks')
  }

  function handlePostTaskClick() {
    if (!isWalletSetup) {
      setShowWalletSetup(true)
      return
    }
    setShowPostModal(true)
  }

  // Called after successful wallet setup
  const handleWalletSetupComplete = () => {
    setShowWalletSetup(false)
    setIsWalletSetup(true)
    localStorage.setItem(WALLET_SETUP_KEY, 'true')   // Persist across refreshes
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <Navbar variant="app" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Wallet Setup Banner (Responsive) ───────────────────────────────── */}
        {!isWalletSetup && (
          <div className="mb-8 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-l-4"
            style={{ 
              background: 'var(--color-surface)', 
              borderColor: '#f59e0b',
              color: 'var(--color-text-primary)'
            }}
          >
            <AlertTriangle size={24} style={{ color: '#f59e0b', flexShrink: 0 }} />
            
            <div className="flex-1">
              <p className="font-medium text-base sm:text-lg leading-tight">
                Complete your wallet setup to start posting or earning
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                You need a verified wallet to post tasks or receive payments.
              </p>
            </div>

            <button
              onClick={() => setShowWalletSetup(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all mt-2 sm:mt-0"
              style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
            >
              Set Up Wallet
            </button>
          </div>
        )}

        {/* ── Welcome + actions row ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className="font-display font-bold text-2xl sm:text-3xl mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Welcome back, {CURRENT_USER.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              You have {myTasks.filter(t => ['OPEN', 'BIDDING', 'ASSIGNED', 'IN_PROGRESS'].includes(t.status)).length} active tasks
              {unreadCount > 0 ? ` · ${unreadCount} new notification${unreadCount > 1 ? 's' : ''}` : ''}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant="primary"
              onClick={handlePostTaskClick}
              className="w-full sm:w-auto"
            >
              <PlusCircle size={15} />
              Post a Task
            </Button>
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <StatsBar tasks={myTasks} />

        {/* ── Tasks section ─────────────────────────────────────────────── */}
        <SectionCard>
          {/* Tabs + search row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
            {/* Tabs */}
            <div
              className="flex rounded-xl p-1 flex-shrink-0"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            >
              {([
                { key: 'my-tasks', label: 'My Tasks', icon: Briefcase },
                { key: 'browse', label: 'Browse Tasks', icon: Search },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: activeTab === key ? 'var(--color-surface)' : 'transparent',
                    color: activeTab === key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    boxShadow: activeTab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none transition-all"
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

          {/* Category filters */}
          <div
            className="flex items-center gap-2 px-5 py-3 overflow-x-auto border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{
                  background:
                    categoryFilter === cat ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  color:
                    categoryFilter === cat ? '#fff' : 'var(--color-text-muted)',
                  border: `1px solid ${
                    categoryFilter === cat ? 'transparent' : 'var(--color-border)'
                  }`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Task list */}
          {displayedTasks.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={24} style={{ color: 'var(--color-text-muted)' }} />}
              title={activeTab === 'my-tasks' ? 'No tasks yet' : 'No tasks found'}
              description={
                activeTab === 'my-tasks'
                  ? 'Post your first task to get started and receive bids from skilled Taskers.'
                  : 'Try adjusting your search or filters to find available tasks.'
              }
              action={
                activeTab === 'my-tasks' ? (
                  <Button variant="primary" onClick={handlePostTaskClick}>
                    <PlusCircle size={15} />
                    Post a Task
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div>
              {displayedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={setSelectedTask}
                  viewAs={activeTab === 'my-tasks' ? 'poster' : 'tasker'}
                />
              ))}
            </div>
          )}
        </SectionCard>

        {/* Sign out */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs flex items-center gap-1.5 mx-auto transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>

      {/* ── Modals & Panels ──────────────────────────────────────────────── */}
      {showPostModal && (
        <PostTaskModal
          onClose={() => setShowPostModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Wallet Setup Modal */}
      {showWalletSetup && (
        <WalletSetupModal
          onComplete={handleWalletSetupComplete}
          onDismiss={() => setShowWalletSetup(false)}
        />
      )}
    </div>
  )
}