// components/admin/region/RegionSelect.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function RegionSelect({
  value,
  onClose,
  onApply,
}: {
  value: { city: string; districts: string[] };
  onClose: () => void;
  onApply: (v: { city: string; districts: string[] }) => void;
}) {
  // 데이터
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

  // 상태
  const [city, setCity] = useState<string>(value.city);
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
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-sm font-semibold">지역 선택</div>
        <Button className="h-8 px-2 text-xs" onClick={onClose}>
          닫기
        </Button>
      </div>

      {/* 본문 */}
      <div className="grid grid-cols-[220px_1fr]">
        {/* 좌측: 시/도 검색 & 리스트 (shadcn Command) */}
        <div className="h-[360px] border-r p-3">
          <Command className="rounded-xl border">
            <CommandInput placeholder="시/도 검색..." />
            <CommandList>
              <CommandEmpty>검색 결과 없음</CommandEmpty>
              <CommandGroup heading="시/도">
                <ScrollArea className="h-[260px]">
                  {cities.map((c) => (
                    <CommandItem
                      key={c.key}
                      value={c.key}
                      onSelect={() => setCity(c.key)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm ${
                        city === c.key ? "bg-slate-100 font-semibold" : ""
                      }`}
                    >
                      <span>{c.key}</span>
                      {city === c.key && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                        </svg>
                      )}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        {/* 우측: 구/군 체크 (shadcn Checkbox + ScrollArea) */}
        <div className="h-[360px] p-3">
          <div className="mb-2 text-sm font-medium">{city}</div>

          <ScrollArea className="max-h-[296px] pr-1">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {map[city]?.map((d) => {
                const checked = districts.includes(d.name);
                return (
                  <label
                    key={d.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(d.name)}
                      className="border-slate-300"
                    />
                    <span>{d.name}</span>
                  </label>
                );
              })}
            </div>
          </ScrollArea>

          <div className="mt-3 flex justify-end gap-2">
            <Button
              className="h-9"
              variant="outline"
              onClick={() => setDistricts([])}
            >
              초기화
            </Button>
            <Button
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
