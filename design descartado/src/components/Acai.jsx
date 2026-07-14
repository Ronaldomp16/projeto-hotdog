import { useState } from 'react'
import { useReveal } from '../hooks/useReveal.js'
import AddOns from './AddOns.jsx'
import CartIcon from './icons/CartIcon.jsx'
import { useCart } from '../context/CartContext.jsx'

const SIZES = [
  { id: 300, label: '300ml', price: 15, limit: 3, visual: 76 },
  { id: 500, label: '500ml', price: 20, limit: 4, visual: 100 },
  { id: 700, label: '700ml', price: 25, limit: 5, visual: 124 },
]

const TOPPING_GROUPS = [
  {
    label: 'Frutas',
    icon: '🍓',
    type: 'fruta',
    dot: '#ff6f91',
    items: [
      { id: 'fruta-banana', label: 'Banana' },
      { id: 'fruta-morango', label: 'Morango' },
    ],
  },
  {
    label: 'Cremes',
    icon: '🍦',
    type: 'creme',
    dot: '#ffd76b',
    items: [
      { id: 'creme-maracuja', label: 'Maracujá' },
      { id: 'creme-morango', label: 'Morango' },
      { id: 'creme-ninho', label: 'Ninho' },
    ],
  },
  {
    label: 'Acompanhamentos',
    icon: '🍪',
    type: 'acompanhamento',
    dot: '#c98b4a',
    items: [
      { id: 'pacoca', label: 'Paçoca' },
      { id: 'amendoim', label: 'Amendoim' },
      { id: 'flocos-arroz', label: 'Flocos de Arroz' },
      { id: 'mel', label: 'Mel' },
      { id: 'granola', label: 'Granola' },
      { id: 'chocoball', label: 'Chocoball' },
      { id: 'farinha-lactea', label: 'Farinha Láctea' },
      { id: 'leite-condensado', label: 'Leite Condensado' },
      { id: 'leite-po', label: 'Leite em Pó' },
      { id: 'ovomaltine', label: 'Ovomaltine' },
      { id: 'confeti', label: 'Confeti' },
    ],
  },
]

const ALL_TOPPINGS = TOPPING_GROUPS.flatMap((g) => g.items.map((item) => ({ ...item, dot: g.dot })))

export default function Acai() {
  const { addItem } = useCart()
  const [headRef, headIn] = useReveal()
  const [size, setSize] = useState(SIZES[1])
  const [selected, setSelected] = useState([])
  const [justAdded, setJustAdded] = useState(false)

  const toggleTopping = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id)
      if (prev.length >= size.limit) return prev
      return [...prev, id]
    })
  }

  const changeSize = (next) => {
    setSize(next)
    setSelected((prev) => prev.slice(0, next.limit))
  }

  const selectedItems = selected.map((id) => ALL_TOPPINGS.find((t) => t.id === id)).filter(Boolean)

  const handleAdd = () => {
    addItem({
      name: `Açaí ${size.label}`,
      details: selectedItems.length ? selectedItems.map((t) => t.label).join(', ') : 'sem acompanhamentos',
      price: size.price,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <section id="acai" className="relative bg-surface/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div ref={headRef} className={`reveal mb-12 max-w-lg ${headIn ? 'in' : ''}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-acai-soft">Açaí</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Monte o seu <span className="text-gradient-acai">açaí</span>
          </h2>
          <p className="mt-3 text-sm text-mute">
            Escolha o tamanho e recheie do seu jeito. Frutas, cremes e acompanhamentos já incluídos no preço.
          </p>
        </div>

        <div className="grid gap-8 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[260px_1fr]">
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex h-[150px] w-full items-end justify-center">
              <div
                className="relative rounded-b-full rounded-t-[42%] bg-gradient-to-b from-acai-soft to-acai shadow-neon-acai transition-all duration-300"
                style={{ width: size.visual, height: size.visual }}
              >
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[35%] rounded-full bg-gradient-to-br from-acai-soft to-acai/70"
                  style={{ width: size.visual * 0.88, height: size.visual * 0.4 }}
                />
                {selectedItems.map((t, i) => {
                  const angle = (i / Math.max(selectedItems.length, 1)) * Math.PI * 2 - Math.PI / 2
                  const rx = size.visual * 0.3
                  const ry = size.visual * 0.12
                  const left = size.visual / 2 + Math.cos(angle) * rx
                  const top = size.visual * 0.12 + Math.sin(angle) * ry
                  return (
                    <span
                      key={t.id}
                      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-ink/50"
                      style={{ left, top, backgroundColor: t.dot }}
                    />
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => changeSize(s)}
                  className={`flex flex-col items-center rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${
                    size.id === s.id
                      ? 'border-acai-soft bg-acai/10 text-acai-soft'
                      : 'border-line text-mute hover:border-line-strong hover:text-ivory'
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="mt-0.5 text-[10px] text-mute">R$ {s.price}</span>
                </button>
              ))}
            </div>

            <div className="w-full">
              <div className="mb-1.5 flex items-center justify-between text-[11px] text-mute">
                <span>Acompanhamentos</span>
                <span className="font-semibold text-acai-soft">
                  {selected.length}/{size.limit}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-acai to-acai-soft transition-all duration-300"
                  style={{ width: `${(selected.length / size.limit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            {TOPPING_GROUPS.map((group) => (
              <div key={group.label} className="mb-5 last:mb-0">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-mute">
                  <span>{group.icon}</span>
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isSelected = selected.includes(item.id)
                    const disabled = !isSelected && selected.length >= size.limit
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleTopping(item.id)}
                        disabled={disabled}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'border-acai-soft bg-acai/15 text-acai-soft'
                            : disabled
                              ? 'cursor-not-allowed border-line text-mute/40'
                              : 'border-line text-mute hover:border-line-strong hover:text-ivory'
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="mt-6 rounded-xl border border-dashed border-line-strong bg-surface-2/60 px-4 py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-mute">Seu açaí</p>
              {selectedItems.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedItems.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => toggleTopping(t.id)}
                      className="flex items-center gap-1 rounded-full border border-acai-soft/40 bg-acai/10 px-2.5 py-1 text-[11px] font-medium text-acai-soft transition-colors hover:border-acai-soft"
                    >
                      {t.label}
                      <span className="text-acai-soft/60">&times;</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-xs text-mute">
                  Ainda sem acompanhamentos. Escolha até {size.limit}, sem custo extra.
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-display text-2xl font-bold text-ivory">R$ {size.price}</span>
                <span className="ml-1.5 text-[10px] font-medium text-mute">{size.label}</span>
              </div>
              <button
                onClick={handleAdd}
                className={`flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-center text-xs font-bold transition-all ${
                  justAdded ? 'bg-yellow text-ink' : 'bg-acai text-ivory shadow-neon-acai hover:-translate-y-0.5'
                }`}
              >
                {justAdded ? (
                  <>&#10003; Adicionado</>
                ) : (
                  <>
                    <CartIcon className="h-3.5 w-3.5" />
                    Adicionar ao carrinho
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddOns context="acai" />
    </section>
  )
}
