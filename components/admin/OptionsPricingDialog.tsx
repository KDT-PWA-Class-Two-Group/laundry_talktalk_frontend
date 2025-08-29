"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Course, AddOn, Category, Target } from "@/types/admin";

// 숫자 포맷 함수
const formatPrice = (price: number) =>
  new Intl.NumberFormat("ko-KR").format(price);
// 고유 id 생성 함수
const generateUniqueId = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
// 클래스명 합치기
const classNames = (...args: (string | false | undefined)[]) =>
  args.filter(Boolean).join(" ");
// 삭제 버튼 클래스
const deleteButtonClass =
  "rounded-full bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500";

function Modal({
  isModalOpen,
  title,
  onClose,
  children,
  footer,
}: {
  isModalOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[min(880px,92vw)] rounded-2xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button
            aria-label="닫기"
            className="rounded-md p-1 hover:bg-slate-100"
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

function AddOptionModal({
  isModalOpen,
  onClose,
  onSave,
}: {
  isModalOpen: boolean;
  onClose: () => void;
  onSave: (v: { courses: Course[]; addOns: AddOn[] }) => void;
}) {
  const [optionName, setOptionName] = useState("");
  const [category, setCategory] = useState<Category>("코스");
  const [optionPrice, setOptionPrice] = useState<number | "">("");
  const [selectedDevices, setSelectedDevices] = useState<Set<Target>>(
    new Set()
  );
  useEffect(() => {
    if (isModalOpen) {
      setOptionName("");
      setCategory("코스");
      setOptionPrice("");
      setSelectedDevices(new Set());
    }
  }, [isModalOpen]);
  const toggleDevice = (device: Target) =>
    setSelectedDevices((prevDevices) => {
      const newDevices = new Set(prevDevices);
      newDevices.has(device)
        ? newDevices.delete(device)
        : newDevices.add(device);
      return newDevices;
    });

  const save = () => {
    const trimmedOptionName = optionName.trim();
    if (!trimmedOptionName) return alert("옵션명을 입력하세요.");
    if (selectedDevices.size === 0)
      return alert("적용 가능한 기기를 1개 이상 선택하세요.");
    const finalOptionPrice =
      typeof optionPrice === "number"
        ? Math.max(0, Math.floor(optionPrice))
        : 0;
    const courses: Course[] = [];
    const addOns: AddOn[] = [];
    selectedDevices.forEach((device) => {
      if (category === "코스") {
        courses.push({
          id: generateUniqueId("c"),
          name: trimmedOptionName,
          price: finalOptionPrice,
          appliesTo: device,
        });
      } else {
        addOns.push({
          id: generateUniqueId("a"),
          name: trimmedOptionName,
          price: finalOptionPrice,
          appliesTo: device,
        });
      }
    });
    onSave({ courses, addOns });
    onClose();
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      title="옵션추가"
      onClose={onClose}
      footer={
        <div className="flex justify-center">
          <Button onClick={save} className="px-8 rounded-full">
            저장
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="text-xl font-semibold">옵션명</div>
          <input
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            placeholder="예) 표준 세탁(60분)"
            value={optionName}
            onChange={(event) => setOptionName(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="text-xl font-semibold">카테고리</div>
          <select
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
          >
            <option value="코스">코스</option>
            <option value="옵션">옵션</option>
          </select>
        </div>
        <div className="grid gap-2">
          <div className="text-xl font-semibold">적용 가능한 기기</div>
          {(["세탁기", "건조기"] as Target[]).map((device) => (
            <label key={device} className="flex items-center gap-2 text-lg">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedDevices.has(device)}
                onChange={() => toggleDevice(device)}
              />
              {device}
            </label>
          ))}
        </div>
        <div className="grid gap-2">
          <div className="text-xl font-semibold">가격 (원)</div>
          <input
            type="number"
            min={0}
            step={100}
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            placeholder="예) 5000"
            value={optionPrice}
            onChange={(event) =>
              setOptionPrice(
                event.target.value === "" ? "" : Number(event.target.value)
              )
            }
          />
        </div>
      </div>
    </Modal>
  );
}

export default function OptionsManagementPanel() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: generateUniqueId("c"),
      name: "표준 세탁(60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
    {
      id: generateUniqueId("c"),
      name: "이불 세탁(60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
    {
      id: generateUniqueId("c"),
      name: "이불 건조 (60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
  ]);
  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: generateUniqueId("a"),
      name: "헹굼 추가(10분)",
      price: 1000,
      appliesTo: "세탁기",
    },
    {
      id: generateUniqueId("a"),
      name: "건조 10분 추가(10분)",
      price: 5000,
      appliesTo: "건조기",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 옵션/코스 행 렌더링 컴포넌트
  function Row({ item, onDelete }: { item: Course | AddOn; onDelete: () => void }) {
    return (
      <div
        onClick={() => setActiveId(item.id)}
        className={classNames(
          "flex items-center justify-between rounded-2xl border bg-white px-5 py-3 transition-shadow",
          activeId === item.id && "ring-2 ring-sky-500 border-sky-500"
        )}
      >
        <div className="min-w-0">
          <div className="truncate text-base font-semibold">{item.name}</div>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <span>적용 가능:</span>
            <Badge variant="secondary" className="shrink-0">
              {item.appliesTo}
            </Badge>
          </div>
        </div>
        <div className="ml-4 flex items-center gap-3">
          <div className="whitespace-nowrap text-base font-medium">
            {formatPrice(item.price)}원
          </div>
          <Button
            size="sm"
            className={deleteButtonClass}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            삭제
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">옵션 관리</h1>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" /> 옵션 추가
        </Button>
      </div>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">코스</h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <Row
              key={course.id}
              item={course}
              onDelete={() =>
                setCourses((prevCourses) =>
                  prevCourses.filter((prevCourse) => prevCourse.id !== course.id)
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">옵션</h2>
        <div className="space-y-4">
          {addOns.map((addOn) => (
            <Row
              key={addOn.id}
              item={addOn}
              onDelete={() =>
                setAddOns((prevAddOns) =>
                  prevAddOns.filter((prevAddOn) => prevAddOn.id !== addOn.id)
                )
              }
            />
          ))}
        </div>
      </section>

      <AddOptionModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={({ courses: newCourses, addOns: newAddOns }) => {
          if (newCourses.length)
            setCourses((prevCourses) => [...prevCourses, ...newCourses]);
          if (newAddOns.length)
            setAddOns((prevAddOns) => [...prevAddOns, ...newAddOns]);
        }}
      />
    </div>
  );
}
