// import { useState } from 'react'
// import {
//   X,
//   MapPin,
//   Clock,
//   CheckCircle2,
//   AlertTriangle,
//   MessageCircle,
//   Truck,
//   Play,
//   Flag,
//   Zap,
//   ArrowRight,
//   Star,
//   ThumbsUp,
//   ThumbsDown,
//   ChevronLeft,
// } from 'lucide-react'
// import { api, formatNaira, CURRENT_USER } from '.././api/mockApi'
// import type { Task, Bid } from '.././api/mockApi'
// import {
//   StatusBadge,
//   Avatar,
//   StarRating,
//   Button,
//   Spinner,
// } from './ui'
// import BidModal from './BidModal'
// import ReviewModal from './ReviewModal'

// interface TaskDetailPanelProps {
//   task: Task
//   onClose: () => void
//   onTaskUpdated: (task: Task) => void
// }

// export default function TaskDetailPanel({
//   task,
//   onClose,
//   onTaskUpdated,
// }: TaskDetailPanelProps) {
//   const [bidModal, setBidModal] = useState<'accept' | 'bid' | null>(null)
//   const [showReview, setShowReview] = useState(false)
//   const [loadingAction, setLoadingAction] = useState<string | null>(null)

//   const isPoster = task.poster.id === CURRENT_USER.id
//   const isTasker = task.assignedTasker?.id === CURRENT_USER.id
//   const hasAlreadyBid = task.bids.some(b => b.tasker.id === CURRENT_USER.id)

//   async function doAction(key: string, fn: () => Promise<Task>) {
//     setLoadingAction(key)
//     try {
//       const updated = await fn()
//       onTaskUpdated(updated)
//     } finally {
//       setLoadingAction(null)
//     }
//   }

//   async function handleAcceptBid(bid: Bid) {
//     await doAction(`accept-${bid.id}`, () => api.acceptBid(task.id, bid.id))
//   }

//   async function handleRejectBid(bid: Bid) {
//     await doAction(`reject-${bid.id}`, () => api.rejectBid(task.id, bid.id))
//   }

//   async function handleStatusUpdate(status: Parameters<typeof api.updateTaskStatus>[1]) {
//     await doAction(status, () => api.updateTaskStatus(task.id, status))
//   }

//   async function handleConfirmCompletion() {
//     await doAction('confirm', () => api.confirmCompletion(task.id))
//     setShowReview(true)
//   }

//   async function handleDispute() {
//     await doAction('dispute', () => api.raiseDispute(task.id))
//   }

//   // ── RENDER TASKER ACTION BAR ──────────────────────────────────────────────
//   function renderTaskerActions() {
//     if (isPoster) return null

//     switch (task.status) {
//       case 'OPEN':
//       case 'BIDDING':
//         if (hasAlreadyBid) {
//           return (
//             <div
//               className="px-4 py-3 rounded-xl text-sm font-medium text-center"
//               style={{
//                 background: 'var(--color-accent)10',
//                 color: 'var(--color-accent)',
//                 border: '1px solid var(--color-accent)30',
//               }}
//             >
//               ✓ You've placed a bid on this task
//             </div>
//           )
//         }
//         return (
//           <div className="flex gap-3">
//             <Button
//               variant="success"
//               size="lg"
//               className="flex-1"
//               onClick={() => setBidModal('accept')}
//             >
//               <Zap size={15} />
//               Accept for {formatNaira(task.budget)}
//             </Button>
//             <Button
//               variant="secondary"
//               size="lg"
//               className="flex-1"
//               onClick={() => setBidModal('bid')}
//             >
//               <MessageCircle size={15} />
//               Make an Offer
//             </Button>
//           </div>
//         )

//       case 'ASSIGNED':
//         if (!isTasker) return null
//         return (
//           <Button
//             variant="primary"
//             size="lg"
//             fullWidth
//             loading={loadingAction === 'IN_PROGRESS'}
//             onClick={() => handleStatusUpdate('IN_PROGRESS')}
//           >
//             <Truck size={15} />
//             On My Way / Start Task
//           </Button>
//         )

