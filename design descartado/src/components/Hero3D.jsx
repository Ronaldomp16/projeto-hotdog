import Skyline from './Skyline.jsx'

export default function Hero3D({ activateCanvas = true }) {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-ink pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,160,27,0.22),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(244,255,42,0.12),transparent_40%)]" />
      <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full text-orange sm:h-48" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-6">
        <div className="animate-fade-up text-center md:text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
            Food truck &middot; DF
          </span>

          <h1 className="title-pop font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            O Hot Dog que tem a <span className="text-gradient">cara de Brasília</span>!
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base text-mute md:mx-0">
            O melhor cachorro-quente do Itapoã Parque e do Grande Colorado, feito na chapa, na hora, do seu jeito.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#cardapio"
              className="group relative overflow-hidden rounded-full bg-orange px-7 py-3.5 text-sm font-bold text-ink shadow-neon-orange transition-transform hover:-translate-y-1"
            >
              <span className="relative z-10">Ver cardápio</span>
              <span className="absolute inset-0 -translate-x-full bg-yellow transition-transform duration-300 group-hover:translate-x-0" />
            </a>
            <a
              href="#eventos"
              className="rounded-full border border-line-strong px-7 py-3.5 text-sm font-bold text-ivory transition-colors hover:border-yellow hover:text-yellow"
            >
              Contratar para eventos
            </a>
          </div>
        </div>

        <div className="relative flex h-[300px] items-center justify-center sm:h-[360px] md:h-[440px]">
          {activateCanvas && (
            <div className="animate-float relative aspect-square w-[65%] max-w-[280px]">
              <div className="absolute inset-[-18%] rounded-full bg-orange/25 blur-3xl" />
              <img
                src="/logo-transparent.png?v=5"
                alt="Dog do Quadradinho"
                className="relative h-full w-full rounded-full object-contain shadow-neon-orange"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
