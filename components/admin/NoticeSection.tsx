"use client";

import { Button } from "@/components/ui/button";

export default function NoticeSection({ storeName }: { storeName: string }) {
  return (
    <>
      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">
          공지 및 홍보 · {storeName}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 좌: 공지 등록 */}
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-sm font-medium">새 공지 등록</div>
            <div className="space-y-3">
              <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
                <div className="text-xs text-slate-500">제목</div>
                <input
                  className="h-10 rounded-xl border px-3 text-sm"
                  placeholder="예) 9월 휴무 안내"
                />
              </div>
              <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
                <div className="text-xs text-slate-500">노출기간</div>
                <input
                  type="date"
                  className="h-10 rounded-xl border px-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-[90px_minmax(0,1fr)] items-start gap-2">
                <div className="text-xs text-slate-500">내용</div>
                <textarea
                  className="min-h-[120px] rounded-xl border px-3 py-2 text-sm"
                  placeholder="공지 내용"
                />
              </div>
              <div className="flex justify-end">
                <Button>등록</Button>
              </div>
            </div>
          </div>

          {/* 우: 홍보 배너 */}
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-sm font-medium">홍보 배너</div>
            <p className="text-sm text-slate-600">
              배너 이미지 업로드, 링크, 우선순위 등을 여기에 구성하세요.
            </p>
            <Button className="mt-2">배너 추가</Button>
          </div>
        </div>
      </div>

      {/* 공지 목록 */}
      <div className="mt-4 rounded-xl border bg-white p-3">
        <div className="mb-2 text-sm font-medium">공지 목록</div>
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="grid grid-cols-[1fr_140px_120px_100px]">
            {["제목", "시작일", "상태", "액션"].map((h) => (
              <div
                key={h}
                className="px-3 py-2 bg-slate-50 border-b text-sm font-medium"
              >
                {h}
              </div>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_120px_100px]">
              <div className="px-3 py-2 border-b text-sm truncate">
                예시 공지 {i}
              </div>
              <div className="px-3 py-2 border-b text-sm">2025-09-0{i}</div>
              <div className="px-3 py-2 border-b text-sm">노출중</div>
              <div className="px-3 py-2 border-b text-sm">
                <Button className="h-8 px-2 text-xs">수정</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
