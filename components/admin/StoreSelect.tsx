"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

export default function StoreSelect({
  value,
  stores,
  onChange,
}: {
  value: string;
  stores: { id: string; name: string; address?: string }[];
  onChange: (id: string) => void;
}) {
  // 상태 선언
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(value);
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [search, setSearch] = useState("");

  // value prop 변경 시 내부 selected 동기화
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // value가 바뀌면 팝업을 강제로 닫음
  useEffect(() => {
    setOpen(false);
  }, [value]);

  // 시/도 목록 추출
  const cities = useMemo(() => {
    const set = new Set<string>();
    stores.forEach((s) => {
      if (s.address) {
        const [c] = s.address.split(" ");
        if (c) set.add(c);
      }
    });
    return Array.from(set);
  }, [stores]);

  // 구/군 목록 추출
  const districtsMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    stores.forEach((s) => {
      if (s.address) {
        const [c, d] = s.address.split(" ");
        if (c && d) {
          if (!map[c]) map[c] = new Set();
          map[c].add(d);
        }
      }
    });
    return Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k, Array.from(v)])
    );
  }, [stores]);

  // 매장 필터링
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (!s.address) return false;
      const [c, d] = s.address.split(" ");
      if (city && c !== city) return false;
      if (district && d !== district) return false;
      if (search && !s.name.includes(search)) return false;
      return true;
    });
  }, [stores, city, district, search]);

  // UI
  return (
    <div className="ml-auto">
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="whitespace-nowrap"
      >
        {selected
          ? `매장 선택: ${stores.find((s) => s.id === selected)?.name ?? ""}`
          : "매장 선택"}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="매장 선택"
          className="fixed inset-0 z-50"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute left-1/2 z-10 w-[min(900px,96vw)] rounded-2xl border bg-white shadow-xl p-6"
            style={{ top: "70%", transform: "translate(-50%, 0)" }}
          >
            <div className="mb-4 text-base font-semibold">매장 지역 선택</div>
            <div className="grid grid-cols-[220px_1fr] gap-6">
              {/* 좌측: 시/도 리스트 */}
              <div>
                <Command className="rounded-xl border">
                  <CommandInput
                    placeholder="시/도 검색..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>검색 결과 없음</CommandEmpty>
                    <CommandGroup heading="시/도">
                      <ScrollArea className="h-[260px]">
                        {cities.map((c) => (
                          <CommandItem
                            key={c}
                            value={c}
                            onSelect={() => {
                              setCity(c);
                              setDistrict("");
                            }}
                            className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm ${
                              city === c ? "bg-slate-100 font-semibold" : ""
                            }`}
                          >
                            <span>{c}</span>
                            {city === c && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
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
              {/* 우측: 구/군 리스트 및 매장 라디오 */}
              <div>
                <div className="mb-2 text-sm font-medium">
                  {city || "시/도 선택"}
                </div>
                <ScrollArea className="max-h-[120px] pr-1 mb-4">
                  <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                    {districtsMap[city]?.map((d) => (
                      <label
                        key={d}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={district === d}
                          onChange={() => setDistrict(d)}
                        />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mb-2 text-sm font-semibold">매장 목록</div>
                <ScrollArea className="max-h-[220px] pr-1">
                  <div className="grid gap-2">
                    {filteredStores.map((s) => {
                      const inputId = `store-radio-${s.id}`;
                      return (
                        <div key={`${s.id}-${s.name}`} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="store-radio"
                            id={inputId}
                            checked={selected === s.id}
                            onChange={() => setSelected(s.id)}
                          />
                          <label htmlFor={inputId} className="cursor-pointer">
                            {s.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelected("");
                  setCity("");
                  setDistrict("");
                  setSearch("");
                  onChange("");
                }}
              >
                초기화
              </Button>
              <Button
                onClick={() => {
                  onChange(selected);
                  setOpen(false);
                }}
              >
                적용
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
