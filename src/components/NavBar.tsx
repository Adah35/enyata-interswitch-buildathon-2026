
// import { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import {
//   Moon,
//   Sun,
//   Zap,
//   Menu,
//   X,
//   Bell,
//   MessageSquare,
//   HomeIcon,
//   Search,
// } from 'lucide-react'

// import { useTheme } from '../context/ThemeContext'
// import NotificationsPanel from '../components/Notificationspanel'
// import type { Notification } from '../api/mockApi'
// import { api } from '../api/mockApi'

// interface NavbarProps {
//   variant?: 'landing' | 'app'
// }

// export default function Navbar({ variant = 'landing' }: NavbarProps) {
//   const { toggleTheme, isDark } = useTheme()

//   const [menuOpen, setMenuOpen] = useState(false)
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [loading, setLoading] = useState(true)

//   const navigate = useNavigate()

//   const isLanding = variant === 'landing'

//   const unreadCount = notifications.filter(n => !n.read).length

  
//   useEffect(() => {
//     async function load() {
//       setLoading(true)
//       const notifs = await api.getNotifications()
//       setNotifications(notifs)
//       setLoading(false)
//     }
//     load()
//   }, [])

  
//   async function handleMarkAllRead() {
//     await api.markAllRead()
//     setNotifications(prev => prev.map(n => ({ ...n, read: true })))
//   }

// async function handleNotificationClick(n: Notification) {
//   await api.markNotificationRead(n.id)

//   setNotifications(prev =>
//     prev.map(x => (x.id === n.id ? { ...x, read: true } : x))
//   )

//   setShowNotifications(false)

//   // 👉 Navigate to tasks page with taskId
//   if (n.taskId) {
//     navigate(`/tasks?taskId=${n.taskId}`)
//   }
// }

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
//           <Link to="/" className="flex items-center gap-2">
//             <span
//               className="w-8 h-8 rounded-lg flex items-center justify-center"
//               style={{ background: 'var(--color-accent)' }}
//             >
//               <Zap size={17} color="#fff" fill="#fff" />
//             </span>

//             <span className="font-semibold text-xl">
//               Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
//             </span>
//           </Link>

//           {/* App nav */}
//           {!isLanding && (
//             <div className="hidden md:flex items-center gap-4">
//               <Link to="/dashboard" className="flex items-center gap-1 text-sm">
//                 <HomeIcon className="w-4 h-4" />
//                 Dashboard
//               </Link>

//               <Link to="/tasks" className="flex items-center gap-1 text-sm">
//                 <Search className="w-4 h-4" />
//                 Tasks
//               </Link>

//               <Link to="/chat" className="flex items-center gap-1 text-sm">
//                 <MessageSquare className="w-4 h-4" />
//                 Chat
//               </Link>
//             </div>
//           )}

//           {/* Right side */}
//           <div className="flex items-center gap-3">
//             {/* Theme */}
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-lg border border-gray-300"
//             >
//               {isDark ? <Sun size={16} /> : <Moon size={16} />}
//             </button>

            
//             {!isLanding && (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowNotifications(v => !v)}
//                   className="relative w-10 h-10 rounded-xl flex items-center border-gray-300 justify-center border"
//                 >
//                   <Bell size={18} />

//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>

//                 {showNotifications && (
//                   <NotificationsPanel
//                     notifications={notifications}
//                     onClose={() => setShowNotifications(false)}
//                     onMarkAllRead={handleMarkAllRead}
//                     onClickNotification={handleNotificationClick}
//                   />
//                 )}
//               </div>
//             )}

//         {isLanding && (
//             <div className="flex gap-3 " style={{ borderColor: 'var(--color-border)' }}>
//               <button
//                 onClick={() => { navigate('/login'); setMenuOpen(false) }}
//                 className="text-sm font-medium py-2"
//                 style={{ color: 'var(--color-text-primary)' }}
//               >
//                 Log in
//               </button>
//               <button
//                 onClick={() => { navigate('/login'); setMenuOpen(false) }}
//                 className="text-sm font-semibold px-5 py-2.5 rounded-lg"
//                 style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
//               >
//                 Get Started Free
//               </button>
//             </div>
//       )}

