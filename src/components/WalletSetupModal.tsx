// ─────────────────────────────────────────────────────────────────────────────
// wallet/WalletSetupModal.tsx
// Simplified flow: BVN → Bank Details → Resolve Account → Create Recipient → Success
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import {
  Wallet,
  Lock,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import {
  ModalShell,
  WalletField,
  WalletInput,
  SubmitButton,
} from './WalletAtoms'

type Step = 'bvn' | 'bank' | 'recipient' | 'success'

export default function WalletSetupModal({
  onComplete,
  onDismiss,
}: {
  onComplete: () => void
  onDismiss: () => void
}) {
  const [step, setStep] = useState<Step>('bvn')
  const [bvn, setBvn] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Verify BVN
  const handleVerifyBVN = (e: React.FormEvent) => {
    e.preventDefault()
    if (bvn.length !== 10) {
      setError('BVN must be exactly 10 digits')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setStep('bank')
    }, 1800)
  }

  // Step 2: Bank Details + Resolve
  const handleResolveAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankName || accountNumber.length !== 10) {
      setError('Please select a bank and enter a valid 10-digit account number')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      setAccountName('Chukwuemeka Adaobi')
      setLoading(false)
      setStep('recipient')
    }, 1500)
  }

  // Step 3: Create Recipient
  const handleCreateRecipient = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 1300)
  }

  return (
    <ModalShell onClose={onDismiss}>
      {/* Close button */}
      {step !== 'success' && (
        <button
          onClick={onDismiss}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          ✕
        </button>
      )}

      {/* BVN Step */}
      {step === 'bvn' && (
        <form onSubmit={handleVerifyBVN}>
          <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wallet color="white" size={32} />
          </div>

          <h2 className="font-display font-bold text-2xl text-center mb-2">Set Up Your Wallet</h2>
          <p className="text-center text-sm text-[var(--color-text-secondary)] mb-8">
            Enter your BVN to verify your identity and enable secure payments.
          </p>

          <WalletField label="10-digit BVN">
            <WalletInput
              value={bvn}
              onChange={(v) => {
                setBvn(v.replace(/\D/g, '').slice(0, 10))
                setError('')
              }}
              placeholder="1234567890"
              maxLength={10}
              icon={Lock}
            />
          </WalletField>

          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

          <SubmitButton loading={loading} disabled={bvn.length !== 10}>
            Verify BVN <ArrowRight size={15} />
          </SubmitButton>
        </form>
      )}

      {/* Bank Details Step */}
      {step === 'bank' && (
        <form onSubmit={handleResolveAccount}>
          <h2 className="font-display font-bold text-xl mb-6 text-center">Link Your Bank Account</h2>

          <div className="space-y-5">
            <WalletField label="Bank Name">
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                }}
                required
              >
                <option value="">Select your bank</option>
                <option value="GTBank">GTBank</option>
                <option value="Access Bank">Access Bank</option>
                <option value="Zenith Bank">Zenith Bank</option>
                <option value="First Bank">First Bank</option>
                <option value="UBA">UBA</option>
              </select>
            </WalletField>

            <WalletField label="Account Number (10 digits)">
              <WalletInput
                value={accountNumber}
                onChange={(v) => {
                  setAccountNumber(v.replace(/\D/g, '').slice(0, 10))
                  setError('')
                }}
                placeholder="0123456789"
                maxLength={10}
                icon={Lock}
              />
            </WalletField>

            {accountName && (
              <div className="rounded-xl p-4 flex items-center gap-3 bg-green-500/10 border border-green-500/30">
                <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                <div>
                  <p className="text-sm font-medium text-green-600">Account Resolved</p>
                  <p className="font-semibold">{accountName}</p>
                </div>
              </div>
            )}
          </div>

          <SubmitButton loading={loading} disabled={!bankName || accountNumber.length !== 10}>
            Continue <ArrowRight size={15} />
          </SubmitButton>
        </form>
      )}

      {/* Create Transfer Recipient Step */}
      {step === 'recipient' && (
        <form onSubmit={handleCreateRecipient} className="text-center py-8">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Account Verified</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Creating secure transfer recipient for payouts...
          </p>

          <SubmitButton loading={loading}>
            Create Transfer Recipient
          </SubmitButton>
        </form>
      )}

      {/* Success Step */}
      {step === 'success' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 size={42} style={{ color: '#10b981' }} />
          </div>

          <h2 className="font-display font-bold text-2xl mb-3">Wallet Ready! 🎉</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            Your wallet is now fully activated.<br />
            You can post tasks, receive payments, and withdraw funds securely.
          </p>

          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-all"
          >
            Continue to Dashboard
          </button>
        </div>
      )}
    </ModalShell>
  )
}