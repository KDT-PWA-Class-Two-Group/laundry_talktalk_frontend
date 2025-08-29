// components/admin/region/RegionSelect.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegionSelectProps } from "@/types/admin";

export default function RegionSelect({
  value,
  onClose,
  onApply,
}: RegionSelectProps) {
  // 서울 매장명 리스트 상태
  const [stores, setStores] = useState<string[]>([]);
  // 선택된 매장명 상태
  const [selected, setSelected] = useState<string>(value.store ?? "");

  // 컴포넌트 마운트 시 서울 매장명만 추출
  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => {
        // 주소가 '서울'로 시작하는 매장만 필터링
        const seoulStores = data
          .filter((store: any) => store.store_address.startsWith("서울"))
          .map((store: any) => store.store_name);
        setStores(seoulStores);
      });
  }, []);

  return (
    <div
      role="dialog"
      aria-label="매장 선택"
      className="absolute right-0 mt-2 w-[400px] rounded-xl border bg-white shadow-xl"
    >
      {/* 헤더: 다이얼로그 제목 및 닫기 버튼 */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-sm font-semibold">서울 매장 선택</div>
        <Button className="h-8 px-2 text-xs" onClick={onClose}>
          닫기
        </Button>
      </div>
      {/* 매장명 리스트 (라디오 선택) */}
      <ScrollArea className="h-[360px] p-3">
        <div className="space-y-2">
          {stores.map((store) => (
            <label
              key={store}
              className={`flex items-center gap-2 text-sm cursor-pointer ${
                selected === store ? "font-semibold text-blue-600" : ""
              }`}
            >
              {/* 매장명 라디오 버튼 */}
              <input
                type="radio"
                checked={selected === store}
                onChange={() => setSelected(store)}
                className="accent-blue-600"
              />
              <span>{store}</span>
            </label>
          ))}
        </div>
      </ScrollArea>
      {/* 하단 버튼: 초기화/적용 */}
      <div className="mt-3 flex justify-end gap-2 px-3 pb-3">
        <Button
          className="h-9"
          variant="outline"
          onClick={() => setSelected("")}
        >
          초기화
        </Button>
        <Button
          className="h-9"
          onClick={() => onApply({ store: selected })}
          disabled={!selected}
        >
          적용
        </Button>
      </div>
    </div>
  );
}
