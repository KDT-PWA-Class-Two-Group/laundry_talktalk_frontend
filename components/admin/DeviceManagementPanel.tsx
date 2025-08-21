// components/admin/DeviceManagementPanel.tsx  (또는 DeviceManagementPage.tsx)
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

/* =========================
 * 타입
 * ========================= */
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
  options?: DeviceOptions;
}

/* =========================
 * 유틸 & 템플릿
 * ========================= */
const fmtKRW = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const TEMPLATES: Record<Exclude<DeviceKind, "기타">, DeviceOptions> = {
  세탁기: {
    courses: [
      { id: uid("c"), name: "표준세탁(60분)", durationMin: 60, price: 5000 },
      { id: uid("c"), name: "이불 세탁 (80분)", durationMin: 80, price: 7000 },
      { id: uid("c"), name: "울코스 (40분)", durationMin: 40, price: 5000 },
    ],
    addOns: [
      { id: uid("a"), name: "섬유유연제", price: 1000 },
      { id: uid("a"), name: "헹굼 추가", price: 500 },
    ],
  },
  건조기: {
    courses: [
      { id: uid("c"), name: "표준건조(60분)", durationMin: 60, price: 5000 },
      { id: uid("c"), name: "이불 건조 (80분)", durationMin: 80, price: 7000 },
      { id: uid("c"), name: "울코스 (40분)", durationMin: 40, price: 5000 },
    ],
    addOns: [{ id: uid("a"), name: "+10분 추가", price: 1000 }],
  },
};

/* =========================
 * 공용 모달
 * ========================= */
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
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            className="rounded-md p-1 hover:bg-slate-100"
            aria-label="닫기"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="border-t px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}

/* =========================
 * 옵션 선택(2차 팝업)
 * ========================= */
