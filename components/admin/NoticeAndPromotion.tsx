"use client";
import { useMemo, useRef, useState, ChangeEvent, useEffect } from "react";
import { getInitialNoticeForm } from "./NoticeFunctions/noticeFormUtils";
import {
  fetchStoreName,
  fetchNoticeList,
  createNotice,
  updateNotice,
  deleteNotice,
} from "./NoticeFunctions/noticeApi";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { NoticeItem } from "@/types/admin";

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

export default function NoticeAndPromotion({ storeId }: { storeId?: string }) {
  // 날짜 및 초기 폼
  const todayDateString = new Date().toISOString().slice(0, 10);
  const initialNoticeForm: NoticeItem = getInitialNoticeForm(todayDateString);
  // 상태 선언
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeMode, setNoticeMode] = useState<"create" | "edit" | "view">(
    "view"
  );
  const [noticeForm, setNoticeForm] = useState<NoticeItem>({
    ...initialNoticeForm,
  });
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [isSortAscending, setIsSortAscending] = useState(true);
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const noticeTitleInputRef = useRef<HTMLInputElement>(null);
  const noticeStartDateInputRef = useRef<HTMLInputElement>(null);
  const noticeEndDateInputRef = useRef<HTMLInputElement>(null);
  const noticeFileInputRef = useRef<HTMLInputElement>(null);
  const storeIdString = storeId || "";
  const selectedNotice = selectedNoticeId
    ? noticeList.find((notice) => notice.id === selectedNoticeId)
    : null;

  useEffect(() => {
    if (!storeIdString) return;
    fetchStoreName(storeIdString).then(setCurrentStoreName);
  }, [storeIdString]);

  useEffect(() => {
    if (!storeIdString) return;
    fetchNoticeList(storeIdString)
      .then(setNoticeList)
      .catch(() => setNoticeList([]));
  }, [storeIdString]);

  const sortedNoticeList = useMemo(() => {
    return [...noticeList].sort((a, b) => {
      const aDate = a.createdAt.replaceAll(".", "");
      const bDate = b.createdAt.replaceAll(".", "");
      return isSortAscending
        ? aDate.localeCompare(bDate)
        : bDate.localeCompare(aDate);
    });
  }, [noticeList, isSortAscending]);

  const openCreateNoticeModal = () => {
    setSelectedNoticeId(null);
    setNoticeMode("create");
    setNoticeForm({ ...initialNoticeForm });
    setIsModalOpen(true);
    setTimeout(() => noticeTitleInputRef.current?.focus(), 0);
  };

  const openEditNoticeModal = (noticeId: string) => {
    const targetNotice = noticeList.find((notice) => notice.id === noticeId);
    if (!targetNotice) return;
    setSelectedNoticeId(noticeId);
    setNoticeMode("edit");
    setNoticeForm({
      id: targetNotice.id,
      title: targetNotice.title,
      type: targetNotice.type,
      createdAt: targetNotice.createdAt || todayDateString.replace(/-/g, "."),
      startAt: targetNotice.startAt || todayDateString,
      endAt: targetNotice.endAt || todayDateString,
      content: targetNotice.content || "",
      fileName: targetNotice.fileName || "",
    });
    setIsModalOpen(true);
  };

  const closeNoticeModal = () => {
    setIsModalOpen(false);
    setNoticeMode("create");
  };

  const handleNoticeFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as {
      name: keyof typeof noticeForm;
      value: string;
    };
    setNoticeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUploadClick = () => noticeFileInputRef.current?.click();
  const handleNoticeFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (!fileObj) return;
    setNoticeForm((prev) => ({ ...prev, fileName: fileObj.name }));
  };

  // 등록/수정 분리
  const handleNoticeSubmit = async () => {
    if (!noticeForm.title.trim()) return alert("제목을 입력하세요.");
    if (noticeMode === "create") {
      const result = await createNotice(storeIdString, noticeForm);
      if (result) {
        setIsModalOpen(false);
        setNoticeMode("view");
        setNoticeList(result);
      } else {
        setNoticeList([]);
      }
    } else if (selectedNotice && selectedNotice.id) {
      const result = await updateNotice(
        storeIdString,
        selectedNotice.id,
        noticeForm
      );
      if (result) {
        setNoticeMode("view");
        setNoticeList(result);
      }
    }
  };

  // 삭제 핸들러
  const handleNoticeDelete = async () => {
    if (!selectedNotice) return;
    if (!confirm("삭제하시겠습니까?")) return;
    const result = await deleteNotice(storeIdString, selectedNotice.id);
    if (result) {
      closeNoticeModal();
      setNoticeList(result);
    }
  };

  // 최종 return 블록
  return (
    <div className="space-y-3">
      {/* 선택된 매장명 표시 */}
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">
          {currentStoreName
            ? `선택된 지점: ${currentStoreName}`
            : "지점이 선택되지 않았습니다."}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="ml-auto flex items-center gap-2">
          <Button
            className="h-8 rounded-md px-3"
            onClick={() => setIsSortAscending((p) => !p)}
          >
            정렬
          </Button>
          <Button className="rounded-xl" onClick={openCreateNoticeModal}>
            글쓰기
          </Button>
        </div>
      </div>
      {/* 리스트 또는 안내 메시지 */}
      {sortedNoticeList.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-slate-600">
          <div className="mb-3">해당 지점에 등록된 공지/홍보글이 없습니다.</div>
          <Button className="rounded-xl" onClick={openCreateNoticeModal}>
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
          {sortedNoticeList.map((n) => (
            <button
              key={n.id}
              onClick={() => openEditNoticeModal(n.id)}
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
        open={isModalOpen}
        onClose={closeNoticeModal}
        title={
          noticeMode === "create" ? "공지/홍보글 등록" : "공지/홍보글 수정"
        }
      >
        <div className="rounded-xl border border-sky-300 bg-sky-100 p-4">
          <div className="grid gap-3">
            {/* 제목 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
              <div className="text-base font-semibold">제목 :</div>
              <input
                ref={noticeTitleInputRef}
                name="title"
                value={noticeForm.title}
                onChange={handleNoticeFormChange}
                className="h-10 rounded-xl border bg-white px-3 text-sm"
                placeholder="제목 입력"
                readOnly={noticeMode === "view"}
              />
            </div>

            {/* 태그 (create/edit 노출) */}
            {(noticeMode === "create" || noticeMode === "edit") && (
              <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-2">
                <div className="text-base font-semibold">태그 :</div>
                <div className="inline-flex overflow-hidden rounded-xl border">
                  {(["공지", "홍보"] as Array<NoticeItem["type"]>).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setNoticeForm((prev) => ({ ...prev, type: t }))
                      }
                      className={`px-3 py-2 text-sm ${
                        noticeForm.type === t
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
                  ref={noticeStartDateInputRef}
                  type="date"
                  name="startAt"
                  value={noticeForm.startAt}
                  onChange={handleNoticeFormChange}
                  onMouseDown={(e) => {
                    if (noticeMode === "view") {
                      e.preventDefault();
                      setNoticeMode("edit");
                    }
                  }}
                  className="h-10 rounded-xl border bg-white px-3 text-sm"
                  readOnly={noticeMode === "view"}
                />
                <span className="px-1">~</span>
                <input
                  ref={noticeEndDateInputRef}
                  type="date"
                  name="endAt"
                  value={noticeForm.endAt}
                  onChange={handleNoticeFormChange}
                  onMouseDown={(e) => {
                    if (noticeMode === "view") {
                      e.preventDefault();
                      setNoticeMode("edit");
                    }
                  }}
                  className="h-10 rounded-xl border bg-white px-3 text-sm"
                  readOnly={noticeMode === "view"}
                />
              </div>
            </div>

            {/* 내용 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)] items-start gap-2">
              <div className="text-base font-semibold">&nbsp;</div>
              <textarea
                name="content"
                value={noticeForm.content}
                onChange={handleNoticeFormChange}
                className="min-h-[220px] rounded-xl border bg-white px-3 py-2 text-sm"
                placeholder="작성 내용"
                readOnly={noticeMode === "view"}
              />
            </div>

            {/* 이미지 첨부 */}
            <div className="grid grid-cols-[90px_minmax(0,1fr)_90px] items-center gap-2">
              <div className="text-base font-semibold">이미지 첨부 :</div>
              <input
                name="fileName"
                value={noticeForm.fileName}
                onChange={handleNoticeFormChange}
                className="h-10 rounded-xl border bg-white px-3 text-sm"
                placeholder="첨부 내용"
                readOnly
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="h-10 rounded-xl"
                  onClick={handleFileUploadClick}
                  disabled={noticeMode === "view"}
                >
                  업로드
                </Button>
                <input
                  ref={noticeFileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleNoticeFileChange}
                  disabled={noticeMode === "view"}
                />
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          {noticeMode === "create" ? (
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button className="rounded-xl px-5" onClick={handleNoticeSubmit}>
                등록
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                className="h-9 rounded-xl px-3 text-sm"
                onClick={handleNoticeSubmit}
              >
                저장
              </Button>
              <Button
                className="h-9 rounded-xl px-3 text-sm"
                onClick={handleNoticeDelete}
                disabled={!selectedNotice}
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
