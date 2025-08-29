"use client";
import { useMemo, useState } from "react";
import type { ReviewRow, SortKey } from "../../types/admin";
import { byNewest, byRating, toInt } from "./review/sortUtils";
import SortMenu from "./review/SortMenu";
import { ReviewCard } from "./review/ReviewCard";

type ReviewManagementProps = {
  storeName: string;
  initialRows?: ReviewRow[];
};

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
  const [rows, setRows] = useState<ReviewRow[]>(initialRows ?? []);
  const [sortKey, setSortKey] = useState<SortKey>("date");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    switch (sortKey) {
      case "rating":
        return copy.sort((a, b) => byRating(a, b) || byNewest(a, b));
      case "commentAsc":
        return copy.sort(
          (a, b) =>
            toInt(a.hasComment) - toInt(b.hasComment) ||
            byNewest(a, b) ||
            byRating(a, b)
        );
      case "commentDesc":
        return copy.sort(
          (a, b) =>
            toInt(b.hasComment) - toInt(a.hasComment) ||
            byNewest(a, b) ||
            byRating(a, b)
        );
      default:
        return copy.sort((a, b) => byNewest(a, b) || byRating(a, b));
    }
  }, [rows, sortKey]);

  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">리뷰관리 · {storeName}</h2>
      <div className="mb-2 flex items-center justify-end">
        <SortMenu value={sortKey} onChange={setSortKey} />
      </div>
      <div className="space-y-5">
        {sortedRows.map((review) => {
          const handlers = {
            onChangeRating: (newRating: number) =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  rating: newRating,
                }))
              ),
            onDeleteReview: () =>
              setRows((prev) => prev.filter((row) => row.id !== review.id)),
            onCreateComment: (commentText: string) =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  hasComment: true,
                  comment: commentText,
                }))
              ),
            onUpdateComment: (commentText: string) =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  comment: commentText,
                }))
              ),
            onDeleteComment: () =>
              setRows((prev) =>
                updateRows(prev, review.id, (row) => ({
                  ...row,
                  hasComment: false,
                  comment: undefined,
                }))
              ),
          };
          return <ReviewCard key={review.id} review={review} {...handlers} />;
        })}
      </div>
    </div>
  );
}
