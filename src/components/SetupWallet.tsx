import { useState } from 'react'
import {
  
  CheckCircle2,
  ArrowRight,
  Wallet,
 
  Loader2,
} from 'lucide-react'

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

  // Step 1: BVN Verification
  const handleVerifyBVN = () => {
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

  // Step 2: Bank Details + Resolve Account
  const handleResolveAccount = () => {
    if (accountNumber.length !== 10 || !bankName) {
      setError('Please enter valid bank details')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      setAccountName('Chukwuemeka Adaobi') // Mock resolved name
      setLoading(false)
      setStep('recipient')
    }, 1500)
  }

  // Step 3: Create Transfer Recipient
  const handleCreateRecipient = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="max-w-[480px] w-full rounded-3xl glass-card p-8 border border-[var(--color-border)]">

        {/* Header Icon */}
        <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wallet color="white" size={32} />
        </div>

        {/* BVN Step */}
        {step === 'bvn' && (
          <>
            <h1 className="text-2xl font-display font-bold text-center mb-2">Set up your Taskly Wallet</h1>
            <p className="text-center text-[var(--color-text-secondary)] text-sm mb-8">
              Enter your BVN to verify your identity and activate payments.
            </p>

            <div className="mb-6">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-2">
                10-digit BVN
              </label>
              <input
                type="text"
                value={bvn}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setBvn(val)
                  setError('')
                }}
                maxLength={10}
                placeholder="1234567890"
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              onClick={handleVerifyBVN}
              disabled={loading || bvn.length !== 10}
              className="w-full py-4 rounded-2xl font-semibold bg-[var(--color-accent)] text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Verifying BVN...
                </>
              ) : (
                <>
                  Verify BVN <ArrowRight size={18} />
                </>
              )}
            </button>
          </>
        )}

        {/* Bank Details Step */}
        {step === 'bank' && (
          <>
            <h1 className="text-2xl font-display font-bold text-center mb-2">Link your Bank Account</h1>
            <p className="text-center text-[var(--color-text-secondary)] text-sm mb-8">
              Enter your bank details. We'll automatically resolve your account name.
            </p>

            <div className="space-y-5 mb-8">
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-2">Bank Name</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1.5px solid var(--color-border)',
                    color: bankName ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  <option value="">Select Bank</option>
                  <option value="GTBank">GTBank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="First Bank">First Bank</option>
                  <option value="UBA">UBA</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-2">Account Number (10 digits)</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setAccountNumber(val)
                    setError('')
                  }}
                  maxLength={10}
                  placeholder="0123456789"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              {accountName && (
                <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Account Resolved</p>
                    <p className="text-sm font-bold">{accountName}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleResolveAccount}
              disabled={loading || accountNumber.length !== 10 || !bankName}
              className="w-full py-4 rounded-2xl font-semibold bg-[var(--color-accent)] text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Resolving Account...
                </>
              ) : (
                <>
                  Continue <ArrowRight size={18} />
                </>
              )}
            </button>
          </>
        )}

        {/* Create Transfer Recipient Step */}
        {step === 'recipient' && (
          <>
            <div className="text-center mb-8">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-1">Account Verified</h2>
              <p className="text-[var(--color-text-secondary)]">Creating secure transfer recipient...</p>
            </div>

            <button
              onClick={handleCreateRecipient}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold bg-[var(--color-accent)] text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Creating Recipient...
                </>
              ) : (
                'Create Transfer Recipient'
              )}
            </button>
          </>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <>
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 size={42} className="text-green-500" />
              </div>

              <h2 className="text-2xl font-display font-bold mb-3">Wallet Ready! 🎉</h2>
              <p className="text-[var(--color-text-secondary)] mb-8">
                Your wallet has been successfully activated.<br />
                You can now post tasks, receive payments, and withdraw funds.
              </p>

              <button
                onClick={onComplete}
                className="w-full py-4 rounded-2xl font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-all"
              >
                Continue to Dashboard
              </button>
            </div>
          </>
        )}

        {/* Dismiss Button */}
        {step !== 'success' && (
          <button
            onClick={onDismiss}
            className="mt-6 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Cancel Setup
          </button>
        )}
      </div>
    </div>
  )
}