//       case 'IN_PROGRESS':
//         if (!isTasker) return null
//         return (
//           <Button
//             variant="primary"
//             size="lg"
//             fullWidth
//             loading={loadingAction === 'PENDING_REVIEW'}
//             onClick={() => handleStatusUpdate('PENDING_REVIEW')}
//           >
//             <Flag size={15} />
//             Mark as Complete
//           </Button>
//         )

//       default:
//         return null
//     }
//   }

//   // ── RENDER POSTER ACTION BAR ──────────────────────────────────────────────
//   function renderPosterActions() {
//     if (!isPoster) return null

//     switch (task.status) {
//       case 'OPEN':
//         return (
//           <p
//             className="text-sm text-center py-2"
//             style={{ color: 'var(--color-text-muted)' }}
//           >
//             ⏳ Waiting for Taskers to bid…
//           </p>
//         )

//       case 'PENDING_REVIEW':
//         return (
//           <div className="flex gap-3">
//             <Button
//               variant="success"
//               size="lg"
//               className="flex-1"
//               loading={loadingAction === 'confirm'}
//               onClick={handleConfirmCompletion}
//             >
//               <CheckCircle2 size={15} />
//               Confirm & Release Payment
//             </Button>
//             <Button
//               variant="danger"
//               size="lg"
//               className="flex-1"
//               loading={loadingAction === 'dispute'}
//               onClick={handleDispute}
//             >
//               <AlertTriangle size={15} />
//               Raise Dispute
//             </Button>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   return (
//     <>
//       <div
//         className="fixed inset-0 z-40 flex"
//         style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
//         onClick={onClose}
//       />

//       <div
//         className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col overflow-hidden"
//         style={{
//           background: 'var(--color-surface)',
//           borderLeft: '1px solid var(--color-border)',
//           boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
//         }}
//       >
//         {/* Header */}
//         <div
//           className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
//           style={{ borderColor: 'var(--color-border)' }}
//         >
//           <button
//             onClick={onClose}
//             className="flex items-center gap-1.5 text-sm transition-colors"
//             style={{ color: 'var(--color-text-muted)' }}
//             onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
//             onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
//           >
//             <ChevronLeft size={16} />
//             Back
//           </button>
//           <StatusBadge status={task.status} />
//           <div className="w-16" /> {/* spacer */}
//         </div>

//         {/* Scrollable content */}
//         <div className="flex-1 overflow-y-auto">
//           {/* Task info */}
//           <div className="px-5 pt-5 pb-4">
//             <span
//               className="text-xs font-semibold uppercase tracking-wider"
//               style={{ color: 'var(--color-accent)' }}
//             >
//               {task.category}
//             </span>
//             <h2
//               className="font-display font-bold text-xl mt-1 mb-3"
//               style={{ color: 'var(--color-text-primary)' }}
//             >
//               {task.title}
//             </h2>

//             <div className="flex flex-wrap gap-3 mb-4">
//               <div
//                 className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
//                 style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
//               >
//                 <MapPin size={12} />
//                 {task.location}
//               </div>
//               <div
//                 className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
//                 style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
//               >
//                 <Clock size={12} />
//                 {task.deadline}
//               </div>
//               <div
//                 className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold"
//                 style={{
//                   background: 'var(--color-accent)18',
//                   color: 'var(--color-accent)',
//                 }}
//               >
//                 {formatNaira(task.budget)}
//               </div>
//             </div>

//             <p
//               className="text-sm leading-relaxed"
//               style={{ color: 'var(--color-text-secondary)' }}
//             >
//               {task.description}
//             </p>
//           </div>

//           <hr style={{ borderColor: 'var(--color-border)' }} />

