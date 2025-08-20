"use client";

import { useState } from "react";

type ReviewRow = {
  id: string;
  rating: number;
  author: string;
  createdAt: string;
  content: string;
  hasComment: boolean;
  comment?: string;
};

export default function ReviewSection({
  storeName,
  initialRows,
}: {
  storeName: string;
  initialRows?: ReviewRow[];
}) {
  const [rows, setRows] = useState<ReviewRow[]>(
    initialRows ?? [
      {
        id: "r1",
        rating: 4,
        author: "민정손",
        createdAt: "2025.08.14",
        content: "리뷰내용",
        hasComment: true,
        comment: "댓글내용",
      },
      {
        id: "r2",
        rating: 4,
        author: "민정손",
        createdAt: "2025.08.14",
        content: "리뷰내용",
        hasComment: false,
      },
      {
        id: "r3",
        rating: 4,
        author: "민정손",
        createdAt: "2025.08.14",
        content: "리뷰내용",
        hasComment: false,
      },
    ]
  );

  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">리뷰관리 · {storeName}</h2>

      <div className="flex items-center justify-end mb-2">
        <button className="h-8 rounded border border-sky-700 bg-sky-100 px-3 text-sm text-sky-900 hover:bg-sky-200">
          정렬
        </button>
      </div>

      <div className="space-y-5">
        {rows.map((r) => (
          <OldSchoolReviewCard
            key={r.id}
            row={r}
            onDeleteReview={() =>
              setRows((prev) => prev.filter((x) => x.id !== r.id))
            }
            onCreateComment={(text) =>
              setRows((prev) =>
                prev.map((x) =>
                  x.id === r.id ? { ...x, hasComment: true, comment: text } : x
                )
              )
            }
            onUpdateComment={(text) =>
              setRows((prev) =>
                prev.map((x) => (x.id === r.id ? { ...x, comment: text } : x))
              )
            }
            onDeleteComment={() =>
              setRows((prev) =>
                prev.map((x) =>
                  x.id === r.id
                    ? { ...x, hasComment: false, comment: undefined }
                    : x
                )
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

function OldSchoolReviewCard({
  row,
  onDeleteReview,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
}: {
  row: ReviewRow;
  onDeleteReview: () => void;
  onCreateComment: (text: string) => void;
  onUpdateComment: (text: string) => void;
  onDeleteComment: () => void;
}) {
  const [commentText, setCommentText] = useState(row.comment ?? "");
  const [editing, setEditing] = useState(false);
  // ✅ 댓글 영역 토글
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded border-2 border-sky-700/60 bg-sky-100 p-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarRating rating={row.rating} />
          <div className="text-slate-800 font-semibold">
            {row.rating.toFixed(1)} <span className="ml-1">{row.author}</span>
          </div>
          <div className="text-xs text-slate-700">{row.createdAt}</div>
          <div
            className={`text-xs ${
              row.hasComment ? "text-sky-700" : "text-red-600"
            }`}
          >
            {row.hasComment ? "댓글 작성" : "댓글 미작성"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ 댓글 버튼 복구 + 토글 */}
          <BlueButton
            onClick={() => {
              // 열 때 현재 댓글 내용을 인풋에 최신화
              if (!open && row.hasComment) setCommentText(row.comment ?? "");
              setOpen((v) => !v);
              // 열기 시 보기모드부터 시작
              setEditing(false);
            }}
          >
            댓글
          </BlueButton>
          <BlueButton onClick={onDeleteReview}>삭제</BlueButton>
        </div>
      </div>

      {/* 본문 */}
      <div className="mt-2 rounded border-2 border-slate-700/60 bg-white px-4 py-8 text-center text-lg text-slate-900">
        {row.content}
      </div>

      {/* ✅ 댓글 영역: 버튼 눌렀을 때만 표시 */}
      {open && (
        <div className="mx-6 mt-4 rounded border-2 border-sky-700/60 bg-sky-50 p-4">
          {/* 댓글 없음: 입력 + 등록 */}
          {!row.hasComment && !editing && (
            <div className="flex items-center gap-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글내용"
                className="h-10 flex-1 rounded border-2 border-slate-700/50 bg-white px-3 text-sm outline-none"
              />
              <BlueButton
                onClick={() => {
                  const text = commentText.trim();
                  if (!text) return;
                  onCreateComment(text);
                  setEditing(false);
                }}
                disabled={!commentText.trim()}
              >
                등록
              </BlueButton>
              <BlueButton onClick={() => setCommentText("")}>삭제</BlueButton>
            </div>
          )}

          {/* 댓글 있음: 보기 모드 */}
          {row.hasComment && !editing && (
            <div className="flex items-start gap-3">
              <div className="flex-1 rounded border-2 border-slate-700/50 bg-white px-4 py-6 text-center text-base text-slate-900">
                {row.comment}
              </div>
              <div className="flex flex-col gap-2">
                <BlueButton
                  onClick={() => {
                    setCommentText(row.comment ?? "");
                    setEditing(true);
                  }}
                >
                  수정
                </BlueButton>
                <BlueButton onClick={onDeleteComment}>삭제</BlueButton>
              </div>
            </div>
          )}

          {/* 댓글 있음: 수정 모드 */}
          {row.hasComment && editing && (
            <div className="flex items-center gap-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글내용"
                className="h-10 flex-1 rounded border-2 border-slate-700/50 bg-white px-3 text-sm outline-none"
              />
              <BlueButton
                onClick={() => {
                  const text = commentText.trim();
                  if (!text) return;
                  onUpdateComment(text);
                  setEditing(false);
                }}
                disabled={!commentText.trim()}
              >
                저장
              </BlueButton>
              <BlueButton
                onClick={() => {
                  setEditing(false);
                  setCommentText(row.comment ?? "");
                }}
              >
                취소
              </BlueButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const max = 5;
  const full = Math.floor(rating);
  const empty = max - full;
  return (
    <div className="flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} color="red" />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} color="gray" />
      ))}
    </div>
  );
}

function Star({ color }: { color: "red" | "gray" }) {
  const fill =
    color === "red"
      ? "fill-red-600 text-red-600"
      : "fill-slate-400 text-slate-400";
  return (
    <svg
      className={`h-4 w-4 ${fill}`}
      viewBox="0 0 20 20"
      aria-hidden
      focusable="false"
    >
      <path d="M10 1.5 12.7 7l6 .9-4.3 4.2 1 5.9-5.4-2.8-5.4 2.8 1-5.9L1.3 7.9l6-.9L10 1.5z" />
    </svg>
  );
}

function BlueButton({
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`h-8 rounded bg-sky-800 px-3 text-sm font-semibold text-white hover:bg-sky-900 disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}
