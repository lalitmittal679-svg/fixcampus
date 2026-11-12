/** Original flat illustration of a campus tower block. Swap for a real photograph when you have one. */
export function CampusIllustration({ className = '' }: { className?: string }) {
  const windows: JSX.Element[] = []
  for (let r = 0; r < 11; r++) for (let c = 0; c < 5; c++) {
    windows.push(<rect key={`${r}-${c}`} x={196 + c * 24} y={80 + r * 24} width="14" height="14" rx="2" fill={(r * 5 + c) % 7 === 0 ? '#F4D9B5' : '#CFE0D8'} />)
  }
  return (
    <svg viewBox="0 0 560 520" className={className} role="img" aria-label="Illustration of a campus tower building with trees">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6EEF8" /><stop offset="1" stopColor="#F7F7F4" /></linearGradient>
      </defs>
      <rect width="560" height="520" fill="url(#sky)" />
      <circle cx="450" cy="90" r="34" fill="#FFF1E3" />
      <path d="M0 330 Q140 290 280 320 T560 300 V520 H0z" fill="#E4F0EA" />
      <rect x="170" y="60" width="140" height="290" rx="6" fill="#174C40" />
      <rect x="186" y="72" width="108" height="266" rx="3" fill="#10382F" />
      {windows}
      <rect x="150" y="40" width="180" height="20" rx="4" fill="#0D2D26" />
      <rect x="60" y="250" width="120" height="100" rx="4" fill="#2A6A59" />
      <rect x="310" y="230" width="150" height="120" rx="4" fill="#2A6A59" />
      {Array.from({ length: 4 }).map((_, i) => <rect key={`l${i}`} x={72 + i * 26} y="268" width="16" height="22" rx="2" fill="#CFE0D8" />)}
      {Array.from({ length: 5 }).map((_, i) => <rect key={`r${i}`} x={324 + i * 26} y="250" width="16" height="22" rx="2" fill="#CFE0D8" />)}
      <rect x="236" y="300" width="28" height="50" rx="3" fill="#F7F7F4" />
      <path d="M0 350 H560 V520 H0z" fill="#F0F2EC" />
      <path d="M210 350 L170 520 H330 L270 350z" fill="#E9EAE7" />
      {[[70, 380], [120, 410], [440, 390], [500, 360]].map(([x, y], i) => (
        <g key={i}><rect x={x - 3} y={y} width="6" height="40" fill="#7C5B3B" /><circle cx={x} cy={y - 8} r={26 - (i % 2) * 4} fill="#2A6A59" /><circle cx={x + 12} cy={y + 4} r="16" fill="#3C8470" /></g>
      ))}
      <g fill="#416FAD"><circle cx="360" cy="440" r="7" /><rect x="353" y="449" width="14" height="22" rx="5" /></g>
      <g fill="#E9A66B"><circle cx="392" cy="448" r="7" /><rect x="385" y="457" width="14" height="22" rx="5" /></g>
    </svg>
  )
}
