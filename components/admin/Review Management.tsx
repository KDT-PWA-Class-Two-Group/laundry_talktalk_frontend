"use client";
import { useMemo, useState } from "react";
import type { ReviewRow, SortKey } from "../../types/admin";
import { byNewest, byRating, toInt } from "./review/sortUtils";
import SortMenu from "./review/SortMenu";
import { ReviewCard } from "./review/ReviewCard";

export default function ReviewSection({
  storeName,
  initialRows,
}: {
  storeName: string;
  initialRows?: ReviewRow[];
}) {
  const [rows, setRows] = useState<ReviewRow[]>(initialRows ?? []);
  const [sortKey, setSortKey] = useState<SortKey>("date");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    switch (sortKey) {
      case "rating":
        return copy.sort(
          (reviewA, reviewB) =>
            byRating(reviewA, reviewB) || byNewest(reviewA, reviewB)
        );
      case "commentAsc":
        return copy.sort(
          (reviewA, reviewB) =>
            toInt(reviewA.hasComment) - toInt(reviewB.hasComment) ||
            byNewest(reviewA, reviewB) ||
            byRating(reviewA, reviewB)
        );
      case "commentDesc":
        return copy.sort(
          (reviewA, reviewB) =>
            toInt(reviewB.hasComment) - toInt(reviewA.hasComment) ||
            byNewest(reviewA, reviewB) ||
            byRating(reviewA, reviewB)
        );
      default:
        return copy.sort(
          (reviewA, reviewB) =>
            byNewest(reviewA, reviewB) || byRating(reviewA, reviewB)
        );
    }
  }, [rows, sortKey]);

  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">리뷰관리 · {storeName}</h2>

      <div className="mb-2 flex items-center justify-end">
        <SortMenu value={sortKey} onChange={setSortKey} />
      </div>

      <div className="space-y-5">
        {sortedRows.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onChangeRating={(newRating) =>
              setRows((prevRows) =>
                prevRows.map((reviewRow) =>
                  reviewRow.id === review.id
                    ? { ...reviewRow, rating: newRating }
                    : reviewRow
                )
              )
            }
            onDeleteReview={() =>
              setRows((prevRows) =>
                prevRows.filter((reviewRow) => reviewRow.id !== review.id)
              )
            }
            onCreateComment={(commentText) =>
              setRows((prevRows) =>
                prevRows.map((reviewRow) =>
                  reviewRow.id === review.id
                    ? { ...reviewRow, hasComment: true, comment: commentText }
                    : reviewRow
                )
              )
            }
            onUpdateComment={(commentText) =>
              setRows((prevRows) =>
                prevRows.map((reviewRow) =>
                  reviewRow.id === review.id
                    ? { ...reviewRow, comment: commentText }
                    : reviewRow
                )
              )
            }
            onDeleteComment={() =>
              setRows((prevRows) =>
                prevRows.map((reviewRow) =>
                  reviewRow.id === review.id
                    ? { ...reviewRow, hasComment: false, comment: undefined }
                    : reviewRow
                )
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