//           {/* Poster info */}
//           <div className="px-5 py-4">
//             <p
//               className="text-xs font-semibold uppercase tracking-wider mb-3"
//               style={{ color: 'var(--color-text-muted)' }}
//             >
//               Posted by
//             </p>
//             <div className="flex items-center gap-3">
//               <Avatar initials={task.poster.avatar} size={40} />
//               <div>
//                 <p
//                   className="font-semibold text-sm"
//                   style={{ color: 'var(--color-text-primary)' }}
//                 >
//                   {task.poster.name}
//                 </p>
//                 <StarRating rating={task.poster.rating} />
//               </div>
//               <button
//                 className="ml-auto flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors"
//                 style={{
//                   background: 'var(--color-surface-2)',
//                   color: 'var(--color-text-secondary)',
//                   border: '1px solid var(--color-border)',
//                 }}
//                 onMouseEnter={e => {
//                   e.currentTarget.style.borderColor = 'var(--color-accent)'
//                   e.currentTarget.style.color = 'var(--color-accent)'
//                 }}
//                 onMouseLeave={e => {
//                   e.currentTarget.style.borderColor = 'var(--color-border)'
//                   e.currentTarget.style.color = 'var(--color-text-secondary)'
//                 }}
//               >
//                 <MessageCircle size={13} />
//                 Chat
//               </button>
//             </div>
//           </div>

//           {/* Assigned tasker (if any) */}
//           {task.assignedTasker && (
//             <>
//               <hr style={{ borderColor: 'var(--color-border)' }} />
//               <div className="px-5 py-4">
//                 <p
//                   className="text-xs font-semibold uppercase tracking-wider mb-3"
//                   style={{ color: 'var(--color-text-muted)' }}
//                 >
//                   Assigned Tasker
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <Avatar
//                     initials={task.assignedTasker.avatar}
//                     size={40}
//                     color="#10b981"
//                   />
//                   <div>
//                     <p
//                       className="font-semibold text-sm"
//                       style={{ color: 'var(--color-text-primary)' }}
//                     >
//                       {task.assignedTasker.name}
//                     </p>
//                     <StarRating rating={task.assignedTasker.rating} />
//                   </div>
//                   <div
//                     className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium"
//                     style={{
//                       background: '#10b98118',
//                       color: '#10b981',
//                     }}
//                   >
//                     ✓ Assigned
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Dispute state */}
//           {task.status === 'DISPUTED' && (
//             <>
//               <hr style={{ borderColor: 'var(--color-border)' }} />
//               <div
//                 className="mx-5 my-4 px-4 py-4 rounded-xl"
//                 style={{
//                   background: '#ef444410',
//                   border: '1px solid #ef444430',
//                 }}
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <AlertTriangle size={15} style={{ color: '#ef4444' }} />
//                   <p className="font-semibold text-sm" style={{ color: '#ef4444' }}>
//                     Task Under Dispute
//                   </p>
//                 </div>
//                 <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
//                   This task is locked while our team reviews the dispute. You'll be notified when a decision is made.
//                 </p>
//               </div>
//             </>
//           )}

//           {/* Completed state */}
//           {task.status === 'COMPLETED' && (
//             <>
//               <hr style={{ borderColor: 'var(--color-border)' }} />
//               <div
//                 className="mx-5 my-4 px-4 py-4 rounded-xl text-center"
//                 style={{
//                   background: '#10b98110',
//                   border: '1px solid #10b98130',
//                 }}
//               >
//                 <CheckCircle2 size={28} className="mx-auto mb-2" style={{ color: '#10b981' }} />
//                 <p className="font-semibold text-sm" style={{ color: '#10b981' }}>
//                   Task Completed!
//                 </p>
//                 <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
//                   Payment has been released. Great work!
//                 </p>
//               </div>
//             </>
//           )}

