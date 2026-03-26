import { useState } from 'react'
import { X, Upload, PlusCircle } from 'lucide-react'
import { api } from '.././api/mockApi'
import type { Task } from '.././api/mockApi'
import { Button, Input, Textarea } from './ui'

const CATEGORIES = [
  'Web & Tech',
  'Design',
  'Writing',
  'Business',
  'Marketing',
  'Local Tasks',
  'Video & Audio',
  'Other',
]

interface PostTaskModalProps {
  onClose: () => void
  onTaskCreated: (task: Task) => void
}

export default function PostTaskModal({ onClose, onTaskCreated }: PostTaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    location: '',
    deadline: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }))

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.budget || isNaN(Number(form.budget))) e.budget = 'Enter a valid budget'
    if (!form.category) e.category = 'Select a category'
    if (!form.deadline) e.deadline = 'Set a deadline'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    try {
      const task = await api.createTask({
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        category: form.category,
        location: form.location || 'Remote',
        deadline: new Date(form.deadline).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      })
      onTaskCreated(task)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-accent)18' }}
            >
              <PlusCircle size={16} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h2
              className="font-display font-bold text-lg"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Post a Task
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Build a React Dashboard"
            value={form.title}
            onChange={set('title')}
            error={errors.title}
          />

          <Textarea
            label="Description"
            placeholder="Describe what you need done in detail..."
            rows={4}
            value={form.description}
            onChange={set('description')}
            error={errors.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget (₦)"
              type="number"
              placeholder="e.g. 50000"
              value={form.budget}
              onChange={set('budget')}
              error={errors.budget}
            />

            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Category
              </label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--color-surface)',
                  border: `1.5px solid ${errors.category ? '#ef4444' : 'var(--color-border)'}`,
                  color: form.category ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}
              >
                <option value="">Select…</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && (
                <span className="text-xs" style={{ color: '#ef4444' }}>
                  {errors.category}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="Remote / Lagos"
              value={form.location}
              onChange={set('location')}
            />
            <Input
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={set('deadline')}
              error={errors.deadline}
            />
          </div>

          {/* Image upload placeholder */}
          <div>
            <label
              className="text-xs font-semibold block mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Images (optional)
            </label>
            <button
              className="w-full py-6 rounded-xl flex flex-col items-center gap-2 transition-colors"
              style={{
                border: '2px dashed var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-muted)'
              }}
            >
              <Upload size={20} />
              <span className="text-xs">Drag & drop or click to upload</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSubmit}
            className="flex-1"
          >
            Post Task
          </Button>
        </div>
      </div>
    </div>
  )
}