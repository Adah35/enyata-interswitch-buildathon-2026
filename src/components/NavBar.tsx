import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Moon, Sun, Zap, Menu, X, Bell, MessageSquare } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface NavbarProps {
  variant?: 'landing' | 'app'
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const { toggleTheme, isDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isLanding = variant === 'landing'

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
          <Link to="/" className="flex items-center gap-2 group">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
            >
              <Zap size={17} color="#fff" fill="#fff" />
            </span>
            <span
              className="font-display font-700 text-xl tracking-tight"
              style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}
            >
              Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-8">
              {['How it Works', 'Features', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* App nav icons */}
          {!isLanding && (
            <div className="hidden md:flex items-center gap-4">
              <button
                className="relative p-2 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Bell size={20} />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <MessageSquare size={20} />
              </button>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-200"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isLanding && (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:block text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:block text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200"
                  style={{
                    background: 'var(--color-accent)',
                    color: 'var(--color-accent-fg)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--color-text-secondary)' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-4 flex flex-col gap-4"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          {isLanding &&
            ['How it Works', 'Features', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          {isLanding && (
            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false) }}
                className="text-sm font-medium py-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Log in
              </button>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false) }}
                className="text-sm font-semibold py-2.5 rounded-lg"
                style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
              >
                Get Started Free
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}