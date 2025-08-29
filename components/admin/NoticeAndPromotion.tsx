"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// 타입 정의
type NoticeType = "공지" | "홍보";
export interface NoticeItem {
  id: string;
  title: string;
  type: NoticeType;
  createdAt: string; // YYYY.MM.DD
  startAt?: string; // YYYY-MM-DD (input용)
  endAt?: string; // YYYY-MM-DD (input용)
  content?: string;
  fileName?: string;
}

// 스토어 데이터 타입 정의
interface StoreData {
  store_id: string;
  store_name: string;
}

// API 응답 공지사항 데이터 타입
export interface ApiNoticeData {
  store_notice_event_id: number;
  store_notice_event_title: string;
  store_notice_event_type: boolean;
  store_notice_event_create_time: string;
  store_notice_event_start_time: string;
  store_notice_event_end_time: string;
  store_notice_event_contents: string;
  store_notice_event_image_url: string;
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

export default function NoticeAndPromotion({ storeId }: { storeId: string }) {
  // 날짜 및 초기 폼
  const today = new Date().toISOString().slice(0, 10);
  const emptyForm: NoticeItem = {
    id: "",
    title: "",
    type: "공지",
    createdAt: today.replace(/-/g, "."),
    startAt: today,
    endAt: today,
    content: "",
    fileName: "",
  };

  type PendingPikcer = "start" | "end" | null;

  // 상태 선언
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "view">("view");
  const [form, setForm] = useState<NoticeItem>({ ...emptyForm });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [storeName, setStoreName] = useState<string>("");
  const [items, setItems] = useState<NoticeItem[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [, setPendingPicker] = useState<PendingPikcer>(null);
  // const store = storeId || "";

  // 선택된 아이템
  const selected = selectedId ? items.find((n) => n.id === selectedId) : null;

  // 매장 데이터 및 공지사항 데이터 fetch
  useEffect(() => {
    if (!storeId) {
      setStoreName("");
      setItems([]);
      return;
    }

    // 매장명과 공지사항을 병렬로 fetch
    const fetchStoreData = async () => {
      try {
        // 매장 정보와 공지사항 동시 요청
        const [storeRes, noticesRes] = await Promise.all([
          fetch("/api/stores"),
          fetch(`/app/api/posts/store/${storeId}`)
        ]);

        // 매장명 설정
        if (storeRes.ok) {
          const storeData: StoreData[] = await storeRes.json();
          const found = storeData.find(
            (s: StoreData) => s.store_id?.toString() === storeId
          );
          setStoreName(found?.store_name ?? "");
        }

        // 공지사항 설정
        if (noticesRes.ok) {
          const noticesData: ApiNoticeData[] = await noticesRes.json();
          setItems(
            noticesData.map((item: ApiNoticeData) => ({
              id: item.store_notice_event_id?.toString() ?? "",
              title: item.store_notice_event_title,
              type: item.store_notice_event_type === false ? "공지" : "홍보",
              createdAt:
                item.store_notice_event_create_time
                  ?.slice(0, 10)
                  ?.replace(/-/g, ".") ?? "",
              startAt: item.store_notice_event_start_time ?? "",
              endAt: item.store_notice_event_end_time ?? "",
              content: item.store_notice_event_contents ?? "",
              fileName: item.store_notice_event_image_url ?? "",
            }))
          );
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setStoreName("");
        setItems([]);
      }
    };

    fetchStoreData();
  }, [storeId]);

  // 정렬된 리스트
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
    setForm({ ...emptyForm });
    setOpen(true);
    setTimeout(() => titleRef.current?.focus(), 0);
  };

  const openView = (id: string) => {
    const targetItem = items.find((n) => n.id === id);
    if (!targetItem) return;
    setSelectedId(id);
    setMode("edit");
    setForm({
      id: targetItem.id,
      title: targetItem.title,
      type: targetItem.type,
      createdAt: targetItem.createdAt || today.replace(/-/g, "."),
      startAt: targetItem.startAt || today,
      endAt: targetItem.endAt || today,
      content: targetItem.content || "",
      fileName: targetItem.fileName || "",
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
            store_id: storeId,
            store_notice_event_title: form.title,
            store_notice_event_type: form.type === "공지" ? false : true,
            store_notice_event_start_time: form.startAt,
            store_notice_event_end_time: form.endAt,
            store_notice_event_contents: form.content,
            store_notice_event_image_url: form.fileName,
          }),
        });
        if (res.ok) {
          setOpen(false);
          setMode("view");
          // 목록 새로고침
          const refreshed = await fetch(`/app/api/posts/store/${storeId}`);
          const data = await refreshed.json();
          setItems(
            data.map((item: ApiNoticeData) => ({
              id: item.store_notice_event_id?.toString() ?? "",
              title: item.store_notice_event_title,
              type: item.store_notice_event_type === false ? "공지" : "홍보",
              createdAt:
                item.store_notice_event_create_time
                  ?.slice(0, 10)
                  ?.replace(/-/g, ".") ?? "",
              startAt: item.store_notice_event_start_time ?? "",
              endAt: item.store_notice_event_end_time ?? "",
              content: item.store_notice_event_contents ?? "",
              fileName: item.store_notice_event_image_url ?? "",
            }))
          );
        }
      } catch {}
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
          const refreshed = await fetch(`/app/api/posts/store/${storeId}`);
          const data = await refreshed.json();
          setItems(
            data.map((item: ApiNoticeData) => ({
              id: item.store_notice_event_id?.toString() ?? "",
              title: item.store_notice_event_title,
              type: item.store_notice_event_type === false ? "공지" : "홍보",
              createdAt:
                item.store_notice_event_create_time
                  ?.slice(0, 10)
                  ?.replace(/-/g, ".") ?? "",
              startAt: item.store_notice_event_start_time ?? "",
              endAt: item.store_notice_event_end_time ?? "",
              content: item.store_notice_event_contents ?? "",
              fileName: item.store_notice_event_image_url ?? "",
            }))
          );
        }
      } catch {}
    }
  };

  // 삭제 시 API 호출, UI 로직은 그대로 유지
  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm("삭제하시겠습니까?")) return;

    const res = await fetch(`/app/api/posts/${selected.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      closeModal();
      // 목록 새로고침
      const refreshed = await fetch(`/app/api/posts/store/${storeId}`);
      const data = await refreshed.json();
      setItems(
        data.map((item: ApiNoticeData) => ({
          id: item.store_notice_event_id?.toString() ?? "",
          title: item.store_notice_event_title,
          type: item.store_notice_event_type === false ? "공지" : "홍보",
          createdAt:
            item.store_notice_event_create_time
              ?.slice(0, 10)
              ?.replace(/-/g, ".") ?? "",
          startAt: item.store_notice_event_start_time ?? "",
          endAt: item.store_notice_event_end_time ?? "",
          content: item.store_notice_event_contents ?? "",
          fileName: item.store_notice_event_image_url ?? "",
        }))
      );
    }
  };

  // 최종 return 블록
  return (
    <div className="space-y-3">
      {/* 선택된 매장명 표시 */}
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">
          {storeName
            ? `선택된 지점: ${storeName}`
            : "지점이 선택되지 않았습니다."}
        </div>
      </div>
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
      {/* 리스트 또는 안내 메시지 */}
      {sortedItems.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-slate-600">
          <div className="mb-3">해당 지점에 등록된 공지/홍보글이 없습니다.</div>
          <Button className="rounded-xl" onClick={openCreate}>
            글 작성하기
          </Button>
        </div>
      ) : (
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
      )}
      {/* 모달: 공지/홍보글 등록 및 수정 */}
      <Modal
        open={open}
        onClose={closeModal}
        title={mode === "create" ? "공지/홍보글 등록" : "공지/홍보글 수정"}
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
