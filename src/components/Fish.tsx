export type Scheme = "orange" | "blue" | "purple";

const SCHEMES: Record<
  Scheme,
  { light: string; body: string; fin: string; finDark: string; belly: string }
> = {
  orange: {
    light: "#FFD24A",
    body: "#F59E0B",
    fin: "#F2812C",
    finDark: "#D97706",
    belly: "#FDE68A",
  },
  blue: {
    light: "#7DBBFA",
    body: "#3B82F6",
    fin: "#2563EB",
    finDark: "#1D4ED8",
    belly: "#BFDBFE",
  },
  purple: {
    light: "#C58BF5",
    body: "#A855F7",
    fin: "#8B5CF6",
    finDark: "#7C3AED",
    belly: "#E9D5FF",
  },
};

type FishProps = {
  scheme: Scheme;
  number: number;
  flip?: boolean;
  className?: string;
  swimming?: boolean;
};

export default function Fish({
  scheme,
  number,
  flip = false,
  className = "",
  swimming = true,
}: FishProps) {
  const c = SCHEMES[scheme];
  const gradId = `fish-body-${scheme}`;
  const finId = `fish-fin-${scheme}`;
  // body center is at x=130; when mirrored it moves to 250-130=120
  const numX = flip ? 120 : 130;

  return (
    <svg
      viewBox="0 0 250 160"
      className={`${className} ${swimming ? "fish-swim" : ""}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.finDark} />
        </radialGradient>
        <linearGradient id={finId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.fin} />
          <stop offset="100%" stopColor={c.finDark} />
        </linearGradient>
      </defs>

      {/* flip the whole fish horizontally without touching the svg transform */}
      <g transform={flip ? "translate(250,0) scale(-1,1)" : undefined}>
        {/* Tail */}
        <path
          d="M80,80 C62,58 40,44 24,40 C34,62 34,98 24,120 C40,116 62,102 80,80 Z"
          fill={`url(#${finId})`}
          stroke={c.finDark}
          strokeWidth="2"
        />

        {/* Dorsal (top) fin */}
        <path
          d="M120,42 C132,16 168,10 188,40 C168,36 140,38 120,42 Z"
          fill={`url(#${finId})`}
          stroke={c.finDark}
          strokeWidth="2"
        />

        {/* Bottom fin */}
        <path
          d="M128,116 C140,142 172,146 186,118 C170,122 148,120 128,116 Z"
          fill={`url(#${finId})`}
          stroke={c.finDark}
          strokeWidth="2"
        />

        {/* Body */}
        <path
          d="M82,80 C86,48 122,30 164,34 C206,38 230,56 230,80 C230,104 206,122 164,126 C122,130 86,112 82,80 Z"
          fill={`url(#${gradId})`}
          stroke={c.finDark}
          strokeWidth="2.5"
        />

        {/* Belly highlight */}
        <path
          d="M100,110 C130,124 180,120 214,96 C206,116 180,126 150,124 C128,122 112,118 100,110 Z"
          fill={c.belly}
          opacity="0.55"
        />

        {/* Pectoral (side) fin */}
        <path
          d="M156,96 C170,116 162,128 148,120 C142,112 145,102 156,96 Z"
          fill={c.fin}
          opacity="0.9"
        />

        {/* Gill line */}
        <path
          d="M182,52 Q192,80 182,108"
          fill="none"
          stroke={c.finDark}
          strokeWidth="2.5"
          opacity="0.5"
        />

        {/* Eye */}
        <circle cx="196" cy="66" r="15" fill="#ffffff" />
        <circle cx="199" cy="66" r="8" fill="#1e293b" />
        <circle cx="196" cy="62" r="3" fill="#ffffff" />

        {/* Smile */}
        <path
          d="M212,86 Q222,94 230,86"
          fill="none"
          stroke="#1e293b"
          strokeWidth="3"
          strokeLinecap="round"
        />

      </g>

      {/* Number oval — outside the flipped group so digits are never mirrored */}
      <ellipse
        cx={numX}
        cy="80"
        rx="40"
        ry="34"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
      <text
        x={numX}
        y="80"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={String(number).length >= 3 ? 36 : 46}
        fontWeight="800"
        fill="#334155"
        fontFamily="system-ui, sans-serif"
      >
        {number}
      </text>
    </svg>
  );
}
