import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Moon, Sun, Zap, Bell, MessageSquare, HomeIcon, Search, Wallet } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import NotificationsPanel from '../components/NotificationsPanel'
import type { Notification } from '../api/mockApi'
import { api } from '../api/mockApi'

interface NavbarProps { variant?: 'landing' | 'app' }

const APP_LINKS = [
  { to: '/dashboard', icon: HomeIcon,      label: 'Dashboard' },
  { to: '/tasks',     icon: Search,        label: 'Tasks' },
  { to: '/chat',      icon: MessageSquare, label: 'Chat' },
  { to: '/wallet',    icon: Wallet,        label: 'Wallet' },
]

const LANDING_LINKS = [
  { to: '#features', label: 'Features' },
  { to: '#pricing',  label: 'Pricing' },
  { to: '#about',    label: 'About' },
]

/* ── Animated 3-line → X hamburger ─────────────────────────────────── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="hbg" data-open={String(open)} aria-hidden="true">
      <span className="hbg-l hbg-l1" />
      <span className="hbg-l hbg-l2" />
      <span className="hbg-l hbg-l3" />
    </span>
  )
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const { toggleTheme, isDark } = useTheme()
  const location  = useLocation()
  const navigate  = useNavigate()
  const isLanding = variant === 'landing'

  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifs,    setShowNotifs]    = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => { api.getNotifications().then(setNotifications) }, [])
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node))
        setDrawerOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [drawerOpen])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

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

  const isActive = (p: string) => location.pathname === p

  const iconBtnStyle = (active = false): React.CSSProperties => ({
    background: active ? 'color-mix(in srgb,var(--color-accent) 12%,transparent)' : 'var(--color-surface-2)',
    border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
    color:  active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
  })

  return (
    <>
      {/* ── Scoped styles ─────────────────────────────────────────────── */}
      <style>{`
        /* ---------- Hamburger ---------- */
        .hbg {
          display: flex; flex-direction: column; justify-content: center;
          align-items: center; width: 18px; height: 18px; position: relative;
        }
        .hbg-l {
          display: block; width: 18px; height: 2px; border-radius: 2px;
          background: var(--color-text-secondary); position: absolute;
          transition: transform .35s cubic-bezier(.23,1,.32,1),
                      opacity   .25s ease,
                      top       .35s cubic-bezier(.23,1,.32,1),
                      width     .3s  cubic-bezier(.23,1,.32,1);
          transform-origin: center;
        }
        .hbg-l1 { top: 3px; }
        .hbg-l2 { top: 50%; transform: translateY(-50%); }
        .hbg-l3 { bottom: 3px; top: auto; width: 11px; }

        /* open → X */
        .hbg[data-open="true"] .hbg-l1 { top: 50%; transform: translateY(-50%) rotate(45deg); }
        .hbg[data-open="true"] .hbg-l2 { opacity: 0; transform: translateY(-50%) scaleX(0); }
        .hbg[data-open="true"] .hbg-l3 { bottom: auto; top: 50%; width: 18px; transform: translateY(-50%) rotate(-45deg); }

        /* ---------- Overlay ---------- */
        .nav-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,.48); backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity .35s ease;
        }
        .nav-overlay.open { opacity: 1; pointer-events: all; }

        /* ---------- Drawer ---------- */
        .nav-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: min(300px, 82vw); z-index: 101;
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          box-shadow: 10px 0 40px rgba(0,0,0,.2);
          transform: translateX(-110%);
          transition: transform .38s cubic-bezier(.23,1,.32,1);
          display: flex; flex-direction: column; overflow-y: auto;
        }
        .nav-drawer.open { transform: translateX(0); }

        /* ---------- Drawer link ---------- */
        .drw-link {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; border-radius: 12px;
          font-size: 14px; font-weight: 500;
          color: var(--color-text-primary);
          text-decoration: none;
          transition: background .18s, color .18s;
          cursor: pointer;
          border: none; background: none; width: 100%; text-align: left;
        }
        .drw-link:hover  { background: var(--color-surface-2); color: var(--color-accent); }
        .drw-link.active { background: color-mix(in srgb,var(--color-accent) 10%,transparent); color: var(--color-accent); font-weight: 600; }
        .drw-divider     { height: 1px; background: var(--color-border); margin: 6px 16px; }
      `}</style>

      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 w-full"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(16px)' }}
      >
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

            {/* Desktop centre links */}
            <div className="hidden md:flex items-center gap-1">
              {isLanding
                ? LANDING_LINKS.map(({ }) => (
                   <></>
                  ))
                : APP_LINKS.map(({ to, icon: Icon, label }) => (
                    <Link key={to} to={to}
                      className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-all"
                      style={{
                        color:      isActive(to) ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        fontWeight: isActive(to) ? '600' : '500',
                        background: isActive(to) ? 'color-mix(in srgb,var(--color-accent) 8%,transparent)' : 'transparent',
                      }}>
                      <Icon size={14} /> {label}
                    </Link>
                  ))
              }
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              <button onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* App-only: wallet + notifications — always visible */}
              {!isLanding && (
                <>
                  <Link to="/wallet"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={iconBtnStyle(isActive('/wallet'))} title="Wallet"
                    onMouseEnter={e => { if (!isActive('/wallet')) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}}
                    onMouseLeave={e => { if (!isActive('/wallet')) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)' }}}>
                    <Wallet size={16} />
                  </Link>

                  <div className="relative">
                    <button onClick={() => setShowNotifs(v => !v)}
                      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 font-bold rounded-full flex items-center justify-center"
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
                </>
              )}

              {/* Landing desktop CTAs */}
              {isLanding && (
                <div className="hidden md:flex gap-2">
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

              {/* ── Hamburger — mobile only, both variants ── */}
              <button
                onClick={() => setDrawerOpen(v => !v)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              >
                <HamburgerIcon open={drawerOpen} />
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* ── Overlay ───────────────────────────────────────────────────── */}
      <div
        className={`nav-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Left drawer ───────────────────────────────────────────────── */}
      <div
        ref={drawerRef}
        className={`nav-drawer${drawerOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Link to="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </span>
            <span className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
            </span>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            aria-label="Close menu"
          >
            <HamburgerIcon open={true} />
          </button>
        </div>

        {/* Drawer body links */}
        <div className="flex flex-col gap-0.5 px-2 py-3 flex-1">
          {isLanding ? (
            <>
              {LANDING_LINKS.map(({ to, label }) => (
                <a key={to} href={to} className="drw-link" onClick={() => setDrawerOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="drw-divider" />
              <button
                className="drw-link"
                onClick={() => { setDrawerOpen(false); navigate('/login') }}>
                Log in
              </button>
              <button
                onClick={() => { setDrawerOpen(false); navigate('/login') }}
                className="text-sm font-semibold px-4 py-3 rounded-xl transition-all mx-2 mt-1"
                style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}>
                Get Started Free
              </button>
            </>
          ) : (
            <>
              {APP_LINKS.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to}
                  className={`drw-link${isActive(to) ? ' active' : ''}`}
                  onClick={() => setDrawerOpen(false)}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}