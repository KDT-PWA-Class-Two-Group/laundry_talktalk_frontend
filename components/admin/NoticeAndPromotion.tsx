"use client";

import {
  useMemo,
  useRef,
  useState,
  ChangeEvent,
  useCallback,
  useEffect,
} from "react";
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
  // 매장/정렬
  const [store, setStore] = useState<string>(storeName || "둔산점");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // 데이터 상태: API 연동
  const [items, setItems] = useState<NoticeItem[]>([]);

  // 매장별 공지/홍보글 목록 조회
  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch(`/app/api/posts/store/${store}`);
        const data = await res.json();
        setItems(
          data.map((item: any) => ({
            id: item.store_notice_event_id?.toString() ?? '',
            title: item.store_notice_event_title,
            type: item.store_notice_event_type === false ? '공지' : '홍보',
            createdAt: item.store_notice_event_create_time?.slice(0, 10)?.replace(/-/g, '.') ?? '',
            startAt: item.store_notice_event_start_time ?? '',
            endAt: item.store_notice_event_end_time ?? '',
            content: item.store_notice_event_contents ?? '',
            fileName: item.store_notice_event_image_url ?? '',
          }))
        );
      } catch (e) {
        setItems([]);
      }
    }
    fetchNotices();
  }, [store]);

  // 선택/모달
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => items.find((n) => n.id === selectedId) || null,
    [items, selectedId]
  );
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "view" | "edit">("create");

  // 폼
  const today = new Date().toISOString().slice(0, 10);
  const emptyForm = {
    title: "",
    startAt: today,
    endAt: today,
    content: "",
    fileName: "",
    type: "공지" as NoticeType,
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const startRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLInputElement | null>(null);
  const [pendingPicker, setPendingPicker] = useState<"start" | "end" | null>(
    null
  );

  // edit 전환 뒤 달력 오픈
  useEffect(() => {
    if (mode === "edit" && pendingPicker) {
      const el = pendingPicker === "start" ? startRef.current : endRef.current;
      el?.focus();
      setTimeout(() => el?.showPicker?.(), 0);
      setPendingPicker(null);
    }
  }, [mode, pendingPicker]);

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
    setTimeout(() => titleRef.current?.focus(), 0);
  };

  const openView = (id: string) => {
    const target = items.find((n) => n.id === id);
    if (!target) return;
    setSelectedId(id);
    setMode("edit"); // 바로 수정
    setForm({
      title: target.title,
      startAt: target.startAt || today,
      endAt: target.endAt || today,
      content: target.content || "",
      fileName: target.fileName || "",
      type: target.type, // 기존 태그 유지
    });
    setOpen(true);
  };

  const closeModal = useCallback(() => {
    setOpen(false);
    setMode("create");
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  // 등록/수정 시 API 호출, UI 로직은 그대로 유지
  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("제목을 입력하세요.");
    if (mode === "create") {
      // 등록
      try {
        const res = await fetch("/app/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_id: store,
            store_notice_event_type: form.type === "공지" ? false : true,
            store_notice_event_title: form.title,
            store_notice_event_contents: form.content,
            store_notice_event_image_url: form.fileName,
            store_notice_event_start_time: form.startAt,
            store_notice_event_end_time: form.endAt,
          }),
        });
        if (res.ok) {
          setOpen(false);
          setMode("view");
          // 목록 새로고침
          const refreshed = await fetch(`/app/api/posts/store/${store}`);
          const data = await refreshed.json();
          setItems(
            data.map((item: any) => ({
              id: item.store_notice_event_id?.toString() ?? '',
              title: item.store_notice_event_title,
              type: item.store_notice_event_type === false ? '공지' : '홍보',
              createdAt: item.store_notice_event_create_time?.slice(0, 10)?.replace(/-/g, '.') ?? '',
              startAt: item.store_notice_event_start_time ?? '',
              endAt: item.store_notice_event_end_time ?? '',
              content: item.store_notice_event_contents ?? '',
              fileName: item.store_notice_event_image_url ?? '',
            }))
          );
        }
      } catch (e) {}
    } else if (mode === "edit" && selected) {
      // 수정
      try {
        const res = await fetch(`/app/api/posts/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_notice_event_title: form.title,
            store_notice_event_contents: form.content,
            store_notice_event_image_url: form.fileName,
            store_notice_event_start_time: form.startAt,
            store_notice_event_end_time: form.endAt,
            store_notice_event_type: form.type === "공지" ? false : true,
          }),
        });
        if (res.ok) {
          setMode("view");
          // 목록 새로고침
          const refreshed = await fetch(`/app/api/posts/store/${store}`);
          const data = await refreshed.json();
          setItems(
            data.map((item: any) => ({
              id: item.store_notice_event_id?.toString() ?? '',
              title: item.store_notice_event_title,
              type: item.store_notice_event_type === false ? '공지' : '홍보',
              createdAt: item.store_notice_event_create_time?.slice(0, 10)?.replace(/-/g, '.') ?? '',
              startAt: item.store_notice_event_start_time ?? '',
              endAt: item.store_notice_event_end_time ?? '',
              content: item.store_notice_event_contents ?? '',
              fileName: item.store_notice_event_image_url ?? '',
            }))
          );
        }
      } catch (e) {}
    }
  };

  // 삭제 시 API 호출, UI 로직은 그대로 유지
  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/app/api/posts/${selected.id}`, { method: "DELETE" });
      if (res.ok) {
        closeModal();
        // 목록 새로고침
        const refreshed = await fetch(`/app/api/posts/store/${store}`);
        const data = await refreshed.json();
        setItems(
          data.map((item: any) => ({
            id: item.store_notice_event_id?.toString() ?? '',
            title: item.store_notice_event_title,
            type: item.store_notice_event_type === false ? '공지' : '홍보',
            createdAt: item.store_notice_event_create_time?.slice(0, 10)?.replace(/-/g, '.') ?? '',
            startAt: item.store_notice_event_start_time ?? '',
            endAt: item.store_notice_event_end_time ?? '',
            content: item.store_notice_event_contents ?? '',
            fileName: item.store_notice_event_image_url ?? '',
          }))
        );
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-3">
      {/* 상단 바 */}
      <div className="flex items-center gap-3">
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

      {/* 리스트 */}
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

      {/* 모달 */}
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
                ref={titleRef}
                name="title"
                value={form.title}
                onChange={handleChange}
                className="h-10 rounded-xl border bg-white px-3 text-sm"
                placeholder="제목 입력"
                readOnly={mode === "view"}
              />
            </div>

            {/* 태그 (create/edit 노출) */}
            {(mode === "create" || mode === "edit") && (
              <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
                <div className="text-base font-semibold">태그 :</div>
                <div className="inline-flex overflow-hidden rounded-xl border">
                  {(["공지", "홍보"] as NoticeType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                      className={`px-3 py-2 text-sm ${
                        form.type === t
                          ? "bg-slate-800 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 기간 설정 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
              <div className="text-base font-semibold">기간 설정 :</div>
              <div className="flex items-center gap-2">
                <input
                  ref={startRef}
                  type="date"
                  name="startAt"
                  value={form.startAt}
                  onChange={handleChange}
                  onMouseDown={(e) => {
                    if (mode === "view") {
                      e.preventDefault();
                      setMode("edit");
                      setPendingPicker("start");
                    }
                  }}
                  className="h-10 rounded-xl border bg-white px-3 text-sm"
                  readOnly={mode === "view"}
                />
                <span className="px-1">~</span>
                <input
                  ref={endRef}
                  type="date"
                  name="endAt"
                  value={form.endAt}
                  onChange={handleChange}
                  onMouseDown={(e) => {
                    if (mode === "view") {
                      e.preventDefault();
                      setMode("edit");
                      setPendingPicker("end");
                    }
                  }}
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
          {mode === "create" ? (
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button className="rounded-xl px-5" onClick={handleSubmit}>
                등록
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                className="h-9 rounded-xl px-3 text-sm"
                onClick={handleSubmit}
              >
                저장
              </Button>
              <Button
                className="h-9 rounded-xl px-3 text-sm"
                onClick={handleDelete}
                disabled={!selected}
              >
                삭제
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
