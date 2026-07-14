import { useEffect, useState } from 'react'
import { WHATSAPP_NUMBER } from '../config.js'
import CartTrigger from './cart/CartTrigger.jsx'

const LINKS = [
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#acai', label: 'Açaí' },
  { href: '#localidades', label: 'Localidades' },
  { href: '#eventos', label: 'Eventos Privados' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink/85 backdrop-blur-md border-b border-line py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight">
          <img
            src="/logo-transparent.png?v=5"
            alt="Dog do Quadradinho"
            className="animate-float h-11 w-11 rounded-full shadow-neon-orange sm:h-12 sm:w-12"
          />
          <span className="hidden sm:inline">
            Dog do <span className="text-gradient">Quadradinho</span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-mute transition-colors hover:text-ivory"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartTrigger className="hidden md:grid" />

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-ink shadow-neon-orange transition-transform hover:-translate-y-0.5 md:inline-block"
          >
            Pedir no WhatsApp
          </a>

          <CartTrigger className="md:hidden" />

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md border border-line md:hidden"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 bg-ivory" />
              <span className="h-0.5 w-5 bg-ivory" />
              <span className="h-0.5 w-5 bg-ivory" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-6 mt-4 flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-mute hover:bg-surface-2 hover:text-ivory"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 rounded-full bg-orange px-4 py-2.5 text-center text-sm font-semibold text-ink"
          >
            Pedir no WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
