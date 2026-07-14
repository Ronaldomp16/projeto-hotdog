import { WHATSAPP_NUMBER } from '../config.js'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <a href="#top" className="flex items-center gap-2.5 font-display text-base font-bold">
          <img src="/logo-transparent.png?v=5" alt="Dog do Quadradinho" className="h-8 w-8 rounded-full" />
          Dog do <span className="text-gradient">Quadradinho</span>
        </a>

        <div className="flex items-center gap-4 text-mute">
          {/* Instagram ainda não existe — sem link até ter perfil de verdade,
              melhor não ter o link do que apontar pra lugar nenhum */}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="transition-colors hover:text-orange">WhatsApp</a>
        </div>

        <p className="text-xs text-mute">© 2026 Dog do Quadradinho. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