function OptionPickerModal({
  open,
  kind,
  initial,
  onClose,
  onDone,
}: {
  open: boolean;
  kind: DeviceKind;
  initial: DeviceOptions;
  onClose: () => void;
  onDone: (value: DeviceOptions) => void;
}) {
  const tpl =
    kind === "기타"
      ? { courses: [] as Course[], addOns: [] as AddOn[] }
      : TEMPLATES[kind];

  const [selCourses, setSelCourses] = useState<Set<string>>(
    () => new Set(initial.courses.map((c) => c.id))
  );
  const [selAddOns, setSelAddOns] = useState<Set<string>>(
    () => new Set(initial.addOns.map((a) => a.id))
  );

  useEffect(() => {
    setSelCourses(new Set(initial.courses.map((c) => c.id)));
    setSelAddOns(new Set(initial.addOns.map((a) => a.id)));
  }, [open, initial]);

  const toggle = (
    set: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string
  ) =>
    set((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const done = () => {
    const courses = tpl.courses.filter((c) => selCourses.has(c.id));
    const addOns = tpl.addOns.filter((a) => selAddOns.has(a.id));
    onDone({ courses, addOns });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="옵션 선택"
      onClose={onClose}
      footer={
        <div className="flex justify-center">
          <Button onClick={done} className="px-8 rounded-full">
            완료
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        <section>
          <h4 className="mb-3 border-b pb-1 text-lg font-semibold">코스</h4>
          <div className="space-y-3">
            {tpl.courses.length === 0 && (
              <p className="text-sm text-slate-500">선택할 코스가 없습니다.</p>
            )}
            {tpl.courses.map((c) => (
              <label
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selCourses.has(c.id)}
                    onChange={() => toggle(setSelCourses, c.id)}
                  />
                  <span className="text-sm">
                    {c.name}
                    {typeof c.durationMin === "number" && (
                      <span className="text-slate-500">
                        {" "}
                        ({c.durationMin}분)
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-sm font-medium">{fmtKRW(c.price)}원</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-3 border-b pb-1 text-lg font-semibold">
            추가 옵션
          </h4>
          <div className="space-y-3">
            {tpl.addOns.length === 0 && (
              <p className="text-sm text-slate-500">
                선택할 추가 옵션이 없습니다.
              </p>
            )}
            {tpl.addOns.map((a) => (
              <label
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selAddOns.has(a.id)}
                    onChange={() => toggle(setSelAddOns, a.id)}
                  />
                  <span className="text-sm">{a.name}</span>
                </div>
                <span className="text-sm font-medium">{fmtKRW(a.price)}원</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}

/* =========================
 * 기기 추가/수정 팝업 (공용)
 * ========================= */
function DeviceEditorModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Device | null; // 없으면 추가, 있으면 수정
  onClose: () => void;
  onSave: (device: Device) => void;
}) {
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<DeviceKind>(initial?.kind ?? "세탁기");
  const [options, setOptions] = useState<DeviceOptions>(
    initial?.options ?? { courses: [], addOns: [] }
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setKind(initial?.kind ?? "세탁기");
      setOptions(initial?.options ?? { courses: [], addOns: [] });
      setPickerOpen(false);
    }
  }, [open, initial]);

  const handleKindChange = (next: DeviceKind) => {
    setKind(next);
    setOptions({ courses: [], addOns: [] }); // 타입 바뀌면 선택 초기화
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return alert("기기명을 입력하세요.");

    onSave({
      id: initial?.id ?? uid("d"),
      name: trimmed,
      kind,
      options,
    });
    onClose();
  };

  const selectedCountText = `${options.courses.length}개 코스, ${options.addOns.length}개 옵션`;

  return (
    <>
      <Modal
        open={open}
        title={isEdit ? "기기 수정" : "기기 추가"}
        onClose={onClose}
        footer={
          <div className="flex justify-center">
            <Button onClick={save} className="rounded-full px-6">
              저장
            </Button>
          </div>
        }
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <div className="text-base font-semibold">기기명</div>
            <input
              className="h-11 w-full rounded-xl border bg-slate-50 px-3"
              placeholder="예) 세탁기2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="text-base font-semibold">기기 타입</div>
            <select
              className="h-11 w-full rounded-xl border bg-slate-50 px-3"
              value={kind}
              onChange={(e) => handleKindChange(e.target.value as DeviceKind)}
            >
              <option value="세탁기">세탁기</option>
              <option value="건조기">건조기</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className="grid gap-2">
            <div className="text-base font-semibold">옵션 설정</div>
            <div className="flex items-center gap-2">
              <input
                className="h-11 flex-1 rounded-xl border bg-slate-50 px-3"
                readOnly
                value={selectedCountText}
              />
              <Button
                type="button"
                className="h-11 rounded-xl"
                onClick={() => setPickerOpen(true)}
              >
                열기
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <OptionPickerModal
        open={pickerOpen}
        kind={kind}
        initial={options}
        onClose={() => setPickerOpen(false)}
        onDone={(v) => setOptions(v)}
      />
    </>
  );
}

/* =========================
 * 메인 패널
 * ========================= */
export default function DeviceManagementPanel() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "d1", name: "세탁기1", kind: "세탁기", options: TEMPLATES["세탁기"] },
    { id: "d2", name: "건조기1", kind: "건조기", options: TEMPLATES["건조기"] },
    { id: "d3", name: "세탁기1", kind: "세탁기" },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Device | null>(null);

  const removeDevice = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // 카드 클릭 전파 방지
    if (!confirm("해당 기기를 삭제할까요?")) return;
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const openEdit = (d: Device) => setEditing(d);

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* 타이틀 + 기기 추가 버튼 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">기기관리</h1>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" /> 기기 추가
        </Button>
      </div>

      {/* 리스트 */}
      <div className="space-y-6 rounded-2xl bg-sky-50 p-4 md:p-6">
        {devices.map((d) => {
          const courses = d.options?.courses ?? [];
          const addOns = d.options?.addOns ?? [];
          const hasAny = courses.length + addOns.length > 0;

          return (
            <div
              key={d.id}
              onClick={() => openEdit(d)}
              className="rounded-2xl bg-white p-4 md:p-6 shadow-sm transition hover:ring-2 hover:ring-sky-300 cursor-pointer"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{d.name}</h2>
                  <Badge variant="secondary">{d.kind}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                    onClick={(e) => removeDevice(d.id, e)}
                  >
                    삭제
                  </Button>
                </div>
              </div>

              <div className="mb-4 text-sm text-slate-600">
                설정된 코스:{" "}
                <span className="font-medium">{courses.length}개</span>
                <span className="mx-2">·</span>
                설정된 옵션:{" "}
                <span className="font-medium">{addOns.length}개</span>
              </div>

              {hasAny ? (
                <div className="space-y-5">
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
                <div className="rounded-2xl border-2 border-dashed border-slate-300 px-4 py-16 text-center text-sm text-slate-500">
                  설정된 옵션이 없습니다.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 추가 / 수정 모달 */}
      <DeviceEditorModal
        open={createOpen}
        initial={null}
        onClose={() => setCreateOpen(false)}
        onSave={(device) => setDevices((prev) => [device, ...prev])}
      />

      <DeviceEditorModal
        open={!!editing}
        initial={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSave={(device) => {
          setDevices((prev) =>
            prev.map((d) => (d.id === device.id ? device : d))
          );
        }}
      />
    </div>
  );
}
