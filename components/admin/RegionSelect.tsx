// components/admin/region/RegionSelect.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegionSelectProps } from "@/types/admin";

export default function RegionSelect({
  value, // 부모에서 전달받은 선택된 매장명 (초기값)
  onClose, // 닫기 버튼 클릭 시 실행되는 함수
  onApply, // 적용 버튼 클릭 시 실행되는 함수
}: RegionSelectProps) {
  // 서울 매장명 리스트 상태 (API에서 받아옴)
  const [stores, setStores] = useState<string[]>([]);
  // 현재 선택된 매장명 상태 (라디오 버튼과 연동)
  const [selected, setSelected] = useState<string>(value.store ?? "");

  // 컴포넌트 마운트 시 서울 매장명만 추출해서 stores에 저장
  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((storeList) => {
        // store_address가 '서울'로 시작하는 매장만 필터링
        const seoulStores = storeList
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
        {/* 닫기 버튼: onClose 핸들러 실행 */}
        <Button className="h-8 px-2 text-xs" onClick={onClose}>
          닫기
        </Button>
      </div>
      {/* 매장명 리스트: stores 배열을 라디오 버튼으로 렌더링 */}
      <ScrollArea className="h-[360px] p-3">
        <div className="space-y-2">
          {stores.map((storeName) => (
            <label
              key={storeName}
              className={`flex items-center gap-2 text-sm cursor-pointer ${
                selected === storeName ? "font-semibold text-blue-600" : ""
              }`}
            >
              {/* 매장명 라디오 버튼: 선택 시 selected 상태 변경 */}
              <input
                type="radio"
                checked={selected === storeName}
                onChange={() => setSelected(storeName)}
                className="accent-blue-600"
              />
              <span>{storeName}</span>
            </label>
          ))}
        </div>
      </ScrollArea>
      {/* 하단 버튼: 초기화/적용 */}
      <div className="mt-3 flex justify-end gap-2 px-3 pb-3">
        {/* 선택 초기화 버튼: selected 상태를 빈 문자열로 변경 */}
        <Button
          className="h-9"
          variant="outline"
          onClick={() => setSelected("")}
        >
          초기화
        </Button>
        {/* 적용 버튼: 선택된 매장명으로 onApply 핸들러 실행 */}
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
