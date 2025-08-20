"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RegionSelect({
  value,
  onClose,
  onApply,
}: {
  value: { city: string; districts: string[] };
  onClose: () => void;
  onApply: (v: { city: string; districts: string[] }) => void;
}) {
  const cities = [{ key: "서울" }, { key: "경기" }, { key: "부산" }];
  const map: Record<string, { name: string }[]> = {
    서울: [
      { name: "강남구" },
      { name: "강서구" },
      { name: "구로구" },
      { name: "마포구" },
      { name: "성동구" },
    ],
    경기: [{ name: "성남시" }, { name: "수원시" }, { name: "용인시" }],
    부산: [{ name: "해운대구" }, { name: "부산진구" }, { name: "남구" }],
  };

  const [city, setCity] = useState(value.city);
  const [districts, setDistricts] = useState<string[]>(value.districts);
  const toggle = (d: string) =>
    setDistricts((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  return (
    <div
      role="dialog"
      aria-label="지역 선택"
      className="absolute right-0 mt-2 w-[720px] rounded-xl border bg-white shadow-xl"
    >
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-sm font-semibold">지역 선택</div>
        <Button className="h-8 px-2 text-xs" onClick={onClose}>
          닫기
        </Button>
      </div>

      <div className="grid grid-cols-[220px_1fr]">
        {/* Cities */}
        <div className="h-[360px] border-r p-3">
          <input
            placeholder="지역명 입력"
            className="h-9 mb-2 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
          <ul className="h-[302px] space-y-1 overflow-auto pr-1">
            {cities.map((c) => (
              <li key={c.key}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                    city === c.key
                      ? "bg-slate-100 font-semibold"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => setCity(c.key)}
                >
                  {c.key}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Districts */}
        <div className="h-[360px] p-3">
          <div className="mb-2 text-sm font-medium">{city}</div>
          <div className="grid max-h-[296px] grid-cols-2 gap-x-6 gap-y-2 overflow-auto pr-1">
            {map[city].map((d) => (
              <label key={d.name} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border border-slate-300"
                  checked={districts.includes(d.name)}
                  onChange={() => toggle(d.name)}
                />
                <span>{d.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <Button className="h-9" onClick={() => setDistricts([])}>
              초기화
            </Button>
            <Button
              variant="default"
              className="h-9"
              onClick={() =>
                onApply({
                  city,
                  districts: districts.length ? districts : ["전체"],
                })
              }
            >
              적용
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
