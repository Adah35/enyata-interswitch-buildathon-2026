import { Briefcase, Clock, CheckCircle2, DollarSign } from 'lucide-react'
import type { Task } from '.././api/mockApi'

interface StatsBarProps {
  tasks: Task[]
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const active = tasks.filter(t =>
    ['OPEN', 'BIDDING', 'ASSIGNED', 'IN_PROGRESS'].includes(t.status)
  ).length

  const pendingBids = tasks.filter(t => t.status === 'BIDDING').length

  const completed = tasks.filter(t => t.status === 'COMPLETED').length

  const totalSpent = tasks
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.budget, 0)

  const stats = [
    { label: 'Active Tasks', value: String(active), icon: Briefcase, color: '#3b82f6' },
    { label: 'Awaiting Bids', value: String(pendingBids), icon: Clock, color: '#f59e0b' },
    { label: 'Completed', value: String(completed), icon: CheckCircle2, color: '#10b981' },
    {
      label: 'Total Spent',
      value: `₦${(totalSpent / 1000).toFixed(0)}k`,
      icon: DollarSign,
      color: '#8b5cf6',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="glass-card rounded-2xl p-5"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: `${color}18` }}
          >
            <Icon size={20} color={color} />
          </div>
          <div
            className="font-display font-bold text-2xl"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {value}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}