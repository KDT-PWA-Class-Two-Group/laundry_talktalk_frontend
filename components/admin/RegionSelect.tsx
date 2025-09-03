"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

// 스토어 데이터 타입 정의
interface StoreData {
  store_address: string;
}

// 스토어 데이터 타입 정의
interface StoreData {
  store_address: string;
}

export default function RegionSelect({
  value,
  onClose,
  onApply,
}: {
  value: { city: string; districts: string[] };
  onClose: () => void;
  onApply: (v: { city: string; districts: string[] }) => void;
}) {
  // 동적 데이터
  const [cities, setCities] = useState<string[]>([]);
  const [districtsMap, setDistrictsMap] = useState<Record<string, string[]>>(
    {}
  );

  // 상태 (단일 선택)
  const [city, setCity] = useState<string>(value.city);
  const [district, setDistrict] = useState<string>(value.districts[0] ?? "");

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => {
        // 주소에서 시/구 추출
        const citySet = new Set<string>();
        const map: Record<string, Set<string>> = {};
        data.forEach((store: StoreData) => {
          const [cityName, districtName] = store.store_address
            .split(" ")
            .slice(0, 2);
          if (cityName && districtName) {
            citySet.add(cityName);
            if (!map[cityName]) map[cityName] = new Set();
            map[cityName].add(districtName);
          }
        });
        setCities(Array.from(citySet));
        setDistrictsMap(
          Object.fromEntries(
            Object.entries(map).map(([k, v]) => [k, Array.from(v)])
          )
        );
      });
  }, []);

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
        {/* 좌측: 시/도 검색 & 리스트 */}
        <div className="h-[360px] border-r p-3">
          <Command className="rounded-xl border">
            <CommandInput placeholder="시/도 검색..." />
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
                        setDistrict(""); // 시/도 변경 시 선택 초기화
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

        {/* 우측: 구/군 단일 선택 (Checkbox로 강제 단일화) */}
        <div className="h-[360px] p-3">
          <div className="mb-2 text-sm font-medium">{city}</div>

          <ScrollArea className="max-h-[296px] pr-1">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {districtsMap[city]?.map((d) => {
                const checked = district === d;
                return (
                  <label key={d} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(ck) => {
                        const isOn = ck === true;
                        setDistrict(isOn ? d : "");
                      }}
                      className="border-slate-300"
                    />
                    <span>{d}</span>
                  </label>
                );
              })}
            </div>
          </ScrollArea>

          <div className="mt-3 flex justify-end gap-2">
            <Button
              className="h-9"
              variant="outline"
              onClick={() => setDistrict("")}
            >
              초기화
            </Button>
            <Button
              className="h-9"
              onClick={() =>
                onApply({
                  city,
                  districts: district ? [district] : ["전체"], // 기존 시그니처 유지
                })
              }
              disabled={!city}
            >
              적용
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