//           {/* BIDS SECTION (poster view) */}
//           {isPoster && task.bids.length > 0 && ['BIDDING', 'OPEN', 'ASSIGNED'].includes(task.status) && (
//             <>
//               <hr style={{ borderColor: 'var(--color-border)' }} />
//               <div className="px-5 py-4">
//                 <p
//                   className="text-xs font-semibold uppercase tracking-wider mb-3"
//                   style={{ color: 'var(--color-text-muted)' }}
//                 >
//                   Bids ({task.bids.length})
//                 </p>

//                 <div className="space-y-3">
//                   {task.bids.map(bid => (
//                     <BidCard
//                       key={bid.id}
//                       bid={bid}
//                       onAccept={() => handleAcceptBid(bid)}
//                       onReject={() => handleRejectBid(bid)}
//                       acceptLoading={loadingAction === `accept-${bid.id}`}
//                       rejectLoading={loadingAction === `reject-${bid.id}`}
//                       disabled={task.status === 'ASSIGNED'}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Sticky action bar */}
//         {(renderTaskerActions() || renderPosterActions()) && (
//           <div
//             className="flex-shrink-0 px-5 py-4 border-t"
//             style={{
//               borderColor: 'var(--color-border)',
//               background: 'var(--color-surface)',
//             }}
//           >
//             {renderTaskerActions() || renderPosterActions()}
//           </div>
//         )}
//       </div>

//       {/* Bid modal */}
//       {bidModal && (
//         <BidModal
//           task={task}
//           mode={bidModal}
//           onClose={() => setBidModal(null)}
//           onSuccess={updated => {
//             onTaskUpdated(updated)
//             setBidModal(null)
//           }}
//         />
//       )}

//       {/* Review modal */}
//       {showReview && task.assignedTasker && (
//         <ReviewModal
//           task={task}
//           onClose={() => setShowReview(false)}
//           onSubmitted={() => setShowReview(false)}
//         />
//       )}
//     </>
//   )
// }

// // ── BidCard sub-component ─────────────────────────────────────────────────────
// function BidCard({
//   bid,
//   onAccept,
//   onReject,
//   acceptLoading,
//   rejectLoading,
//   disabled,
// }: {
//   bid: Bid
//   onAccept: () => void
//   onReject: () => void
//   acceptLoading: boolean
//   rejectLoading: boolean
//   disabled: boolean
// }) {
//   const isAccepted = bid.status === 'accepted'
//   const isRejected = bid.status === 'rejected'

//   return (
//     <div
//       className="rounded-xl p-4"
//       style={{
//         background: isAccepted
//           ? '#10b98110'
//           : isRejected
//           ? 'var(--color-surface-2)'
//           : 'var(--color-surface-2)',
//         border: `1px solid ${
//           isAccepted ? '#10b98130' : isRejected ? 'var(--color-border)' : 'var(--color-border)'
//         }`,
//         opacity: isRejected ? 0.6 : 1,
//       }}
//     >
//       <div className="flex items-start justify-between gap-3 mb-2">
//         <div className="flex items-center gap-2">
//           <Avatar initials={bid.tasker.avatar} size={32} />
//           <div>
//             <p
//               className="font-semibold text-sm"
//               style={{ color: 'var(--color-text-primary)' }}
//             >
//               {bid.tasker.name}
//             </p>
//             <StarRating rating={bid.tasker.rating} size={11} />
//           </div>
//         </div>
//         <div className="text-right">
//           <p
//             className="font-bold text-sm"
//             style={{ color: isAccepted ? '#10b981' : 'var(--color-text-primary)' }}
//           >
//             {formatNaira(bid.amount)}
//           </p>
//           {isAccepted && (
//             <span className="text-xs" style={{ color: '#10b981' }}>
//               Accepted
//             </span>
//           )}
//           {isRejected && (
//             <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
//               Rejected
//             </span>
//           )}
//         </div>
//       </div>

//       <p
//         className="text-xs leading-relaxed mb-3"
//         style={{ color: 'var(--color-text-muted)' }}
//       >
//         {bid.message}
//       </p>

