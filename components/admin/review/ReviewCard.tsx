import { useState } from "react";
import type { ReviewRow } from "../../../types/admin";
import { Button } from "@/components/ui/button";
import { EditableStarRating } from "./EditableStarRating";

export function ReviewCard({
  review,
  onChangeRating,
  onDeleteReview,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
}: {
  review: ReviewRow;
  onChangeRating: (newRating: number) => void; // 0.5 step
  onDeleteReview: () => void;
  onCreateComment: (newCommentText: string) => void;
  onUpdateComment: (newCommentText: string) => void;
  onDeleteComment: () => void;
}) {
  const [commentText, setCommentText] = useState(review.comment ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded border-2 border-sky-700/60 bg-sky-100 p-2">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* ✅ 반개(0.5) 단위로 편집 가능한 별점 */}
          <EditableStarRating value={review.rating} onChange={onChangeRating} />
          <div className="font-semibold text-slate-800">
            {review.rating.toFixed(1)}{" "}
            <span className="ml-1">{review.author}</span>
          </div>
          <div className="text-xs text-slate-700">{review.createdAt}</div>
          <div
            className={`text-xs ${
              review.hasComment ? "text-sky-700" : "text-red-600"
            }`}
          >
            {review.hasComment ? "댓글 작성" : "댓글 미작성"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (!isOpen && review.hasComment)
                setCommentText(review.comment ?? "");
              setIsOpen((prevIsOpen) => !prevIsOpen);
              setIsEditing(false);
            }}
          >
            댓글
          </Button>
          <Button variant="destructive" onClick={onDeleteReview}>
            삭제
          </Button>
        </div>
      </div>

      {/* 리뷰 본문 */}
      <div className="mt-2 rounded border-2 border-slate-700/60 bg-white px-4 py-8 text-center text-lg text-slate-900">
        {review.content}
      </div>

      {/* 댓글 입력/수정 영역 */}
      {isOpen && (
        <div className="mx-6 mt-4 rounded border-2 border-sky-700/60 bg-sky-50 p-4">
          {!review.hasComment && !isEditing && (
            <div className="flex items-center gap-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글내용"
                className="h-10 flex-1 rounded border-2 border-slate-700/50 bg-white px-3 text-sm outline-none"
              />
              <Button
                variant="outline"
                onClick={() => {
                  const text = commentText.trim();
                  if (!text) return;
                  onCreateComment(text);
                  setIsEditing(false);
                }}
                disabled={!commentText.trim()}
              >
                등록
              </Button>
              <Button variant="destructive" onClick={() => setCommentText("")}>
                삭제
              </Button>
            </div>
          )}

          {review.hasComment && !isEditing && (
            <div className="flex items-start gap-3">
              <div className="flex-1 rounded border-2 border-slate-700/50 bg-white px-4 py-6 text-center text-base text-slate-900">
                {review.comment}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCommentText(review.comment ?? "");
                    setIsEditing(true);
                  }}
                >
                  수정
                </Button>
                <Button variant="destructive" onClick={onDeleteComment}>
                  삭제
                </Button>
              </div>
            </div>
          )}

          {review.hasComment && isEditing && (
            <div className="flex items-center gap-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글내용"
                className="h-10 flex-1 rounded border-2 border-slate-700/50 bg-white px-3 text-sm outline-none"
              />
              <Button
                variant="outline"
                onClick={() => {
                  const text = commentText.trim();
                  if (!text) return;
                  onUpdateComment(text);
                  setIsEditing(false);
                }}
                disabled={!commentText.trim()}
              >
                저장
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setCommentText(review.comment ?? "");
                }}
              >
                취소
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
