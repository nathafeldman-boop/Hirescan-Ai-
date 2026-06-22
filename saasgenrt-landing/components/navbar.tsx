'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#how-it-works', label: 'Comment ça marche' },
  { href: '#pricing', label: 'Tarifs' },
  { href: '#proof', label: 'Témoignages' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 transition-all duration-300"
      style={{
        zIndex: 100,
        background: scrolled ? 'oklch(0.985 0.004 50 / 0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between" style={{ height: 70 }}>

        <a href="/" className="flex items-center gap-2.5 flex-shrink-0" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="SaaSGenrt" style={{ width: 30, height: 30, objectFit: 'contain', flexShrink: 0 }} />
          <span className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            SaaSGenrt
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-150"
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="transition-colors duration-150"
            style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none', padding: '8px 4px' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Connexion
          </a>
          <a
            href="/builder"
            className="group flex items-center gap-1.5 transition-all"
            style={{
              fontSize: 13.5, fontWeight: 600, padding: '9px 18px', borderRadius: 11,
              background: 'var(--ink)', color: 'var(--bg)', textDecoration: 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.background = 'var(--signal)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.background = 'var(--ink)' }}
          >
            Commencer
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" style={{ width: 14, height: 14 }} strokeWidth={2.5} />
          </a>
        </div>

        <button
          className="md:hidden transition-colors"
          style={{ color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '12px 24px 20px' }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block"
              style={{ padding: '13px 0', fontSize: 15, fontWeight: 500, color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 10, paddingTop: 16 }}>
            <a href="/login" style={{ flex: 1, textAlign: 'center', padding: '11px', fontSize: 14, fontWeight: 500, color: 'var(--ink-soft)', border: '1px solid var(--border-strong)', borderRadius: 11, textDecoration: 'none' }}>Connexion</a>
            <a href="/builder" style={{ flex: 1, textAlign: 'center', padding: '11px', fontSize: 14, fontWeight: 600, color: 'var(--bg)', background: 'var(--ink)', borderRadius: 11, textDecoration: 'none' }}>Commencer</a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
