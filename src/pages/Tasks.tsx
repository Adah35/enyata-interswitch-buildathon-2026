import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  PlusCircle,
  Search,
  Briefcase,
} from 'lucide-react'

import Navbar from '../components/NavBar'
import { api } from '../api/mockApi'
import type { Task } from '../api/mockApi'

import {
  LoadingScreen,
  EmptyState,
  SectionCard,
  Button,
} from '../components/ui'

import TaskCard from '../components/TaskCard'
import PostTaskModal from '../components/PostTaskModal'
import TaskDetailPanel from '../components/Taskdetailpanel'

type DashTab = 'my-tasks' | 'browse'

const CATEGORY_FILTERS = ['All', 'Web & Tech', 'Design', 'Writing', 'Business', 'Local Tasks']

export default function TasksPage() {
  // ── Data state ─────────────────────────────────────────
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [searchParams] = useSearchParams()
  const [browseTasks, setBrowseTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // ── UI state ───────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DashTab>('my-tasks')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  // ── Load data ──────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)
      const [mine, browse] = await Promise.all([
        api.getMyTasks(),
        api.getBrowseTasks(),
      ])
      setMyTasks(mine)
      setBrowseTasks(browse)
      setLoading(false)
    }
    load()
  }, [])
  useEffect(() => {
  const taskId = searchParams.get('taskId')
  if (!taskId) return

  const allTasks = [...myTasks, ...browseTasks]
  const task = allTasks.find(t => t.id === taskId)

  if (task) {
    setSelectedTask(task)
  }
}, [searchParams, myTasks, browseTasks])

  // ── Derived lists ──────────────────────────────────────
  const displayedTasks = (activeTab === 'my-tasks' ? myTasks : browseTasks).filter(t => {
    const matchSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = categoryFilter === 'All' || t.category === categoryFilter
    return matchSearch && matchCat
  })

  // ── Handlers ───────────────────────────────────────────
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

  if (loading) return <LoadingScreen />

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <Navbar variant="app" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Tasks section ONLY ───────────────────────────── */}
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

            {/* Post Button (added but matches system) */}
            <Button variant="primary" onClick={() => setShowPostModal(true)}>
              <PlusCircle size={15} />
              Post a Task
            </Button>
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
      </div>

      {/* Modals */}
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