"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

type DeviceKind = "세탁기" | "건조기" | "기타";
type Target = Exclude<DeviceKind, "기타">;
type Category = "코스" | "옵션";

interface Course {
  id: string;
  name: string;
  durationMin?: number;
  price: number;
  appliesTo: Target;
}
interface AddOn {
  id: string;
  name: string;
  price: number;
  appliesTo: Target;
}

const fmt = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const cx = (...a: (string | false | undefined)[]) =>
  a.filter(Boolean).join(" ");
const delBtn =
  "rounded-full bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500";

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
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (v: { courses: Course[]; addOns: AddOn[] }) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("코스");
  const [price, setPrice] = useState<number | "">("");
  const [sel, setSel] = useState<Set<Target>>(new Set());
  useEffect(() => {
    if (open) {
      setName("");
      setCategory("코스");
      setPrice("");
      setSel(new Set());
    }
  }, [open]);
  const toggle = (d: Target) =>
    setSel((p) => {
      const n = new Set(p);
      n.has(d) ? n.delete(d) : n.add(d);
      return n;
    });

  const save = () => {
    const nm = name.trim();
    if (!nm) return alert("옵션명을 입력하세요.");
    if (sel.size === 0) return alert("적용 가능한 기기를 1개 이상 선택하세요.");
    const p = typeof price === "number" ? Math.max(0, Math.floor(price)) : 0;
    const courses: Course[] = [],
      addOns: AddOn[] = [];
    sel.forEach((dev) =>
      category === "코스"
        ? courses.push({ id: uid("c"), name: nm, price: p, appliesTo: dev })
        : addOns.push({ id: uid("a"), name: nm, price: p, appliesTo: dev })
    );
    onSave({ courses, addOns });
    onClose();
  };

  return (
    <Modal
      open={open}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div className="grid gap-2">
          <div className="text-xl font-semibold">적용 가능한 기기</div>
          {(["세탁기", "건조기"] as Target[]).map((d) => (
            <label key={d} className="flex items-center gap-2 text-lg">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={sel.has(d)}
                onChange={() => toggle(d)}
              />
              {d}
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

export default function OptionsManagementPanel() {
  const [activeId, setActiveId] = useState<string | null>(null);
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
  const [open, setOpen] = useState(false);
  const Row = ({
    id,
    name,
    appliesTo,
    price,
    onDelete,
  }: {
    id: string;
    name: string;
    appliesTo: Target;
    price: number;
    onDelete: () => void;
  }) => (
    <div
      onClick={() => setActiveId(id)}
      className={cx(
        "flex items-center justify-between rounded-2xl border bg-white px-5 py-3 transition-shadow",
        activeId === id && "ring-2 ring-sky-500 border-sky-500"
      )}
    >
      <div className="min-w-0">
        <div className="truncate text-base font-semibold">{name}</div>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <span>적용 가능:</span>
          <Badge variant="secondary" className="shrink-0">
            {appliesTo}
          </Badge>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <div className="whitespace-nowrap text-base font-medium">
          {fmt(price)}원
        </div>
        <Button
          size="sm"
          className={delBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          삭제
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">옵션 관리</h1>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" /> 옵션 추가
        </Button>
      </div>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">코스</h2>
        <div className="space-y-4">
          {courses.map((c) => (
            <Row
              key={c.id}
              id={c.id}
              name={c.name}
              appliesTo={c.appliesTo}
              price={c.price}
              onDelete={() => setCourses((p) => p.filter((x) => x.id !== c.id))}
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">옵션</h2>
        <div className="space-y-4">
          {addOns.map((a) => (
            <Row
              key={a.id}
              id={a.id}
              name={a.name}
              appliesTo={a.appliesTo}
              price={a.price}
              onDelete={() => setAddOns((p) => p.filter((x) => x.id !== a.id))}
            />
          ))}
        </div>
      </section>

      <AddOptionModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={({ courses: cs, addOns: as }) => {
          if (cs.length) setCourses((p) => [...p, ...cs]);
          if (as.length) setAddOns((p) => [...p, ...as]);
        }}
      />
    </div>
  );
}
