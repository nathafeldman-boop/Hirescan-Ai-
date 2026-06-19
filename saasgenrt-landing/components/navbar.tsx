'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#blog', label: 'Blog' },
  { href: '#resources', label: 'Resources' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080f]/85 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-[28px] h-[28px] rounded-[7px] bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4.25V10.75L7 14L1.5 10.75V4.25L7 1Z" fill="white" fillOpacity="0.9" />
              <circle cx="7" cy="7" r="2.5" fill="white" fillOpacity="0.5" />
            </svg>
          </div>
          <span className="text-white font-semibold text-[15px] tracking-[-0.01em]">
            SaaSGenrt
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/55 hover:text-white text-[13.5px] font-medium transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA row */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#"
            className="text-white/60 hover:text-white text-[13.5px] font-medium transition-colors"
          >
            Sign In
          </a>
          <a
            href="#pricing"
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold px-[18px] py-[7px] rounded-full transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40"
          >
            Start free
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0e0e1a] border-t border-white/[0.06] px-6 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-white/70 hover:text-white text-sm font-medium border-b border-white/[0.05] last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-4">
            <a href="#" className="flex-1 text-center py-2.5 text-sm text-white/70 border border-white/10 rounded-full">
              Sign In
            </a>
            <a href="#pricing" className="flex-1 text-center py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-full">
              Start free →
            </a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
