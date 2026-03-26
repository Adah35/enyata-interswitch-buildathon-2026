import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { api } from '.././api/mockApi'
import type { Task } from '.././api/mockApi'
import { Avatar, Button, Textarea } from './ui'

interface ReviewModalProps {
  task: Task
  onClose: () => void
  onSubmitted: () => void
}

export default function ReviewModal({ task, onClose, onSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const reviewTarget = task.assignedTasker!

  async function handleSubmit() {
    if (!rating) return
    setLoading(true)
    try {
      await api.submitReview({
        taskId: task.id,
        reviewerId: 'u1',
        rating,
        comment,
      })
      onSubmitted()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2
            className="font-display font-bold text-base"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Rate Your Tasker
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-6 space-y-5">
          {/* Tasker info */}
          <div className="flex items-center gap-3">
            <Avatar initials={reviewTarget.avatar} size={44} />
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {reviewTarget.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {task.title}
              </p>
            </div>
          </div>

          {/* Stars */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              How was the work?
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    fill={n <= (hovered || rating) ? '#f59e0b' : 'none'}
                    stroke={n <= (hovered || rating) ? '#f59e0b' : 'var(--color-border)'}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs" style={{ color: '#f59e0b' }}>
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
              </p>
            )}
          </div>

          <Textarea
            label="Leave a review (optional)"
            placeholder="Tell others about your experience..."
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <div
          className="flex gap-3 px-5 py-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Skip
          </Button>
          <Button
            variant="primary"
            loading={loading}
            disabled={!rating}
            onClick={handleSubmit}
            className="flex-1"
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  )
}