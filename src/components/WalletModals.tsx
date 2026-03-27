// ─────────────────────────────────────────────────────────────────────────────
// wallet/WalletModals.tsx — Deposit & Withdraw modals (standalone, reusable)
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { PlusCircle, Banknote, Zap } from 'lucide-react'
import { ModalShell, ModalHeader, SuccessView, WalletField, SubmitButton, InfoBanner } from './WalletAtoms'
import { fmtNaira } from '../api/walletUtils'
import { AlertCircle } from 'lucide-react'

// ── Deposit Modal ─────────────────────────────────────────────────────────────

const QUICK_AMOUNTS = [1_000, 5_000, 10_000, 20_000, 50_000]

export function DepositModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'card' | 'transfer'>('card')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <ModalShell onClose={onClose} narrow>
        <SuccessView
          title="Money Added!"
          desc={`₦${Number(amount).toLocaleString()} has been added to your wallet.`}
          onDone={onClose}
        />
      </ModalShell>
    )
  }

  return (
    <ModalShell onClose={onClose} narrow>
      <ModalHeader title="Add Money" onClose={onClose} />

      {/* Method tabs */}
      <div className="flex rounded-xl p-1 mb-5"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        {(['card', 'transfer'] as const).map(k => (
          <button key={k} onClick={() => setMethod(k)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: method === k ? 'var(--color-surface)' : 'transparent',
              color: method === k ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}>
            {k === 'card' ? 'Debit Card' : 'Bank Transfer'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <WalletField label="Amount (₦)">
          <input
            type="number" placeholder="0" value={amount}
            onChange={e => setAmount(e.target.value)}
            min="100" required
            className="w-full px-4 py-3 rounded-xl text-lg font-display font-bold outline-none transition-all"
            style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')} />
          {/* Quick amounts */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {QUICK_AMOUNTS.map(q => (
              <button key={q} type="button" onClick={() => setAmount(String(q))}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: amount === String(q) ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  color: amount === String(q) ? '#fff' : 'var(--color-text-muted)',
                  border: `1px solid ${amount === String(q) ? 'transparent' : 'var(--color-border)'}`,
                }}>
                ₦{q.toLocaleString()}
              </button>
            ))}
          </div>
        </WalletField>

        {method === 'transfer' && (
          <div className="rounded-xl px-4 py-3 space-y-2"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Transfer to your virtual account:
            </p>
            {[['Bank', 'Providus Bank'], ['Account No.', '9971234567'], ['Account Name', 'Taskly / Your Name']].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontFamily: k === 'Account No.' ? 'monospace' : undefined }}>{v}</span>
              </div>
            ))}
            <p className="text-xs pt-1" style={{ color: 'var(--color-text-muted)' }}>Transfers reflect instantly.</p>
          </div>
        )}

        <InfoBanner icon={AlertCircle} color="#3b82f6">
          Funds added here can be used to pay for tasks you post. A 12% platform service fee
          is added at task checkout — not at deposit.
        </InfoBanner>

        <SubmitButton loading={loading} disabled={!amount}>
          <PlusCircle size={15} />
          {method === 'card' ? 'Pay with Card' : "I've Sent the Transfer"}
        </SubmitButton>
      </form>
    </ModalShell>
  )
}

// ── Withdraw Modal ────────────────────────────────────────────────────────────

export function WithdrawModal({ available, bankName, bankLast4, onClose }: {
  available: number
  bankName: string
  bankLast4: string
  onClose: () => void
}) {
  const [amount, setAmount] = useState('')
  const [instant, setInstant] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const kobo = Math.round(parseFloat(amount || '0') * 100)
  const fee  = instant ? Math.round(kobo * 0.015) : 0
  const net  = kobo - fee
  const valid = kobo >= 10_000 && kobo <= available

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <ModalShell onClose={onClose} narrow>
        <SuccessView
          title="Withdrawal Sent!"
          desc={`${fmtNaira(net)} is on its way to your ${bankName} account. Arrives ${instant ? 'in minutes' : 'within 1–2 business days'}.`}
          onDone={onClose}
        />
      </ModalShell>
    )
  }

  return (
    <ModalShell onClose={onClose} narrow>
      <ModalHeader title="Withdraw" onClose={onClose} />

      {/* Balance row */}
      <div className="rounded-xl px-4 py-3 mb-5 flex items-center justify-between"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        <div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Available</p>
          <p className="font-bold text-sm" style={{ color: '#10b981' }}>{fmtNaira(available)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Sending to</p>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
            {bankName} ****{bankLast4}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <WalletField label="Amount (₦) — min ₦100">
          <input type="number" placeholder="0" value={amount}
            onChange={e => setAmount(e.target.value)}
            min="100" max={available / 100} required
            className="w-full px-4 py-3 rounded-xl text-lg font-display font-bold outline-none transition-all"
            style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')} />
        </WalletField>

        {/* Instant payout toggle */}
        <label className="flex items-center justify-between rounded-xl px-4 py-3.5 cursor-pointer transition-all"
          style={{
            background: instant ? 'var(--color-accent)10' : 'var(--color-surface-2)',
            border: `1.5px solid ${instant ? 'var(--color-accent)' : 'var(--color-border)'}`,
          }}>
          <div>
            <div className="flex items-center gap-2">
              <Zap size={13} style={{ color: '#f59e0b' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Instant Payout</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Arrives in minutes · +1.5% fee</p>
          </div>
          <input type="checkbox" checked={instant} onChange={e => setInstant(e.target.checked)}
            className="w-4 h-4" style={{ accentColor: 'var(--color-accent)' }} />
        </label>

        {/* Summary */}
        {kobo > 0 && (
          <div className="rounded-xl px-4 py-3 space-y-1.5 text-xs"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <div className="flex justify-between" style={{ color: 'var(--color-text-muted)' }}>
              <span>Amount</span><span>{fmtNaira(kobo)}</span>
            </div>
            {instant && (
              <div className="flex justify-between" style={{ color: '#f59e0b' }}>
                <span>Instant fee (1.5%)</span><span>−{fmtNaira(fee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1"
              style={{ color: 'var(--color-text-primary)', borderTop: '1px solid var(--color-border)' }}>
              <span>You receive</span>
              <span style={{ color: '#10b981' }}>{fmtNaira(net)}</span>
            </div>
          </div>
        )}

        <SubmitButton loading={loading} disabled={!valid}>
          <Banknote size={15} />
          Withdraw {kobo > 0 ? fmtNaira(kobo) : ''}
        </SubmitButton>
      </form>
    </ModalShell>
  )
}