//             {/* Mobile menu */}
//            {!isLanding && (
//              <button
//               className="md:hidden"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               {menuOpen ? <X /> : <Menu />}
//             </button>
//            )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile */}
//       {menuOpen && (
//         <div className="md:hidden p-4 flex flex-col gap-3 border-t">
//           <Link to="/dashboard">Dashboard</Link>
//           <Link to="/tasks">Tasks</Link>
//           <Link to="/chat">Chat</Link>
//         </div>
//       )}
//     </nav>
//   )
// }
// components/NavBar.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Moon, Sun, Zap, Menu, X, Bell, MessageSquare, HomeIcon, Search, Wallet } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import NotificationsPanel from '../components/NotificationsPanel'
import type { Notification } from '../api/mockApi'
import { api } from '../api/mockApi'

interface NavbarProps { variant?: 'landing' | 'app' }

const APP_LINKS = [
  { to: '/dashboard', icon: HomeIcon,     label: 'Dashboard' },
  { to: '/tasks',     icon: Search,       label: 'Tasks' },
  { to: '/chat',      icon: MessageSquare,label: 'Chat' },
]

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const { toggleTheme, isDark } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = variant === 'landing'

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifs, setShowNotifs] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    api.getNotifications().then(setNotifications)
  }, [])

  async function handleMarkAllRead() {
    await api.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  async function handleNotifClick(n: Notification) {
    await api.markNotificationRead(n.id)
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
    setShowNotifs(false)
    if (n.taskId) navigate(`/tasks?taskId=${n.taskId}`)
  }

  function isActive(path: string) {
    return location.pathname === path
  }

  const iconBtnStyle = (active = false) => ({
    background: active ? 'var(--color-accent)15' : 'var(--color-surface-2)',
    border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
    color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
  })

  return (
    <nav className="sticky top-0 z-50 w-full"
      style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}>
              <Zap size={17} color="#fff" fill="#fff" />
            </span>
            <span className="font-semibold text-xl" style={{ color: 'var(--color-text-primary)' }}>
              Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
            </span>
          </Link>

          {/* Desktop app links */}
          {!isLanding && (
            <div className="hidden md:flex items-center gap-1">
              {APP_LINKS.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-all"
                  style={{
                    color: isActive(to) ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontWeight: isActive(to) ? '600' : '500',
                    background: isActive(to) ? 'var(--color-accent)08' : 'transparent',
                  }}>
                  <Icon size={14} /> {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Theme */}
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {!isLanding && (
              <>
                {/* ── Wallet icon ── */}
                <Link to="/wallet"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={iconBtnStyle(isActive('/wallet'))}
                  title="Wallet"
                  onMouseEnter={e => { if (!isActive('/wallet')) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}}
                  onMouseLeave={e => { if (!isActive('/wallet')) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)' }}}>
                  <Wallet size={16} />
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setShowNotifs(v => !v)}
                    className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 text-xs font-bold rounded-full flex items-center justify-center"
                        style={{ background: 'var(--color-accent)', color: '#fff', fontSize: 9 }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifs && (
                    <NotificationsPanel
                      notifications={notifications}
                      onClose={() => setShowNotifs(false)}
                      onMarkAllRead={handleMarkAllRead}
                      onClickNotification={handleNotifClick}
                    />
                  )}
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  {menuOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </>
            )}

            {/* Landing CTAs */}
            {isLanding && (
              <div className="flex gap-2">
                <button onClick={() => navigate('/login')}
                  className="text-sm font-medium py-2 px-3"
                  style={{ color: 'var(--color-text-primary)' }}>
                  Log in
                </button>
                <button onClick={() => navigate('/login')}
                  className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}>
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {!isLanding && menuOpen && (
        <div className="md:hidden p-3 flex flex-col gap-1 border-t"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
          {[...APP_LINKS, { to: '/wallet', icon: Wallet, label: 'Wallet' }].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{
                background: isActive(to) ? 'var(--color-accent)10' : 'transparent',
                color: isActive(to) ? 'var(--color-accent)' : 'var(--color-text-primary)',
              }}>
              <Icon size={15} /> {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}