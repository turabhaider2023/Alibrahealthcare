import { useId } from 'react'

export function stripName(productName = '') {
  const short = productName.replace(/^(?:Alibra|YZAR)\s+/i, '').trim()
  if (short.length <= 14) return short || 'Daily'
  const words = short.split(/\s+/)
  const two = words.slice(0, 2).join(' ')
  return two.length <= 14 ? two : words[0]
}
const rows = [68, 98, 128, 158, 188]
const cols = [34, 86]

export default function Strip({ tint = '#f0d48a', tablet = '#c9922a', name = 'D3' }) {
  const foilId = `foil-${useId().replace(/:/g, '')}`

  return (
    <svg viewBox="0 0 120 214" aria-hidden="true">
      <defs>
        <linearGradient id={foilId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf8f2" />
          <stop offset="42%" stopColor="#e6dfd2" />
          <stop offset="100%" stopColor="#c9c0b0" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="114" height="208" rx="8" fill={`url(#${foilId})`} stroke="#b5ab9a" />
      <path d="M3 11a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8v30H3V11z" fill={tint} />
      <text x="60" y="20" textAnchor="middle" fontSize="8" fontFamily="Georgia, serif" letterSpacing="1.4" fill="#16382c">
        YZAR
      </text>
      <text x="60" y="36" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fill="#16382c">
        {name}
      </text>
      <line x1="60" y1="50" x2="60" y2="200" stroke="#b5ab9a" strokeDasharray="1.5 3" />
      {rows.map((y) =>
        cols.map((x) => (
          <g key={`${x}-${y}`}>
            <ellipse cx={x} cy={y + 1.5} rx="16" ry="11" fill="#8d8476" opacity="0.28" />
            <ellipse cx={x} cy={y} rx="16" ry="11" fill="#fff" opacity="0.72" />
            <ellipse cx={x} cy={y} rx="13" ry="8.5" fill={tablet} />
            <ellipse cx={x - 4} cy={y - 3} rx="5" ry="2.4" fill="#fff" opacity="0.7" />
          </g>
        )),
      )}
      <text x="60" y="207" textAnchor="middle" fontSize="7" fontFamily="Georgia, serif" fill="#5c6b63">
        10 tablets
      </text>
    </svg>
  )
}
