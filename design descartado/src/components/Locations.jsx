import { useReveal } from '../hooks/useReveal.js'
import { WHATSAPP_NUMBER } from '../config.js'

const LOCATIONS = [
  {
    tag: 'Fixo',
    tagColor: 'bg-orange',
    title: 'Unidade Itapoã Parque',
    detail: 'Ponto fixo, todos os dias',
    hours: 'Ter a dom · 18h às 23h',
    address: null,
    icon: '📍',
  },
  {
    tag: 'Fixo',
    tagColor: 'bg-orange',
    title: 'Império dos Nobres',
    detail: 'Grande Colorado',
    hours: 'Qui a dom · 18h às 23h',
    address: null,
    icon: '📍',
  },
  {
    tag: 'Móvel',
    tagColor: 'bg-yellow',
    title: 'Truck na Rua',
    detail: 'Próximos eventos',
    hours: 'Agenda variável — confira no Instagram',
    address: 'Feiras, praças e eventos pelo DF',
    icon: '🚚',
  },
]

export default function Locations() {
  const [headRef, headIn] = useReveal()

  return (
    <section id="localidades" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div ref={headRef} className={`reveal mb-12 max-w-lg ${headIn ? 'in' : ''}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-soft">Onde estamos</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Fixo ou na rua, sempre por perto</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.title} loc={loc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LocationCard({ loc, index }) {
  const [ref, inView] = useReveal()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 0.1}s` }}
      className={`reveal group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-colors hover:border-line-strong ${
        inView ? 'in' : ''
      }`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-3xl bg-orange/10 blur-2xl transition-opacity group-hover:opacity-80" />

      <div className="flex items-center justify-between">
        <span className="text-2xl">{loc.icon}</span>
        <span className={`rounded-full ${loc.tagColor} px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ink`}>
          {loc.tag}
        </span>
      </div>

      <h3 className="mt-5 font-display text-xl font-bold text-ivory">{loc.title}</h3>
      <p className="text-sm font-medium text-orange-soft">{loc.detail}</p>

      <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-mute">
        <p className="flex items-center gap-2">
          <span className="text-yellow">⏰</span> {loc.hours}
        </p>
        <p className="flex items-center gap-2">
          <span className="text-yellow">📌</span>
          {loc.address ?? (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange-soft underline decoration-dotted underline-offset-2 hover:text-orange"
            >
              Endereço em breve — chama no WhatsApp
            </a>
          )}
        </p>
      </div>
    </div>
  )
}
