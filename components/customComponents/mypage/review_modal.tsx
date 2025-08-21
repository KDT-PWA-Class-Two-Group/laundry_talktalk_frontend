// src/components/UsageReviewModal.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 올바른 위치에서 인터페이스를 불러옵니다.
import { UsageItem } from "@/types/mypage";

// 모달이 사용할 props 타입을 정의합니다.
interface UsageReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: UsageItem | null;
  rating: number;
  onRatingChange: (newRating: number) => void;
  reviewText: string;
  onReviewTextChange: (text: string) => void;
  onSubmit: () => void;
}

export const UsageReviewModal: React.FC<UsageReviewModalProps> = ({
  open,
  onOpenChange,
  item,
  rating,
  onRatingChange,
  reviewText,
  onReviewTextChange,
  onSubmit,
}) => {
  const isSubmitDisabled = rating === 0 || reviewText.trim() === "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            리뷰 작성
          </DialogTitle>
        </DialogHeader>
        {item && (
          <div className="flex flex-col gap-4 py-4 px-2">
            <div className="text-sm space-y-1">
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">매장</span>
                <span>{item.storeName}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">내용</span>
                <span>{item.code}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">이용일</span>
                <span>{item.reservationDate}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-4">
              <span className="text-sm font-semibold">
                별점을 선택해주세요!
              </span>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <div key={index} className="relative flex items-center">
                      {/* 반쪽 별점 */}
                      <div
                        className="absolute w-1/2 h-full top-0 left-0 cursor-pointer overflow-hidden"
                        onMouseMove={() => onRatingChange(index + 0.5)}
                        onClick={() => onRatingChange(index + 0.5)}
                        onMouseLeave={() => onRatingChange(rating)}
                      >
                        <span
                          className={`text-2xl ${
                            index + 0.5 <= rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      </div>
                      {/* 온전한 별점 */}
                      <div
                        className="w-1/2 h-full cursor-pointer"
                        onMouseMove={() => onRatingChange(starValue)}
                        onClick={() => onRatingChange(starValue)}
                        onMouseLeave={() => onRatingChange(rating)}
                      >
                        <span
                          className={`text-2xl ${
                            starValue <= rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-1">{rating}점</p>
            </div>

            <div className="space-y-2 mt-2">
              <textarea
                className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm resize-none"
                placeholder="후기를 남겨주세요!"
                value={reviewText}
                onChange={(e) => onReviewTextChange(e.target.value)}
              ></textarea>
            </div>

            <Button
              className={`bg-[#74D4FF] hover:bg-[#5BBCE3] text-white font-bold ${
                isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitDisabled}
              onClick={onSubmit}
            >
              리뷰 완료
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
