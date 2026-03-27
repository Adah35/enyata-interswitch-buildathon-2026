import { X, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, History, Shield } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { Button } from './ui';

export default function WalletPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { balance, transactions } = useWallet();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--color-surface)] z-[120] shadow-2xl flex flex-col border-l border-[var(--color-border)] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WalletIcon size={20} className="text-[var(--color-accent)]" />
            <h2 className="font-display font-bold text-xl">My Wallet</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-surface-2)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-6">
          <div className="rounded-2xl p-8 text-white relative overflow-hidden" 
               style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #6366f1 100%)' }}>
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">Available Balance</p>
              <h3 className="text-4xl font-bold">${balance.toLocaleString()}</h3>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="secondary" className="w-full gap-2 text-xs">
              <ArrowDownLeft size={14} /> Deposit
            </Button>
            <Button variant="secondary" className="w-full gap-2 text-xs">
              <ArrowUpRight size={14} /> Withdraw
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <History size={14} /> Recent Activity
            </h4>
            <button className="text-xs text-[var(--color-accent)] font-semibold">View All</button>
          </div>

          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="p-3 rounded-xl border border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-2)]">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type.includes('received') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.type.includes('received') ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{tx.label}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{tx.date}</p>
                  </div>
                </div>
                <p className={`text-xs font-bold ${tx.type.includes('received') ? 'text-green-500' : 'text-[var(--color-text-primary)]'}`}>
                  {tx.type.includes('received') ? '+' : '-'}${tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Footer */}
        <div className="p-6 bg-[var(--color-surface-2)] border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
            <Shield size={14} className="text-green-500" />
            <p>Funds are secured by Taskly Escrow Protection. Payments are only released upon your approval.</p>
          </div>
        </div>
      </div>
    </>
  );
}