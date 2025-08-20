"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Undo2, Save, Wand2, X, Settings2 } from "lucide-react";

/* =========================
 * 타입 정의
 * ========================= */
export type DeviceKind = "세탁기" | "건조기" | "기타";

export interface Course {
  id: string;
  name: string;
  durationMin?: number; // 분 단위 (선택)
  price: number; // 원 단위
}

export interface AddOn {
  id: string;
  name: string;
  price: number; // 원 단위
}

export interface DeviceOptions {
  courses: Course[];
  addOns: AddOn[];
}

export interface OptionsPricingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (value: DeviceOptions) => void;
  deviceName?: string; // UI 타이틀에 표시
  deviceKind?: DeviceKind; // 뱃지 표기용
  initial?: Partial<DeviceOptions>; // 빈 값 가능
}

/* =========================
 * 유틸리티
 * ========================= */
const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const toNonNegativeInt = (v: string | number | undefined) => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Math.max(0, Math.floor(Number(v)));
  return Number.isFinite(n) ? n : undefined;
};

const toMoney = (v: string | number) => {
  const n = Math.max(0, Math.floor(Number(v)));
  return Number.isFinite(n) ? n : 0;
};

const fmtKRW = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

/* 템플릿 (스크린샷 기준 기본값) */
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

/* =========================
 * 하위 행 컴포넌트 (리렌더 최적화)
 * ========================= */
const CourseRow = React.memo(function CourseRow({
  value,
  onChange,
  onRemove,
  index,
}: {
  value: Course;
  onChange: (next: Course) => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <div className="grid grid-cols-12 items-center gap-2 rounded-xl border p-3">
      <div className="col-span-12 md:col-span-5">
        <Label className="sr-only">코스명</Label>
        <Input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder="예) 표준세탁"
        />
      </div>
      <div className="col-span-6 md:col-span-3">
        <Label className="sr-only">시간(분)</Label>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={value.durationMin ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              durationMin: toNonNegativeInt(e.target.value),
            })
          }
          placeholder="60"
        />
      </div>
      <div className="col-span-6 md:col-span-3">
        <Label className="sr-only">가격(원)</Label>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          step={100}
          value={value.price}
          onChange={(e) =>
            onChange({ ...value, price: toMoney(e.target.value) })
          }
          placeholder="5000"
        />
      </div>
      <div className="col-span-12 md:col-span-1 flex justify-end">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onRemove}
          aria-label={`코스 삭제 ${index + 1}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
});

const AddOnRow = React.memo(function AddOnRow({
  value,
  onChange,
  onRemove,
  index,
}: {
  value: AddOn;
  onChange: (next: AddOn) => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <div className="grid grid-cols-12 items-center gap-2 rounded-xl border p-3">
      <div className="col-span-12 md:col-span-8">
        <Label className="sr-only">옵션명</Label>
        <Input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder="예) 섬유유연제"
        />
      </div>
      <div className="col-span-6 md:col-span-3">
        <Label className="sr-only">가격(원)</Label>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          step={100}
          value={value.price}
          onChange={(e) =>
            onChange({ ...value, price: toMoney(e.target.value) })
          }
          placeholder="1000"
        />
      </div>
      <div className="col-span-6 md:col-span-1 flex justify-end">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onRemove}
          aria-label={`옵션 삭제 ${index + 1}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
});

/* =========================
 * 메인 컴포넌트
 * ========================= */
