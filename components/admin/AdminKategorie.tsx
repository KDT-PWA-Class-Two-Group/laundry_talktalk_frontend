"use client";

import { useState, useEffect } from "react";
import { Store } from "@/types/admin";
import { Button } from "@/components/ui/button";
import StoreSelect from "@/components/admin/StoreSelect";
import NoticeSection from "@/components/admin/NoticeAndPromotion";
import ReviewSection from "@/components/admin/Review Management";

// 패널 컴포넌트(default export)
import DeviceManagementPanel from "@/components/admin/DeviceManagementPanel";
import OptionsManagementPanel from "@/components/admin/OptionsPricingDialog";

type TabKey = "review" | "notice" | "options";
type OptionsSubTab = "devices" | "options";

export default function AdminShell() {
  const [tab, setTab] = useState<TabKey>("review");
  const [activeStoreId, setActiveStoreId] = useState<string>("s001");
  const [subTab, setSubTab] = useState<OptionsSubTab>("devices");
  const [storeList, setStoreList] = useState<Store[]>([]);
  const selectedStore = storeList.find((store) => store.id === activeStoreId);

  // 매장 목록을 API에서 받아옴
  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch("/api/stores");
        const data = await response.json();
        // store_id, store_name을 id, name으로 변환
        const mapped: Store[] = data.map((store: any) => ({
          id: store.store_id,
          name: store.store_name,
          address: store.store_address,
        }));
        setStoreList(mapped);
        if (mapped.length > 0 && !activeStoreId) {
          setActiveStoreId(mapped[0].id);
        }
      } catch (e) {
        setStoreList([]);
      }
    }
    fetchStores();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* 좌: 상단 고정 탭 3개 */}
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
            <Button
              variant={tab === "options" ? "default" : "ghost"}
              onClick={() => setTab("options")}
            >
              옵션 및 가격
            </Button>
          </div>

          {/* 우: 매장 선택 */}
          <StoreSelect
            value={activeStoreId}
            stores={storeList}
            onChange={setActiveStoreId}
          />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "review" &&
          (selectedStore ? (
            <ReviewSection storeName={selectedStore.name} />
          ) : (
            <div className="rounded-lg border bg-white p-6 text-sm text-slate-600">
              선택된 매장을 찾을 수 없습니다. 매장을 다시 선택해 주세요.
            </div>
          ))}

        {tab === "notice" &&
          (selectedStore ? (
            <NoticeSection storeId={selectedStore.id} />
          ) : (
            <div className="rounded-lg border bg-white p-6 text-sm text-slate-600">
              선택된 매장이 없습니다.
            </div>
          ))}

        {tab === "options" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
                <Button
                  size="sm"
                  className="rounded-full min-w-[128px]"
                  variant={subTab === "devices" ? "default" : "ghost"}
                  onClick={() => setSubTab("devices")}
                >
                  기기관리
                </Button>
                <Button
                  size="sm"
                  className="rounded-full min-w-[128px]"
                  variant={subTab === "options" ? "default" : "ghost"}
                  onClick={() => setSubTab("options")}
                >
                  옵션 관리
                </Button>
              </div>
            </div>
            {subTab === "devices" ? (
              <DeviceManagementPanel />
            ) : (
              <OptionsManagementPanel />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
