// import { useState } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { Moon, Sun, Zap, Menu, X, Bell, MessageSquare,HomeIcon, Search } from 'lucide-react'
// import { useTheme } from '../context/ThemeContext'
// import NotificationsPanel from '../components/Notificationspanel'
// import type { Notification } from '../api/mockApi'

// interface NavbarProps {
//   variant?: 'landing' | 'app'
// }

// export default function Navbar({ variant = 'landing' }: NavbarProps) {
//   const { toggleTheme, isDark } = useTheme()
//     const [loading, setLoading] = useState(true)
//   const [menuOpen, setMenuOpen] = useState(false)
//     const [notifications, setNotifications] = useState<Notification[]>([])
//   const navigate = useNavigate()
//   const location = useLocation()
//     const [showNotifications, setShowNotifications] = useState(false)
//    async function handleMarkAllRead() {
//     await api.markAllRead()
//     setNotifications(prev => prev.map(n => ({ ...n, read: true })))
//   }
//    async function handleNotificationClick(n: Notification) {
//       await api.markNotificationRead(n.id)
//       setNotifications(prev => prev.map(x => (x.id === n.id ? { ...x, read: true } : x)))
//       setShowNotifications(false)
//       if (n.taskId) {
//         const task = [...myTasks, ...browseTasks].find(t => t.id === n.taskId)
//         if (task) setSelectedTask(task)
//       }
//     }
//       useEffect(() => {
//         async function load() {
//           setLoading(true)
//           const [ notifs] = await Promise.all([
          
          
//             api.getNotifications(),
//           ])
      
//           setNotifications(notifs)
//           setLoading(false)
//         }
//         load()
//       }, [])
    

//   const isLanding = variant === 'landing'

//   return (
//     <nav
//       className="sticky top-0 z-50 w-full"
//       style={{
//         background: 'var(--color-surface)',
//         borderBottom: '1px solid var(--color-border)',
//         backdropFilter: 'blur(16px)',
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 group">
//             <span
//               className="w-8 h-8 rounded-lg flex items-center justify-center"
//               style={{ background: 'var(--color-accent)' }}
//             >
//               <Zap size={17} color="#fff" fill="#fff" />
//             </span>
//             <span
//               className="font-display font-700 text-xl tracking-tight"
//               style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}
//             >
//               Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
//             </span>
//           </Link>

//           {/* Desktop Nav Links */}
//           {isLanding && (
//             <div className="hidden md:flex items-center gap-8">
//               {['How it Works', 'Features', 'Pricing', 'About'].map((item) => (
//                 <a
//                   key={item}
//                   href={`#${item.toLowerCase().replace(/ /g, '-')}`}
//                   className="text-sm font-medium transition-colors duration-200"
//                   style={{ color: 'var(--color-text-secondary)' }}
//                   onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
//                   onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
//                 >
//                   {item}
//                 </a>
//               ))}
//             </div>
//           )}

//           {/* App nav icons */}
//           {!isLanding && (
//             <div className="hidden md:flex items-center gap-4">
//                 <Link to="/dashboard"
//                 className="p-2 rounded-lg flex gap-1 text-[16px] transition-colors"
//                 style={{ color: 'var(--color-text-secondary)' }}

//               >
//                 <HomeIcon className='w-4 h-4' />
//                 Dashboard
//               </Link>
            
//               <Link to="/tasks"
//                 className="p-2 rounded-lg gap-1 text-[16px] flex transition-colors"
//                 style={{ color: 'var(--color-text-secondary)' }}

//               >
//                 <Search  className='w-4 h-4'/>
//                 Browse tasks
//               </Link>
//               <Link to="/chat"
//                 className="p-2 text-[16px] rounded-lg flex gap-1 transition-colors"
//                 style={{ color: 'var(--color-text-secondary)' }}

//               >
//                 <MessageSquare className='w-4 h-4' />
//                 Chat
//               </Link>
//             </div>
//           )}

