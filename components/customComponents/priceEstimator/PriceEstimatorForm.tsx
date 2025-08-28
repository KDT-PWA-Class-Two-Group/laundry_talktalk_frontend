"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react"; // lucide 아이콘
import { useState } from "react";

export default function PriceEstimatorForm() {
  const [search, setSearch] = useState("");
  const [washCourse, setWashCourse] = useState("표준");
  const [washOption, setWashOption] = useState("");
  const [useDry, setUseDry] = useState(false);
  const [dryTime, setDryTime] = useState<number | null>(null);
  const [dryOption, setDryOption] = useState("");
  const [result, setResult] = useState<{
    wash: number;
    dry: number;
    total: number;
    time: number;
  } | null>(null);

  const handleEstimate = async () => {
    try {
    // 나중에 백엔드가 준비되면 주석 해제
    /*
    const res = await fetch("/api/laundry/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        store: search,
        washCourse,
        washOption,
        useDry,
        dryTime,
        dryOption,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "계산 실패");
    setResult(data.data);
    return;
    */

    // 🔹 현재는 프론트 계산 fallback
    let washPrice =
      washCourse === "표준" ? 4000 : washCourse === "이불" ? 6000 : 5000;
    if (washOption === "헹굼 1회 추가") washPrice += 500;
    if (washOption === "헹굼 2회 추가") washPrice += 1000;

    let dryPrice = 0;
    const dryMinutes = dryTime || 0;
    if (useDry && dryTime) {
      dryPrice = dryMinutes * 200;
      if (dryOption === "고온") dryPrice += 500;
      if (dryOption === "저온") dryPrice -= 300;
    }

    setResult({
      wash: washPrice,
      dry: dryPrice,
      total: washPrice + dryPrice,
      time: 60 + dryMinutes,
    });
    } catch (err) {
    console.error(err);
    alert("예상 비용 계산 중 오류가 발생했습니다.");
  }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 font-nanum">
      {/* 제목 */}
      <h1 className="text-2xl font-bold text-center mb-8 border-b-2 border-sky-300 pb-2">
        예상 비용 조회
      </h1>

      {/* 검색 영역 */}
      <div className="flex items-center gap-2 mb-8">
        <Input
          placeholder="매장 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-50"
        />
        <Button
          variant="outline"
          size="icon"
          className="border-sky-500 text-sky-700 hover:bg-sky-100"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* 세탁 */}
      <div className="mb-2 font-bold text-lg text-gray-900">세탁</div>
      <div className="border rounded-lg p-4 mb-6 border-gray-200 bg-white shadow-sm">
        <div className="font-semibold mb-2">코스</div>
        <div className="flex gap-2 mb-4">
          {["표준", "이불", "섬세"].map((course) => (
            <Button
              key={course}
              type="button"
              className={`flex-1 transition ${
                washCourse === course
                  ? "bg-sky-500 text-white shadow"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setWashCourse(course)}
            >
              {course}
            </Button>
          ))}
        </div>
        <div className="font-semibold mb-2">옵션</div>
        <div className="flex gap-2">
          {["헹굼 1회 추가", "헹굼 2회 추가"].map((option) => (
            <Button
              key={option}
              type="button"
              className={`flex-1 transition ${
                washOption === option
                  ? "bg-sky-500 text-white shadow"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setWashOption(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* 건조 */}
      <div className="mb-2 font-bold text-lg text-gray-900 flex items-center gap-2">
        건조
        <Switch checked={useDry} onCheckedChange={setUseDry} />
        <span className="text-sm text-gray-600">
          {useDry ? "사용" : "사용 안함"}
        </span>
      </div>
      <div
        className={`border rounded-lg p-4 mb-6 border-gray-200 bg-white shadow-sm ${
          !useDry ? "opacity-50" : ""
        }`}
      >
        <div className="font-semibold mb-2">사용 시간</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {[5, 10, 15, 20, 25, 30, 35, 40].map((min) => (
            <Button
              key={min}
              type="button"
              className={`flex-1 transition ${
                dryTime === min
                  ? "bg-sky-500 text-white shadow"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setDryTime(min)}
              disabled={!useDry}
            >
              {min}분
            </Button>
          ))}
        </div>
        <div className="font-semibold mb-2">옵션</div>
        <div className="flex gap-2">
          {["고온", "표준", "저온"].map((option) => (
            <Button
              key={option}
              type="button"
              className={`flex-1 transition ${
                dryOption === option
                  ? "bg-sky-500 text-white shadow"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setDryOption(option)}
              disabled={!useDry}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* 조회 버튼 */}
      <Button
        className="w-full mb-6 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg"
        onClick={handleEstimate}
      >
        조회
      </Button>

      <Separator />
      {/* 계산 영역 */}
      <div className="mt-10 text-center space-y-6">
        {/* 세탁 + 건조 = 비용 (한 줄 수식) */}
        <div className="inline-flex items-end gap-4">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">세탁</span>
            <span className="text-xl font-semibold text-gray-800">
              {result ? `${result.wash.toLocaleString()}원` : "—"}
            </span>
          </div>

          <span className="text-2xl font-bold text-gray-500">+</span>

          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">건조</span>
            <span className="text-xl font-semibold text-gray-800">
              {result ? `${result.dry.toLocaleString()}원` : "—"}
            </span>
          </div>

          <span className="text-2xl font-bold text-sky-600">=</span>

          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">예상 비용</span>
            <span className="text-3xl font-extrabold text-sky-600">
              {result ? `${result.total.toLocaleString()}원` : "—"}
            </span>
          </div>
        </div>

        {/* 예상 시간 */}
        <div className="pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-500 block">예상 시간</span>
          <span className="text-xl font-semibold text-emerald-600">
            {result ? `${result.time}분` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
