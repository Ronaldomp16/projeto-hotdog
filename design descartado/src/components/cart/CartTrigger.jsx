import { useCart } from '../../context/CartContext.jsx'
import CartIcon from '../icons/CartIcon.jsx'

export default function CartTrigger({ className = '' }) {
  const { items, toggle } = useCart()

  return (
    <button
      onClick={toggle}
      aria-label="Ver carrinho"
      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ivory transition-colors hover:border-line-strong ${className}`}
    >
      <CartIcon className="h-5 w-5" />
      {items.length > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-ink">
          {items.length}
        </span>
      )}
    </button>
  )
}
