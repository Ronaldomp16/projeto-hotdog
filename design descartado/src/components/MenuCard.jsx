import { useState } from 'react'
import CartIcon from './icons/CartIcon.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function MenuCard({ item, featured = false }) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    addItem({ name: item.name, price: item.price })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <article className="group relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-3xl border border-line bg-surface p-5 transition-all duration-300 snap-start hover:-translate-y-1 hover:border-line-strong sm:w-auto">
      {featured && (
        <span className="absolute left-5 top-5 z-10 rounded-full bg-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ink">
          Mais pedido
        </span>
      )}

      <div className="flex h-40 items-center justify-center rounded-2xl bg-surface-2 p-3">
        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
      </div>

      <h3 className="mt-5 font-display text-lg font-bold text-ivory">{item.name}</h3>
      <p className="mt-1.5 min-h-[64px] text-[13.5px] leading-relaxed text-mute line-clamp-3">{item.description}</p>

      {item.tags?.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-mute"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="font-display text-2xl font-bold text-ivory">R$ {item.price}</span>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition-all ${
            justAdded ? 'bg-yellow text-ink' : 'bg-orange text-ink shadow-neon-orange hover:-translate-y-0.5'
          }`}
        >
          {justAdded ? (
            <>&#10003; Adicionado</>
          ) : (
            <>
              <CartIcon className="h-3.5 w-3.5" />
              Adicionar
            </>
          )}
        </button>
      </div>
    </article>
  )
}
