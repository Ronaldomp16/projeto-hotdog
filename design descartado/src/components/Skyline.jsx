// Silhueta estilizada do skyline de Brasília (Torre de TV, Catedral, Congresso)
// usada como elemento decorativo sutil, ecoando a logomarca.
export default function Skyline({ className = '', color = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 1440 180"
      preserveAspectRatio="none"
      className={className}
      fill={color}
      aria-hidden="true"
    >
      {/* linha de base de prédios do Eixo Monumental */}
      <rect x="0" y="140" width="1440" height="40" />
      <rect x="40" y="118" width="26" height="62" />
      <rect x="90" y="128" width="34" height="52" />
      <rect x="150" y="108" width="22" height="72" />

      {/* Congresso Nacional: cúpulas + torres gêmeas */}
      <g>
        <ellipse cx="620" cy="140" rx="46" ry="18" />
        <ellipse cx="720" cy="128" rx="34" ry="26" />
        <rect x="665" y="60" width="16" height="90" rx="4" />
        <rect x="692" y="60" width="16" height="90" rx="4" />
      </g>

      {/* Catedral: coroa de arcos */}
      <g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const cx = 860 + i * 22
          return <path key={i} d={`M${cx - 10} 150 Q${cx} 78 ${cx + 10} 150 Z`} />
        })}
      </g>

      {/* Torre de TV */}
      <g>
        <rect x="1120" y="40" width="6" height="110" />
        <circle cx="1123" cy="34" r="16" />
        <rect x="1105" y="66" width="36" height="6" />
      </g>

      <rect x="1220" y="112" width="24" height="68" />
      <rect x="1256" y="96" width="30" height="84" />
      <rect x="1310" y="122" width="20" height="58" />
    </svg>
  )
}
