// ─── TYPES ────────────────────────────────────────────────────────────────────

export type TaskStatus =
  | 'OPEN'
  | 'BIDDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING_REVIEW'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED'

export type UserRole = 'poster' | 'tasker' | 'both'

export interface User {
  id: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  role: UserRole
  bio: string
  completedTasks: number
}

export interface Bid {
  id: string
  taskId: string
  tasker: User
  amount: number
  message: string
  createdAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface Task {
  id: string
  title: string
  description: string
  budget: number
  category: string
  location: string
  deadline: string
  status: TaskStatus
  poster: User
  assignedTasker?: User
  bids: Bid[]
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  type: 'bid' | 'assigned' | 'message' | 'complete' | 'dispute' | 'review'
  title: string
  body: string
  read: boolean
  createdAt: string
  taskId?: string
}

export interface Review {
  taskId: string
  reviewerId: string
  rating: number
  comment: string
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Anthony Okeke',
    avatar: 'AO',
    rating: 4.8,
    reviewCount: 24,
    role: 'both',
    bio: 'Entrepreneur & product builder based in Lagos.',
    completedTasks: 12,
  },
  {
    id: 'u2',
    name: 'Chidi Eze',
    avatar: 'CE',
    rating: 4.9,
    reviewCount: 61,
    role: 'tasker',
    bio: 'Full-stack developer. React, Node, Python. 5 years exp.',
    completedTasks: 61,
  },
  {
    id: 'u3',
    name: 'Amaka Obi',
    avatar: 'AM',
    rating: 4.7,
    reviewCount: 33,
    role: 'tasker',
    bio: 'Graphic designer & brand identity specialist.',
    completedTasks: 33,
  },
  {
    id: 'u4',
    name: 'Tunde Balogun',
    avatar: 'TB',
    rating: 4.6,
    reviewCount: 18,
    role: 'tasker',
    bio: 'Content writer, SEO expert, blog strategist.',
    completedTasks: 18,
  },
]

export const CURRENT_USER = MOCK_USERS[0]

let MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Build a React Dashboard',
    description:
      'I need a full admin dashboard built in React with Tailwind CSS. Should include charts, tables, user management, and dark mode. Figma designs will be provided.',
    budget: 75000,
    category: 'Web & Tech',
    location: 'Remote',
    deadline: 'Apr 10, 2025',
    status: 'BIDDING',
    poster: MOCK_USERS[0],
    bids: [
      {
        id: 'b1',
        taskId: 't1',
        tasker: MOCK_USERS[1],
        amount: 70000,
        message: 'I can deliver in 5 days. I have done 10+ similar dashboards.',
        createdAt: '2025-03-24T10:00:00Z',
        status: 'pending',
      },
      {
        id: 'b2',
        taskId: 't1',
        tasker: MOCK_USERS[2],
        amount: 80000,
        message: 'I will deliver pixel-perfect UI with full responsiveness.',
        createdAt: '2025-03-24T12:00:00Z',
        status: 'pending',
      },
    ],
    images: [],
    createdAt: '2025-03-23T09:00:00Z',
    updatedAt: '2025-03-24T12:00:00Z',
  },
  {
    id: 't2',
    title: 'Design a Logo for my Startup',
    description:
      'Looking for a modern, clean logo for a fintech startup called "PayStack Pro". Need 3 concepts with final files in SVG, PNG.',
    budget: 30000,
    category: 'Design',
    location: 'Remote',
    deadline: 'Apr 2, 2025',
    status: 'OPEN',
    poster: MOCK_USERS[0],
    bids: [],
    images: [],
    createdAt: '2025-03-25T08:00:00Z',
    updatedAt: '2025-03-25T08:00:00Z',
  },
  {
    id: 't3',
    title: 'Write 5 Blog Posts on AI',
    description:
      'Need 5 SEO-optimised blog posts (1000 words each) on AI trends in Africa. Topics will be provided. Must pass plagiarism check.',
    budget: 45000,
    category: 'Writing',
    location: 'Remote',
    deadline: 'Apr 5, 2025',
    status: 'IN_PROGRESS',
    poster: MOCK_USERS[0],
    assignedTasker: MOCK_USERS[3],
    bids: [
      {
        id: 'b3',
        taskId: 't3',
        tasker: MOCK_USERS[3],
        amount: 45000,
        message: 'Happy to write these. I have extensive AI writing experience.',
        createdAt: '2025-03-22T09:00:00Z',
        status: 'accepted',
      },
    ],
    images: [],
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-22T09:30:00Z',
  },
  {
    id: 't4',
    title: 'Fix my WordPress Site Bug',
    description:
      'My WooCommerce checkout page is throwing a 500 error on mobile devices only. Need it fixed ASAP.',
    budget: 15000,
    category: 'Web & Tech',
    location: 'Remote',
    deadline: 'Mar 30, 2025',
    status: 'COMPLETED',
    poster: MOCK_USERS[0],
    assignedTasker: MOCK_USERS[1],
    bids: [],
    images: [],
    createdAt: '2025-03-18T08:00:00Z',
    updatedAt: '2025-03-20T14:00:00Z',
  },
  // Tasker feed (other posters)
  {
    id: 't5',
    title: 'Migrate PostgreSQL database to Supabase',
    description:
      'Have a production PostgreSQL DB with ~20 tables. Need it fully migrated to Supabase with RLS policies set up.',
    budget: 60000,
    category: 'Web & Tech',
    location: 'Remote',
    deadline: 'Apr 15, 2025',
    status: 'OPEN',
    poster: MOCK_USERS[2],
    bids: [
      {
        id: 'b4',
        taskId: 't5',
        tasker: MOCK_USERS[1],
        amount: 55000,
        message: 'Done this many times. Can start tomorrow.',
        createdAt: '2025-03-25T11:00:00Z',
        status: 'pending',
      },
    ],
    images: [],
    createdAt: '2025-03-24T07:00:00Z',
    updatedAt: '2025-03-25T11:00:00Z',
  },
  {
    id: 't6',
    title: 'Brand identity for a restaurant',
    description:
      'A new restaurant in Lekki needs a full brand kit: logo, menu design, social media templates, business cards.',
    budget: 120000,
    category: 'Design',
    location: 'Lekki, Lagos',
    deadline: 'Apr 20, 2025',
    status: 'OPEN',
    poster: MOCK_USERS[3],
    bids: [],
    images: [],
    createdAt: '2025-03-25T09:00:00Z',
    updatedAt: '2025-03-25T09:00:00Z',
  },
]

let MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'bid',
    title: 'New bid received',
    body: 'Chidi Eze placed a bid of ₦70,000 on "Build a React Dashboard"',
    read: false,
    createdAt: '2025-03-24T10:00:00Z',
    taskId: 't1',
  },
  {
    id: 'n2',
    type: 'bid',
    title: 'New bid received',
    body: 'Amaka Obi placed a bid of ₦80,000 on "Build a React Dashboard"',
    read: false,
    createdAt: '2025-03-24T12:00:00Z',
    taskId: 't1',
  },
  {
    id: 'n3',
    type: 'assigned',
    title: 'Task started',
    body: 'Tunde Balogun has started working on "Write 5 Blog Posts on AI"',
    read: true,
    createdAt: '2025-03-22T10:00:00Z',
    taskId: 't3',
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms))

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`

// ─── API FUNCTIONS ────────────────────────────────────────────────────────────

export const api = {
  // Auth
  getCurrentUser: async (): Promise<User> => {
    await delay(300)
    return CURRENT_USER
  },

  // Tasks
  getMyTasks: async (): Promise<Task[]> => {
    await delay(500)
    return MOCK_TASKS.filter(t => t.poster.id === CURRENT_USER.id)
  },

  getBrowseTasks: async (): Promise<Task[]> => {
    await delay(500)
    return MOCK_TASKS.filter(t => t.poster.id !== CURRENT_USER.id && ['OPEN', 'BIDDING'].includes(t.status))
  },

  getTaskById: async (id: string): Promise<Task | null> => {
    await delay(400)
    return MOCK_TASKS.find(t => t.id === id) ?? null
  },

  createTask: async (data: Partial<Task>): Promise<Task> => {
    await delay(800)
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: data.title ?? '',
      description: data.description ?? '',
      budget: data.budget ?? 0,
      category: data.category ?? 'Other',
      location: data.location ?? 'Remote',
      deadline: data.deadline ?? '',
      status: 'OPEN',
      poster: CURRENT_USER,
      bids: [],
      images: data.images ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MOCK_TASKS = [newTask, ...MOCK_TASKS]

    MOCK_NOTIFICATIONS = [
      {
        id: `n${Date.now()}`,
        type: 'assigned',
        title: 'Task posted!',
        body: `Your task "${newTask.title}" is now live.`,
        read: false,
        createdAt: new Date().toISOString(),
        taskId: newTask.id,
      },
      ...MOCK_NOTIFICATIONS,
    ]
    return newTask
  },

  cancelTask: async (taskId: string): Promise<Task> => {
    await delay(500)
    MOCK_TASKS = MOCK_TASKS.map(t =>
      t.id === taskId ? { ...t, status: 'CANCELLED' } : t
    )
    return MOCK_TASKS.find(t => t.id === taskId)!
  },

  // Bids
  submitBid: async (taskId: string, amount: number, message: string): Promise<Bid> => {
    await delay(700)
    const task = MOCK_TASKS.find(t => t.id === taskId)!
    const bid: Bid = {
      id: `b${Date.now()}`,
      taskId,
      tasker: CURRENT_USER,
      amount,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }
    MOCK_TASKS = MOCK_TASKS.map(t =>
      t.id === taskId
        ? { ...t, bids: [...t.bids, bid], status: 'BIDDING', updatedAt: new Date().toISOString() }
        : t
    )
    MOCK_NOTIFICATIONS = [
      {
        id: `n${Date.now()}`,
        type: 'bid',
        title: 'Bid submitted!',
        body: `You placed a bid of ₦${amount.toLocaleString()} on "${task.title}"`,
        read: false,
        createdAt: new Date().toISOString(),
        taskId,
      },
      ...MOCK_NOTIFICATIONS,
    ]
    return bid
  },

  acceptTask: async (taskId: string): Promise<Task> => {
    await delay(700)
    const task = MOCK_TASKS.find(t => t.id === taskId)!
    const updatedTask = {
      ...task,
      status: 'ASSIGNED' as TaskStatus,
      assignedTasker: CURRENT_USER,
      updatedAt: new Date().toISOString(),
    }
    MOCK_TASKS = MOCK_TASKS.map(t => (t.id === taskId ? updatedTask : t))
    MOCK_NOTIFICATIONS = [
      {
        id: `n${Date.now()}`,
        type: 'assigned',
        title: 'Task accepted!',
        body: `You accepted "${task.title}". Get in touch with the poster.`,
        read: false,
        createdAt: new Date().toISOString(),
        taskId,
      },
      ...MOCK_NOTIFICATIONS,
    ]
    return updatedTask
  },

  acceptBid: async (taskId: string, bidId: string): Promise<Task> => {
    await delay(700)
    const task = MOCK_TASKS.find(t => t.id === taskId)!
    const bid = task.bids.find(b => b.id === bidId)!
    const updatedTask = {
      ...task,
      status: 'ASSIGNED' as TaskStatus,
      assignedTasker: bid.tasker,
      bids: task.bids.map(b => ({
        ...b,
        status: b.id === bidId ? ('accepted' as const) : ('rejected' as const),
      })),
      updatedAt: new Date().toISOString(),
    }
    MOCK_TASKS = MOCK_TASKS.map(t => (t.id === taskId ? updatedTask : t))
    MOCK_NOTIFICATIONS = [
      {
        id: `n${Date.now()}`,
        type: 'assigned',
        title: 'Tasker assigned!',
        body: `${bid.tasker.name} has been assigned to "${task.title}"`,
        read: false,
        createdAt: new Date().toISOString(),
        taskId,
      },
      ...MOCK_NOTIFICATIONS,
    ]
    return updatedTask
  },

  rejectBid: async (taskId: string, bidId: string): Promise<Task> => {
    await delay(500)
    MOCK_TASKS = MOCK_TASKS.map(t =>
      t.id === taskId
        ? { ...t, bids: t.bids.map(b => b.id === bidId ? { ...b, status: 'rejected' as const } : b) }
        : t
    )
    return MOCK_TASKS.find(t => t.id === taskId)!
  },

  // Task progression (tasker actions)
  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task> => {
    await delay(600)
    MOCK_TASKS = MOCK_TASKS.map(t =>
      t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
    )
    const task = MOCK_TASKS.find(t => t.id === taskId)!
    const notifMessages: Record<string, string> = {
      IN_PROGRESS: `Tasker has started working on "${task.title}"`,
      PENDING_REVIEW: `"${task.title}" has been marked complete. Please review.`,
    }
    if (notifMessages[status]) {
      MOCK_NOTIFICATIONS = [
        {
          id: `n${Date.now()}`,
          type: status === 'PENDING_REVIEW' ? 'complete' : 'assigned',
          title: status === 'PENDING_REVIEW' ? 'Task completed!' : 'Task in progress',
          body: notifMessages[status],
          read: false,
          createdAt: new Date().toISOString(),
          taskId,
        },
        ...MOCK_NOTIFICATIONS,
      ]
    }
    return task
  },

  confirmCompletion: async (taskId: string): Promise<Task> => {
    await delay(700)
    MOCK_TASKS = MOCK_TASKS.map(t =>
      t.id === taskId ? { ...t, status: 'COMPLETED', updatedAt: new Date().toISOString() } : t
    )
    return MOCK_TASKS.find(t => t.id === taskId)!
  },

  raiseDispute: async (taskId: string): Promise<Task> => {
    await delay(700)
    MOCK_TASKS = MOCK_TASKS.map(t =>
      t.id === taskId ? { ...t, status: 'DISPUTED', updatedAt: new Date().toISOString() } : t
    )
    return MOCK_TASKS.find(t => t.id === taskId)!
  },

  submitReview: async (data: Review): Promise<void> => {
    await delay(600)
    // In real app, would save to DB
    console.log('Review submitted:', data)
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(300)
    return MOCK_NOTIFICATIONS
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await delay(200)
    MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  },

  markAllRead: async (): Promise<void> => {
    await delay(300)
    MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n => ({ ...n, read: true }))
  },
}

export { formatNaira }