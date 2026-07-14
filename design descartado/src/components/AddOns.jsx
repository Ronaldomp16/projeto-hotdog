import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
// cada add-on é selecionável de forma independente (não é escolha única):
// dá pra pedir batata E refrigerante ao mesmo tempo. `selected` guarda o id
// do item no carrinho pra permitir desmarcar (remover) depois.

const ADDONS = [
  { id: 'batata', label: 'Batata Chips', price: 9, emoji: '🍟' },
  { id: 'refri', label: 'Refri Lata', price: 6, emoji: '🥤' },
  { id: 'suco', label: 'Suco Lata', price: 9, emoji: '🧃' },
  { id: 'agua-gas', label: 'Água com Gás', price: 5, emoji: '💧' },
  { id: 'agua-sem-gas', label: 'Água sem Gás', price: 4, emoji: '💧' },
  { id: 'sache-maionese', label: 'Sachê Extra de Maionese', price: 2, emoji: '🥫', context: 'dog' },
]

export default function AddOns({ context = 'dog' }) {
  const { addItem, removeItem } = useCart()
  const [selected, setSelected] = useState({})
  const contextLabel = context === 'acai' ? 'do seu açaí' : 'do seu quadradinho'
  const available = ADDONS.filter((a) => !a.context || a.context === context)

  const toggle = (item) => {
    const cartId = selected[item.id]
    if (cartId) {
      removeItem(cartId)
      setSelected((prev) => {
        const next = { ...prev }
        delete next[item.id]
        return next
      })
    } else {
      const id = addItem({ name: item.label, price: item.price })
      setSelected((prev) => ({ ...prev, [item.id]: id }))
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl px-6">
      <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange/15 text-base font-bold text-orange-soft">
            +
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-soft">
              Quer completar o pedido?
            </p>
            <p className="mt-0.5 text-sm text-mute">
              Adicione ao carrinho junto {contextLabel}, sem perder o que você já montou.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {available.map((item) => {
            const added = Boolean(selected[item.id])
            return (
              <button
                key={item.id}
                onClick={() => toggle(item)}
                aria-pressed={added}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  added
                    ? 'border-yellow bg-yellow/15 text-yellow'
                    : 'border-line bg-surface-2 text-ivory hover:border-line-strong'
                }`}
              >
                <span className="text-base leading-none">{item.emoji}</span>
                {item.label}
                <span className={added ? 'text-yellow/70' : 'text-mute'}>· R$ {item.price}</span>
                {added && <span>&#10003;</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
