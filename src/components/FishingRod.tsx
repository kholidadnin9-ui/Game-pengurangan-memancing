import { useEffect, useRef } from "react";

const ROD_TIP = { x: 41.5, y: 9 };
const HOOK_REST = { x: 43, y: 46 };

type Pt = { x: number; y: number };

// Convert percentage coords to the 1000x625 SVG viewBox space
const toVB = (p: Pt) => ({ x: p.x * 10, y: p.y * 6.25 });

type FishingRodProps = {
  target: Pt;
};

export default function FishingRod({ target }: FishingRodProps) {
  const lineRef = useRef<SVGLineElement>(null);
  const rigRef = useRef<SVGGElement>(null);
  const posRef = useRef<Pt>({ ...HOOK_REST });
  const targetRef = useRef<Pt>(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const t = toVB(targetRef.current);
      const p = posRef.current;
      const nx = p.x + (t.x - p.x) * 0.16;
      const ny = p.y + (t.y - p.y) * 0.16;
      posRef.current = { x: nx, y: ny };

      if (lineRef.current) {
        lineRef.current.setAttribute("x2", String(nx));
        lineRef.current.setAttribute("y2", String(ny - 12));
      }
      if (rigRef.current) {
        rigRef.current.setAttribute("transform", `translate(${nx} ${ny})`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const rod = toVB(ROD_TIP);
  const rest = toVB(HOOK_REST);

  return (
    <svg
      className="hook-layer"
      viewBox="0 0 1000 625"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* fishing line */}
      <line
        ref={lineRef}
        x1={rod.x}
        y1={rod.y}
        x2={rest.x}
        y2={rest.y - 12}
        stroke="#f8fafc"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* bobber + hook rig */}
      <g ref={rigRef} transform={`translate(${rest.x} ${rest.y})`}>
        {/* bobber */}
        <circle r="12" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M -12 0 A 12 12 0 0 1 12 0 Z" fill="#ef4444" />
        <circle
          r="12"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          y1="12"
          y2="23"
          stroke="#475569"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M0 23 C0 30 -8 30 -7 22"
          fill="none"
          stroke="#475569"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
