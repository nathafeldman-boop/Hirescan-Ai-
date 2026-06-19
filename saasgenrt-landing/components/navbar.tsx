'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#resources', label: 'Resources' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(9,11,17,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.055)' : '1px solid transparent',
      }}
    >
      <div
        className="max-w-[1200px] mx-auto px-6 flex items-center justify-between"
        style={{ height: '80px' }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6d28d9 100%)',
              boxShadow: '0 4px 14px rgba(139,92,246,0.32)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L12 4.25V9.75L7 12.5L2 9.75V4.25L7 1.5Z" fill="white" fillOpacity="0.92" />
              <circle cx="7" cy="7" r="2.2" fill="white" fillOpacity="0.45" />
            </svg>
          </div>
          <span className="text-white font-semibold" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
            SaaSGenrt
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-150"
              style={{ fontSize: '13.5px', fontWeight: 500, color: 'rgba(255,255,255,0.52)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.52)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA row */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="#"
            className="transition-colors duration-150"
            style={{ fontSize: '13.5px', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
          >
            Sign In
          </a>
          <a
            href="/builder"
            className="flex items-center gap-1.5 text-white font-semibold transition-all"
            style={{
              fontSize: '13px',
              padding: '8px 20px',
              borderRadius: '14px',
              background: '#8B5CF6',
              boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#7c3aed'
              ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#8B5CF6'
              ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
            }}
          >
            Start Free
            <ArrowRight style={{ width: 13, height: 13 }} strokeWidth={2.5} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden transition-colors"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: '#090B11',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '16px 24px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block transition-colors"
              style={{
                padding: '12px 0',
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 12, paddingTop: 16 }}>
            <a href="#" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99 }}>Sign In</a>
            <a href="#pricing" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '13.5px', fontWeight: 600, color: 'white', background: '#8B5CF6', borderRadius: 14 }}>Start Free →</a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
