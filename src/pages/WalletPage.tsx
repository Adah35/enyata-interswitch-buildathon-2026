// ─────────────────────────────────────────────────────────────────────────────
// pages/WalletPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import {
  Wallet, Clock, Shield, Landmark, Zap, TrendingUp,
  Banknote, CreditCard, Copy, CheckCircle2, ExternalLink, BadgeCheck, PlusCircle,
} from 'lucide-react'
import Navbar from '../components/NavBar'
import { StatCard, StatusPill } from '../components/WalletAtoms'
import { DepositModal, WithdrawModal } from '../components/WalletModals'
import {
  fmtNaira, fmtDate, TX_META,
  MOCK_WALLET, MOCK_TRANSACTIONS,
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

  const txs = filter === 'all' ? MOCK_TRANSACTIONS : MOCK_TRANSACTIONS.filter(t => t.type === filter)

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref).catch(() => {})
    setCopied(ref)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <Navbar variant="app" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
                Wallet
              </h1>
              {wallet.verified && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#10b98115', color: '#10b981', border: '1px solid #10b98130' }}>
                  <BadgeCheck size={12} /> Verified
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Manage your earnings, escrow, and payouts
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setModal('deposit')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}>
              <PlusCircle size={15} /> Add Money
            </button>
            <button onClick={() => setModal('withdraw')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}>
              <Banknote size={15} /> Withdraw
            </button>
          </div>
        </div>

        {/* Balance hero */}
        <div className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}>
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)' }} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} style={{ color: 'var(--color-accent)' }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Available Balance
                </span>
              </div>
              <div className="font-display font-extrabold text-5xl sm:text-6xl tracking-tight mb-1"
                style={{ color: 'var(--color-text-primary)' }}>
                {fmtNaira(wallet.available)}
              </div>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={13} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b' }}>{fmtNaira(wallet.escrow)}</span>
                <span>locked in escrow</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <div className="flex items-center gap-2"><Shield size={13} style={{ color: '#10b981' }} /><span>Escrow-secured</span></div>
              <div className="flex items-center gap-2"><Landmark size={13} style={{ color: 'var(--color-accent)' }} /><span>{wallet.bankName} · ****{wallet.bankLast4}</span></div>
              <div className="flex items-center gap-2"><Zap size={13} style={{ color: '#f59e0b' }} /><span>Instant withdrawal (+1.5%)</span></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Earned"    value={fmtNaira(wallet.earned)}    sub="Gross lifetime"   icon={TrendingUp} color="#10b981" />
          <StatCard label="In Escrow"       value={fmtNaira(wallet.escrow)}    sub="Awaiting release" icon={Clock}      color="#f59e0b" />
          <StatCard label="Total Withdrawn" value={fmtNaira(wallet.withdrawn)} sub="Sent to bank"      icon={Banknote}   color="#8b5cf6" />
          <StatCard label="Task Spend"      value={fmtNaira(wallet.spent)}     sub="Funded tasks"     icon={CreditCard} color="#3b82f6" />
        </div>

        {/* Transaction history */}
        <div className="glass-card rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b"
            style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-display font-semibold text-lg flex-shrink-0"
              style={{ color: 'var(--color-text-primary)' }}>Transaction History</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {FILTERS.map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                  style={{
                    background: filter === key ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    color: filter === key ? '#fff' : 'var(--color-text-muted)',
                    border: `1px solid ${filter === key ? 'transparent' : 'var(--color-border)'}`,
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {txs.length === 0 ? (
            <div className="py-16 text-center" style={{ color: 'var(--color-text-muted)' }}>
              <Wallet size={28} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No transactions found</p>
            </div>
          ) : (
            txs.map((tx, i) => {
              const { icon: Icon, color, bg } = TX_META[tx.type]
              const isCredit = tx.amount > 0
              return (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-4 transition-all"
                  style={{ borderBottom: i < txs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: bg, color }}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{tx.label}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{tx.sub}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{fmtDate(tx.date)}</p>
                  </div>
                  {tx.ref && (
                    <button onClick={() => copyRef(tx.ref!)}
                      className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all font-mono"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                      {copied === tx.ref ? <CheckCircle2 size={11} /> : <Copy size={11} />} {tx.ref}
                    </button>
                  )}
                  <div className="hidden sm:block"><StatusPill status={tx.status} /></div>
                  <div className="text-sm font-bold flex-shrink-0 text-right"
                    style={{ color: isCredit ? '#10b981' : 'var(--color-text-primary)', minWidth: 88 }}>
                    {isCredit ? '+' : '−'}{fmtNaira(tx.amount)}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Escrow strip */}
        <div className="mt-6 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#3b82f615' }}>
            <Shield size={18} color="#3b82f6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>How task payments work</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              When a task is assigned, the budget is funded from the poster's wallet and locked in escrow.
              On completion, funds are released to the Tasker — ready to withdraw to their bank anytime.
            </p>
          </div>
          <a href="#" className="flex items-center gap-1 text-xs font-semibold flex-shrink-0"
            style={{ color: 'var(--color-accent)' }}>
            Learn more <ExternalLink size={11} />
          </a>
        </div>
      </div>

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