//       {bid.status === 'pending' && !disabled && (
//         <div className="flex gap-2">
//           <button
//             onClick={onAccept}
//             disabled={acceptLoading}
//             className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors"
//             style={{
//               background: '#10b98118',
//               color: '#10b981',
//               border: '1px solid #10b98130',
//             }}
//           >
//             {acceptLoading ? (
//               <Spinner size={12} />
//             ) : (
//               <ThumbsUp size={12} />
//             )}
//             Accept
//           </button>
//           <button
//             onClick={onReject}
//             disabled={rejectLoading}
//             className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors"
//             style={{
//               background: '#ef444410',
//               color: '#ef4444',
//               border: '1px solid #ef444430',
//             }}
//           >
//             {rejectLoading ? (
//               <Spinner size={12} />
//             ) : (
//               <ThumbsDown size={12} />
//             )}
//             Decline
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }
// components/Taskdetailpanel.tsx
// Chat button now navigates to /chat?with=userId&taskId=taskId&name=Name
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Clock, CheckCircle2, AlertTriangle,
  MessageCircle, Truck, Flag, Zap, ThumbsUp, ThumbsDown, ChevronLeft,
} from 'lucide-react'
import { api, formatNaira, CURRENT_USER } from '.././api/mockApi'
import type { Task, Bid } from '.././api/mockApi'
import { StatusBadge, Avatar, StarRating, Button, Spinner } from './ui'
import BidModal from './BidModal'
import ReviewModal from './ReviewModal'

interface Props {
  task: Task
  onClose: () => void
  onTaskUpdated: (task: Task) => void
}

