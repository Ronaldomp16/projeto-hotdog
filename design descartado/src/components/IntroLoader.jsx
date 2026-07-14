import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const PUFFS = [0, 0.28, 0.56, 0.84, 1.12]

export default function IntroLoader({ onCanvasReady }) {
  const [mounted, setMounted] = useState(true)
  const [fading, setFading] = useState(false)
  const [ready, setReady] = useState(false)
  const h1Ref = useRef(null)
  const [anchor, setAnchor] = useState(null)

  useLayoutEffect(() => {
    let cancelled = false
    // esperar a fonte Fredoka carregar (ou um limite curto) ANTES de medir/animar:
    // medir cedo demais captura a métrica da fonte fallback, e a troca pra Fredoka
    // no meio do voo empurraria o h1/comboio, causando o soluço na animação
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const timeout = new Promise((resolve) => setTimeout(resolve, 300))
    Promise.race([fontsReady, timeout]).then(() => {
      if (cancelled || !h1Ref.current) return
      const rect = h1Ref.current.getBoundingClientRect()
      setAnchor({ top: rect.top + rect.height / 2, left: rect.right })
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    // o Hero3D fica com o Canvas (WebGL) desligado até aqui: renderizar o comboio 3D
    // rodando em paralelo com a animação CSS do comboio é o que causava o soluço/travada
    const fadeTimer = setTimeout(() => {
      setFading(true)
      onCanvasReady?.()
    }, 5200)
    const unmountTimer = setTimeout(() => setMounted(false), 6000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(unmountTimer)
    }
  }, [ready, onCanvasReady])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex min-h-dvh flex-col justify-center overflow-hidden bg-ink pt-28 pb-16 transition-opacity duration-700 ease-out md:pt-32 md:pb-20 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* réplica exata do layout da Hero3D: só o h1 fica visível, o resto reserva o mesmo espaço
          pra garantir que a posição de repouso (translateX 0) coincida pixel a pixel com o h1 estático */}
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-6">
        <div className="text-center md:text-left">
          <span className="invisible mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
            Food truck &middot; DF
          </span>

          <h1
            ref={h1Ref}
            className={`${ready ? 'animate-convoy-enter-hold' : 'invisible'} title-pop font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl`}
          >
            O Hot Dog que tem a <span className="text-gradient">cara de Brasília</span>!
          </h1>

          <p className="invisible mx-auto mt-5 max-w-md text-base text-mute md:mx-0">
            O melhor cachorro-quente do Itapoã Parque e do Grande Colorado, feito na chapa, na hora, do seu jeito.
          </p>

          <div className="invisible mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <span className="rounded-full px-7 py-3.5 text-sm font-bold">Ver cardápio</span>
            <span className="rounded-full px-7 py-3.5 text-sm font-bold">Contratar para eventos</span>
          </div>
        </div>

        <div className="relative h-[300px] sm:h-[360px] md:h-[440px]" />
      </div>

      {/* comboio: carro na frente puxa o carrinho, carrinho puxa a corda até o texto */}
      {anchor && (
        <div
          className="animate-convoy-drive pointer-events-none absolute flex -translate-y-1/2 items-center gap-2"
          style={{ top: anchor.top, left: anchor.left }}
        >
          <span className="animate-rope-release h-0.5 w-10 origin-left border-t-2 border-dashed border-mute sm:w-16" />

          <div className="relative shrink-0">
            {PUFFS.map((delay, i) => (
              <span
                key={i}
                className="animate-smoke-puff absolute -left-3 bottom-4 h-3 w-3 rounded-full bg-mute/70"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
            <img
              src="/intro-cart.png"
              alt=""
              className="h-16 w-auto sm:h-20 md:h-24"
            />
          </div>

          <span className="h-1 w-3 shrink-0 rounded-full bg-mute/70 sm:w-4" />

          <img
            src="/intro-car.png"
            alt=""
            className="h-16 w-auto sm:h-20 md:h-24"
          />
        </div>
      )}
    </div>
  )
}
