// src/app/usage-history/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

// 올바른 위치에서 인터페이스와 모의 데이터를 불러옵니다.
import { UsageItem, initialMockData } from "@/types/mypage";

// 분리된 모달 컴포넌트들을 불러옵니다.
import { UsageCancelModal } from "./cancle_modal";
import { UsageReviewModal } from "./review_modal";

const getStatusText = (status: UsageItem["status"]) => {
  switch (status) {
    case "ongoing":
      return "예약중";
    case "completed":
      return "완료";
    case "cancelled":
      return "취소";
    case "reviewed":
      return "완료";
    default:
      return "확인 불가";
  }
};

const getButtonText = (status: UsageItem["status"]) => {
  switch (status) {
    case "ongoing":
      return "예약 취소";
    case "completed":
      return "리뷰 쓰기";
    case "reviewed":
      return "리뷰 완료";
    default:
      return "";
  }
};

const getStatusClasses = (status: UsageItem["status"]) => {
  switch (status) {
    case "ongoing":
      return "bg-[#EBF7FF] border-[#BDE0FF] text-blue-700";
    case "completed":
    case "cancelled":
    case "reviewed":
      return "bg-gray-50 border-gray-200 text-gray-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

const UsageHistoryCard: React.FC<{
  item: UsageItem;
  onActionClick: () => void;
  isProcessing: boolean;
}> = ({ item, onActionClick, isProcessing }) => {
  const isButtonDisabled = item.status === "reviewed" || isProcessing;

  return (
    <div
      key={item.id}
      className={`w-full rounded-xl shadow-sm p-6 border ${getStatusClasses(
        item.status
      )}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base">
            {getStatusText(item.status)}
          </span>
          <span className="text-sm text-gray-500">{item.date}</span>
        </div>
        {getButtonText(item.status) && (
          <Button
            onClick={onActionClick}
            disabled={isButtonDisabled}
            className={
              item.status === "ongoing"
                ? "bg-[#74D4FF] hover:bg-[#5BBCE3] text-white font-normal text-sm px-3 py-1 rounded"
                : item.status === "reviewed"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed font-normal text-sm px-3 py-1 rounded"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 font-normal text-sm px-3 py-1 rounded"
            }
          >
            {isProcessing ? "처리 중..." : getButtonText(item.status)}
          </Button>
        )}
      </div>

      <div className="h-px bg-gray-300 my-4" />
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{item.storeName}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-400">📅</span>
          <span>{item.reservationDate}</span>
        </div>
        <p className="text-xs text-gray-500">{item.duration}</p>
        <p className="text-xs text-gray-500">{item.code}</p>
        <p className="text-sm font-semibold mt-4">{item.price}</p>
      </div>
    </div>
  );
};

export default function UsageHistoryPage() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] =
    useState<UsageItem | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  const [usageData, setUsageData] = useState<UsageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. 페이지 로드 시 이용 내역을 가져옵니다.
  useEffect(() => {
    const fetchUsageHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/mypage/usage-history");
        if (!response.ok)
          throw new Error("이용 내역을 불러오는 데 실패했습니다.");
        const data: UsageItem[] = await response.json();
        setUsageData(data);
      } catch (error) {
        console.error("Fetch 에러:", error);
        setIsError(true);
        // API 연동 실패 시 목 데이터로 대체
        setUsageData(initialMockData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsageHistory();
  }, []);

  const ongoingHistory = usageData.filter((item) => item.status === "ongoing");
  const pastHistory = usageData.filter((item) => item.status !== "ongoing");

  const handleActionButtonClick = (item: UsageItem) => {
    if (item.status === "completed") {
      setSelectedItemForAction(item);
      setRating(0);
      setReviewText("");
      setShowReviewModal(true);
    }
    if (item.status === "ongoing") {
      setSelectedItemForAction(item);
      setShowCancelModal(true);
    }
  };

  // 2. 예약 취소 확인 핸들러 (fetch 로직 추가)
  const handleCancelConfirmed = async () => {
    if (!selectedItemForAction) return;
    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/mypage/usage-history/cancel/${selectedItemForAction.id}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("예약 취소 요청에 실패했습니다.");

      const updatedData = usageData.map((dataItem) =>
        dataItem.id === selectedItemForAction.id
          ? { ...dataItem, status: "cancelled" }
          : dataItem
      ) as UsageItem[];
      setUsageData(updatedData);
      console.log("예약 취소 완료:", updatedData);
    } catch (error) {
      console.error("예약 취소 API 에러:", error);
      alert("예약 취소에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsProcessing(false);
      setShowCancelModal(false);
    }
  };

  // 3. 리뷰 제출 핸들러 (fetch 로직 추가)
  const handleReviewSubmit = async () => {
    if (!selectedItemForAction) return;
    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/users/usage-history/review/${selectedItemForAction.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, reviewText }),
        }
      );
      if (!response.ok) throw new Error("리뷰 제출에 실패했습니다.");

      const updatedData = usageData.map((item) =>
        item.id === selectedItemForAction.id
          ? { ...item, status: "reviewed" }
          : item
      ) as UsageItem[];
      setUsageData(updatedData);
      console.log("리뷰 제출 완료:", {
        itemId: selectedItemForAction.id,
        rating: rating,
        reviewText: reviewText,
      });
    } catch (error) {
      console.error("리뷰 제출 API 에러:", error);
      alert("리뷰 제출에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsProcessing(false);
      setShowReviewModal(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="pt-8 pb-4 pl-8 w-full">
          <h1 className="text-2xl font-bold">이용 내역</h1>
        </div>

        <div className="flex flex-grow justify-center items-center">
          <div className="w-full max-w-xl flex flex-col items-start gap-8 px-4 sm:px-6">
            <h2 className="text-xl font-semibold mt-8">예약 내역</h2>
            <div className="w-full flex flex-col gap-6">
              {isLoading ? (
                <p className="text-gray-500 text-center w-full">
                  이용 내역을 불러오는 중입니다...
                </p>
              ) : isError ? (
                <p className="text-red-500 text-center w-full">
                  데이터를 불러오는 데 실패했습니다.
                </p>
              ) : ongoingHistory.length > 0 ? (
                ongoingHistory.map((item) => (
                  <UsageHistoryCard
                    key={item.id}
                    item={item}
                    onActionClick={() => handleActionButtonClick(item)}
                    isProcessing={isProcessing}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">
                  예약 내역이 없습니다.
                </p>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-4">과거 이용 내역</h2>
            <div className="w-full flex flex-col gap-6">
              {isLoading ? null : isError ? null : pastHistory.length > 0 ? ( // '예약 내역'과 동일한 로딩 메시지 사용 // '예약 내역'과 동일한 에러 메시지 사용
                pastHistory.map((item) => (
                  <UsageHistoryCard
                    key={item.id}
                    item={item}
                    onActionClick={() => handleActionButtonClick(item)}
                    isProcessing={isProcessing}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">
                  과거 이용 내역이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <UsageReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        item={selectedItemForAction}
        rating={rating}
        onRatingChange={setRating}
        reviewText={reviewText}
        onReviewTextChange={setReviewText}
        onSubmit={handleReviewSubmit}
      />

      <UsageCancelModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        onConfirm={handleCancelConfirmed}
      />
    </>
  );
}
