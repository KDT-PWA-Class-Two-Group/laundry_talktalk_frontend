"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { formatNumber } from "./deviceUtils/formatNumber";
import { Modal } from "./deviceUtils/modal";
import { OptionPickerModal } from "./deviceUtils/optionPicker";
import {
  Device,
  DeviceKind,
  DeviceOptions,
  Course,
  AddOn,
} from "@/types/admin";

// 숫자 포맷 함수는 deviceUtils/formatNumber.ts에서 관리

// TPL 더미 데이터 삭제됨. 실제 데이터는 서버 또는 상위 컴포넌트에서 받아와야 함
const TPL: Record<Exclude<DeviceKind, "기타">, DeviceOptions> = {
  세탁기: {
    courses: [],
    addOns: [],
  },
  건조기: {
    courses: [],
    addOns: [],
  },
};







function DeviceEditorModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Device | null;
  onClose: () => void;
  onSave: (d: Device) => void;
}) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<DeviceKind>(initial?.kind ?? "세탁기");
  const [opt, setOpt] = useState<DeviceOptions>(
    initial?.options ?? { courses: [], addOns: [] }
  );
  const [pick, setPick] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setKind(initial?.kind ?? "세탁기");
      setOpt(initial?.options ?? { courses: [], addOns: [] });
      setPick(false);
    }
  }, [open, initial]);
  const save = () => {
    const nm = name.trim();
    if (!nm) return alert("기기명을 입력하세요.");
    // id 생성: 기존 id가 없으면 Date.now()와 Math.random()을 조합해 생성
    const generatedId =
      initial?.id ??
      `device_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
    onSave({ id: generatedId, name: nm, kind, options: opt });
    onClose();
  };

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
              onChange={(e) => {
                setKind(e.target.value as DeviceKind);
                setOpt({ courses: [], addOns: [] });
              }}
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
                value={`${opt.courses.length}개 코스, ${opt.addOns.length}개 옵션`}
              />
              <Button
                type="button"
                className="h-11 rounded-xl"
                onClick={() => setPick(true)}
              >
                열기
              </Button>
            </div>
          </div>
        </div>
      </Modal>

       <OptionPickerModal
         open={pick}
         kind={kind}
         initial={opt}
         onClose={() => setPick(false)}
         onDone={(v) => setOpt(v)}
         tpl={TPL}
       />
    </>
  );
}

export default function DeviceManagementPanel() {
  const [list, setList] = useState<Device[]>([
    { id: "d1", name: "세탁기1", kind: "세탁기", options: TPL["세탁기"] },
    { id: "d2", name: "건조기1", kind: "건조기", options: TPL["건조기"] },
    { id: "d3", name: "세탁기1", kind: "세탁기" },
  ]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Device | null>(null);

  const remove = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("해당 기기를 삭제할까요?")) return;
    setList((p) => p.filter((d) => d.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
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

      <div className="space-y-6 rounded-2xl bg-sky-50 p-4 md:p-6">
        {list.map((d) => {
          const cs = d.options?.courses ?? [];
          const as = d.options?.addOns ?? [];
          const has = cs.length + as.length > 0;
          return (
            <div
              key={d.id}
              onClick={() => setEditing(d)}
              className="rounded-2xl bg-white p-4 md:p-6 shadow-sm transition hover:ring-2 hover:ring-sky-300 cursor-pointer"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{d.name}</h2>
                  <Badge variant="secondary">{d.kind}</Badge>
                </div>
                <Button
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                  onClick={(e) => remove(d.id, e)}
                >
                  삭제
                </Button>
              </div>

              <div className="mb-4 text-sm text-slate-600">
                설정된 코스: <span className="font-medium">{cs.length}개</span>
                <span className="mx-2">·</span>
                설정된 옵션: <span className="font-medium">{as.length}개</span>
              </div>

              {has ? (
                <div className="space-y-5">
                  {cs.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold text-slate-700">
                        세탁 코스
                      </h3>
                      <div className="space-y-2">
                        {cs.map((c) => (
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
                              {formatNumber(c.price)}원
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {as.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold text-slate-700">
                        추가 옵션
                      </h3>
                      <div className="space-y-2">
                        {as.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-2 text-sm"
                          >
                            <span>{a.name}</span>
                            <span className="font-medium">
                              {formatNumber(a.price)}원
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

      <DeviceEditorModal
        open={createOpen}
        initial={null}
        onClose={() => setCreateOpen(false)}
        onSave={(d) => setList((p) => [d, ...p])}
      />
      <DeviceEditorModal
        open={!!editing}
        initial={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSave={(d) => setList((p) => p.map((x) => (x.id === d.id ? d : x)))}
      />
    </div>
  );
}
