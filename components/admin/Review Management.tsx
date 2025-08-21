// components/admin/review/ReviewSection.tsx
"use client";

import { useMemo, useState } from "react";
// shadcn/ui
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

type ReviewRow = {
  id: string;
  rating: number; // 0.5 step 지원 (예: 1.5, 3.5)
  author: string;
  createdAt: string; // "YYYY.MM.DD"
  content: string;
  hasComment: boolean;
  comment?: string;
};

type SortKey = "date" | "rating" | "commentAsc" | "commentDesc";

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
        rating: 3.5,
        author: "민정손",
        createdAt: "2025.08.12",
        content: "리뷰내용",
        hasComment: false,
      },
      {
        id: "r3",
        rating: 5,
        author: "민정손",
        createdAt: "2025.08.13",
        content: "리뷰내용",
        hasComment: false,
      },
    ]
  );

  const [sortKey, setSortKey] = useState<SortKey>("date");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    const toTime = (s: string) => {
      const [y, m, d] = s.split(".").map((t) => parseInt(t, 10));
      return new Date(y, m - 1, d).getTime();
    };
    const byNewest = (a: ReviewRow, b: ReviewRow) =>
      toTime(b.createdAt) - toTime(a.createdAt);
    const byRating = (a: ReviewRow, b: ReviewRow) => b.rating - a.rating;
    const toInt = (v: boolean) => (v ? 1 : 0);

    switch (sortKey) {
      case "rating":
        copy.sort((a, b) => byRating(a, b) || byNewest(a, b));
        break;
      case "commentAsc":
        copy.sort(
          (a, b) =>
            toInt(a.hasComment) - toInt(b.hasComment) ||
            byNewest(a, b) ||
            byRating(a, b)
        );
        break;
      case "commentDesc":
        copy.sort(
          (a, b) =>
            toInt(b.hasComment) - toInt(a.hasComment) ||
            byNewest(a, b) ||
            byRating(a, b)
        );
        break;
      case "date":
      default:
        copy.sort((a, b) => byNewest(a, b) || byRating(a, b));
        break;
    }
    return copy;
  }, [rows, sortKey]);

  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">리뷰관리 · {storeName}</h2>

      <div className="mb-2 flex items-center justify-end">
        <SortMenu value={sortKey} onChange={setSortKey} />
      </div>

      <div className="space-y-5">
        {sortedRows.map((r) => (
          <ReviewCard
            key={r.id}
            row={r}
            onChangeRating={(val) =>
              setRows((prev) =>
                prev.map((x) => (x.id === r.id ? { ...x, rating: val } : x))
              )
            }
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

/* ------------------- Sort Menu (shadcn) ------------------- */
function SortMenu({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const label =
    value === "rating"
      ? "별점순"
      : value === "date"
      ? "등록순"
      : value === "commentAsc"
      ? "댓글 미작성"
      : "댓글 작성";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 px-3 text-sm">
          정렬: {label}
          <svg
            className="ml-1"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white z-50">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as SortKey)}
        >
          <DropdownMenuRadioItem value="date">등록순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="rating">별점순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="commentAsc">
            댓글 미작성
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="commentDesc">
            댓글 작성
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------- Review Card ------------------- */
function ReviewCard({
  row,
  onChangeRating,
  onDeleteReview,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
}: {
  row: ReviewRow;
  onChangeRating: (v: number) => void; // 0.5 step
  onDeleteReview: () => void;
  onCreateComment: (text: string) => void;
  onUpdateComment: (text: string) => void;
  onDeleteComment: () => void;
}) {
  const [commentText, setCommentText] = useState(row.comment ?? "");
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded border-2 border-sky-700/60 bg-sky-100 p-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* ✅ 반개(0.5) 단위 편집 가능한 별점 */}
          <EditableStarRating value={row.rating} onChange={onChangeRating} />
          <div className="font-semibold text-slate-800">
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
          <BlueButton
            onClick={() => {
              if (!open && row.hasComment) setCommentText(row.comment ?? "");
              setOpen((v) => !v);
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

      {/* 댓글 영역 */}
      {open && (
        <div className="mx-6 mt-4 rounded border-2 border-sky-700/60 bg-sky-50 p-4">
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

/* ------------------- Editable Star Rating (0.5 step) ------------------- */
/**
 * - 마우스 이동으로 반개/한개 단위 미리보기
 * - 클릭 시 0.5 단위로 onChange
 * - 표시는 overlay 기법: 회색 별 위에 빨간 별을 비율만큼 덮어 그림
 */
function EditableStarRating({
  value,
  onChange,
  max = 5,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  // 별 하나 영역에서 마우스 위치를 0.5/1.0으로 스냅
  const pickFraction = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    base: number
  ) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const ratio = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );
    const half = ratio < 0.5 ? 0.5 : 1.0; // 0.5 단위 스냅
    return base + half; // base는 0,1,2,3,4
  };

  const active = hoverVal ?? value;

  return (
    <div
      className="flex items-center"
      role="radiogroup"
      aria-label="별점(0.5 단위)"
    >
      {Array.from({ length: max }).map((_, i) => {
        const base = i; // 0..4
        // 이 별의 채움 비율 계산: 0, 0.5, 1
        const frac = Math.max(0, Math.min(1, active - base));
        const fill = frac >= 1 ? 1 : frac >= 0.5 ? 0.5 : 0;

        return (
          <div
            key={i}
            className="relative h-5 w-5 cursor-pointer select-none"
            onMouseMove={(e) => setHoverVal(pickFraction(e, base))}
            onMouseLeave={() => setHoverVal(null)}
            onClick={(e) => onChange(pickFraction(e, base))}
            role="radio"
            aria-checked={
              Math.round(value * 2) / 2 > base &&
              Math.round(value * 2) / 2 <= base + 1
            }
            title={`${(
              base + (fill === 1 ? 1 : fill === 0.5 ? 0.5 : 0)
            ).toFixed(1)} / ${max}`}
          >
            {/* 회색 빈 별(바닥) */}
            <StarSvg className="text-slate-300" />
            {/* 빨간 채움 별: width로 마스킹 */}
            <div
              className="absolute left-0 top-0 h-full overflow-hidden"
              style={{ width: `${fill * 100}%` }} // 0, 50, 100
            >
              <StarSvg className="text-red-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StarSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 ${className} fill-current`}
      viewBox="0 0 20 20"
      aria-hidden
      focusable="false"
    >
      <path d="M10 1.5 12.7 7l6 .9-4.3 4.2 1 5.9-5.4-2.8-5.4 2.8 1-5.9L1.3 7.9l6-.9L10 1.5z" />
    </svg>
  );
}

/* ------------------- Small UI bits ------------------- */
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
