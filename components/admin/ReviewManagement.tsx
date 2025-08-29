"use client";

import { useMemo, useState } from "react";
import type { ReviewRow, SortKey } from "../../types/admin";
import { byNewest, byRating, toInt } from "./review/sortUtils";
import SortMenu from "./review/SortMenu";
import { ReviewCard } from "./review/ReviewCard";

// 리뷰 관리 컴포넌트의 props 타입
type ReviewManagementProps = {
  storeName: string; // 매장 이름
  initialRows?: ReviewRow[]; // 초기 리뷰 데이터
};

/**
 * 특정 리뷰(id)만 업데이트하는 유틸 함수
 * @param rows 전체 리뷰 배열
 * @param id 수정할 리뷰 id
 * @param updater row를 수정하는 함수
 */
function updateRows(
  rows: ReviewRow[],
  id: string,
  updater: (row: ReviewRow) => ReviewRow
) {
  return rows.map((row) => (row.id === id ? updater(row) : row));
}

export default function ReviewManagement({
  storeName,
  initialRows,
}: ReviewManagementProps) {
  // 리뷰 목록 상태
  const [rows, setRows] = useState<ReviewRow[]>(initialRows ?? []);
  // 정렬 기준 상태
  const [sortKey, setSortKey] = useState<SortKey>("date");

  // 정렬된 리뷰 목록 계산 (정렬 기준에 따라)
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    switch (sortKey) {
      case "rating": // 평점순
        return copy.sort((a, b) => byRating(a, b) || byNewest(a, b));
      case "commentAsc": // 댓글 없는 리뷰 우선
        return copy.sort(
          (a, b) =>
            toInt(a.hasComment) - toInt(b.hasComment) ||
            byNewest(a, b) ||
            byRating(a, b)
        );
      case "commentDesc": // 댓글 있는 리뷰 우선
        return copy.sort(
          (a, b) =>
            toInt(b.hasComment) - toInt(a.hasComment) ||
            byNewest(a, b) ||
            byRating(a, b)
        );
      default: // 최신순
        return copy.sort((a, b) => byNewest(a, b) || byRating(a, b));
    }
  }, [rows, sortKey]);

  // UI 렌더링
  return (
    <div className="rounded-xl border bg-white p-4">
      {/* 헤더: 매장명 표시 */}
      <h2 className="mb-4 text-lg font-semibold">리뷰관리 · {storeName}</h2>
      {/* 정렬 메뉴 */}
      <div className="mb-2 flex items-center justify-end">
        <SortMenu value={sortKey} onChange={setSortKey} />
      </div>
      {/* 리뷰 카드 리스트 */}
      <div className="space-y-5">
        {sortedRows.map((review) => {
          // 각 리뷰별 핸들러 객체 (평점/댓글/삭제 등)
          const handlers = {
            // 평점 변경
            onChangeRating: (newRating: number) =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  rating: newRating,
                }))
              ),
            // 리뷰 삭제
            onDeleteReview: () =>
              setRows((prev) => prev.filter((row) => row.id !== review.id)),
            // 댓글 생성
            onCreateComment: (commentText: string) =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  hasComment: true,
                  comment: commentText,
                }))
              ),
            // 댓글 수정
            onUpdateComment: (commentText: string) =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  comment: commentText,
                }))
              ),
            // 댓글 삭제
            onDeleteComment: () =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  hasComment: false,
                  comment: undefined,
                }))
              ),
          };
          // 리뷰 카드 렌더링
          return <ReviewCard key={review.id} review={review} {...handlers} />;
        })}
      </div>
    </div>
  );
}
