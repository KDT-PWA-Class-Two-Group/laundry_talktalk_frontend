import { useState, useEffect } from "react";
import { DeviceKind, DeviceOptions, Course, AddOn } from "@/types/admin";

// # 옵션 선택 모달의 props 타입 정의
interface OptionPickerModalProps {
  open: boolean;
  kind: DeviceKind;
  initial: DeviceOptions;
  onClose: () => void;
  onDone: (v: DeviceOptions) => void;
  tpl: Record<Exclude<DeviceKind, "기타">, DeviceOptions>;
}

// # 옵션 선택 모달 컴포넌트
// # 코스/옵션 선택 토글 함수 (외부 분리)
export function toggleSelection(set: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) {
  set((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
}

// # 선택 완료 함수 (외부 분리)
export function getSelectedOptions(template: DeviceOptions, selC: Set<string>, selA: Set<string>) {
  return {
    courses: template.courses.filter((c) => selC.has(c.id)),
    addOns: template.addOns.filter((a) => selA.has(a.id)),
  };
}

export function OptionPickerModal({ open, kind, initial, onClose, onDone, tpl }: OptionPickerModalProps) {
  // # 선택된 기기 종류에 따라 템플릿 결정
  const template = kind === "기타"
    ? { courses: [] as Course[], addOns: [] as AddOn[] }
    : tpl[kind];
  // # 선택된 코스/옵션 id를 상태로 관리
  const [selC, setSelC] = useState<Set<string>>(() => new Set(initial.courses.map((c) => c.id)));
  const [selA, setSelA] = useState<Set<string>>(() => new Set(initial.addOns.map((a) => a.id)));
  // # 모달이 열릴 때마다 초기값으로 상태 재설정
  useEffect(() => {
    setSelC(new Set(initial.courses.map((c) => c.id)));
    setSelA(new Set(initial.addOns.map((a) => a.id)));
  }, [open, initial]);

  // # 코스/옵션 선택 토글 함수

  // # 선택 완료 시 부모로 결과 전달
  const done = () => {
    onDone(getSelectedOptions(template, selC, selA));
    onClose();
  };

  // # UI 렌더링은 기존 코드 참고하여 분리 필요
  return null;
}
