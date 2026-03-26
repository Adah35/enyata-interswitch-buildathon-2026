import { useState } from 'react'
import { X, Zap, MessageSquare } from 'lucide-react'
import { api, formatNaira } from '.././api/mockApi'
import type { Task } from '.././api/mockApi'
import { Button, Input, Textarea } from './ui'

interface BidModalProps {
  task: Task
  mode: 'accept' | 'bid'
  onClose: () => void
  onSuccess: (updatedTask: Task) => void
}

export default function BidModal({ task, mode, onClose, onSuccess }: BidModalProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(String(task.budget))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit() {
    setError('')
    const num = Number(amount)
    if (!num || num <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (mode === 'bid' && !message.trim()) {
      setError('Please add a message to your bid')
      return
    }
    setLoading(true)
    try {
      if (mode === 'accept') {
        const updated = await api.acceptTask(task.id)
        onSuccess(updated)
      } else {
        await api.submitBid(task.id, num, message)
        // Re-fetch task
        const updated = await api.getTaskById(task.id)
        onSuccess(updated!)
      }
    } finally {
      setLoading(false)
    }
  }

  const isAccept = mode === 'accept'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: isAccept ? '#10b98118' : 'var(--color-accent)18',
              }}
            >
              {isAccept ? (
                <Zap size={16} style={{ color: '#10b981' }} />
              ) : (
                <MessageSquare size={16} style={{ color: 'var(--color-accent)' }} />
              )}
            </div>
            <h2
              className="font-display font-bold text-base"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {isAccept ? 'Accept Task' : 'Make an Offer'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Task preview */}
        <div
          className="mx-5 my-4 px-4 py-3 rounded-xl"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          <p
            className="font-semibold text-sm mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {task.title}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Budget: {formatNaira(task.budget)} · {task.location}
          </p>
        </div>

        {/* Body */}
        <div className="px-5 pb-2 space-y-4">
          <Input
            label={isAccept ? 'Confirm Amount (₦)' : 'Your Offer (₦)'}
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            error={error && !message ? error : undefined}
          />

          {!isAccept && (
            <Textarea
              label="Message to Poster"
              placeholder="Introduce yourself and explain why you're the right person..."
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              error={error && message === '' ? error : undefined}
            />
          )}

          {error && (
            <p className="text-xs" style={{ color: '#ef4444' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-t mt-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant={isAccept ? 'success' : 'primary'}
            loading={loading}
            onClick={handleSubmit}
            className="flex-1"
          >
            {isAccept
              ? `Accept for ${formatNaira(Number(amount) || task.budget)}`
              : 'Submit Offer'}
          </Button>
        </div>
      </div>
    </div>
  )
}