export type ConstellationPoint = {
  x: number;
  y: number;
};

export function Constellation({
  className = "",
  connections,
  points,
  viewBox = "0 0 100 100",
}: {
  className?: string;
  connections?: Array<[number, number]>;
  points: ConstellationPoint[];
  viewBox?: string;
}) {
  const lineConnections =
    connections ??
    points
      .map((_, index) => [index, index + 1] as [number, number])
      .filter(([start, end]) => end < points.length && start % 3 !== 2);

  return (
    <svg
      className={`pointer-events-none absolute text-[color:var(--gold-light)] ${className}`}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
    >
      {lineConnections.map(([start, end]) => (
        <line
          key={`${start}-${end}`}
          x1={points[start].x}
          y1={points[start].y}
          x2={points[end].x}
          y2={points[end].y}
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="0.5"
        />
      ))}
      {points.map((point, index) => (
        <circle
          key={`${point.x}-${point.y}-${index}`}
          className="constellation-dot"
          cx={point.x}
          cy={point.y}
          r="1.4"
          fill="currentColor"
          style={{ animationDelay: `${index * 220}ms`, animationDuration: `${2 + (index % 4) * 0.45}s` }}
        />
      ))}
    </svg>
  );
}
