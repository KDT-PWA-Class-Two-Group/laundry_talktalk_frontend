// app/components/WasherDryerDialog.tsx
"use client";
import { Dialog } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// 기계 옵션 데이터 타입을 정의합니다.
// options_id, options_name, options_base_time, options_base_price를 포함합니다.
type MachineOption = {
  options_id: number;
  options_name: string;
  options_base_time: string;
  options_base_price: string;
  options_type: boolean; // true: 코스/시간, false: 추가옵션
  machine_type: boolean; // true: 세탁기, false: 건조기
};

// WasherDryerDialog 컴포넌트의 props 타입을 명시적으로 정의합니다.
// 이 타입 정의를 통해 부모 컴포넌트가 전달하는 props를 정확하게 검사합니다.
type WasherDryerDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: string;
  washerId: number | null;
  dryerId: number | null;
  storeId: string;
};

export default function WasherDryerDialog({
  open,
  onClose,
  mode,
  washerId,
  dryerId,
  storeId,
}: WasherDryerDialogProps) {
  const router = useRouter();

  // API로부터 받아온 옵션 목록을 저장할 상태들
  const [courses, setCourses] = useState<MachineOption[]>([]);
  const [options, setOptions] = useState<MachineOption[]>([]);
  const [dryerTimes, setDryerTimes] = useState<MachineOption[]>([]);

  // 사용자 선택을 저장할 상태 (전체 객체 저장)
  const [selectedCourse, setSelectedCourse] = useState<MachineOption | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<MachineOption[]>([]);
  const [selectedDryerTime, setSelectedDryerTime] =
    useState<MachineOption | null>(null);

  // 예상 비용 및 시간을 저장할 상태
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  // 로딩, 에러, 예약 상태를 관리합니다.
  const [loading, setLoading] = useState<boolean>(true);
  const [estimateLoading, setEstimateLoading] = useState<boolean>(false);
  const [reserving, setReserving] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reservationMessage, setReservationMessage] = useState<string | null>(
    null
  );

  // 다이얼로그가 열릴 때 API를 호출하여 옵션 목록을 불러옵니다.
  useEffect(() => {
    // 다이얼로그가 닫히면 상태를 초기화합니다.
    if (!open) {
      setLoading(true);
      setCourses([]);
      setOptions([]);
      setDryerTimes([]);
      setSelectedCourse(null);
      setSelectedOptions([]);
      setSelectedDryerTime(null);
      setTotalPrice(0);
      setTotalTime(0);
      setFetchError(null);
      setReservationMessage(null);
      return;
    }

    setLoading(true);
    setFetchError(null);

    const fetchAllOptions = async () => {
      try {
        const fetchMachineOptions = async (id: number) => {
          // POST 요청으로 변경하고 데이터를 body에 담아 보냅니다.
          const response = await fetch("/api/machine/options", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeId: storeId, machineId: id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "옵션 목록을 불러오는 데 실패했습니다."
            );
          }
          const data = await response.json();
          return data;
        };

        if (mode === "세탁" || mode === "세탁+건조") {
          if (!washerId) {
            setFetchError(
              "세탁기 정보가 누락되었습니다. 관리자에게 문의하세요."
            );
            setLoading(false);
            return;
          }
          const washerData = await fetchMachineOptions(washerId);
          if (washerData) {
            setCourses(washerData.courses);
            setOptions(washerData.options);
            if (washerData.courses.length > 0) {
              setSelectedCourse(washerData.courses[0]);
            }
          }
        }

        if (mode === "건조" || mode === "세탁+건조") {
          if (!dryerId) {
            setFetchError(
              "건조기 정보가 누락되었습니다. 관리자에게 문의하세요."
            );
            setLoading(false);
            return;
          }
          const dryerData = await fetchMachineOptions(dryerId);
          if (dryerData) {
            setDryerTimes(dryerData.dryerTimes);
            if (dryerData.dryerTimes.length > 0) {
              setSelectedDryerTime(dryerData.dryerTimes[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch all options:", error);
        setFetchError(
          error instanceof Error
            ? error.message
            : "옵션 데이터를 불러오는 중 오류 발생"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllOptions();
  }, [open, washerId, dryerId, storeId, mode]);

  // 선택된 옵션이 변경될 때마다 예상 비용을 계산합니다.
  useEffect(() => {
    const fetchEstimate = async () => {
      if (!open || (!selectedCourse && !selectedDryerTime)) {
        setTotalPrice(0);
        setTotalTime(0);
        return;
      }

      setEstimateLoading(true);

      try {
        const optionsToEstimate = [];

        if (mode !== "건조" && selectedCourse) {
          optionsToEstimate.push({ optionId: selectedCourse.options_id });
        }
        if (mode !== "건조" && selectedOptions.length > 0) {
          selectedOptions.forEach((opt) =>
            optionsToEstimate.push({ optionId: opt.options_id })
          );
        }
        if (mode !== "세탁" && selectedDryerTime) {
          optionsToEstimate.push({ optionId: selectedDryerTime.options_id });
        }

        if (optionsToEstimate.length === 0) {
          setTotalPrice(0);
          setTotalTime(0);
          setEstimateLoading(false);
          return;
        }

        const response = await fetch("/api/machine/estimate", {
          method: "POST", // POST 요청으로 변경
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId: storeId,
            machineId: mode === "세탁" ? washerId : dryerId,
            options: optionsToEstimate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "예상 비용 계산에 실패했습니다."
          );
        }

        const data = await response.json();
        setTotalPrice(data.totalCost);
        setTotalTime(data.totalDuration);
      } catch (err) {
        console.error("Failed to calculate estimate:", err);
        setTotalPrice(0);
        setTotalTime(0);
        setFetchError(
          err instanceof Error ? err.message : "예상 비용 계산 중 오류 발생"
        );
      } finally {
        setEstimateLoading(false);
      }
    };

    fetchEstimate();
  }, [
    selectedCourse,
    selectedOptions,
    selectedDryerTime,
    mode,
    open,
    storeId,
    washerId,
    dryerId,
  ]);

  const handleReserve = async () => {
    if (reserving) {
      setReservationMessage("이미 예약 진행 중입니다.");
      return;
    }

    const isWasherNeeded = mode === "세탁" || mode === "세탁+건조";
    const isDryerNeeded = mode === "건조" || mode === "세탁+건조";

    if (
      (isWasherNeeded && washerId === null) ||
      (isDryerNeeded && dryerId === null)
    ) {
      setReservationMessage("기기를 먼저 선택해주세요.");
      return;
    }

    setReserving(true);
    setReservationMessage(null);

    try {
      const reservationData = {
        storeId: storeId,
        machineId: isWasherNeeded ? washerId : dryerId,
        washerId: isWasherNeeded ? washerId : null,
        dryerId: isDryerNeeded ? dryerId : null,
        machineType: mode,
        options: [
          ...(selectedCourse ? [selectedCourse.options_id] : []),
          ...selectedOptions.map((opt) => opt.options_id),
          ...(selectedDryerTime ? [selectedDryerTime.options_id] : []),
        ],
        totalPrice: totalPrice,
        totalTime: totalTime,
      };

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        setReservationMessage("예약이 성공적으로 완료되었습니다!");
        router.push("/mypage/reservations");
      } else {
        const errorData = await response.json();
        setReservationMessage(`예약 실패: ${errorData.message}`);
      }
    } catch (err) {
      setReservationMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Failed to make reservation:", err);
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative p-6 w-full md:w-1/3 bg-white rounded-xl shadow-2xl z-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>로딩 중...</p>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-all"
            onClick={onClose}
          />
          <div className="relative p-6 w-full md:w-1/3 bg-white rounded-xl shadow-2xl z-10">
            {(washerId !== null || dryerId !== null) && (
              <div className="absolute left-4 top-2 text-xs text-gray-500">
                기기번호:
                {washerId && ` 세탁기 ${washerId}`}
                {washerId && dryerId && " + "}
                {dryerId && ` 건조기 ${dryerId}`}
              </div>
            )}
            <button
              className="absolute top-2 right-2 text-gray-500 text-xl"
              onClick={onClose}
            >
              &times;
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {mode === "세탁" && "세탁"}
                {mode === "건조" && "건조"}
                {mode === "세탁+건조" && "세탁 및 건조"}
              </h2>
            </div>
            {fetchError && (
              <div className="text-red-500 text-center mb-4">{fetchError}</div>
            )}
            <div className="mb-6">
              <h3 className="font-bold mb-2">세탁 코스</h3>
              <div className="flex gap-2 flex-wrap">
                {courses.map((course) => (
                  <button
                    key={course.options_id}
                    className={`px-3 py-1 rounded border ${
                      selectedCourse?.options_id === course.options_id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-600 border-gray-300"
                    } ${
                      mode === "건조" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => setSelectedCourse(course)}
                    disabled={mode === "건조"}
                  >
                    {course.options_name}
                    <span className="block text-xs mt-1">
                      {Number(course.options_base_price).toLocaleString()}원
                    </span>
                  </button>
                ))}
              </div>
              <h4 className="font-bold mb-1 mt-4">옵션 추가</h4>
              <div className="flex gap-2 flex-wrap">
                {options.map((option) => (
                  <label
                    key={option.options_id}
                    className={`flex items-center gap-1 cursor-pointer ${
                      mode === "건조" ? "opacity-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.some(
                        (o) => o.options_id === option.options_id
                      )}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedOptions([...selectedOptions, option]);
                        else
                          setSelectedOptions(
                            selectedOptions.filter(
                              (o) => o.options_id !== option.options_id
                            )
                          );
                      }}
                      disabled={mode === "건조"}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{option.options_name}</span>
                    <span className="text-xs ml-1 text-gray-500">
                      +{Number(option.options_base_price).toLocaleString()}원
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-bold mb-2">건조기 사용시간</h3>
              <div className="flex gap-2 flex-wrap">
                {dryerTimes.map((time) => (
                  <button
                    key={time.options_id}
                    className={`px-3 py-1 rounded border ${
                      selectedDryerTime?.options_id === time.options_id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                    onClick={() => setSelectedDryerTime(time)}
                    disabled={mode === "세탁"}
                  >
                    {time.options_base_time}분
                    <span className="block text-xs mt-1">
                      {Number(time.options_base_price).toLocaleString()}원
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {reservationMessage && (
              <div
                className={`text-center mb-4 ${
                  reservationMessage.includes("성공")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {reservationMessage}
              </div>
            )}
            <div className="flex flex-col items-end gap-2 mt-8">
              {estimateLoading ? (
                <div className="text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                  예상 비용 계산 중...
                </div>
              ) : (
                <>
                  <div className="text-right text-sm">
                    {mode !== "건조" && selectedCourse && (
                      <span>
                        세탁{" "}
                        {Number(
                          selectedCourse.options_base_price
                        ).toLocaleString()}
                        원
                      </span>
                    )}
                    {mode !== "건조" && selectedOptions.length > 0 && (
                      <span>
                        + 옵션{" "}
                        {selectedOptions
                          .reduce(
                            (sum, opt) => sum + Number(opt.options_base_price),
                            0
                          )
                          .toLocaleString()}
                        원
                      </span>
                    )}
                    {mode === "세탁+건조" && (
                      <span className="mx-1 text-gray-400"> + </span>
                    )}
                    {mode !== "세탁" && selectedDryerTime && (
                      <span>
                        건조{" "}
                        {Number(
                          selectedDryerTime.options_base_price
                        ).toLocaleString()}
                        원
                      </span>
                    )}
                  </div>
                  <div className="text-right text-sm font-bold">
                    총 예상 비용: {totalPrice.toLocaleString()}원
                  </div>
                  <div className="text-right text-sm font-bold mb-2">
                    총 예상 시간: {totalTime}분
                  </div>
                </>
              )}
              <button
                onClick={handleReserve}
                className="bg-blue-600 text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700 transition-colors"
                disabled={
                  reserving ||
                  loading ||
                  estimateLoading ||
                  (!selectedCourse && !selectedDryerTime)
                }
              >
                {reserving ? "예약 중..." : "예약하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
