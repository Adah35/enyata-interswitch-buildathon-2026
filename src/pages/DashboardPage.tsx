// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Briefcase,
//   PlusCircle,
//   Search,
//   Bell,
//   MessageSquare,
//   CheckCircle2,
//   Clock,
//   DollarSign,
//   TrendingUp,
//   Star,
//   ChevronRight,
//   Zap,
//   User,
//   Settings,
//   LogOut,
//   LayoutGrid,
//   List,
// } from 'lucide-react'
// import Navbar from './../components/NavBar'

// const MOCK_TASKS = [
//   { id: 1, title: 'Build a React Dashboard', budget: '$150', status: 'In Progress', bids: 3, deadline: 'Mar 28', category: 'Web & Tech' },
//   { id: 2, title: 'Design a Logo for my Startup', budget: '$80', status: 'Open', bids: 7, deadline: 'Apr 2', category: 'Design' },
//   { id: 3, title: 'Write 5 Blog Posts on AI', budget: '$120', status: 'Review', bids: 2, deadline: 'Apr 5', category: 'Writing' },
//   { id: 4, title: 'Fix my WordPress Site Bug', budget: '$40', status: 'Complete', bids: 1, deadline: 'Mar 20', category: 'Web & Tech' },
// ]

// const STATUS_COLORS: Record<string, string> = {
//   'Open':        '#3b82f6',
//   'In Progress': '#f59e0b',
//   'Review':      '#8b5cf6',
//   'Complete':    '#10b981',
//   'Draft':       '#94a3b8',
// }

// export default function DashboardPage() {
//   const navigate = useNavigate()
//   const [activeTab, setActiveTab] = useState<'my-tasks' | 'browse'>('my-tasks')

//   return (
//     <div style={{ background: 'var(--color-background)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
//       <Navbar variant="app" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome banner */}
//         <div
//           className="rounded-2xl p-6 mb-8 flex items-center justify-between"
        
//         >
//           <div>
//             <h1 className="font-display font-bold text-2xl mb-1">Welcome back Anthony! 👋</h1>
//           </div>
//           <button
//             onClick={() => {}}
//             className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
//             style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
//           >
//             <PlusCircle size={16} />
//             Post a Task
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: 'Active Tasks', value: '3', icon: Briefcase, color: '#3b82f6' },
//             { label: 'Pending Bids', value: '2', icon: Clock, color: '#f59e0b' },
//             { label: 'Completed', value: '12', icon: CheckCircle2, color: '#10b981' },
//             { label: 'Total Spent', value: '$840', icon: DollarSign, color: '#8b5cf6' },
//           ].map(({ label, value, icon: Icon, color }) => (
//             <div
//               key={label}
//               className="glass-card rounded-2xl p-5"
//             >
//               <div
//                 className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
//                 style={{ background: `${color}18` }}
//               >
//                 <Icon size={20} color={color} />
//               </div>
//               <div className="font-display font-bold text-2xl" style={{ color: 'var(--color-text-primary)' }}>
//                 {value}
//               </div>
//               <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Tasks section */}
//         <div
//           className="rounded-2xl overflow-hidden"
//           style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
//         >
//           <div
//             className="flex items-center justify-between px-6 py-4 border-b"
//             style={{ borderColor: 'var(--color-border)' }}
//           >
//             <div className="flex gap-1">
//               {(['my-tasks', 'browse'] as const).map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
//                   style={{
//                     background: activeTab === tab ? 'var(--color-accent)' : 'transparent',
//                     color: activeTab === tab ? '#fff' : 'var(--color-text-muted)',
//                   }}
//                 >
//                   {tab === 'my-tasks' ? 'My Tasks' : 'Browse Tasks'}
//                 </button>
//               ))}
//             </div>
//             <button
//               className="flex items-center gap-2 text-sm font-medium"
//               style={{ color: 'var(--color-accent)' }}
//             >
//               <PlusCircle size={15} />
//               New Task
//             </button>
//           </div>

//           <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
//             {MOCK_TASKS.map(task => (
//               <div
//                 key={task.id}
//                 className="flex items-center justify-between px-6 py-4 hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
//               >
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-1">
//                     <span
//                       className="text-xs px-2.5 py-0.5 rounded-full font-medium"
//                       style={{
//                         background: `${STATUS_COLORS[task.status]}18`,
//                         color: STATUS_COLORS[task.status],
//                       }}
//                     >
//                       {task.status}
//                     </span>
//                     <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
//                       {task.category}
//                     </span>
//                   </div>
//                   <p className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
//                     {task.title}
//                   </p>
//                   <div className="flex items-center gap-4 mt-1">
//                     <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
//                       📅 Due {task.deadline}
//                     </span>
//                     <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
//                       👤 {task.bids} bid{task.bids !== 1 ? 's' : ''}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 ml-4">
//                   <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
//                     {task.budget}
//                   </span>
//                   <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Sign out */}
//         <div className="mt-6 text-center">
//           <button
//             onClick={() => navigate('/')}
//             className="text-sm flex items-center gap-1.5 mx-auto transition-colors"
//             style={{ color: 'var(--color-text-muted)' }}
//             onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-danger)')}
//             onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
//           >
//             <LogOut size={15} />
//             Sign out
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PlusCircle,
  Bell,
  LogOut,
  Search,
  Briefcase,
  Zap,
  SlidersHorizontal,
} from 'lucide-react'
import Navbar from '../components/NavBar'
import { api, CURRENT_USER } from '../api/mockApi'
import type { Task, Notification } from '../api/mockApi'
import { LoadingScreen, EmptyState, SectionCard, Button, Spinner } from '../components/ui'
import StatsBar from '../components/StatsBar'
import TaskCard from '../components/TaskCard'
import NotificationsPanel from '../components/Notificationspanel'
import PostTaskModal from '../components/PostTaskModal'
import TaskDetailPanel from '../components/Taskdetailpanel'

type DashTab = 'my-tasks' | 'browse'

const CATEGORY_FILTERS = ['All', 'Web & Tech', 'Design', 'Writing', 'Business', 'Local Tasks']

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
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

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

  async function handleMarkAllRead() {
    await api.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  async function handleNotificationClick(n: Notification) {
    await api.markNotificationRead(n.id)
    setNotifications(prev => prev.map(x => (x.id === n.id ? { ...x, read: true } : x)))
    setShowNotifications(false)
    if (n.taskId) {
      const task = [...myTasks, ...browseTasks].find(t => t.id === n.taskId)
      if (task) setSelectedTask(task)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <Navbar variant="app" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Welcome + actions row ──────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8 gap-4">
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

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notifications bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(v => !v)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{
                      background: 'var(--color-accent)',
                      color: '#fff',
                      width: '18px',
                      height: '18px',
                      fontSize: '10px',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationsPanel
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onMarkAllRead={handleMarkAllRead}
                  onClickNotification={handleNotificationClick}
                />
              )}
            </div>

            {/* Post a Task */}
            <Button
              variant="primary"
              onClick={() => setShowPostModal(true)}
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
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 "
          
          >
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
                  <Button variant="primary" onClick={() => setShowPostModal(true)}>
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
    </div>
  )
}