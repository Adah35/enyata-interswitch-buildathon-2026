// ─────────────────────────────────────────────────────────────────────────────
// pages/WalletPage.tsx
// Responsive wallet page aligned with simplified BVN → Bank flow
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import {
  Wallet,
  Clock,
  Shield,
  Landmark,
  Zap,
  TrendingUp,
  Banknote,
  CreditCard,
  Copy,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  BadgeCheck,
} from 'lucide-react'
import Navbar from '../components/NavBar'
import { StatCard, StatusPill } from '../components/WalletAtoms'
import { DepositModal, WithdrawModal } from '../components/WalletModals'
import {
  fmtNaira,
  fmtDate,
  TX_META,
  MOCK_WALLET,
  MOCK_TRANSACTIONS,
  type TxType,
} from '../api/walletUtils'

type Filter = 'all' | TxType

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'task_received', label: 'Received' },
  { key: 'task_funded', label: 'Funded' },
  { key: 'deposit', label: 'Deposits' },
  { key: 'withdrawal', label: 'Withdrawals' },
  { key: 'refund', label: 'Refunds' },
  { key: 'fee', label: 'Fees' },
]

export default function WalletPage() {
  const wallet = MOCK_WALLET
  const [filter, setFilter] = useState<Filter>('all')
  const [modal, setModal] = useState<'deposit' | 'withdraw' | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const txs = filter === 'all'
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter(t => t.type === filter)

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref).catch(() => {})
    setCopied(ref)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <Navbar variant="app" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>
                Wallet
              </h1>
              {wallet.verified && (
                <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full mt-1 sm:mt-0"
                  style={{ background: '#10b98115', color: '#10b981', border: '1px solid #10b98130' }}>
                  <BadgeCheck size={13} /> Verified
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Manage your earnings, escrow, and payouts
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setModal('deposit')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all w-full sm:w-auto"
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
            >
              <PlusCircle size={16} /> Add Money
            </button>

            <button
              onClick={() => setModal('withdraw')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all w-full sm:w-auto"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
            >
              <Banknote size={16} /> Withdraw
            </button>
          </div>
        </div>

        {/* Balance Hero - Responsive */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}>
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)' }} />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={18} style={{ color: 'var(--color-accent)' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Available Balance
                </span>
              </div>
              <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tighter"
                style={{ color: 'var(--color-text-primary)' }}>
                {fmtNaira(wallet.available)}
              </div>
              <div className="flex items-center gap-1.5 text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={14} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b' }}>{fmtNaira(wallet.escrow)}</span>
                <span>in escrow</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield size={16} style={{ color: '#10b981' }} />
                <span>Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark size={16} style={{ color: 'var(--color-accent)' }} />
                <span>{wallet.bankName} ••••{wallet.bankLast4}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: '#f59e0b' }} />
                <span>Instant withdrawal available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Earned" value={fmtNaira(wallet.earned)} sub="Lifetime" icon={TrendingUp} color="#10b981" />
          <StatCard label="In Escrow" value={fmtNaira(wallet.escrow)} sub="Locked" icon={Clock} color="#f59e0b" />
          <StatCard label="Withdrawn" value={fmtNaira(wallet.withdrawn)} sub="To bank" icon={Banknote} color="#8b5cf6" />
          <StatCard label="Spent" value={fmtNaira(wallet.spent)} sub="On tasks" icon={CreditCard} color="#3b82f6" />
        </div>

        {/* Transaction History */}
        <div className="glass-card rounded-3xl overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="px-5 py-5 border-b flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-display font-semibold text-xl" style={{ color: 'var(--color-text-primary)' }}>
              Transactions
            </h2>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="text-xs px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap"
                  style={{
                    background: filter === key ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    color: filter === key ? '#fff' : 'var(--color-text-muted)',
                    border: `1px solid ${filter === key ? 'transparent' : 'var(--color-border)'}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {txs.length === 0 ? (
            <div className="py-20 text-center" style={{ color: 'var(--color-text-muted)' }}>
              <Wallet size={32} className="mx-auto mb-4 opacity-40" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {txs.map((tx, i) => {
                const { icon: Icon, color, bg } = TX_META[tx.type]
                const isCredit = tx.amount > 0

                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 px-5 py-5 hover:bg-[var(--color-surface-2)] transition-all"
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: bg, color }}>
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {tx.label}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{tx.sub}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {fmtDate(tx.date)}
                      </p>
                    </div>

                    {tx.ref && (
                      <button
                        onClick={() => copyRef(tx.ref!)}
                        className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg border transition-all"
                        style={{
                          background: 'var(--color-surface-2)',
                          borderColor: copied === tx.ref ? '#10b981' : 'var(--color-border)',
                          color: copied === tx.ref ? '#10b981' : 'var(--color-text-muted)',
                        }}
                      >
                        {copied === tx.ref ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                        {tx.ref}
                      </button>
                    )}

                    <div className="hidden sm:block">
                      <StatusPill status={tx.status} />
                    </div>

                    <div className="font-display font-bold text-right text-sm sm:text-base flex-shrink-0 ml-auto"
                      style={{ color: isCredit ? '#10b981' : 'var(--color-text-primary)', minWidth: '80px' }}>
                      {isCredit ? '+' : ''}{fmtNaira(tx.amount)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Escrow Info */}
        <div className="mt-8 rounded-3xl p-6 flex flex-col sm:flex-row gap-4 items-start"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Shield size={24} style={{ color: '#3b82f6', flexShrink: 0 }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>
              How payments work on Taskly
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              When you post a task, funds are held in escrow. Once the task is completed and approved,
              money is released to the Tasker. You can withdraw anytime to your linked bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'deposit' && <DepositModal onClose={() => setModal(null)} />}
      {modal === 'withdraw' && (
        <WithdrawModal
          available={wallet.available}
          bankName={wallet.bankName}
          bankLast4={wallet.bankLast4}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}