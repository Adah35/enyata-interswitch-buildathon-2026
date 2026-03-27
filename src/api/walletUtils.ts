// ─────────────────────────────────────────────────────────────────────────────
// wallet/walletUtils.ts  — shared helpers & types for the wallet system
// ─────────────────────────────────────────────────────────────────────────────

export type TxType = 'task_funded' | 'task_received' | 'deposit' | 'withdrawal' | 'refund' | 'fee'
export type TxStatus = 'completed' | 'pending' | 'failed'
export type SetupStep = 'identity' | 'selfie' | 'bank' | 'review'

export interface WalletTransaction {
  id: string
  type: TxType
  label: string
  sub: string
  amount: number   // kobo — positive = credit, negative = debit
  status: TxStatus
  date: Date
  ref?: string
}

export interface WalletState {
  verified: boolean
  available: number   // kobo
  escrow: number
  earned: number
  withdrawn: number
  spent: number
  bankName: string
  bankLast4: string
}

// ── Formatting ────────────────────────────────────────────────────────────────

export function fmtNaira(kobo: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Math.abs(kobo) / 100)
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Transaction meta map ──────────────────────────────────────────────────────

import {
  ArrowDownLeft, ArrowUpRight, Clock,
  PlusCircle, RefreshCw, Info,
} from 'lucide-react'

export const TX_META: Record<TxType, { icon: React.ElementType; color: string; bg: string }> = {
  task_received: { icon: ArrowDownLeft, color: '#10b981', bg: '#10b98115' },
  refund:        { icon: RefreshCw,    color: '#10b981', bg: '#10b98115' },
  deposit:       { icon: PlusCircle,   color: '#3b82f6', bg: '#3b82f615' },
  task_funded:   { icon: Clock,        color: '#f59e0b', bg: '#f59e0b15' },
  withdrawal:    { icon: ArrowUpRight, color: '#8b5cf6', bg: '#8b5cf615' },
  fee:           { icon: Info,         color: '#94a3b8', bg: '#94a3b815' },
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_WALLET: WalletState = {
  verified: false,   // flip to true to skip setup modal
  available: 8_350_000,
  escrow:    2_500_000,
  earned:   12_075_000,
  withdrawn: 4_000_000,
  spent:     2_500_000,
  bankName: 'GTBank',
  bankLast4: '3821',
}

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: 'tx1', type: 'task_received', label: 'Task payment received', sub: 'Build a React Dashboard',    amount:  4_850_000, status: 'completed', date: new Date(Date.now() - 3.6e6*3),  ref: 'TRF-482910' },
  { id: 'tx2', type: 'task_funded',   label: 'Task funded (escrow)',   sub: 'Design a Logo for Startup', amount: -2_500_000, status: 'pending',   date: new Date(Date.now() - 3.6e6*8)  },
  { id: 'tx3', type: 'withdrawal',    label: 'Withdrawal to bank',     sub: 'GTBank — ****3821',         amount: -4_000_000, status: 'completed', date: new Date(Date.now() - 3.6e6*24), ref: 'WDR-110934' },
  { id: 'tx4', type: 'task_received', label: 'Task payment received',  sub: 'Write 5 Blog Posts on AI',  amount:  7_225_000, status: 'completed', date: new Date(Date.now() - 3.6e6*48), ref: 'TRF-481003' },
  { id: 'tx5', type: 'fee',           label: 'Platform fee (3%)',      sub: 'Write 5 Blog Posts on AI',  amount:   -225_000, status: 'completed', date: new Date(Date.now() - 3.6e6*48) },
  { id: 'tx6', type: 'deposit',       label: 'Wallet top-up',          sub: 'Paystack · Card ****4422',  amount:  5_000_000, status: 'completed', date: new Date(Date.now() - 3.6e6*72), ref: 'DEP-029811' },
  { id: 'tx7', type: 'refund',        label: 'Dispute refund',         sub: 'Fix WordPress Site Bug',    amount:  1_500_000, status: 'completed', date: new Date(Date.now() - 3.6e6*96), ref: 'REF-009201' },
]

export const NIGERIAN_BANKS = [
  'Access Bank', 'First Bank', 'GTBank', 'Zenith Bank', 'UBA',
  'Fidelity Bank', 'FCMB', 'Ecobank', 'Sterling Bank', 'Wema Bank',
  'Polaris Bank', 'Union Bank', 'Keystone Bank', 'Stanbic IBTC',
  'Kuda Bank', 'Opay', 'Palmpay', 'Moniepoint',
]