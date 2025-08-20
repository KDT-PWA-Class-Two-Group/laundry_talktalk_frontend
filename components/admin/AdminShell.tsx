"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import StoreSelect from "@/components/admin/StoreSelect";
import NoticeSection from "@/components/admin/NoticeSection";
import ReviewSection from "@/components/admin/ReviewSection";
import { OptionsPricingDialog } from "@/components/admin/OptionsPricingDialog";
import { STORES } from "@/lib/mock";

// 외부 타입이 없을 때를 대비한 로컬 정의
export type TabKey = "review" | "notice";

export default function AdminShell() {
  // 좌측 탭
  const [tab, setTab] = useState<TabKey>("review");
  // 선택 매장 (id)
  const [selectedStoreId, setSelectedStoreId] = useState<string>("s001");

  // 옵션/가격 모달
  const [openOptions, setOpenOptions] = useState(false);
  const [deviceName, setDeviceName] = useState("세탁기1");
  const [deviceKind, setDeviceKind] = useState<"세탁기" | "건조기" | "기타">(
    "세탁기"
  );
  const [optionsData, setOptionsData] = useState<{
    courses: any[];
    addOns: any[];
  } | null>(null);

  // 매장 객체 해석
  const store = useMemo(() => {
    const found = STORES.find((s: any) => s.id === selectedStoreId);
    return found ?? { id: "unknown", name: "데모 매장" };
  }, [selectedStoreId]);

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {/* 좌측: 탭 + (공지 옆 옵션설정) */}
          <nav className="flex items-center gap-2">
            <Button
              variant={tab === "review" ? "default" : "secondary"}
              onClick={() => setTab("review")}
              size="sm"
            >
              리뷰관리
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={tab === "notice" ? "default" : "secondary"}
                onClick={() => setTab("notice")}
                size="sm"
              >
                공지 및 홍보
              </Button>

              {/* 공지 탭일 때만 노출, 탭 바로 옆에 배치 */}
              {tab === "notice" && (
                <Button
                  variant={tab === "notice" ? "default" : "secondary"}
                  onClick={() => setTab("notice")}
                  size="sm"
                >
                  오션 및 가격
                </Button>
              )}
            </div>
          </nav>

          {/* 우측: 매장 선택만 유지 */}
          <div className="flex items-center gap-2">
            <StoreSelect
              value={selectedStoreId}
              onChange={setSelectedStoreId}
            />
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "review" ? (
          <ReviewSection storeName={store.name} />
        ) : (
          <NoticeSection storeName={store.name} />
        )}
      </main>

      {/* 옵션/가격 모달 */}
      <OptionsPricingDialog
        open={openOptions}
        onClose={() => setOpenOptions(false)}
        onSave={(v) => {
          setOptionsData(v); // 필요 시 서버 저장 API 연동
          setOpenOptions(false);
        }}
        deviceName={deviceName}
        deviceKind={deviceKind}
        initial={optionsData ?? undefined}
      />
    </div>
  );
}
