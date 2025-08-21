// components/admin/OptionsPricingDialog.tsx
// (= OptionsManagementPanel)  ─ default export 유지

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

/** ===== 타입 ===== */
export type DeviceKind = "세탁기" | "건조기" | "기타";
type TargetDevice = Exclude<DeviceKind, "기타">;
type Category = "코스" | "옵션";

interface Course {
  id: string;
  name: string;
  durationMin?: number;
  price: number;
  appliesTo: TargetDevice;
}
interface AddOn {
  id: string;
  name: string;
  price: number;
  appliesTo: TargetDevice;
}

/** ===== 유틸 ===== */
const fmtKRW = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** ===== 공용 모달 ===== */
function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[min(880px,92vw)] rounded-2xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button
            className="rounded-md p-1 hover:bg-slate-100"
            aria-label="닫기"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="border-t px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}

/** ===== 옵션 추가 모달 ===== */
function AddOptionModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (items: { courses: Course[]; addOns: AddOn[] }) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("코스");
  const [price, setPrice] = useState<number | "">("");
  const [selected, setSelected] = useState<Set<TargetDevice>>(
    () => new Set<TargetDevice>()
  );

  // 모달 열릴 때마다 폼 초기화
  React.useEffect(() => {
    if (open) {
      setName("");
      setCategory("코스");
      setPrice("");
      setSelected(new Set());
    }
  }, [open]);

  const toggleDevice = (dev: TargetDevice) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(dev) ? next.delete(dev) : next.add(dev);
      return next;
    });

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("옵션명을 입력하세요.");
      return;
    }
    const p =
      typeof price === "string" || Number.isNaN(Number(price))
        ? 0
        : Math.max(0, Math.floor(Number(price)));

    if (selected.size === 0) {
      alert("적용 가능한 기기를 1개 이상 선택하세요.");
      return;
    }

    const courses: Course[] = [];
    const addOns: AddOn[] = [];

    // 체크박스에서 선택한 각 기기에 대해 항목을 생성
    selected.forEach((dev) => {
      if (category === "코스") {
        courses.push({
          id: uid("c"),
          name: trimmed, // "표준 세탁(60분)" 처럼 이름에 시간 포함 가능
          price: p,
          appliesTo: dev,
        });
      } else {
        addOns.push({
          id: uid("a"),
          name: trimmed,
          price: p,
          appliesTo: dev,
        });
      }
    });

    onSave({ courses, addOns });
    onClose(); // 닫기
  };

  return (
    <Modal
      open={open}
      title="옵션추가"
      onClose={onClose}
      footer={
        <div className="flex justify-center">
          <Button onClick={handleSave} className="rounded-full px-8">
            저장
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        {/* 옵션명 */}
        <div className="grid gap-2">
          <div className="text-xl font-semibold">옵션명</div>
          <input
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            placeholder="예) 표준 세탁(60분)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 카테고리 */}
        <div className="grid gap-2">
          <div className="text-xl font-semibold">카테고리</div>
          <select
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="코스">코스</option>
            <option value="옵션">옵션</option>
          </select>
        </div>

        {/* 적용 가능한 기기 */}
        <div className="grid gap-2">
          <div className="text-xl font-semibold">적용 가능한 기기</div>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={selected.has("세탁기")}
              onChange={() => toggleDevice("세탁기")}
            />
            세탁기
          </label>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={selected.has("건조기")}
              onChange={() => toggleDevice("건조기")}
            />
            건조기
          </label>
        </div>

        {/* 가격 */}
        <div className="grid gap-2">
          <div className="text-xl font-semibold">가격 (원)</div>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            placeholder="예) 5000"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
      </div>
    </Modal>
  );
}

/** ===== 메인: 옵션 관리 패널 ===== */
export default function OptionsManagementPanel() {
  // 선택 하이라이트(파란 외곽선)
  const [activeId, setActiveId] = useState<string | null>(null);

  // 초기 더미 데이터
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

  // 삭제
  const removeCourse = (id: string) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));
  const removeAddOn = (id: string) =>
    setAddOns((prev) => prev.filter((a) => a.id !== id));

  // 추가 모달
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* 상단 우측: 옵션 추가 버튼(→ 모달) */}
      <div className="mb-4 flex items-center justify-end">
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setAddOpen(true)}
        >
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
                    className="rounded-full bg-red-600 text-white hover:bg-red-700"
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
                    className="rounded-full bg-red-600 text-white hover:bg-red-700"
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

      {/* 추가 모달 */}
      <AddOptionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={({ courses: newCourses, addOns: newAddOns }) => {
          // 다중 선택 시 기기별로 항목이 여러 개 생깁니다.
          if (newCourses.length) {
            setCourses((prev) => [...prev, ...newCourses]);
          }
          if (newAddOns.length) {
            setAddOns((prev) => [...prev, ...newAddOns]);
          }
        }}
      />
    </div>
  );
}