export default function TaskDetailPanel({ task, onClose, onTaskUpdated }: Props) {
  const navigate = useNavigate()
  const [bidModal, setBidModal] = useState<'accept' | 'bid' | null>(null)
  const [showReview, setShowReview] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const isPoster = task.poster.id === CURRENT_USER.id
  const isTasker = task.assignedTasker?.id === CURRENT_USER.id
  const hasAlreadyBid = task.bids.some(b => b.tasker.id === CURRENT_USER.id)

  // ── Navigate to DM ───────────────────────────────────────────────────────
  function openChat(userId: string, name: string) {
    onClose()
    navigate(`/chat?with=${userId}&taskId=${task.id}&name=${encodeURIComponent(name)}`)
  }

  async function doAction(key: string, fn: () => Promise<Task>) {
    setLoadingAction(key)
    try { const u = await fn(); onTaskUpdated(u) }
    finally { setLoadingAction(null) }
  }

  // ── Action bars ──────────────────────────────────────────────────────────
  function renderTaskerActions() {
    if (isPoster) return null
    switch (task.status) {
      case 'OPEN': case 'BIDDING':
        if (hasAlreadyBid) return (
          <div className="px-4 py-3 rounded-xl text-sm font-medium text-center"
            style={{ background: 'var(--color-accent)10', color: 'var(--color-accent)', border: '1px solid var(--color-accent)30' }}>
            ✓ You've placed a bid on this task
          </div>
        )
        return (
          <div className="flex gap-3">
            <Button variant="success" size="lg" className="flex-1" onClick={() => setBidModal('accept')}>
              <Zap size={15} /> Accept for {formatNaira(task.budget)}
            </Button>
            <Button variant="secondary" size="lg" className="flex-1" onClick={() => setBidModal('bid')}>
              <MessageCircle size={15} /> Make an Offer
            </Button>
          </div>
        )
      case 'ASSIGNED':
        if (!isTasker) return null
        return (
          <Button variant="primary" size="lg" fullWidth loading={loadingAction === 'IN_PROGRESS'}
            onClick={() => doAction('IN_PROGRESS', () => api.updateTaskStatus(task.id, 'IN_PROGRESS'))}>
            <Truck size={15} /> On My Way / Start Task
          </Button>
        )
      case 'IN_PROGRESS':
        if (!isTasker) return null
        return (
          <Button variant="primary" size="lg" fullWidth loading={loadingAction === 'PENDING_REVIEW'}
            onClick={() => doAction('PENDING_REVIEW', () => api.updateTaskStatus(task.id, 'PENDING_REVIEW'))}>
            <Flag size={15} /> Mark as Complete
          </Button>
        )
      default: return null
    }
  }

  function renderPosterActions() {
    if (!isPoster) return null
    switch (task.status) {
      case 'OPEN':
        return <p className="text-sm text-center py-2" style={{ color: 'var(--color-text-muted)' }}>⏳ Waiting for Taskers to bid…</p>
      case 'PENDING_REVIEW':
        return (
          <div className="flex gap-3">
            <Button variant="success" size="lg" className="flex-1" loading={loadingAction === 'confirm'}
              onClick={async () => { await doAction('confirm', () => api.confirmCompletion(task.id)); setShowReview(true) }}>
              <CheckCircle2 size={15} /> Confirm & Release Payment
            </Button>
            <Button variant="danger" size="lg" className="flex-1" loading={loadingAction === 'dispute'}
              onClick={() => doAction('dispute', () => api.raiseDispute(task.id))}>
              <AlertTriangle size={15} /> Raise Dispute
            </Button>
          </div>
        )
      default: return null
    }
  }

  const chatBtn = (userId: string, name: string) => (
    <button
      onClick={() => openChat(userId, name)}
      className="ml-auto flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all"
      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
      <MessageCircle size={13} /> Message
    </button>
  )

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col overflow-hidden"
        style={{ background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)', boxShadow: '-8px 0 40px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}>
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <ChevronLeft size={16} /> Back
          </button>
          <StatusBadge status={task.status} />
          <div className="w-16" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Task info */}
          <div className="px-5 pt-5 pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>{task.category}</span>
            <h2 className="font-display font-bold text-xl mt-1 mb-3" style={{ color: 'var(--color-text-primary)' }}>{task.title}</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                <MapPin size={12} /> {task.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                <Clock size={12} /> {task.deadline}
              </div>
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold"
                style={{ background: 'var(--color-accent)18', color: 'var(--color-accent)' }}>
                {formatNaira(task.budget)}
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{task.description}</p>
          </div>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          {/* Poster */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Posted by</p>
            <div className="flex items-center gap-3">
              <Avatar initials={task.poster.avatar} size={40} />
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{task.poster.name}</p>
                <StarRating rating={task.poster.rating} />
              </div>
              {/* Show chat btn only for taskers viewing this task */}
              {!isPoster && chatBtn(task.poster.id, task.poster.name)}
            </div>
          </div>

          {/* Assigned tasker */}
          {task.assignedTasker && (
            <>
              <hr style={{ borderColor: 'var(--color-border)' }} />
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Assigned Tasker</p>
                <div className="flex items-center gap-3">
                  <Avatar initials={task.assignedTasker.avatar} size={40} color="#10b981" />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{task.assignedTasker.name}</p>
                    <StarRating rating={task.assignedTasker.rating} />
                  </div>
                  {/* Poster can message their assigned tasker */}
                  {isPoster && chatBtn(task.assignedTasker.id, task.assignedTasker.name)}
                  <div className="text-xs px-3 py-1.5 rounded-lg font-medium ml-auto"
                    style={{ background: '#10b98118', color: '#10b981' }}>✓ Assigned</div>
                </div>
              </div>
            </>
          )}

          {/* Disputed */}
          {task.status === 'DISPUTED' && (
            <>
              <hr style={{ borderColor: 'var(--color-border)' }} />
              <div className="mx-5 my-4 px-4 py-4 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={15} style={{ color: '#ef4444' }} />
                  <p className="font-semibold text-sm" style={{ color: '#ef4444' }}>Task Under Dispute</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Locked while our team reviews. You'll be notified of the decision.
                </p>
              </div>
            </>
          )}

          {/* Completed */}
          {task.status === 'COMPLETED' && (
            <>
              <hr style={{ borderColor: 'var(--color-border)' }} />
              <div className="mx-5 my-4 px-4 py-4 rounded-xl text-center" style={{ background: '#10b98110', border: '1px solid #10b98130' }}>
                <CheckCircle2 size={28} className="mx-auto mb-2" style={{ color: '#10b981' }} />
                <p className="font-semibold text-sm" style={{ color: '#10b981' }}>Task Completed!</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Payment has been released. Great work!</p>
              </div>
            </>
          )}

          {/* Bids (poster view) */}
          {isPoster && task.bids.length > 0 && ['BIDDING', 'OPEN', 'ASSIGNED'].includes(task.status) && (
            <>
              <hr style={{ borderColor: 'var(--color-border)' }} />
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
                  Bids ({task.bids.length})
                </p>
                <div className="space-y-3">
                  {task.bids.map(bid => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      onAccept={() => doAction(`accept-${bid.id}`, () => api.acceptBid(task.id, bid.id))}
                      onReject={() => doAction(`reject-${bid.id}`, () => api.rejectBid(task.id, bid.id))}
                      onChat={() => openChat(bid.tasker.id, bid.tasker.name)}
                      acceptLoading={loadingAction === `accept-${bid.id}`}
                      rejectLoading={loadingAction === `reject-${bid.id}`}
                      disabled={task.status === 'ASSIGNED'}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action bar */}
        {(renderTaskerActions() || renderPosterActions()) && (
          <div className="flex-shrink-0 px-5 py-4 border-t"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
            {renderTaskerActions() || renderPosterActions()}
          </div>
        )}
      </div>

      {bidModal && (
        <BidModal task={task} mode={bidModal} onClose={() => setBidModal(null)}
          onSuccess={u => { onTaskUpdated(u); setBidModal(null) }} />
      )}
      {showReview && task.assignedTasker && (
        <ReviewModal task={task} onClose={() => setShowReview(false)} onSubmitted={() => setShowReview(false)} />
      )}
    </>
  )
}

// ── BidCard ───────────────────────────────────────────────────────────────────

function BidCard({ bid, onAccept, onReject, onChat, acceptLoading, rejectLoading, disabled }: {
  bid: Bid; onAccept: () => void; onReject: () => void; onChat: () => void
  acceptLoading: boolean; rejectLoading: boolean; disabled: boolean
}) {
  const isAccepted = bid.status === 'accepted'
  const isRejected = bid.status === 'rejected'
  return (
    <div className="rounded-xl p-4"
      style={{ background: isAccepted ? '#10b98110' : 'var(--color-surface-2)', border: `1px solid ${isAccepted ? '#10b98130' : 'var(--color-border)'}`, opacity: isRejected ? 0.6 : 1 }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Avatar initials={bid.tasker.avatar} size={32} />
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{bid.tasker.name}</p>
            <StarRating rating={bid.tasker.rating} size={11} />
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm" style={{ color: isAccepted ? '#10b981' : 'var(--color-text-primary)' }}>{formatNaira(bid.amount)}</p>
          {isAccepted && <span className="text-xs" style={{ color: '#10b981' }}>Accepted</span>}
          {isRejected && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Rejected</span>}
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-text-muted)' }}>{bid.message}</p>
      {bid.status === 'pending' && !disabled && (
        <div className="flex gap-2">
          <button onClick={onAccept} disabled={acceptLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
            style={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130' }}>
            {acceptLoading ? <Spinner size={12} /> : <ThumbsUp size={12} />} Accept
          </button>
          <button onClick={onReject} disabled={rejectLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
            style={{ background: '#ef444410', color: '#ef4444', border: '1px solid #ef444430' }}>
            {rejectLoading ? <Spinner size={12} /> : <ThumbsDown size={12} />} Decline
          </button>
          {/* Message the bidder */}
          <button onClick={onChat}
            className="flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
            <MessageCircle size={12} />
          </button>
        </div>
      )}
    </div>
  )
}