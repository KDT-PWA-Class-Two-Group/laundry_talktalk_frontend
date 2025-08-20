"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// 이용 내역 데이터의 타입을 정의합니다.
interface UsageItem {
  id: number;
  status: "ongoing" | "completed" | "cancelled" | "reviewed";
  date: string;
  time: string;
  storeName: string;
  reservationDate: string;
  duration: string;
  code: string;
  price: string;
}

// 예시 데이터입니다. 실제로는 API 호출로 받아와야 합니다.
const initialMockData: UsageItem[] = [
  {
    id: 1,
    status: "ongoing",
    date: "2025.08.14 | 13시 10분",
    storeName: "크린토피아 월평점",
    reservationDate: "2025.08.14 | 14:00 ~ 18:00",
    duration:
      "총 소요시간: 3시간 30분 | 세탁 시간: 1시간 30분 | 건조 시간: 2시간",
    code: "코스: 이불 빨래, 건조",
    price: "이용 가격: 30,000원",
    time: "",
  },
  {
    id: 2,
    status: "completed",
    date: "2025.08.10 | 15시 10분",
    storeName: "크린토피아 둔산점",
    reservationDate: "2025.08.10 | 14:00 ~ 18:00",
    duration:
      "총 소요시간: 2시간 00분 | 세탁 시간: 1시간 00분 | 건조 시간: 1시간",
    code: "코스: 일반 세탁",
    price: "이용 가격: 20,000원",
    time: "",
  },
  {
    id: 3,
    status: "cancelled",
    date: "2025.08.07 | 13시 10분",
    storeName: "크린토피아 월평점",
    reservationDate: "2025.08.07 | 10:00 ~ 12:00",
    duration: "총 소요시간: 1시간 30분 | 세탁 시간: 45분 | 건조 시간: 45분",
    code: "코스: 운동복 세탁",
    price: "이용 가격: 15,000원",
    time: "",
  },
  {
    id: 4,
    status: "reviewed",
    date: "2025.08.05 | 11시 00분",
    storeName: "크린토피아 유성점",
    reservationDate: "2025.08.05 | 09:00 ~ 11:00",
    duration:
      "총 소요시간: 4시간 00분 | 세탁 시간: 2시간 00분 | 건조 시간: 2시간",
    code: "코스: 드라이클리닝",
    price: "이용 가격: 40,000원",
    time: "",
  },
];

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
}> = ({ item, onActionClick }) => {
  const isButtonDisabled = item.status === "reviewed";

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
            {getButtonText(item.status)}
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

  const [usageData, setUsageData] = useState<UsageItem[]>(initialMockData);

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

  const handleCancelConfirmed = () => {
    if (selectedItemForAction) {
      const updatedData = usageData.map((dataItem) =>
        dataItem.id === selectedItemForAction.id
          ? { ...dataItem, status: "cancelled" }
          : dataItem
      ) as UsageItem[];
      setUsageData(updatedData);
      console.log("예약 취소 완료:", updatedData);
    }
    setShowCancelModal(false);
  };

  const handleReviewSubmit = () => {
    if (selectedItemForAction) {
      console.log("리뷰 제출:", {
        itemId: selectedItemForAction.id,
        rating: rating,
        reviewText: reviewText,
      });

      const updatedData = usageData.map((item) =>
        item.id === selectedItemForAction.id
          ? { ...item, status: "reviewed" }
          : item
      ) as UsageItem[];
      setUsageData(updatedData);
    }

    setShowReviewModal(false);
  };

  const isSubmitDisabled = rating === 0 || reviewText.trim() === "";

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
              {ongoingHistory.length > 0 ? (
                ongoingHistory.map((item) => (
                  <UsageHistoryCard
                    key={item.id}
                    item={item}
                    onActionClick={() => handleActionButtonClick(item)}
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
              {pastHistory.length > 0 ? (
                pastHistory.map((item) => (
                  <UsageHistoryCard
                    key={item.id}
                    item={item}
                    onActionClick={() => handleActionButtonClick(item)}
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

      {/* 리뷰 작성 모달 */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="bg-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              리뷰 작성
            </DialogTitle>
          </DialogHeader>
          {selectedItemForAction && (
            <div className="flex flex-col gap-4 py-4 px-2">
              <div className="text-sm space-y-1">
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">매장</span>
                  <span>{selectedItemForAction.storeName}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">내용</span>
                  <span>{selectedItemForAction.code}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">이용일</span>
                  <span>{selectedItemForAction.reservationDate}</span>
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
                          onMouseMove={() => setRating(index + 0.5)}
                          onClick={() => setRating(index + 0.5)}
                          onMouseLeave={() => setRating(rating)}
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
                          onMouseMove={() => setRating(starValue)}
                          onClick={() => setRating(starValue)}
                          onMouseLeave={() => setRating(rating)}
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
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
              </div>

              <Button
                className={`bg-[#74D4FF] hover:bg-[#5BBCE3] text-white font-bold ${
                  isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitDisabled}
                onClick={handleReviewSubmit}
              >
                리뷰 완료
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 예약 취소 확인 모달 */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="bg-white shadow-xl">
          <DialogHeader className="text-center">
            <DialogTitle>예약 취소 확인</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-700">예약을 정말 취소하시겠습니까?</p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="w-1/2"
            >
              취소
            </Button>
            <Button
              onClick={handleCancelConfirmed}
              className="w-1/2 bg-[#74D4FF] hover:bg-[#5BBCE3] text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
