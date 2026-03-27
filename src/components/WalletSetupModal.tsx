// ─────────────────────────────────────────────────────────────────────────────
// wallet/WalletSetupModal.tsx
// Post-login modal — BVN → NIN → Selfie → Bank → Done
// Appears automatically for unverified users; dismissable with limited access
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import {
  Shield, User, Camera, Landmark, CheckCircle2,
  ChevronRight, Phone, Lock, AlertCircle, Loader2, BadgeCheck, X,
} from 'lucide-react'
import {
  ModalShell, WalletField, WalletInput, SubmitButton, InfoBanner,
} from './WalletAtoms'
import { NIGERIAN_BANKS, type SetupStep } from '../api/walletUtils'

// ── Step progress bar ─────────────────────────────────────────────────────────

const STEPS: { key: SetupStep; label: string; icon: React.ElementType }[] = [
  { key: 'identity', label: 'Identity', icon: User },
  { key: 'selfie',   label: 'Selfie',   icon: Camera },
  { key: 'bank',     label: 'Bank',     icon: Landmark },
]

function StepBar({ current }: { current: SetupStep | 'review' | 'done' }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="flex items-center gap-1 mb-6">
      {STEPS.map((s, i) => {
        const done = idx > i
        const active = idx === i
        const Icon = s.icon
        return (
          <div key={s.key} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: done ? '#10b98118' : active ? 'var(--color-accent)18' : 'var(--color-surface-2)',
                  border: `2px solid ${done ? '#10b981' : active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  color: done ? '#10b981' : active ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}>
                {done ? <CheckCircle2 size={14} /> : <Icon size={13} />}
              </div>
              <span className="text-xs font-medium"
                style={{ color: active ? 'var(--color-accent)' : done ? '#10b981' : 'var(--color-text-muted)' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mt-[-14px]"
                style={{ background: done ? '#10b981' : 'var(--color-border)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Identity step ─────────────────────────────────────────────────────────────

function IdentityStep({ onNext }: { onNext: () => void }) {
  const [bvn, setBvn] = useState('')
  const [nin, setNin] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)

  const valid = bvn.length === 11 && nin.length === 11 && phone.length >= 10 && dob

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setLoading(false)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <WalletField label="BVN (Bank Verification Number)"
        hint="11-digit number · dial *565*0# on your bank line">
        <WalletInput value={bvn} onChange={v => setBvn(v.replace(/\D/g, '').slice(0, 11))}
          placeholder="22XXXXXXXXX" type="password" maxLength={11} icon={Lock} />
      </WalletField>

      <WalletField label="NIN (National Identity Number)"
        hint="11-digit NIN from your national ID card or NIMC app">
        <WalletInput value={nin} onChange={v => setNin(v.replace(/\D/g, '').slice(0, 11))}
          placeholder="XXXXXXXXXXX" type="password" maxLength={11} icon={Lock} />
      </WalletField>

      <WalletField label="Phone Number" hint="Must match the number on your BVN">
        <WalletInput value={phone} onChange={setPhone}
          placeholder="+234 800 000 0000" type="tel" icon={Phone} />
      </WalletField>

      <WalletField label="Date of Birth" hint="Must match your NIN records">
        <WalletInput value={dob} onChange={setDob} type="date" icon={User} />
      </WalletField>

      <InfoBanner icon={AlertCircle} color="#f59e0b">
        Providing false information violates Taskly's Terms and Nigerian financial law.
        Your data is encrypted and never shared with other users.
      </InfoBanner>

      <SubmitButton loading={loading} disabled={!valid}>
        Verify Identity <ChevronRight size={15} />
      </SubmitButton>
    </form>
  )
}

// ── Selfie step ───────────────────────────────────────────────────────────────

function SelfieStep({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)
  const [passed, setPassed] = useState(false)

  async function handleCapture() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setPassed(true)
    setTimeout(onNext, 600)
  }

  return (
    <div className="space-y-4">
      {/* Camera box */}
      <div
        className="rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
        style={{
          height: 240,
          background: passed ? '#10b98110' : 'var(--color-surface)',
          border: `2px dashed ${passed ? '#10b981' : 'var(--color-border)'}`,
        }}
        onClick={!loading && !passed ? handleCapture : undefined}
      >
        {passed ? (
          <>
            <CheckCircle2 size={44} style={{ color: '#10b981' }} />
            <p className="text-sm font-semibold" style={{ color: '#10b981' }}>Liveness check passed ✓</p>
          </>
        ) : loading ? (
          <>
            <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Running liveness check…</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-surface-2)', border: '2px dashed var(--color-border)' }}>
              <Camera size={28} style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Tap to open camera
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Good lighting · Face visible · No glasses
            </p>
          </>
        )}
      </div>

      <div className="space-y-1.5">
        {['Face fully visible', 'Good lighting, no shadows', 'Remove glasses / hats if possible', 'Hold phone steady'].map(t => (
          <div key={t} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-accent)' }} />
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t}</p>
          </div>
        ))}
      </div>

      {!passed && !loading && (
        <button onClick={handleCapture}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{ background: 'var(--color-accent)', color: '#fff' }}>
          <Camera size={15} /> Take Selfie
        </button>
      )}
    </div>
  )
}

// ── Bank step ─────────────────────────────────────────────────────────────────

function BankStep({ onNext }: { onNext: (name: string, last4: string, bank: string) => void }) {
  const [bankName, setBankName] = useState('')
  const [accNum, setAccNum] = useState('')
  const [accName, setAccName] = useState('')
  const [resolving, setResolving] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAccNumChange(v: string) {
    const cleaned = v.replace(/\D/g, '').slice(0, 10)
    setAccNum(cleaned)
    setAccName('')
    if (cleaned.length === 10 && bankName) {
      setResolving(true)
      await new Promise(r => setTimeout(r, 1200))
      setAccName('Chukwuemeka Adaobi') // mock resolved name
      setResolving(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    onNext(accName, accNum.slice(-4), bankName)
  }

  const valid = bankName && accNum.length === 10 && !!accName

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <WalletField label="Bank Name">
        <div className="relative">
          <Landmark size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-text-muted)' }} />
          <select value={bankName} onChange={e => setBankName(e.target.value)} required
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
            style={{
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              color: bankName ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
            <option value="">Select your bank</option>
            {NIGERIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </WalletField>

      <WalletField label="Account Number (10-digit NUBAN)">
        <WalletInput value={accNum} onChange={handleAccNumChange}
          placeholder="0123456789" maxLength={10} icon={Lock}
          rightSlot={resolving ? <Loader2 size={13} className="animate-spin" style={{ color: 'var(--color-accent)' }} /> : undefined} />
      </WalletField>

      {accName && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-2"
          style={{ background: '#10b98110', border: '1px solid #10b98130' }}>
          <CheckCircle2 size={14} style={{ color: '#10b981' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#10b981' }}>Account confirmed</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--color-text-primary)' }}>{accName}</p>
          </div>
        </div>
      )}

      <InfoBanner icon={Lock} color="#3b82f6">
        Account name must match your verified NIN/BVN identity.
        Mismatches are rejected for fraud prevention.
      </InfoBanner>

      <SubmitButton loading={loading} disabled={!valid}>
        Link Bank Account <ChevronRight size={15} />
      </SubmitButton>
    </form>
  )
}

// ── Review step ───────────────────────────────────────────────────────────────

function ReviewStep({ bankName, bankLast4, phone, onConfirm }: {
  bankName: string; bankLast4: string; phone: string; onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    onConfirm()
  }

  const rows = [
    { icon: User,     label: 'BVN & NIN Verified', sub: phone, color: '#10b981' },
    { icon: Camera,   label: 'Selfie Confirmed',    sub: 'Liveness check passed', color: '#10b981' },
    { icon: Landmark, label: bankName,               sub: `****${bankLast4}`, color: '#10b981' },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 space-y-3"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        {rows.map(({ icon: Icon, label, sub, color }, i) => (
          <div key={label}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>
              </div>
              <CheckCircle2 size={15} style={{ color }} />
            </div>
            {i < rows.length - 1 && <hr className="mt-3" style={{ borderColor: 'var(--color-border)' }} />}
          </div>
        ))}
      </div>

      <InfoBanner icon={AlertCircle} color="#f59e0b">
        By activating your wallet you confirm all information is accurate. Providing false details
        may result in permanent account suspension under Nigerian law.
      </InfoBanner>

      <button onClick={handleConfirm} disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        style={{ background: 'var(--color-accent)', color: '#fff', opacity: loading ? 0.65 : 1 }}>
        {loading ? <><Loader2 size={15} className="animate-spin" />Activating…</> : <><Shield size={15} />Activate Wallet</>}
      </button>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface WalletSetupModalProps {
  onComplete: () => void   // called when wallet is fully set up
  onDismiss: () => void    // called when user skips
}

export default function WalletSetupModal({ onComplete, onDismiss }: WalletSetupModalProps) {
  const [step, setStep] = useState<SetupStep | 'intro' | 'done'>('intro')
  const [phone, setPhone] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankLast4, setBankLast4] = useState('')

  const stepTitles: Record<string, string> = {
    intro: 'Set Up Your Wallet',
    identity: 'Verify Identity',
    selfie: 'Selfie Check',
    bank: 'Link Bank Account',
    review: 'Review & Confirm',
  }

  return (
    <ModalShell onClose={onDismiss}>
      {/* Close (skip) button */}
      {step !== 'done' && (
        <button onClick={onDismiss}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
          <X size={14} />
        </button>
      )}

      {/* ── INTRO ── */}
      {step === 'intro' && (
        <div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'var(--color-accent)15', border: '2px solid var(--color-accent)30' }}>
            <Shield size={30} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2"
            style={{ color: 'var(--color-text-primary)' }}>Set Up Your Wallet</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Verify your identity to send, receive, and withdraw money. Every person on Taskly must be
            traceable — this keeps payments safe for everyone.
          </p>

          <div className="rounded-2xl p-4 mb-5 space-y-3"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: 'var(--color-text-muted)' }}>What you'll need</p>
            {[
              { icon: Lock,     text: 'BVN — your Bank Verification Number' },
              { icon: BadgeCheck, text: 'NIN — your National Identity Number' },
              { icon: Camera,   text: 'Selfie / liveness check' },
              { icon: Landmark, text: 'Nigerian bank account for payouts' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={13} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{text}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setStep('identity')}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--color-accent)', color: '#fff' }}>
            Start Verification <ChevronRight size={15} />
          </button>
          <button onClick={onDismiss}
            className="w-full mt-2 py-2.5 text-xs transition-all"
            style={{ color: 'var(--color-text-muted)' }}>
            Skip for now — limited access
          </button>
        </div>
      )}

      {/* ── STEPS ── */}
      {(['identity', 'selfie', 'bank', 'review'] as const).includes(step as any) && step !== 'done' && (
        <div>
          <StepBar current={step as SetupStep | 'review'} />
          <h2 className="font-display font-bold text-xl mb-4"
            style={{ color: 'var(--color-text-primary)' }}>
            {stepTitles[step]}
          </h2>

          {step === 'identity' && (
            <IdentityStep onNext={() => setStep('selfie')} />
          )}
          {step === 'selfie' && (
            <SelfieStep onNext={() => setStep('bank')} />
          )}
          {step === 'bank' && (
            <BankStep onNext={(name, last4, bank) => {
              setBankName(bank)
              setBankLast4(last4)
              setStep('review')
            }} />
          )}
          {step === 'review' && (
            <ReviewStep
              bankName={bankName}
              bankLast4={bankLast4}
              phone="+234 812 345 6789"
              onConfirm={() => setStep('done')}
            />
          )}
        </div>
      )}

      {/* ── DONE ── */}
      {step === 'done' && (
        <div className="text-center py-4">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: '#10b98115', border: '2px solid #10b98130' }}>
            <CheckCircle2 size={40} style={{ color: '#10b981' }} />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Wallet Ready! 🎉
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Your identity is verified and your bank account is linked.
            You can now receive task payments, deposit, and withdraw.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {['Identity ✓', 'Selfie ✓', 'Bank ✓'].map(l => (
              <div key={l} className="rounded-xl py-2.5 text-xs font-semibold text-center"
                style={{ background: '#10b98110', color: '#10b981', border: '1px solid #10b98130' }}>
                {l}
              </div>
            ))}
          </div>
          <button onClick={onComplete}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--color-accent)', color: '#fff' }}>
            Go to Wallet <ChevronRight size={15} />
          </button>
        </div>
      )}
    </ModalShell>
  )
}