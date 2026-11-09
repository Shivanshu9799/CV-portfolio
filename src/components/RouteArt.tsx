/** Decorative route-line drawing. Shape is derived from the slug only; it carries no data. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function RouteArt({ seed, className = '' }: { seed: string; className?: string }) {
  let h = hash(seed);
  const rnd = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    return (h & 0xffff) / 0xffff;
  };
  const pts: [number, number][] = [];
  const n = 6;
  for (let i = 0; i <= n; i++) pts.push([10 + (i * 300) / n, 22 + rnd() * 56]);
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]!;
    const [x, y] = pts[i]!;
    d += ` C ${(px + x) / 2} ${py}, ${(px + x) / 2} ${y}, ${x} ${y}`;
  }
  return (
    <svg viewBox="0 0 320 100" aria-hidden="true" focusable="false" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="100" fill="rgb(var(--navy))" />
      <g stroke="rgb(var(--on-navy))" strokeOpacity="0.07">
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} />
        ))}
      </g>
      <path d={d} fill="none" stroke="rgb(var(--navy-2))" strokeWidth="14" strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgb(var(--accent))" strokeWidth="1.6" strokeDasharray="7 6" />
      <circle cx={pts[0]![0]} cy={pts[0]![1]} r="4" fill="rgb(var(--accent))" />
      <circle cx={pts[n]![0]} cy={pts[n]![1]} r="4" fill="rgb(var(--accent))" />
    </svg>
  );
}
