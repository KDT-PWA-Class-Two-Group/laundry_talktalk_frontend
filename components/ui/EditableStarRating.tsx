import { useState } from "react";

export default function EditableStarRating({
  value,
  onChange,
  max = 5,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  // 별 하나 영역에서 마우스 위치를 0.5/1.0 단위로 스냅
  const pickFraction = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    base: number
  ) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const ratio = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );
    const half = ratio < 0.5 ? 0.5 : 1.0; // 0.5 단위 스냅
    return base + half; // base는 0,1,2,3,4
  };

  const active = hoverVal ?? value;

  return (
    <div
      className="flex items-center"
      role="radiogroup"
      aria-label="별점(0.5 단위)"
    >
      {Array.from({ length: max }).map((_, i) => {
        const base = i; // 0..4
        // 이 별의 채움 비율 계산: 0, 0.5, 1
        const frac = Math.max(0, Math.min(1, active - base));
        const fill = frac >= 1 ? 1 : frac >= 0.5 ? 0.5 : 0;

        return (
          <div
            key={i}
            className="relative h-5 w-5 cursor-pointer select-none"
            onMouseMove={(e) => setHoverVal(pickFraction(e, base))}
            onMouseLeave={() => setHoverVal(null)}
            onClick={(e) => onChange(pickFraction(e, base))}
            role="radio"
            aria-checked={
              Math.round(value * 2) / 2 > base &&
              Math.round(value * 2) / 2 <= base + 1
            }
            title={`${(
              base + (fill === 1 ? 1 : fill === 0.5 ? 0.5 : 0)
            ).toFixed(1)} / ${max}`}
          >
            {/* 회색 빈 별(바닥) */}
            <StarSvg className="text-slate-300" />
            {/* 빨간 채움 별: width로 마스킹 */}
            <div
              className="absolute left-0 top-0 h-full overflow-hidden"
              style={{ width: `${fill * 100}%` }} // 0, 50, 100
            >
              <StarSvg className="text-red-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StarSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 ${className} fill-current`}
      viewBox="0 0 20 20"
      aria-hidden
      focusable="false"
    >
      <path d="M10 1.5 12.7 7l6 .9-4.3 4.2 1 5.9-5.4-2.8-5.4 2.8 1-5.9L1.3 7.9l6-.9L10 1.5z" />
    </svg>
  );
}
