'use client'

const links = {
  Product: ['How it works', 'Features', 'Pricing', 'Changelog'],
  Resources: ['Blog', 'Documentation', 'Support', 'Status'],
  Company: ['About', 'Twitter/X', 'Privacy Policy', 'Terms'],
}

export function Footer() {
  return (
    <footer
      className="py-16 relative"
      style={{
        background: '#08080f',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Brand */}
          <div className="flex-shrink-0 max-w-[240px]">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-7 h-7 rounded-[7px] flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L12.5 4.25V10.75L7 14L1.5 10.75V4.25L7 1Z" fill="white" fillOpacity="0.9" />
                  <circle cx="7" cy="7" r="2.5" fill="white" fillOpacity="0.5" />
                </svg>
              </div>
              <span className="text-white font-semibold text-[15px]">SaaSGenrt</span>
            </div>
            <p className="text-[13px] leading-[1.65]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              The fastest way to discover profitable SaaS ideas and launch your first product.
            </p>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-3 gap-8">
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <div className="text-white text-[12px] font-semibold tracking-wide uppercase mb-4">
                  {group}
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[13px] transition-colors"
                        style={{ color: 'rgba(255,255,255,0.45)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2025 SaaSGenrt. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
