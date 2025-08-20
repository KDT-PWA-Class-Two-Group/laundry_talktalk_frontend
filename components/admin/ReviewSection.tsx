"use client";

import { Button } from "@/components/ui/button";

export default function ReviewSection({ storeName }: { storeName: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="text-lg font-semibold mb-3">리뷰관리 · {storeName}</h2>

      {/* 필터 바 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select className="h-9 rounded-xl border px-3 text-sm">
          <option>전체 등급</option>
          <option>★ 5</option>
          <option>★ 4</option>
          <option>★ 3</option>
          <option>★ 2</option>
          <option>★ 1</option>
        </select>
        <select className="h-9 rounded-xl border px-3 text-sm">
          <option>처리 상태: 전체</option>
          <option>미응답</option>
          <option>완료</option>
        </select>
        <input
          className="h-9 min-w-[220px] flex-1 rounded-xl border px-3 text-sm"
          placeholder="키워드 검색"
        />
      </div>

      {/* 리스트 */}
      <div className="rounded-xl border">
        <div className="grid grid-cols-[1fr_140px_90px_120px] items-center border-b bg-slate-50 px-3 py-2 text-sm font-medium">
          <div>리뷰</div>
          <div>작성일</div>
          <div>등급</div>
          <div>처리</div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_140px_90px_120px] items-center border-t px-3 py-3 text-sm"
          >
            <div className="pr-3">
              <div className="line-clamp-2 font-medium">
                깊고 진한 맛, 매장이 깔끔했습니다. 재방문 의사 있어요. ({i + 1})
              </div>
              <div className="mt-1 text-xs text-slate-500">
                홍*동 · 네이버 리뷰
              </div>
            </div>
            <div>2025-08-1{i}</div>
            <div>★ {5 - (i % 3)}</div>
            <div className="flex gap-2">
              <Button className="h-8 px-2 text-xs">답변</Button>
              <Button className="h-8 px-2 text-xs">완료</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
