import { MapPin, Clock, Users, ChevronRight } from 'lucide-react'
import type { Task } from '.././api/mockApi'
import { StatusBadge, Avatar } from '../components/ui/index'
import { formatNaira } from '.././api/mockApi'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  viewAs?: 'poster' | 'tasker'
}

export default function TaskCard({ task, onClick, viewAs = 'poster' }: TaskCardProps) {
  return (
    <div
      onClick={() => onClick(task)}
      className="group flex items-start justify-between px-5 py-4 cursor-pointer transition-all duration-150 hover:bg-[var(--color-surface-2)]"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="flex-1 min-w-0 pr-4">
        {/* Status + category row */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <StatusBadge status={task.status} />
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            {task.category}
          </span>
        </div>

        {/* Title */}
        <p
          className="font-semibold text-sm truncate mb-2 group-hover:text-[var(--color-accent)] transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {task.title}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap">
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <MapPin size={11} />
            {task.location}
          </span>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Clock size={11} />
            {task.deadline}
          </span>
          {task.bids.length > 0 && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Users size={11} />
              {task.bids.length} bid{task.bids.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Assigned tasker (if poster view) */}
        {viewAs === 'poster' && task.assignedTasker && (
          <div className="flex items-center gap-2 mt-2">
            <Avatar
              initials={task.assignedTasker.avatar}
              size={20}
              color="var(--color-accent)"
            />
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {task.assignedTasker.name}
            </span>
          </div>
        )}
      </div>

      {/* Right: budget + arrow */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <div
            className="font-bold text-sm"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {formatNaira(task.budget)}
          </div>
          {viewAs === 'tasker' && (
            <div
              className="text-xs mt-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              budget
            </div>
          )}
        </div>
        <ChevronRight
          size={15}
          className="group-hover:translate-x-0.5 transition-transform"
          style={{ color: 'var(--color-text-muted)' }}
        />
      </div>
    </div>
  )
}