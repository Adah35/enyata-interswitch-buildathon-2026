// ─────────────────────────────────────────────────────────────────────────────
// wallet/WalletAtoms.tsx  — tiny reusable components used across wallet files
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import type { TxStatus } from '../api/walletUtils'

// ── StatusPill ────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<TxStatus, { l: string; c: string; bg: string }> = {
  completed: { l: 'Completed', c: '#10b981', bg: '#10b98115' },
  pending:   { l: 'Pending',   c: '#f59e0b', bg: '#f59e0b15' },
  failed:    { l: 'Failed',    c: '#ef4444', bg: '#ef444415' },
}

export function StatusPill({ status }: { status: TxStatus }) {
  const s = STATUS_MAP[status]
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
      style={{ color: s.c, background: s.bg }}>
      {s.l}
    </span>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────

export function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string; icon: React.ElementType; color: string
}) {
  return (
    <div className="glass-card rounded-2xl p-5" style={{ border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div className="font-display font-bold text-2xl"
        style={{ color: 'var(--color-text-primary)' }}>
        {value}
      </div>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>}
    </div>
  )
}

// ── WalletField ───────────────────────────────────────────────────────────────

export function WalletField({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1.5"
        style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>
      )}
    </div>
  )
}

// ── WalletInput ───────────────────────────────────────────────────────────────

export function WalletInput({ value, onChange, placeholder, type = 'text', maxLength, icon: Icon, disabled, rightSlot }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  maxLength?: number
  icon?: React.ElementType
  disabled?: boolean
  rightSlot?: React.ReactNode
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="relative">
      {Icon && (
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--color-text-muted)' }} />
      )}
      <input
        type={isPassword && show ? 'text' : type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="w-full py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          paddingLeft: Icon ? '2.5rem' : '1rem',
          paddingRight: isPassword || rightSlot ? '2.75rem' : '1rem',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          opacity: disabled ? 0.6 : 1,
        }}
        onFocus={e => !disabled && (e.currentTarget.style.borderColor = 'var(--color-accent)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--color-text-muted)' }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
      {rightSlot && !isPassword && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  )
}

// ── ModalShell ────────────────────────────────────────────────────────────────

export function ModalShell({ onClose, children, narrow = false }: {
  onClose: () => void; children: React.ReactNode; narrow?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <div
        className={`w-full rounded-3xl p-6 ${narrow ? 'max-w-md' : 'max-w-lg'}`}
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ── ModalHeader ───────────────────────────────────────────────────────────────

export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-display font-bold text-xl" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg transition-all"
        style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
        Cancel
      </button>
    </div>
  )
}

// ── SuccessView ───────────────────────────────────────────────────────────────

export function SuccessView({ title, desc, onDone }: {
  title: string; desc: string; onDone: () => void
}) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: '#10b98115' }}>
        <span style={{ fontSize: 32 }}>✓</span>
      </div>
      <h3 className="font-display font-bold text-xl mb-2"
        style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      <button onClick={onDone} className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{ background: 'var(--color-accent)', color: '#fff' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}>
        Done
      </button>
    </div>
  )
}

// ── SubmitButton ──────────────────────────────────────────────────────────────

export function SubmitButton({ loading, disabled, children }: {
  loading: boolean; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button type="submit" disabled={loading || disabled}
      className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-2"
      style={{ background: 'var(--color-accent)', color: '#fff', opacity: loading || disabled ? 0.65 : 1 }}
      onMouseEnter={e => !(loading || disabled) && (e.currentTarget.style.background = 'var(--color-accent-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}>
      {loading ? <><Loader2 size={16} className="animate-spin" />Processing…</> : children}
    </button>
  )
}

// ── InfoBanner ────────────────────────────────────────────────────────────────

export function InfoBanner({ icon: Icon, color, children }: {
  icon: React.ElementType; color: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-xl px-4 py-3 flex items-start gap-2"
      style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
      <Icon size={14} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{children}</p>
    </div>
  )
}