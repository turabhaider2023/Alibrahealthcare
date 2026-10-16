export function Heart({ filled = false }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.2S5.2 15.7 5.2 10.6C5.2 8.2 7 6.4 9.3 6.4c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.3 0 4.1 1.8 4.1 4.2 0 5.1-6.8 9.6-7.4 9.6z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Bag() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.4 8.2h11.2l-.9 11a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8l-.9-11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.2V7a3 3 0 0 1 6 0v1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
