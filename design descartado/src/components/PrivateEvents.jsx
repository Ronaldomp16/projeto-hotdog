import { useReveal } from '../hooks/useReveal.js'
import { WHATSAPP_NUMBER } from '../config.js'

const PERSONAL = ['Aniversários', 'Casamentos', 'Confraternizações', 'Reuniões de família']
const CORPORATE = ['Eventos corporativos', 'Feiras e festivais', 'Ativações de rua', 'Grandes eventos do DF']

export default function PrivateEvents() {
  const [ref, inView] = useReveal()

  return (
    <section id="eventos" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(249,160,27,0.14),transparent_55%)]" />

      <div
        ref={ref}
        className={`reveal relative mx-auto max-w-4xl rounded-[2.5rem] border border-line-strong bg-surface px-8 py-14 text-center sm:px-16 ${
          inView ? 'in' : ''
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-orange-soft">Leve o truck</span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
          Do aniversário na garagem ao <span className="text-gradient">maior evento da cidade</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-mute">
          Do encontro íntimo com os amigos ao grande evento de rua, o Dog do Quadradinho monta a
          chapa onde você estiver, com cardápio personalizado e atendimento completo.
        </p>

        <div className="mt-8 grid gap-6 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface-2 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-yellow">Eventos pessoais</p>
            <div className="flex flex-wrap gap-2">
              {PERSONAL.map((o) => (
                <span
                  key={o}
                  className="rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-xs font-medium text-mute"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface-2 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-soft">Grandes eventos</p>
            <div className="flex flex-wrap gap-2">
              {CORPORATE.map((o) => (
                <span
                  key={o}
                  className="rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-xs font-medium text-mute"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Oi!%20Quero%20orçamento%20para%20contratar%20o%20Dog%20do%20Quadradinho%20em%20um%20evento.`}
          target="_blank"
          rel="noreferrer"
          className="group relative mt-9 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange px-8 py-4 text-sm font-bold text-ink shadow-neon-orange transition-transform hover:-translate-y-1"
        >
          <span className="relative z-10">📲 Fazer Orçamento para meu Evento</span>
          <span className="absolute inset-0 -translate-x-full bg-yellow transition-transform duration-300 group-hover:translate-x-0" />
        </a>
      </div>
    </section>
  )
}