//           {/* Right Actions */}
//           <div className="flex items-center gap-3">
//             {/* Theme Toggle */}
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-lg transition-all duration-200"
//               style={{
//                 background: 'var(--color-surface-2)',
//                 border: '1px solid var(--color-border)',
//                 color: 'var(--color-text-secondary)',
//               }}
//               aria-label="Toggle dark mode"
//             >
//               {isDark ? <Sun size={16} /> : <Moon size={16} />}
//             </button>
//              {!isLanding && (     {/* Notifications bell */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(v => !v)}
//                 className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
//                 style={{
//                   background: 'var(--color-surface)',
//                   border: '1px solid var(--color-border)',
//                   color: 'var(--color-text-secondary)',
//                 }}
//               >
//                 <Bell size={18} />
//                 {unreadCount > 0 && (
//                   <span
//                     className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-xs font-bold flex items-center justify-center"
//                     style={{
//                       background: 'var(--color-accent)',
//                       color: '#fff',
//                       width: '18px',
//                       height: '18px',
//                       fontSize: '10px',
//                     }}
//                   >
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {showNotifications && (
//                 <NotificationsPanel
//                   notifications={notifications}
//                   onClose={() => setShowNotifications(false)}
//                   onMarkAllRead={handleMarkAllRead}
//                   onClickNotification={handleNotificationClick}
//                 />
//               )}
//             </div>)}

//             {isLanding && (
//               <>
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="hidden md:block text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
//                   style={{ color: 'var(--color-text-secondary)' }}
//                   onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
//                   onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
//                 >
//                   Log in
//                 </button>
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="hidden md:block text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200"
//                   style={{
//                     background: 'var(--color-accent)',
//                     color: 'var(--color-accent-fg)',
//                   }}
//                   onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
//                   onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
//                 >
//                   Get Started
//                 </button>
//               </>
//             )}

//             {/* Mobile hamburger */}
//             <button
//               className="md:hidden p-2 rounded-lg"
//               style={{ color: 'var(--color-text-secondary)' }}
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               {menuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div
//           className="md:hidden border-t px-4 py-4 flex flex-col gap-4"
//           style={{
//             background: 'var(--color-surface)',
//             borderColor: 'var(--color-border)',
//           }}
//         >
//           {isLanding &&
//             ['How it Works', 'Features', 'Pricing', 'About'].map((item) => (
//               <a
//                 key={item}
//                 href={`#${item.toLowerCase().replace(/ /g, '-')}`}
//                 className="text-sm font-medium"
//                 style={{ color: 'var(--color-text-secondary)' }}
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {item}
//               </a>
//             ))}
    //       {isLanding && (
    //         <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
    //           <button
    //             onClick={() => { navigate('/login'); setMenuOpen(false) }}
    //             className="text-sm font-medium py-2"
    //             style={{ color: 'var(--color-text-primary)' }}
    //           >
    //             Log in
    //           </button>
    //           <button
    //             onClick={() => { navigate('/login'); setMenuOpen(false) }}
    //             className="text-sm font-semibold py-2.5 rounded-lg"
    //             style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
    //           >
    //             Get Started Free
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   )}
//     </nav>
//   )
// }
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Moon,
  Sun,
  Zap,
  Menu,
  X,
  Bell,
  MessageSquare,
  HomeIcon,
  Search,
} from 'lucide-react'

import { useTheme } from '../context/ThemeContext'
import NotificationsPanel from '../components/Notificationspanel'
import type { Notification } from '../api/mockApi'
import { api } from '../api/mockApi'

interface NavbarProps {
  variant?: 'landing' | 'app'
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const { toggleTheme, isDark } = useTheme()

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const isLanding = variant === 'landing'

  const unreadCount = notifications.filter(n => !n.read).length

  
  useEffect(() => {
    async function load() {
      setLoading(true)
      const notifs = await api.getNotifications()
      setNotifications(notifs)
      setLoading(false)
    }
    load()
  }, [])

  
  async function handleMarkAllRead() {
    await api.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

async function handleNotificationClick(n: Notification) {
  await api.markNotificationRead(n.id)

  setNotifications(prev =>
    prev.map(x => (x.id === n.id ? { ...x, read: true } : x))
  )

  setShowNotifications(false)

  // 👉 Navigate to tasks page with taskId
  if (n.taskId) {
    navigate(`/tasks?taskId=${n.taskId}`)
  }
}

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
            >
              <Zap size={17} color="#fff" fill="#fff" />
            </span>

            <span className="font-semibold text-xl">
              Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
            </span>
          </Link>

          {/* App nav */}
          {!isLanding && (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-1 text-sm">
                <HomeIcon className="w-4 h-4" />
                Dashboard
              </Link>

              <Link to="/tasks" className="flex items-center gap-1 text-sm">
                <Search className="w-4 h-4" />
                Tasks
              </Link>

              <Link to="/chat" className="flex items-center gap-1 text-sm">
                <MessageSquare className="w-4 h-4" />
                Chat
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-300"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            
            {!isLanding && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(v => !v)}
                  className="relative w-10 h-10 rounded-xl flex items-center border-gray-300 justify-center border"
                >
                  <Bell size={18} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center">
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
            )}

        {isLanding && (
            <div className="flex gap-3 " style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false) }}
                className="text-sm font-medium py-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Log in
              </button>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false) }}
                className="text-sm font-semibold px-5 py-2.5 rounded-lg"
                style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
              >
                Get Started Free
              </button>
            </div>
      )}

            {/* Mobile menu */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      {menuOpen && (
        <div className="md:hidden p-4 flex flex-col gap-3 border-t">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/chat">Chat</Link>
        </div>
      )}
    </nav>
  )
}