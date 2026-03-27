import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Lock, CheckCircle2, ArrowRight, Wallet } from 'lucide-react'

export default function SetupWallet() {
  const navigate = useNavigate()

  const [bvn, setBvn] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (bvn.length !== 10) {
      setError('BVN must be exactly 10 digits')
      return
    }

    setError('')
    setLoading(true)

    // simulate verification
    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="max-w-[480px] w-full glass-card p-8 rounded-3xl text-center border border-[var(--color-border)]">

        {/* ICON */}
        <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
          <Wallet color="white" size={32} />
        </div>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <>
            <h1 className="text-2xl font-display font-bold mb-3">
              Set up your Taskly Wallet
            </h1>

            <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed">
              To send, receive, and withdraw money, we need to verify your identity.
              Your BVN helps ensure secure transactions and accountability between users.
            </p>

            {/* SECURITY FEATURES */}
            <div className="space-y-4 mb-6 text-left">
              {[
                { icon: <Shield size={18} />, title: 'Verified Identity', desc: 'Ensures every Tasker is traceable and trusted.' },
                { icon: <Lock size={18} />, title: 'Secure Payments', desc: 'Funds are protected with encrypted escrow system.' }
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]"
                >
                  <div className="text-[var(--color-accent)]">{item.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold">{item.title}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BVN INPUT */}
            <div className="mb-6 text-left">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-2">
                Enter your 10-digit BVN
              </label>

              <input
                type="text"
                value={bvn}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setBvn(value)
                }}
                maxLength={10}
                placeholder="e.g. 1234567890"
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              />

              {error && (
                <p className="text-xs mt-2 text-red-500">{error}</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold bg-[var(--color-accent)] text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify & Activate Wallet <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="mt-4 text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-medium">
              BVN is encrypted and never stored publicly
            </p>
          </>
        )}

        {/* STEP 2: SUCCESS */}
        {step === 'success' && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>

            <h2 className="text-xl font-bold mb-2">
              Wallet Activated
            </h2>

            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Your wallet is now ready. You can fund your account, receive payments,
              and withdraw securely.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 rounded-xl font-bold bg-[var(--color-accent)] text-white hover:opacity-90 transition-all"
            >
              Continue to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  )
}