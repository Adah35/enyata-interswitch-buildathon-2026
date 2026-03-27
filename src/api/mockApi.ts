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
    bio: 'Reliable errand runner & delivery guy. Fast and trustworthy.',
    completedTasks: 61,
  },
  {
    id: 'u3',
    name: 'Amaka Obi',
    avatar: 'AO',
    rating: 4.7,
    reviewCount: 33,
    role: 'tasker',
    bio: 'Professional chef & home cook. Specialises in Nigerian and continental cuisine.',
    completedTasks: 33,
  },
  {
    id: 'u4',
    name: 'Tunde Balogun',
    avatar: 'TB',
    rating: 4.6,
    reviewCount: 18,
    role: 'tasker',
    bio: 'Driver & logistics expert. Know Lagos like the back of my hand.',
    completedTasks: 18,
  },
]

export const CURRENT_USER = MOCK_USERS[0]

let MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Pick Up a Package from Island and Bring to Mainland',
    description:
      'I ordered some items from a vendor in Victoria Island (Ozumba Mbadiwe area). I need someone with a car or bike to pick them up and deliver to my office in Yaba. Package is one medium box — not heavy. Speed matters.',
    budget: 5000,
    category: 'Delivery & Errands',
    location: 'Victoria Island → Yaba, Lagos',
    deadline: 'Mar 28, 2025',
    status: 'BIDDING',
    poster: MOCK_USERS[0],
    bids: [
      {
        id: 'b1',
        taskId: 't1',
        tasker: MOCK_USERS[1],
        amount: 4500,
        message: `I can do this now. I'm currently around Lekki. Will take about 45 mins.`,
        createdAt: '2025-03-27T10:00:00Z',
        status: 'pending',
      },
      {
        id: 'b2',
        taskId: 't1',
        tasker: MOCK_USERS[3],
        amount: 5000,
        message: 'Available and ready. I know the exact street in VI, no wahala.',
        createdAt: '2025-03-27T11:30:00Z',
        status: 'pending',
      },
    ],
    images: [],
    createdAt: '2025-03-27T09:00:00Z',
    updatedAt: '2025-03-27T11:30:00Z',
  },
  {
    id: 't2',
    title: 'Cook Lunch for a Small Family Gathering (8 people)',
    description:
      `Need a good cook to come to my house in Surulere and prepare Sunday lunch for 8 people. Menu: jollof rice, fried chicken, moi moi, and coleslaw. Must bring their own utensils and spices. I'll provide the ingredients.`,
    budget: 18000,
    category: 'Home & Cooking',
    location: 'Surulere, Lagos',
    deadline: 'Mar 30, 2025',
    status: 'OPEN',
    poster: MOCK_USERS[0],
    bids: [],
    images: [],
    createdAt: '2025-03-27T08:00:00Z',
    updatedAt: '2025-03-27T08:00:00Z',
  },
  {
    id: 't3',
    title: 'Plait My Hair – Knotless Braids (Waist Length)',
    description:
      `Looking for a skilled hair braider to come to my home in Ikeja and do knotless braids for me. Waist length, medium-sized. I'll provide the attachment hair. Needs to be neat and long-lasting. Ladies only please.`,
    budget: 22000,
    category: 'Beauty & Personal Care',
    location: 'Ikeja, Lagos',
    deadline: 'Mar 29, 2025',
    status: 'IN_PROGRESS',
    poster: MOCK_USERS[0],
    assignedTasker: MOCK_USERS[2],
    bids: [
      {
        id: 'b3',
        taskId: 't3',
        tasker: MOCK_USERS[2],
        amount: 20000,
        message: 'I specialise in knotless braids. Very neat finish, I can come Saturday morning.',
        createdAt: '2025-03-26T09:00:00Z',
        status: 'accepted',
      },
    ],
    images: [],
    createdAt: '2025-03-25T10:00:00Z',
    updatedAt: '2025-03-26T09:30:00Z',
  },
  {
    id: 't4',
    title: 'Deliver Food from My Restaurant to 3 Customers',
    description:
      'Need a dispatch rider to pick up food orders from my restaurant in Gbagada and deliver to 3 addresses on the mainland. All addresses are within 5km. Orders must arrive hot — insulated bag will be provided.',
    budget: 6000,
    category: 'Delivery & Errands',
    location: 'Gbagada, Lagos',
    deadline: 'Mar 27, 2025',
    status: 'COMPLETED',
    poster: MOCK_USERS[0],
    assignedTasker: MOCK_USERS[1],
    bids: [],
    images: [],
    createdAt: '2025-03-26T08:00:00Z',
    updatedAt: '2025-03-26T14:00:00Z',
  },
  // Tasker feed (other posters)
  {
    id: 't5',
    title: 'Grocery Shopping at Shoprite — Lekki',
    description:
      `Need someone to go to Shoprite Lekki and buy groceries for me. I'll send the full shopping list via chat. Budget for items is separate — I'll do a bank transfer before you go. Task pay is for your time and transport.`,
    budget: 4000,
    category: 'Delivery & Errands',
    location: 'Lekki Phase 1, Lagos',
    deadline: 'Mar 29, 2025',
    status: 'OPEN',
    poster: MOCK_USERS[2],
    bids: [
      {
        id: 'b4',
        taskId: 't5',
        tasker: MOCK_USERS[1],
        amount: 3500,
        message: `I'm around Lekki. Can go now if you send the list.`,
        createdAt: '2025-03-27T11:00:00Z',
        status: 'pending',
      },
    ],
    images: [],
    createdAt: '2025-03-27T07:00:00Z',
    updatedAt: '2025-03-27T11:00:00Z',
  },
  {
    id: 't6',
    title: 'Home Deep Cleaning – 3-Bedroom Flat in Ajah',
    description:
      'My apartment needs a thorough deep clean before I move in. 3 bedrooms, 2 bathrooms, kitchen, and sitting room. Need mopping, scrubbing, wiping down surfaces, and cleaning the toilets. Cleaning supplies will be provided.',
    budget: 15000,
    category: 'Cleaning & Maintenance',
    location: 'Ajah, Lagos',
    deadline: 'Apr 1, 2025',
    status: 'OPEN',
    poster: MOCK_USERS[3],
    bids: [],
    images: [],
    createdAt: '2025-03-27T09:00:00Z',
    updatedAt: '2025-03-27T09:00:00Z',
  },
]

let MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'bid',
    title: 'New bid on your delivery task',
    body: 'Chidi Eze offered ₦4,500 to pick up your package from Victoria Island.',
    read: false,
    createdAt: '2025-03-27T10:00:00Z',
    taskId: 't1',
  },
  {
    id: 'n2',
    type: 'bid',
    title: 'Another bid received',
    body: 'Tunde Balogun placed a bid of ₦5,000 on your "Pick Up a Package" task.',
    read: false,
    createdAt: '2025-03-27T11:30:00Z',
    taskId: 't1',
  },
  {
    id: 'n3',
    type: 'assigned',
    title: 'Hair braiding in progress',
    body: 'Amaka Obi has started plaiting your hair. Task is now in progress.',
    read: true,
    createdAt: '2025-03-26T10:00:00Z',
    taskId: 't3',
  },
  {
    id: 'n4',
    type: 'complete',
    title: 'Delivery completed!',
    body: 'Chidi Eze has delivered all 3 food orders. Please confirm completion.',
    read: true,
    createdAt: '2025-03-26T14:00:00Z',
    taskId: 't4',
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
        body: `Your task "${newTask.title}" is now live and visible to taskers.`,
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
        body: `You offered ₦${amount.toLocaleString()} for "${task.title}". Waiting for the poster to respond.`,
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
        body: `You've been assigned "${task.title}". Reach out to the poster to get started.`,
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
        body: `${bid.tasker.name} has been assigned to "${task.title}". They'll be in touch soon.`,
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
    const notifMessages: Record<string, { title: string; body: string }> = {
      IN_PROGRESS: {
        title: 'Task in progress',
        body: `${task.assignedTasker?.name ?? 'Your tasker'} has started working on "${task.title}".`,
      },
      PENDING_REVIEW: {
        title: 'Task completed — review needed',
        body: `"${task.title}" has been marked as done. Please confirm or raise a dispute.`,
      },
    }
    if (notifMessages[status]) {
      MOCK_NOTIFICATIONS = [
        {
          id: `n${Date.now()}`,
          type: status === 'PENDING_REVIEW' ? 'complete' : 'assigned',
          title: notifMessages[status].title,
          body: notifMessages[status].body,
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