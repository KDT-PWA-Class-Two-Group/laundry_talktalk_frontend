"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Plus } from "lucide-react";
// import { OptionsPricingDialog } from "@/components/admin/OptionsPricingDialog";

/** ===== 타입 ===== */
export type DeviceKind = "세탁기" | "건조기" | "기타";
export interface Course {
  id: string;
  name: string;
  durationMin?: number;
  price: number;
}
export interface AddOn {
  id: string;
  name: string;
  price: number;
}
export interface DeviceOptions {
  courses: Course[];
  addOns: AddOn[];
}

interface Device {
  id: string;
  name: string;
  kind: DeviceKind;
  options?: DeviceOptions; // 없을 수 있음
}

/** ===== 유틸 ===== */
const fmtKRW = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** 데모 템플릿 */
const TEMPLATES: Record<Exclude<DeviceKind, "기타">, DeviceOptions> = {
  세탁기: {
    courses: [
      { id: uid("c"), name: "표준세탁", durationMin: 60, price: 5000 },
      { id: uid("c"), name: "이불 세탁", durationMin: 80, price: 7000 },
      { id: uid("c"), name: "울코스", durationMin: 40, price: 5000 },
    ],
    addOns: [
      { id: uid("a"), name: "섬유유연제", price: 1000 },
      { id: uid("a"), name: "헹굼 추가", price: 500 },
    ],
  },
  건조기: {
    courses: [
      { id: uid("c"), name: "표준건조", durationMin: 60, price: 5000 },
      { id: uid("c"), name: "이불 건조", durationMin: 80, price: 7000 },
      { id: uid("c"), name: "울코스", durationMin: 40, price: 5000 },
    ],
    addOns: [{ id: uid("a"), name: "+10분 추가", price: 1000 }],
  },
};

/** ===== 메인: 기기관리 페이지 ===== */
export default function DeviceManagementPage() {
  // 장비 리스트 (데모 시드)
  const [devices, setDevices] = useState<Device[]>([
    { id: "d1", name: "세탁기1", kind: "세탁기", options: TEMPLATES["세탁기"] },
    { id: "d2", name: "건조기1", kind: "건조기", options: TEMPLATES["건조기"] },
    { id: "d3", name: "세탁기1", kind: "세탁기" }, // 옵션 없음
  ]);

  // 옵션 편집 모달
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = useMemo(
    () => devices.find((d) => d.id === editingId),
    [devices, editingId]
  );

  // 핸들러
  const addDevice = () => {
    const count = devices.length + 1;
    setDevices((prev) => [
      ...prev,
      { id: uid("d"), name: `세탁기${count}`, kind: "세탁기" },
    ]);
  };

  const removeDevice = (id: string) => {
    if (!confirm("해당 기기를 삭제할까요?")) return;
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const openOptions = (id: string) => setEditingId(id);
  const closeOptions = () => setEditingId(null);

  const saveOptions = (value: DeviceOptions) => {
    if (!editing) return;
    setDevices((prev) =>
      prev.map((d) => (d.id === editing.id ? { ...d, options: value } : d))
    );
    closeOptions();
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* 상단 세그먼트 + 추가 버튼 */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex w-full max-w-md items-center rounded-full bg-slate-100 p-1">
          <button
            className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow"
            // 실제 탭 스위치 필요 시 onClick에 라우팅/상태 연결
          >
            + 기기관리
          </button>
          <button className="flex-1 rounded-full px-4 py-2 text-sm text-slate-600">
            옵션 관리
          </button>
        </div>
        <Button size="sm" className="rounded-full" onClick={addDevice}>
          <Plus className="mr-1 h-4 w-4" /> 기기 추가
        </Button>
      </div>

      <h1 className="mb-4 text-2xl font-bold">기기관리</h1>

      {/* 리스트 컨테이너 */}
      <div className="rounded-2xl bg-sky-50 p-4 md:p-6 space-y-6">
        {devices.map((d) => {
          const courses = d.options?.courses ?? [];
          const addOns = d.options?.addOns ?? [];
          const hasAny = courses.length + addOns.length > 0;

          return (
            <div
              key={d.id}
              className="rounded-2xl bg-white p-4 md:p-6 shadow-sm"
            >
              {/* 카드 헤더 */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{d.name}</h2>
                  <Badge variant="secondary">{d.kind}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => openOptions(d.id)}
                  >
                    <Settings2 className="mr-1 h-4 w-4" />
                    옵션설정
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => removeDevice(d.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>

              {/* 메타 정보 */}
              <div className="mb-4 text-sm text-slate-600">
                설정된 코스:{" "}
                <span className="font-medium">{courses.length}개</span>
                <span className="mx-2">·</span>
                설정된 옵션:{" "}
                <span className="font-medium">{addOns.length}개</span>
              </div>

              {/* 내용 */}
              {hasAny ? (
                <div className="space-y-5">
                  {/* 세탁 코스 */}
                  {courses.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold text-slate-700">
                        세탁 코스
                      </h3>
                      <div className="space-y-2">
                        {courses.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-2 text-sm"
                          >
                            <span>
                              {c.name}
                              {typeof c.durationMin === "number" && (
                                <span className="text-slate-500">
                                  {" "}
                                  ({c.durationMin}분)
                                </span>
                              )}
                            </span>
                            <span className="font-medium">
                              {fmtKRW(c.price)}원
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 추가 옵션 */}
                  {addOns.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold text-slate-700">
                        추가 옵션
                      </h3>
                      <div className="space-y-2">
                        {addOns.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-2 text-sm"
                          >
                            <span>{a.name}</span>
                            <span className="font-medium">
                              {fmtKRW(a.price)}원
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                // 비었을 때
                <div className="rounded-2xl border-2 border-dashed border-slate-300 px-4 py-16 text-center text-sm text-slate-500">
                  설정된 옵션이 없습니다.
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => openOptions(d.id)}
                    >
                      옵션 추가하기
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 옵션 편집 모달 */}
      {/* {editing && (
        <OptionsPricingDialog
          open={!!editing}
          onClose={closeOptions}
          onSave={saveOptions}
          deviceName={editing.name}
          deviceKind={editing.kind}
          initial={editing.options ?? undefined}
        />
      )} */}
    </div>
  );
}
