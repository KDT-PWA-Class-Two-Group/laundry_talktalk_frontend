"use client";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";

const WASHER_COURSES = ["표준세탁", "강력세탁", "섬세세탁"];
const WASHER_OPTIONS = ["삶음", "헹굼추가", "탈수강화"];
const DRYER_TIMES = [20, 40, 60];

export default function WasherDryerDialog({ open, onClose, mode, machineId }: { open: boolean; onClose: () => void; mode: string; machineId: number | null }) {
  const [selectedCourse, setSelectedCourse] = useState(WASHER_COURSES[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedDryerTime, setSelectedDryerTime] = useState(DRYER_TIMES[0]);

  // 가격 및 시간 예시
  const washerPrice = 3000;
  const dryerPrice = 2500;
  const totalPrice = mode === "세탁+건조" ? washerPrice + dryerPrice : mode === "세탁" ? washerPrice : dryerPrice;
  const totalTime = mode === "세탁+건조" ? 120 : mode === "세탁" ? 60 : 60;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 흐린 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-all" onClick={onClose} />
          {/* 모달 컨텐츠 */}
          <div className="relative p-6 w-[350px] bg-white rounded-xl shadow-2xl z-10">
            {/* 선택된 기기 번호 표시 */}
            {machineId !== null && (
              <div className="absolute left-4 top-2 text-xs text-gray-500">기기번호: {machineId}</div>
            )}
            {/* X 버튼 */}
            <button className="absolute top-2 right-2 text-gray-500 text-xl" onClick={onClose}>&times;</button>
            {/* 세탁 코스 및 옵션 */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">세탁 코스</h3>
              <div className="flex gap-2 mb-2">
                {WASHER_COURSES.map(course => (
                  <button
                    key={course}
                    className={`px-3 py-1 rounded border ${selectedCourse === course ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-600 border-gray-300"}`}
                    onClick={() => setSelectedCourse(course)}
                    disabled={mode === "건조"}
                    style={mode === "건조" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    {course}
                  </button>
                ))}
              </div>
              <h4 className="font-bold mb-1">옵션 추가</h4>
              <div className="flex gap-2">
                {WASHER_OPTIONS.map(option => (
                  <label key={option} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={e => {
                        if (e.target.checked) setSelectedOptions([...selectedOptions, option]);
                        else setSelectedOptions(selectedOptions.filter(o => o !== option));
                      }}
                      disabled={mode === "건조"}
                    />
                    <span className="text-sm" style={mode === "건조" ? { opacity: 0.5 } : {}}>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* 건조기 사용시간 */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">건조기 사용시간</h3>
              <div className="flex gap-2">
                {DRYER_TIMES.map(time => (
                  <button
                    key={time}
                    className={`px-3 py-1 rounded border ${selectedDryerTime === time ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-600 border-gray-300"}`}
                    onClick={() => setSelectedDryerTime(time)}
                    disabled={mode === "세탁"}
                    style={mode === "세탁" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    {time}분
                  </button>
                ))}
              </div>
            </div>
            {/* 예상 비용/시간 및 예약 버튼 */}
            <div className="flex flex-col items-end gap-2 mt-8">
              <div className="text-right text-sm">
                {mode !== "건조" && <span>세탁 {washerPrice.toLocaleString()}원</span>}
                {mode === "세탁+건조" && <span> + </span>}
                {mode !== "세탁" && <span>건조 {dryerPrice.toLocaleString()}원</span>}
              </div>
              <div className="text-right text-sm font-bold">총 예상 비용: {totalPrice.toLocaleString()}원</div>
              <div className="text-right text-sm font-bold mb-2">총 예상 시간: {totalTime}분</div>
              <button className="bg-blue-600 text-white px-5 py-2 rounded font-bold">예약하기</button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
