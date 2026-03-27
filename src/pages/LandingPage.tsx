import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  CreditCard,
  Bell,
  LayoutList,
  Search,
  PlusCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
} from 'lucide-react'
import Navbar from './../components/NavBar'

const STEPS = [
  {
    step: '01',
    icon: PlusCircle,
    title: 'Post Your Task',
    desc: 'Describe what you need done, set your budget, and choose a deadline. It takes under two minutes.',
    color: '#3b82f6',
  },
  {
    step: '02',
    icon: Search,
    title: 'Receive Bids',
    desc: 'Skilled Taskers browse your listing and place competitive bids. Review profiles, ratings, and reviews.',
    color: '#8b5cf6',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Get It Done',
    desc: 'Pick your Tasker, chat in real-time, and release payment once the task is complete. Simple.',
    color: '#10b981',
  },
]

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Real-Time Chat',
    desc: 'Message your Poster or Tasker instantly. Share files, photos, and updates all in one thread.',
    tag: 'Communication',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    desc: 'Funds are held in escrow and only released when you approve the completed work. Zero surprises.',
    tag: 'Finance',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Stay on top of bids, messages, and task milestones with push and email notifications.',
    tag: 'Productivity',
  },
  {
    icon: LayoutList,
    title: 'Task Lifecycle',
    desc: 'From Draft → Open → In Progress → Review → Complete. Every step tracked and transparent.',
    tag: 'Workflow',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Safety',
    desc: 'Identity verified Taskers, dispute resolution, and a full refund guarantee on every task.',
    tag: 'Security',
  },
  {
    icon: TrendingUp,
    title: 'Reputation System',
    desc: 'Build your profile with reviews, badges, and completion rates. Great work gets rewarded.',
    tag: 'Growth',
  },
]

const LIFECYCLE = [
  { label: 'Draft', color: '#94a3b8', desc: 'Task created, not yet published' },
  { label: 'Open', color: '#3b82f6', desc: 'Accepting bids from Taskers' },
  { label: 'In Progress', color: '#f59e0b', desc: 'Assigned Tasker is working' },
  { label: 'Review', color: '#8b5cf6', desc: 'Poster reviewing deliverables' },
  { label: 'Complete', color: '#10b981', desc: 'Approved & payment released' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
      <Navbar variant="landing" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center" id="hero">
        {/* Background gradient blob */}
        <div
          className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-16 relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT: Text Content */}
            <div className="space-y-8 lg:pr-8 animate-slide-in-left">
              {/* Headline - Space Grotesk */}
              <h1
                className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Get Tasks Done. Or Get Paid{' '}
                <span
                  className="relative inline-block"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Doing It.
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8.5c60-6 140-7.5 298-1"
                      stroke="var(--color-accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                  </svg>
                </span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl max-w-xl leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Taskly connects people who need work done with talented Taskers ready to deliver.
                Post a task, receive bids, chat, pay — all in one seamless marketplace.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-glow w-full sm:w-auto"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
                >
                  Post a Task Free
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 w-full sm:w-auto"
                  style={{
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: '1.5px solid var(--color-border)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }}
                >
                  Browse Tasks
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* RIGHT: Image / Mockup Area */}
            <div className="hidden lg:flex justify-center lg:justify-end animate-slide-in-right">
              <div 
                className="relative w-full max-w-[520px] rounded-3xl overflow-hidden"
              >
                <img 
                  src="/image-2.png"   
                  alt="Taskly App Interface"
                  className="w-full h-auto object-cover"
                />
              </div> 
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-accent)' }}
            >
              Simple Process
            </span>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mt-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Three steps to done
            </h2>
            <p
              className="mt-4 text-base md:text-lg max-w-xl mx-auto px-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Taskly makes it effortless to get skilled help or earn money from your skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map(({ step, icon: Icon, title, desc, color }, i) => (
              <div
                key={step}
                className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="absolute top-4 right-4 font-display font-extrabold text-6xl md:text-8xl leading-none select-none pointer-events-none"
                  style={{ color: 'var(--color-border)', opacity: 0.5 }}
                >
                  {step}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={24} color={color} />
                </div>
                <h3
                  className="font-display font-semibold text-xl mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TASK LIFECYCLE ────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: 'var(--color-surface)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-accent)' }}
          >
            Task Lifecycle
          </span>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl mt-3 mb-10 md:mb-12"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Full transparency at every stage
          </h2>

          <div className="relative flex flex-wrap sm:flex-nowrap items-start justify-center gap-x-8 gap-y-10 md:gap-y-0">
            <div
              className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px"
              style={{ background: 'var(--color-border)' }}
            />

            {LIFECYCLE.map(({ label, color, desc }, i) => (
              <div 
                key={label} 
                className="relative flex flex-col items-center gap-3 flex-1 min-w-[140px] sm:min-w-0"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs z-10"
                  style={{ background: `${color}20`, border: `2px solid ${color}`, color }}
                >
                  {i + 1}
                </div>
                <span
                  className="font-semibold text-sm text-center"
                  style={{ color }}
                >
                  {label}
                </span>
                <span
                  className="text-xs text-center max-w-[130px] leading-relaxed"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-accent)' }}
            >
              Platform Features
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, tag }, i) => (
              <div
                key={title}
                className="glass-card rounded-2xl p-6"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  >
                    <Icon size={20} color="var(--color-accent)" />
                  </div>
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      background: 'var(--color-surface-2)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {tag}
                  </span>
                </div>
                <h3
                  className="font-display font-semibold text-lg mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{ background: 'var(--color-surface-2)' }}
          >
            <Clock size={36} className="mx-auto mb-4 opacity-80" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
              Ready to get started?
            </h2>
            <p className="text-base md:text-lg mb-8 max-w-xl mx-auto">
              Join Taskly to get things done and build their freelance career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 w-full sm:w-auto"
                style={{ background: '#fff', color: 'var(--color-accent)' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Post Your First Task
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 w-full sm:w-auto"
                style={{ border: '1.5px solid rgba(255,255,255,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Become a Tasker
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer
        className="border-t py-12 md:py-16"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <Zap size={17} color="#fff" fill="#fff" />
                </span>
                <span className="font-display font-bold text-xl" style={{ color: 'var(--color-text-primary)' }}>
                  Task<span style={{ color: 'var(--color-accent)' }}>ly</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
                The peer-to-peer task marketplace connecting people who need work done with talented Taskers worldwide.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['How it Works', 'Features', 'Pricing', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Terms', 'Privacy'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4
                  className="font-semibold text-sm mb-4"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(link => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t text-sm gap-4"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            <span>© 202 Taskly. All rights reserved.</span>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <span style={{ color: '#ef4444' }}>♥</span>
              <span>for Africa & beyond</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}