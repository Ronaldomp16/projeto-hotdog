import { useReveal } from '../hooks/useReveal.js'

export default function QuemSomos() {
  const [ref, inView] = useReveal()

  return (
    <section className="relative overflow-hidden bg-orange py-16 text-ink sm:py-20">
      <div
        ref={ref}
        className={`reveal mx-auto max-w-4xl px-6 text-center ${inView ? 'in' : ''}`}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-ink/70">Quem somos</span>
        <h2 className="title-pop-dark mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          O legítimo food truck de Brasília
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-ink/80 sm:text-lg">
          O Dog do Quadradinho nasceu no coração do DF e hoje tem presença fixa no{' '}
          <strong className="font-bold text-ink">Itapoã Parque</strong> e no{' '}
          <strong className="font-bold text-ink">Império dos Nobres (Grande Colorado)</strong>,
          além de rodar os melhores eventos da cidade. Cachorro-quente feito na chapa, com pão
          quentinho e a cara de Brasília em cada mordida.
        </p>
      </div>
    </section>
  )
}
