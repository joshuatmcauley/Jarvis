type BeeProps = {
  className?: string
  title?: string
}

export function Bee({ className, title }: BeeProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      <path
        className="bee-trail"
        d="M18 92 C28 70 46 62 58 74 C64 82 58 94 48 90"
        stroke="#111"
        strokeWidth="1.6"
        strokeDasharray="3 4"
        fill="none"
      />
      <g className="bee-wings">
        <ellipse cx="62" cy="42" rx="22" ry="14" fill="#fff" stroke="#111" strokeWidth="2" opacity="0.92" />
        <ellipse cx="108" cy="42" rx="22" ry="14" fill="#fff" stroke="#111" strokeWidth="2" opacity="0.92" />
      </g>
      <ellipse cx="86" cy="72" rx="32" ry="34" fill="#F4C430" stroke="#111" strokeWidth="2.4" />
      <rect x="62" y="58" width="48" height="10" rx="4" fill="#111" />
      <rect x="62" y="76" width="48" height="10" rx="4" fill="#111" />
      <circle cx="74" cy="48" r="8" fill="#fff" stroke="#111" strokeWidth="1.6" />
      <circle cx="98" cy="48" r="8" fill="#fff" stroke="#111" strokeWidth="1.6" />
      <circle cx="76" cy="49" r="3.2" fill="#111" />
      <circle cx="100" cy="49" r="3.2" fill="#111" />
      <path d="M78 58 Q86 64 94 58" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M76 30 Q80 12 70 8" stroke="#111" strokeWidth="2" fill="none" />
      <path d="M96 30 Q92 12 102 8" stroke="#111" strokeWidth="2" fill="none" />
      <circle cx="70" cy="8" r="3" fill="#EE7AA0" stroke="#111" strokeWidth="1.2" />
      <circle cx="102" cy="8" r="3" fill="#EE7AA0" stroke="#111" strokeWidth="1.2" />
      <path d="M86 18 C80 10 92 10 86 20 C92 12 96 18 86 18Z" fill="#EE7AA0" stroke="#111" strokeWidth="1.2" />
      <g className="bee-duster">
        <rect x="118" y="64" width="28" height="5" rx="2" fill="#111" transform="rotate(18 118 64)" />
        <ellipse cx="146" cy="58" rx="12" ry="16" fill="#F4B8C8" stroke="#111" strokeWidth="1.6" />
        <path d="M138 50 Q146 44 154 50" stroke="#EE7AA0" strokeWidth="1.4" fill="none" />
        <path d="M137 58 Q146 52 155 58" stroke="#EE7AA0" strokeWidth="1.4" fill="none" />
        <path d="M138 66 Q146 60 154 66" stroke="#EE7AA0" strokeWidth="1.4" fill="none" />
      </g>
      <path d="M54 98 Q48 118 42 122" stroke="#111" strokeWidth="2" />
      <path d="M118 98 Q124 118 130 122" stroke="#111" strokeWidth="2" />
    </svg>
  )
}
