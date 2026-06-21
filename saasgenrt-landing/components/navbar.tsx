'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#how-it-works', label: 'Comment ça marche' },
  { href: '#pricing', label: 'Tarifs' },
  { href: '#testimonials', label: 'Témoignages' },
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
        background: scrolled ? 'oklch(0.08 0 0 / 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between" style={{ height: '72px' }}>

        <a href="/" className="flex items-center gap-2 flex-shrink-0" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="SaaSGenrt" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            SaaSGenrt
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-150"
              style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="/login"
            className="transition-colors duration-150"
            style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--muted)', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Connexion
          </a>
          <a
            href="/builder"
            className="flex items-center gap-1.5 font-semibold transition-all"
            style={{
              fontSize: '13px',
              padding: '8px 18px',
              borderRadius: '10px',
              background: 'var(--primary)',
              color: 'white',
              textDecoration: 'none',
              boxShadow: '0 3px 12px oklch(0.62 0.14 205 / 0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            Commencer
            <ArrowRight style={{ width: 13, height: 13 }} strokeWidth={2.5} />
          </a>
        </div>

        <button
          className="md:hidden transition-colors"
          style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '16px 24px' }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block transition-colors"
              style={{
                padding: '12px 0',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--muted)',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
              }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 10, paddingTop: 14 }}>
            <a href="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '13.5px', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none' }}>Connexion</a>
            <a href="/builder" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '13.5px', fontWeight: 600, color: 'white', background: 'var(--primary)', borderRadius: 10, textDecoration: 'none' }}>Commencer →</a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
