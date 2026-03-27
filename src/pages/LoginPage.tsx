import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, ArrowLeft, Mail, Lock, User, } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

type Mode = 'login' | 'signup'

export default function LoginPage() {
  const navigate = useNavigate()
//   const { toggleTheme, isDark } = useTheme()
  const [mode, setMode] = useState<Mode>('login')
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState<'poster' | 'tasker'>('poster')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)



const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  setTimeout(() => {
    setLoading(false)
    // 👉 If signup, force wallet setup. If login, go to dashboard.
    if (mode === 'signup') {
      navigate('/setup-wallet')
    } else {
      navigate('/dashboard')
    }
  }, 1400)
}

const handleGoogle = () => {
  setGoogleLoading(true)
  setTimeout(() => {
    setGoogleLoading(false)
    // Google users also need a wallet check
    navigate('/setup-wallet')
  }, 1600)
}

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-background)' }}
    >
      {/* ── LEFT PANEL (decorative, hidden on mobile) ── */}

     {/* <section className="py-20">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">

      <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
        Stop waiting. Start getting things done.
      </h2>

      <p className="text-lg mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        Taskly isn’t just another platform — it’s where ideas turn into completed work.
        Whether you need something done or you’re ready to earn from your skills,
        everything you need is already here.
      </p>

      <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
        Post a task in minutes, connect with skilled people instantly, and get real results — fast, secure, and stress-free.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          Post Your First Task
        </button>

        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
          style={{
            border: '1.5px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          Start Earning as a Tasker
        </button>
      </div>

    
      <div className="flex items-center justify-center gap-2 opacity-80">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--color-accent)' }}
        >
          <Zap size={16} color="#fff" fill="#fff" />
        </span>
        <span className="font-display font-bold text-lg">
          Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
        </span>
      </div>

    </div>
  </div>
        </section> */}

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-4 "
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <ArrowLeft size={16} />
            Back to home
          </button>

          {/* Mobile logo */}
          {/* <Link to="/" className="lg:hidden flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
            >
              <Zap size={14} color="#fff" fill="#fff" />
            </span>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
            </span>
          </Link> */}

          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button> */}
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full  p-6 rounded-2xl max-w-[480px]">
            {/* Header */}
            <div className="mb-8">
              <h1
                className="font-display font-bold text-3xl mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {mode === 'login'
                  ? 'Sign in to manage your tasks and earnings.'
                  : 'Join 50,000+ people getting things done on Taskly.'}
              </p>
            </div>

            {/* Mode tabs */}
            <div
              className="flex rounded-xl p-1 mb-6"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            >
              {(['login', 'signup'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize"
                  style={{
                    background: mode === m ? 'var(--color-surface)' : 'transparent',
                    color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {m === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Role selector (sign up only) */}
            {mode === 'signup' && (
              <div className="mb-5">
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
                  I want to…
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'poster', label: 'Post Tasks', sub: 'I need work done' },
                    { value: 'tasker', label: 'Be a Tasker', sub: 'I want to earn' },
                  ].map(({ value, label, sub }) => (
                    <button
                      key={value}
                      onClick={() => setRole(value as 'poster' | 'tasker')}
                      className="rounded-xl p-3.5 text-left transition-all duration-200"
                      style={{
                        background: role === value ? 'var(--color-surface)' : 'var(--color-surface-2)',
                        border: role === value ? '2px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <div className="font-semibold text-sm">{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-5"
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            >
              {googleLoading ? (
                <span
                  className="w-4 h-4 border-2 rounded-full animate-spin border-t-transparent"
                  style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
                />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>or continue with email</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label
                    className="text-xs font-semibold block mb-1.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--color-text-muted)' }}
                    />
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'var(--color-surface)',
                        border: '1.5px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  className="text-xs font-semibold block mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1.5px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="text-xs font-semibold"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <a
                      href="#"
                      className="text-xs transition-colors"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1.5px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 w-4 h-4 rounded"
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    I agree to Taskly's{' '}
                    <a href="#" style={{ color: 'var(--color-accent)' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: 'var(--color-accent)' }}>Privacy Policy</a>
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-accent-fg)',
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--color-accent-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
              >
                {loading ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                    />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p
              className="text-center text-xs mt-6"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-semibold"
                style={{ color: 'var(--color-accent)' }}
              >
                {mode === 'login' ? 'Sign up free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}