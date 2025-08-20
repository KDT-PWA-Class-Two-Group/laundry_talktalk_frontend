"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import StoreSelect from "@/components/admin/StoreSelect";
import NoticeSection from "@/components/admin/NoticeSection";
import ReviewSection from "@/components/admin/ReviewSection";
import { STORES } from "@/lib/mock";
// import type { TabKey } from "@/lib/types";

export default function AdminShell() {
  // 기본 탭: 리뷰관리
  const [tab, setTab] = useState<TabKey>("review");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("s001");

  const store = useMemo(
    () => STORES.find((s) => s.id === selectedStoreId)!,
    [selectedStoreId]
  );

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* 좌: 탭 (리뷰관리 → 공지 및 홍보) */}
          <div className="flex items-center gap-3">
            <Button
              variant={tab === "review" ? "default" : "ghost"}
              onClick={() => setTab("review")}
            >
              리뷰관리
            </Button>
            <Button
              variant={tab === "notice" ? "default" : "ghost"}
              onClick={() => setTab("notice")}
            >
              공지 및 홍보
            </Button>
          </div>

          {/* 우: 매장 선택 */}
          <StoreSelect value={selectedStoreId} onChange={setSelectedStoreId} />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "review" ? (
          <ReviewSection storeName={store.name} />
        ) : (
          <NoticeSection storeName={store.name} />
        )}
      </main>
    </div>
  );
}
