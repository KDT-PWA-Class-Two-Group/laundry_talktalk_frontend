// components/admin/OptionsPricingDialog.tsx
// (= OptionsManagementPanel. 파일명은 유지해도 default export로 패널 컴포넌트를 내보냅니다)

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

/** ===== 타입 ===== */
export type DeviceKind = "세탁기" | "건조기" | "기타";

// 코스(세탁/건조 과정)
interface Course {
  id: string;
  name: string;
  durationMin?: number;
  price: number;
  appliesTo: Exclude<DeviceKind, "기타">; // 적용 기기
}

// 추가 옵션(추가 요금)
interface AddOn {
  id: string;
  name: string;
  price: number;
  appliesTo: Exclude<DeviceKind, "기타">; // 적용 기기
}

/** ===== 유틸 ===== */
const fmtKRW = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** ===== 메인: 옵션 관리 패널 ===== */
export default function OptionsManagementPanel() {
  // 선택 하이라이트(파란 외곽선)
  const [activeId, setActiveId] = useState<string | null>(null);

  // 초기 더미 데이터 (스크린샷 톤)
  const [courses, setCourses] = useState<Course[]>([
    {
      id: uid("c"),
      name: "표준 세탁(60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
    {
      id: uid("c"),
      name: "이불 세탁(60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
    {
      id: uid("c"),
      name: "이불 건조 (60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
  ]);
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: uid("a"), name: "헹굼 추가(10분)", price: 1000, appliesTo: "세탁기" },
    {
      id: uid("a"),
      name: "건조 10분 추가(10분)",
      price: 5000,
      appliesTo: "건조기",
    },
  ]);

  // 삭제/추가
  const removeCourse = (id: string) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));
  const removeAddOn = (id: string) =>
    setAddOns((prev) => prev.filter((a) => a.id !== id));

  // 스크린샷 우측 상단 버튼이 "옵션 추가"였으므로 AddOn만 추가
  const addNewAddOn = () =>
    setAddOns((prev) => [
      ...prev,
      {
        id: uid("a"),
        name: "새 옵션(10분)",
        price: 1000,
        appliesTo: "세탁기",
      },
    ]);

  // (필요하면 코스도 추가할 수 있도록 주석 해제해서 사용)
  // const addNewCourse = () =>
  //   setCourses((prev) => [
  //     ...prev,
  //     {
  //       id: uid("c"),
  //       name: "새 코스 (60분)",
  //       durationMin: 60,
  //       price: 5000,
  //       appliesTo: "세탁기",
  //     },
  //   ]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* 상단 우측: 옵션 추가 버튼 */}
      <div className="mb-4 flex items-center justify-end">
        <Button size="sm" className="rounded-full" onClick={addNewAddOn}>
          <Plus className="mr-1 h-4 w-4" />
          옵션 추가
        </Button>
      </div>

      <h1 className="mb-6 text-3xl font-bold">옵션 관리</h1>

      {/* ===== 코스 섹션 ===== */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">코스</h2>
        <div className="space-y-4">
          {courses.map((c) => {
            const isActive = activeId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={[
                  "flex items-center justify-between rounded-2xl border bg-white px-5 py-3",
                  "transition-shadow",
                  isActive ? "ring-2 ring-sky-500 border-sky-500" : "",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold">
                    {c.name}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <span>적용 가능:</span>
                    <Badge variant="secondary" className="shrink-0">
                      {c.appliesTo}
                    </Badge>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-3">
                  <div className="whitespace-nowrap text-base font-medium">
                    {fmtKRW(c.price)}원
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCourse(c.id);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 옵션 섹션 ===== */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">옵션</h2>
        <div className="space-y-4">
          {addOns.map((a) => {
            const isActive = activeId === a.id;
            return (
              <div
                key={a.id}
                onClick={() => setActiveId(a.id)}
                className={[
                  "flex items-center justify-between rounded-2xl border bg-white px-5 py-3",
                  "transition-shadow",
                  isActive ? "ring-2 ring-sky-500 border-sky-500" : "",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold">
                    {a.name}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <span>적용 가능:</span>
                    <Badge variant="secondary" className="shrink-0">
                      {a.appliesTo}
                    </Badge>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-3">
                  <div className="whitespace-nowrap text-base font-medium">
                    {fmtKRW(a.price)}원
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAddOn(a.id);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
