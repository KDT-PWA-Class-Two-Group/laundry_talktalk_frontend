"use client";

import { useMemo, useRef, useState, ChangeEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";

// 타입 정의
type NoticeType = "공지" | "홍보";
interface NoticeItem {
  id: string;
  title: string;
  type: NoticeType;
  createdAt: string; // YYYY.MM.DD
  startAt?: string; // YYYY-MM-DD (input용)
  endAt?: string; // YYYY-MM-DD (input용)
  content?: string;
  fileName?: string;
}

function formatToDotDate(input: string) {
  // input: YYYY-MM-DD -> YYYY.MM.DD
  if (!input) return "";
  const [y, m, d] = input.split("-");
  return `${y}.${m}.${d}`;
}

// 간단 모달
function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[min(960px,92vw)] rounded-2xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            className="rounded-md p-1 hover:bg-slate-100"
            aria-label="닫기"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function NoticeSection({ storeName }: { storeName: string }) {
  // 탭/매장/정렬 상태
  const [store, setStore] = useState<string>(storeName || "둔산점");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // 데모 데이터
  const [items, setItems] = useState<NoticeItem[]>([
    {
      id: "n1",
      title: "할인~",
      type: "홍보",
      createdAt: "2025.08.14",
      startAt: "2025-08-14",
      endAt: "2025-08-14",
      content: "예시 홍보 내용",
    },
    {
      id: "n2",
      title: "일 안함~",
      type: "공지",
      createdAt: "2025.08.14",
      startAt: "2025-08-14",
      endAt: "2025-08-14",
      content: "예시 공지 내용",
    },
  ]);

  // 목록 선택/모달 상태
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => items.find((n) => n.id === selectedId) || null,
    [items, selectedId]
  );
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "view" | "edit">("create");

  // 폼 상태
  const today = new Date().toISOString().slice(0, 10);
  const emptyForm = {
    title: "",
    startAt: today,
    endAt: today,
    content: "",
    fileName: "",
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const sortedItems = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const av = a.createdAt.replaceAll(".", "");
      const bv = b.createdAt.replaceAll(".", "");
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return copy;
  }, [items, sortAsc]);

  // 핸들러
  const openCreate = () => {
    setSelectedId(null);
    setMode("create");
    setForm(emptyForm);
    setOpen(true);
  };

  const openView = (id: string) => {
    const target = items.find((n) => n.id === id);
    if (!target) return;
    setSelectedId(id);
    setMode("view");
    setForm({
      title: target.title,
      startAt: target.startAt || today,
      endAt: target.endAt || today,
      content: target.content || "",
      fileName: target.fileName || "",
    });
    setOpen(true);
  };

  const closeModal = useCallback(() => {
    setOpen(false);
    setMode("create");
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as {
      name: keyof typeof form;
      value: string;
    };
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => fileRef.current?.click();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setForm((prev) => ({ ...prev, fileName: f.name }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return alert("제목을 입력하세요.");
    if (mode === "create") {
      const newItem: NoticeItem = {
        id: `n${Date.now()}`,
        title: form.title,
        type: "공지",
        createdAt: formatToDotDate(form.startAt),
        startAt: form.startAt,
        endAt: form.endAt,
        content: form.content,
        fileName: form.fileName,
      };
      setItems((prev) => [newItem, ...prev]);
      setSelectedId(newItem.id);
      setMode("view");
    } else if (mode === "edit" && selected) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === selected.id
            ? {
                ...it,
                title: form.title,
                startAt: form.startAt,
                endAt: form.endAt,
                createdAt: formatToDotDate(form.startAt),
                content: form.content,
                fileName: form.fileName,
              }
            : it
        )
      );
      setMode("view");
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm("삭제하시겠습니까?")) return;
    setItems((prev) => prev.filter((it) => it.id !== selected.id));
    closeModal();
  };

  const beginEdit = () => selected && setMode("edit");

  return (
    <div className="space-y-3">
      {/* 상단: 매장선택 + 정렬 + 글쓰기 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">매장선택 :</span>
          <div className="relative">
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="appearance-none h-9 rounded-xl border px-3 pr-8 text-sm bg-white"
            >
              {["둔산점", "강남점", "서면점"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            className="h-8 rounded-md px-3"
            onClick={() => setSortAsc((p) => !p)}
          >
            정렬
          </Button>
          <Button className="rounded-xl" onClick={openCreate}>
            글쓰기
          </Button>
        </div>
      </div>

      {/* 공지/홍보 리스트만 표시 */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="grid grid-cols-[1fr_120px_120px]">
          {["제목", "구분", "생성일"].map((h) => (
            <div
              key={h}
              className="px-3 py-2 bg-slate-50 border-b text-sm font-medium"
            >
              {h}
            </div>
          ))}
        </div>
        {sortedItems.map((n) => (
          <button
            key={n.id}
            onClick={() => openView(n.id)}
            className="grid w-full grid-cols-[1fr_120px_120px] border-b text-left hover:bg-slate-50"
          >
            <div className="px-3 py-2 text-sm truncate">{n.title}</div>
            <div className="px-3 py-2 text-sm">{n.type}</div>
            <div className="px-3 py-2 text-sm">{n.createdAt}</div>
          </button>
        ))}
      </div>

      {/* 모달: 작성/조회/수정 */}
      <Modal
        open={open}
        onClose={closeModal}
        title={
          mode === "create"
            ? "새 공지 등록"
            : mode === "edit"
            ? "공지 수정"
            : "공지 조회"
        }
      >
        <div className="rounded-xl border border-sky-300 bg-sky-100 p-4">
          <div className="grid gap-3">
            {/* 제목 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
              <div className="text-base font-semibold">제목 :</div>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="h-10 rounded-xl border bg-white px-3 text-sm"
                placeholder="제목 입력"
                readOnly={mode === "view"}
              />
            </div>
            {/* 기간 설정 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
              <div className="text-base font-semibold">기간 설정 :</div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  name="startAt"
                  value={form.startAt}
                  onChange={handleChange}
                  className="h-10 rounded-xl border bg-white px-3 text-sm"
                  readOnly={mode === "view"}
                />
                <span className="px-1">~</span>
                <input
                  type="date"
                  name="endAt"
                  value={form.endAt}
                  onChange={handleChange}
                  className="h-10 rounded-xl border bg-white px-3 text-sm"
                  readOnly={mode === "view"}
                />
              </div>
            </div>
            {/* 내용 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)] items-start gap-2">
              <div className="text-base font-semibold">&nbsp;</div>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="min-h-[220px] rounded-xl border bg-white px-3 py-2 text-sm"
                placeholder="작성 내용"
                readOnly={mode === "view"}
              />
            </div>
            {/* 이미지 첨부 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)_90px] items-center gap-2">
              <div className="text-base font-semibold">이미지 첨부 :</div>
              <input
                name="fileName"
                value={form.fileName}
                onChange={handleChange}
                className="h-10 rounded-xl border bg-white px-3 text-sm"
                placeholder="첨부 내용"
                readOnly
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="h-10 rounded-xl"
                  onClick={handleUploadClick}
                  disabled={mode === "view"}
                >
                  업로드
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={mode === "view"}
                />
              </div>
            </div>
          </div>
          {/* 하단 버튼 */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button className="rounded-xl px-5" onClick={handleSubmit}>
              {mode === "create" ? "등록" : mode === "edit" ? "저장" : "등록"}
            </Button>
            <div className="ml-3 flex items-center gap-2">
              <span className="text-xs text-slate-600">조회시</span>
              <Button
                className="h-9 rounded-xl px-3 text-sm"
                onClick={beginEdit}
                disabled={!selected || mode === "edit" || mode === "create"}
              >
                수정
              </Button>
              <Button
                className="h-9 rounded-xl px-3 text-sm"
                onClick={handleDelete}
                disabled={!selected || mode === "create"}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
