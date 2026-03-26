// ─── Shared UI primitives ─────────────────────────────────────────────────────
import { Loader2 } from 'lucide-react'
import type { TaskStatus } from '../../api/mockApi'

// ── StatusBadge ───────────────────────────────────────────────────────────────
const STATUS_META: Record<TaskStatus | string, { color: string; label: string }> = {
  OPEN:           { color: '#3b82f6', label: 'Open' },
  BIDDING:        { color: '#f59e0b', label: 'Bidding' },
  ASSIGNED:       { color: '#8b5cf6', label: 'Assigned' },
  IN_PROGRESS:    { color: '#f97316', label: 'In Progress' },
  PENDING_REVIEW: { color: '#ec4899', label: 'Review' },
  COMPLETED:      { color: '#10b981', label: 'Completed' },
  DISPUTED:       { color: '#ef4444', label: 'Disputed' },
  CANCELLED:      { color: '#94a3b8', label: 'Cancelled' },
}

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { color: '#94a3b8', label: status }
  return (
    <span
      className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
      style={{
        background: `${meta.color}18`,
        color: meta.color,
        border: `1px solid ${meta.color}30`,
      }}
    >
      {meta.label}
    </span>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({
  initials,
  size = 36,
  color = 'var(--color-accent)',
}: {
  initials: string
  size?: number
  color?: string
}) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        color: '#fff',
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  )
}

// ── StarRating ────────────────────────────────────────────────────────────────
export function StarRating({
  rating,
  size = 13,
}: {
  rating: number
  size?: number
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span
        className="text-xs ml-1 font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <Loader2
      size={size}
      className="animate-spin"
      style={{ color: 'var(--color-accent)' }}
    />
  )
}

// ── LoadingScreen ─────────────────────────────────────────────────────────────
export function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-background)' }}
    >
      <Spinner size={32} />
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      >
        {icon}
      </div>
      <h3
        className="font-semibold text-lg mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-xs mb-6"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {description}
      </p>
      {action}
    </div>
  )
}

// ── SectionCard ───────────────────────────────────────────────────────────────
export function SectionCard({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
}: {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  fullWidth?: boolean
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer'

  const sizes = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-sm px-6 py-3.5',
  }

  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: 'var(--color-accent)',
      color: 'var(--color-accent-fg)',
      border: 'none',
    },
    secondary: {
      background: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      border: '1.5px solid var(--color-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
      border: 'none',
    },
    danger: {
      background: '#ef444418',
      color: '#ef4444',
      border: '1px solid #ef444430',
    },
    success: {
      background: '#10b98118',
      color: '#10b981',
      border: '1px solid #10b98130',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        ...variants[variant],
        opacity: disabled || loading ? 0.6 : 1,
      }}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({
  label,
  error,
  leftIcon,
  className = '',
  ...props
}: {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          className="text-xs font-semibold"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
            {leftIcon}
          </div>
        )}
        <input
          {...props}
          className="w-full py-3 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: 'var(--color-surface)',
            border: `1.5px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
            color: 'var(--color-text-primary)',
            paddingLeft: leftIcon ? '2.5rem' : '1rem',
            paddingRight: '1rem',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--color-accent)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--color-border)'
          }}
        />
      </div>
      {error && (
        <span className="text-xs" style={{ color: '#ef4444' }}>
          {error}
        </span>
      )}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({
  label,
  error,
  className = '',
  ...props
}: {
  label?: string
  error?: string
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          className="text-xs font-semibold"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
        style={{
          background: 'var(--color-surface)',
          border: `1.5px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
          color: 'var(--color-text-primary)',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--color-accent)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--color-border)'
        }}
      />
      {error && (
        <span className="text-xs" style={{ color: '#ef4444' }}>
          {error}
        </span>
      )}
    </div>
  )
}

export { STATUS_META }