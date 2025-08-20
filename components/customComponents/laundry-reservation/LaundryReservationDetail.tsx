"use client";
import { useState } from "react";
import WasherDryerDialog from "./WasherDryerDialog";

const WASHER_LIST = [
  { id: 1, status: "available", time: null },
  { id: 2, status: "busy", time: 18 },
  { id: 3, status: "busy", time: 10 },
  { id: 4, status: "available", time: null },
  { id: 5, status: "busy", time: 5 },
  { id: 6, status: "unavailable", time: null },
];
const DRYER_LIST = [
  { id: 1, status: "available", time: null },
  { id: 2, status: "busy", time: 22 },
  { id: 3, status: "unavailable", time: null },
  { id: 4, status: "busy", time: 8 },
  { id: 5, status: "available", time: null },
  { id: 6, status: "busy", time: 3 },
];

const MODES = ["세탁", "건조", "세탁+건조"];

export default function LaundryReservationDetail({ storeId }: { storeId: string }) {
  const [mode, setMode] = useState("세탁");
  const [selectedWasher, setSelectedWasher] = useState<number | null>(null);
  const [selectedDryer, setSelectedDryer] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<string>("");
  const [dialogMachineId, setDialogMachineId] = useState<number | null>(null);

  // 버튼 disable 조건
  const washerDisabled = mode === "건조";
  const dryerDisabled = mode === "세탁" || mode === "세탁+건조";

  return (
    <div className="max-w-2xl mx-auto py-8 relative">
      <h2 className="text-xl font-bold mb-6">{storeId} 세탁소</h2>
      <div className="flex gap-2 mb-8">
        {MODES.map(m => (
          <button
            key={m}
            className={`px-4 py-2 rounded font-semibold border transition-all ${mode === m ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-600 border-gray-300"}`}
            onClick={() => {
              setMode(m);
              setSelectedWasher(null);
              setSelectedDryer(null);
              setDialogMode(m)
            }}
          >
            {m}
          </button>
        ))}
      </div>
      {/* 세탁기 선택 섹션 */}
      <section className="mb-8">
        <h3 className="font-bold mb-2">세탁기 선택</h3>
        <div className="grid grid-cols-3 gap-4">
          {WASHER_LIST.map(washer => (
            <button
              key={washer.id}
              disabled={washerDisabled || washer.status === "unavailable"}
              className={`flex flex-col items-center justify-center border rounded p-4 h-24 transition-all
                ${washerDisabled || washer.status === "unavailable" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-blue-50"}
                ${selectedWasher === washer.id ? "border-blue-600" : "border-gray-300"}`}
              onClick={() => {
                setSelectedWasher(washer.id);
                // setDialogMode("세탁");
                setDialogMachineId(washer.id);
                setDialogOpen(true);
              }}
            >
              <span className="text-2xl mb-1">🧺</span>
              {washer.status === "busy" ? (
                <>
                  <span className="text-sm">남은 시간: {washer.time}분</span>
                  <span className="text-xs text-green-600 block">예약 가능</span>
                </>
              ) : (
                <span className="text-sm text-red-400">미사용중</span>
              )}
            </button>
          ))}
        </div>
      </section>
      {/* 건조기 선택 섹션 */}
      <section>
        <h3 className="font-bold mb-2">건조기 선택</h3>
        <div className="grid grid-cols-3 gap-4">
          {DRYER_LIST.map(dryer => (
            <button
              key={dryer.id}
              disabled={dryerDisabled || dryer.status === "unavailable"}
              className={`flex flex-col items-center justify-center border rounded p-4 h-24 transition-all
                ${dryerDisabled || dryer.status === "unavailable" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-blue-50"}
                ${selectedDryer === dryer.id ? "border-blue-600" : "border-gray-300"}`}
              onClick={() => {
                setSelectedDryer(dryer.id);
                // setDialogMode("건조");
                setDialogMachineId(dryer.id);
                setDialogOpen(true);
              }}
            >
              <span className="text-2xl mb-1">🔥</span>
              {dryer.status === "busy" ? (
                <>
                  <span className="text-sm">남은 시간: {dryer.time}분</span>
                  <span className="text-xs text-green-600 block">예약 가능</span>
                </>
              ) : (
                <span className="text-sm text-red-400">미사용중</span>
              )}
            </button>
          ))}
        </div>
      </section>
    {/* 예약 Dialog */}
    <WasherDryerDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      mode={dialogMode}
      machineId={dialogMachineId}
    />
  </div>
  );
}
