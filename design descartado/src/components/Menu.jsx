import { useReveal } from '../hooks/useReveal.js'
import MenuCard from './MenuCard.jsx'
import AddOns from './AddOns.jsx'

const ITEMS = [
  {
    id: 'simples',
    name: 'Dog Simples',
    description: 'Pão de leite ninho, molho caseiro, salsicha, queijo, maionese caseira, milho e batata palha.',
    price: 18,
    featured: true,
    image: '/menu/dog-simples.svg',
    tags: ['Queijo', 'Milho', 'Batata Palha'],
  },
  {
    id: 'bacon',
    name: 'Dog Bacon',
    description: 'Pão de leite ninho, molho caseiro, salsicha, queijo, maionese caseira, milho, bacon crisp e batata palha.',
    price: 21,
    image: '/menu/dog-bacon.svg',
    tags: ['Queijo', 'Bacon Crisp', 'Milho'],
  },
  {
    id: 'sem-pao',
    name: 'Dog Sem Pão',
    description: 'Molho caseiro, salsicha, queijo, maionese caseira e milho servidos na caixinha, com batata. Sem pão.',
    price: 17,
    image: '/menu/dog-sem-pao.svg',
    tags: ['Queijo', 'Milho', 'Na Caixinha'],
  },
]

export default function Menu() {
  const [headRef, headIn] = useReveal()

  return (
    <section id="cardapio" className="relative bg-surface/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div ref={headRef} className={`reveal mb-12 max-w-lg ${headIn ? 'in' : ''}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-soft">Cardápio</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            O seu <span className="text-gradient">quadradinho</span>
          </h2>
          <p className="mt-3 text-sm text-mute">
            Pão quentinho, molho caseiro e recheio na medida certa. Escolha o seu.
          </p>
        </div>
      </div>

      <div className="rail mx-auto flex max-w-6xl gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
        {ITEMS.map((item) => (
          <MenuCard key={item.id} item={item} featured={item.featured} />
        ))}
      </div>

      <AddOns context="dog" />
    </section>
  )
}