export function OptionsPricingDialog({
  open,
  onClose,
  onSave,
  deviceName = "기기",
  deviceKind = "세탁기",
  initial,
}: OptionsPricingDialogProps) {
  // 초기 시드
  const seed = useMemo<DeviceOptions>(
    () => ({
      courses: initial?.courses?.length
        ? initial.courses
        : structuredClone(
            TEMPLATES[deviceKind as Exclude<DeviceKind, "기타">]?.courses || []
          ),
      addOns: initial?.addOns?.length
        ? initial.addOns
        : structuredClone(
            TEMPLATES[deviceKind as Exclude<DeviceKind, "기타">]?.addOns || []
          ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deviceKind]
  );

  const [courses, setCourses] = useState<Course[]>(seed.courses);
  const [addOns, setAddOns] = useState<AddOn[]>(seed.addOns);

  // open 시점마다 시드 재적용
  useEffect(() => {
    if (open) {
      setCourses(seed.courses);
      setAddOns(seed.addOns);
    }
  }, [open, seed.courses, seed.addOns]);

  const resetAll = useCallback(() => {
    setCourses(seed.courses);
    setAddOns(seed.addOns);
  }, [seed.courses, seed.addOns]);

  const applyTemplate = useCallback((kind: Exclude<DeviceKind, "기타">) => {
    setCourses(structuredClone(TEMPLATES[kind].courses));
    setAddOns(structuredClone(TEMPLATES[kind].addOns));
  }, []);

  // CRUD 핸들러
  const addCourse = () =>
    setCourses((prev) => [
      ...prev,
      { id: uid("c"), name: "새 코스", durationMin: 60, price: 5000 },
    ]);
  const addAddOn = () =>
    setAddOns((prev) => [
      ...prev,
      { id: uid("a"), name: "새 옵션", price: 1000 },
    ]);

  const patchCourse = (id: string, next: Course) =>
    setCourses((list) => list.map((c) => (c.id === id ? next : c)));
  const patchAddOn = (id: string, next: AddOn) =>
    setAddOns((list) => list.map((a) => (a.id === id ? next : a)));

  const removeCourse = (id: string) =>
    setCourses((list) => list.filter((c) => c.id !== id));
  const removeAddOn = (id: string) =>
    setAddOns((list) => list.filter((a) => a.id !== id));

  // 미리보기
  const totalPreview = useMemo(() => {
    const base = courses.reduce((s, c) => s + (c.price || 0), 0);
    const opts = addOns.reduce((s, a) => s + (a.price || 0), 0);
    return { base, opts, sum: base + opts };
  }, [courses, addOns]);

  // 저장
  const handleSave = () => {
    const trimmedCourses = courses.map((c) => ({
      ...c,
      name: c.name.trim(),
      price: toMoney(c.price),
      durationMin:
        c.durationMin === undefined
          ? undefined
          : toNonNegativeInt(c.durationMin)!,
    }));
    const trimmedAddOns = addOns.map((a) => ({
      ...a,
      name: a.name.trim(),
      price: toMoney(a.price),
    }));

    const validCourses =
      trimmedCourses.length > 0 &&
      trimmedCourses.every((c) => c.name.length > 0 && c.price >= 0);
    const validAddOns = trimmedAddOns.every(
      (a) => a.name.length > 0 && a.price >= 0
    );

    if (!validCourses || !validAddOns) {
      alert("이름과 가격을 확인해 주세요.");
      return;
    }

    onSave({ courses: trimmedCourses, addOns: trimmedAddOns });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="size-5" /> {deviceName} 옵션/가격 설정
            {deviceKind && (
              <Badge variant="secondary" className="ml-2">
                {deviceKind}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-5 grid gap-6">
            {/* 템플릿 퀵 액션 */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => applyTemplate("세탁기")}
                className="gap-1"
                title="세탁기 템플릿 적용"
              >
                <Wand2 className="size-4" /> 세탁기 템플릿
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => applyTemplate("건조기")}
                className="gap-1"
                title="건조기 템플릿 적용"
              >
                <Wand2 className="size-4" /> 건조기 템플릿
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetAll}
                className="gap-1"
                title="현재 값으로 되돌리기"
              >
                <Undo2 className="size-4" /> 초기화
              </Button>
            </div>

            {/* 세탁 코스 */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">세탁 코스</h3>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addCourse}
                    className="gap-1"
                  >
                    <Plus className="size-4" /> 코스 추가
                  </Button>
                </div>

                <div className="grid gap-3">
                  {courses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      등록된 코스가 없습니다.
                    </p>
                  ) : (
                    courses.map((c, idx) => (
                      <CourseRow
                        key={c.id}
                        value={c}
                        index={idx}
                        onChange={(next) => patchCourse(c.id, next)}
                        onRemove={() => removeCourse(c.id)}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 추가 옵션 */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">추가 옵션</h3>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addAddOn}
                    className="gap-1"
                  >
                    <Plus className="size-4" /> 옵션 추가
                  </Button>
                </div>

                <div className="grid gap-3">
                  {addOns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      등록된 옵션이 없습니다.
                    </p>
                  ) : (
                    addOns.map((a, idx) => (
                      <AddOnRow
                        key={a.id}
                        value={a}
                        index={idx}
                        onChange={(next) => patchAddOn(a.id, next)}
                        onRemove={() => removeAddOn(a.id)}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 미리보기 */}
            <div className="text-sm text-muted-foreground px-1">
              <span className="font-medium text-foreground">합계 미리보기</span>
              : 코스 {fmtKRW(totalPreview.base)}원 + 옵션{" "}
              {fmtKRW(totalPreview.opts)}원 ={" "}
              <span className="ml-1 font-semibold text-foreground">
                {fmtKRW(totalPreview.sum)}원
              </span>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t px-6 py-4 flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            ⓘ 이름/가격만 필수입니다. 시간(분)은 비워 둘 수 있습니다.
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="gap-1"
            >
              <X className="size-4" /> 취소
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={resetAll}
              className="gap-1"
            >
              <Undo2 className="size-4" /> 초기화
            </Button>
            <Button type="button" onClick={handleSave} className="gap-1">
              <Save className="size-4" /> 저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
 * (선택) 데모 컴포넌트
 * 실제 사용처에서는 open/onClose/onSave만 연결하세요.
 * ========================= */
export default function Demo() {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<DeviceOptions | null>(null);

  return (
    <div className="p-6 grid gap-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setOpen(true)}>옵션/가격 편집 열기</Button>
        {data && (
          <span className="text-sm text-muted-foreground">
            최근 저장: 코스 {data.courses.length}개, 옵션 {data.addOns.length}개
          </span>
        )}
      </div>

      <OptionsPricingDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={(v) => setData(v)}
        deviceName="세탁기1"
        deviceKind="세탁기"
      />

      {data && (
        <pre className="whitespace-pre-wrap text-xs bg-muted p-4 rounded-xl">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
