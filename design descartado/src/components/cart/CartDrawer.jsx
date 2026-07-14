import { useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import { WHATSAPP_NUMBER } from '../../config.js'
import WhatsAppIcon from '../icons/WhatsAppIcon.jsx'

function buildOrderMessage({ items, total, name, address, notes }) {
  const lines = items.map(
    (item) =>
      `• ${item.quantity}x ${item.name}${item.details ? ` — ${item.details}` : ''} (R$ ${item.price * item.quantity})`,
  )

  return [
    '*Pedido — Dog do Quadradinho*',
    '',
    ...lines,
    '',
    `*Total: R$ ${total}*`,
    '',
    `*Cliente:* ${name}`,
    `*Endereço de entrega:* ${address}`,
    notes ? `*Observações:* ${notes}` : null,
    '',
    'Aguardo a confirmação por aqui, obrigado!',
  ]
    .filter((line) => line !== null)
    .join('\n')
}

export default function CartDrawer() {
  const { items, removeItem, setQuantity, total, clear, isOpen, close } = useCart()
  const [step, setStep] = useState('cart')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [touched, setTouched] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    close()
    setTimeout(() => {
      setStep('cart')
      setTouched(false)
    }, 300)
  }

  const handleConfirm = () => {
    setTouched(true)
    if (!name.trim() || !address.trim()) return

    const message = buildOrderMessage({
      items,
      total,
      name: name.trim(),
      address: address.trim(),
      notes: notes.trim(),
    })

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noreferrer')
    clear()
    setStep('success')
  }

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <button aria-label="Fechar carrinho" onClick={handleClose} className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />

      <div className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-2xl sm:border-l sm:border-line">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-display text-lg font-bold text-ivory">
            {step === 'cart' && 'Seu carrinho'}
            {step === 'checkout' && 'Finalizar pedido'}
            {step === 'success' && 'Pedido enviado'}
          </h3>
          <button
            onClick={handleClose}
            aria-label="Fechar"
            className="grid h-8 w-8 place-items-center rounded-full text-lg text-mute hover:text-ivory"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 'cart' &&
            (items.length === 0 ? (
              <p className="mt-10 text-center text-sm text-mute">
                Seu carrinho está vazio. Monte um dog ou um açaí ali em cima pra começar.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-line bg-surface-2/60 px-3.5 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ivory">{item.name}</p>
                      {item.details && <p className="mt-0.5 text-xs text-mute">{item.details}</p>}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          aria-label="Diminuir quantidade"
                          className="grid h-6 w-6 place-items-center rounded-full border border-line text-mute hover:border-line-strong hover:text-ivory"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-xs font-semibold text-ivory">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumentar quantidade"
                          className="grid h-6 w-6 place-items-center rounded-full border border-line text-mute hover:border-line-strong hover:text-ivory"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="text-sm font-semibold text-ivory">R$ {item.price * item.quantity}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover item"
                        className="text-lg leading-none text-mute hover:text-orange-soft"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {step === 'checkout' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className={`w-full rounded-xl border bg-surface-2 px-3.5 py-2.5 text-sm text-ivory placeholder:text-mute/60 focus:outline-none ${
                    touched && !name.trim() ? 'border-red-500' : 'border-line focus:border-line-strong'
                  }`}
                />
                {touched && !name.trim() && <p className="mt-1 text-[11px] text-red-400">Preenche seu nome pra gente saber quem é.</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute">
                  Endereço de entrega
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, ponto de referência"
                  rows={3}
                  className={`w-full resize-none rounded-xl border bg-surface-2 px-3.5 py-2.5 text-sm text-ivory placeholder:text-mute/60 focus:outline-none ${
                    touched && !address.trim() ? 'border-red-500' : 'border-line focus:border-line-strong'
                  }`}
                />
                {touched && !address.trim() && (
                  <p className="mt-1 text-[11px] text-red-400">Precisamos do endereço pra levar o pedido até você.</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute">
                  Observações (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ponto da carne, troco, etc."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-ivory placeholder:text-mute/60 focus:border-line-strong focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-orange/15 text-2xl">✅</span>
              <p className="text-sm text-mute">
                Seu pedido foi aberto no WhatsApp com tudo preenchido. É só confirmar o envio da mensagem por lá pra gente
                começar a preparar!
              </p>
            </div>
          )}
        </div>

        {step === 'cart' && items.length > 0 && (
          <div className="border-t border-line px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-mute">Total</span>
              <span className="font-display text-xl font-bold text-ivory">R$ {total}</span>
            </div>
            <button
              onClick={() => setStep('checkout')}
              className="w-full rounded-full bg-orange px-4 py-3 text-sm font-bold text-ink shadow-neon-orange transition-transform hover:-translate-y-0.5"
            >
              Finalizar pedido
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <div className="border-t border-line px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-mute">Total</span>
              <span className="font-display text-xl font-bold text-ivory">R$ {total}</span>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setStep('cart')}
                className="rounded-full border border-line px-4 py-3 text-sm font-semibold text-mute hover:text-ivory"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-orange px-4 py-3 text-sm font-bold text-ink shadow-neon-orange transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Confirmar e enviar
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="border-t border-line px-5 py-4">
            <button
              onClick={handleClose}
              className="w-full rounded-full border border-line px-4 py-3 text-sm font-semibold text-ivory hover:border-line-strong"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
