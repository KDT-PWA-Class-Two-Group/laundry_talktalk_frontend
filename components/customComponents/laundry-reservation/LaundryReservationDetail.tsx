"use client";
import { useState, useEffect } from "react";
import WasherDryerDialog from "./WasherDryerDialog";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

// Store entity type definition.
type Store = {
  store_id: number;
  store_name: string;
  store_address: string;
  store_latitude: number;
  store_longitude: number;
  store_detail_info: string;
  store_phone: string;
  store_machine_info: Machine[];
  store_business_hours: string;
};

// Machine entity type definition.
type Machine = {
  machine_id: number;
  machine_name: string;
  machine_type: boolean; // true: washer, false: dryer
  machine_is_active: boolean;
  machine_last_used: string;
};

// Reservation entity type definition.
type Reservation = {
  reservation_id: number;
  reservation_time: string;
  machine_id: number;
};

// Props type for LaundryReservationDetail component.
type LaundryReservationDetailProps = {
  storeId: string;
};

// Helper function to format date without a library.
const formatDate = (date: Date, formatStr: string): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  let result = formatStr;
  result = result.replace("yyyy", year.toString());
  result = result.replace("MM", month);
  result = result.replace("dd", day);
  result = result.replace("d", date.getDate().toString());
  result = result.replace("E", dayOfWeek);

  return result;
};

// Helper function to add days to a date without a library.
const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

// Helper function to check if two dates are the same day.
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export default function LaundryReservationDetail({
  storeId,
}: LaundryReservationDetailProps) {
  const [store, setStore] = useState<Store | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWasher, setSelectedWasher] = useState<Machine | null>(null);
  const [selectedDryer, setSelectedDryer] = useState<Machine | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    if (!storeId) {
      setError("No store information provided.");
      setLoading(false);
      return;
    }

    const fetchStoreDetails = async () => {
      try {
        const response = await fetch(`/api/store?storeId=${storeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const storeData = await response.json();
        setStore(storeData);
      } catch (err) {
        console.error("Error fetching store details:", err);
        setError(
          "매장 정보를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchReservations = async (date: Date) => {
      try {
        const formattedDate = formatDate(date, "yyyy-MM-dd");
        const response = await fetch(
          `/api/reservations?storeId=${storeId}&date=${formattedDate}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reservationData = await response.json();
        setReservations(reservationData);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError(
          "예약 정보를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
    };

    fetchStoreDetails();
    fetchReservations(currentDate);
  }, [storeId, currentDate]);

  const handleSelectMachine = (machine: Machine) => {
    if (machine.machine_type) {
      if (selectedWasher?.machine_id === machine.machine_id) {
        setSelectedWasher(null);
      } else {
        setSelectedWasher(machine);
      }
    } else {
      if (selectedDryer?.machine_id === machine.machine_id) {
        setSelectedDryer(null);
      } else {
        setSelectedDryer(machine);
      }
    }
  };

  const handleReserve = () => {
    if (selectedWasher && selectedDryer) {
      setDialogMode("세탁+건조");
    } else if (selectedWasher) {
      setDialogMode("세탁");
    } else if (selectedDryer) {
      setDialogMode("건조");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedWasher(null);
    setSelectedDryer(null);
    setDialogMode("");
  };

  const isMachineReserved = (machineId: number) => {
    return reservations.some((res) => res.machine_id === machineId);
  };

  const getDayList = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - startOfWeek.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startOfWeek, i));
    }
    return days;
  };

  const handleDateChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentDate((prev) => addDays(prev, -7));
    } else {
      setCurrentDate((prev) => addDays(prev, 7));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <Link href="/" className="text-blue-500 underline mt-2 inline-block">
          Return to home
        </Link>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-4 text-center">
        <p>Store information not found.</p>
        <Link href="/" className="text-blue-500 underline mt-2 inline-block">
          Return to home
        </Link>
      </div>
    );
  }

  const washers = store.store_machine_info.filter(
    (machine) => machine.machine_type
  );
  const dryers = store.store_machine_info.filter(
    (machine) => !machine.machine_type
  );

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          {store.store_name}
        </h1>
        <p className="text-gray-600 mb-4 text-center">{store.store_address}</p>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <button
            onClick={() => handleDateChange("prev")}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Previous week"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-lg font-semibold">
            {formatDate(currentDate, "yyyy년 MM월")}
          </div>
          <button
            onClick={() => handleDateChange("next")}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Next week"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6 text-center">
          {getDayList().map((day) => (
            <div
              key={day.toISOString()}
              className={`p-2 rounded-lg ${
                isSameDay(day, new Date()) ? "bg-blue-100 font-bold" : ""
              }`}
            >
              <div className="text-sm">{daysOfWeek[day.getDay()]}</div>
              <div className="text-2xl">{day.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="border p-4 rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              세탁기 ({washers.length}대)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {washers.map((washer) => (
                <div
                  key={washer.machine_id}
                  className={`p-4 border-2 rounded-lg shadow-sm transition-all duration-300
                    ${
                      isMachineReserved(washer.machine_id)
                        ? "bg-red-100 border-red-300 opacity-60"
                        : selectedWasher?.machine_id === washer.machine_id
                        ? "bg-blue-100 border-blue-500"
                        : "bg-green-100 border-green-300 hover:shadow-md cursor-pointer"
                    }`}
                  onClick={() =>
                    !isMachineReserved(washer.machine_id) &&
                    handleSelectMachine(washer)
                  }
                >
                  <h3 className="font-semibold text-lg">
                    세탁기 {washer.machine_id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {washer.machine_is_active ? "사용 가능" : "사용 불가능"}
                  </p>
                  {isMachineReserved(washer.machine_id) && (
                    <div className="text-sm text-red-600 font-bold mt-2">
                      예약됨
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border p-4 rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              건조기 ({dryers.length}대)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dryers.map((dryer) => (
                <div
                  key={dryer.machine_id}
                  className={`p-4 border-2 rounded-lg shadow-sm transition-all duration-300
                    ${
                      isMachineReserved(dryer.machine_id)
                        ? "bg-red-100 border-red-300 opacity-60"
                        : selectedDryer?.machine_id === dryer.machine_id
                        ? "bg-blue-100 border-blue-500"
                        : "bg-green-100 border-green-300 hover:shadow-md cursor-pointer"
                    }`}
                  onClick={() =>
                    !isMachineReserved(dryer.machine_id) &&
                    handleSelectMachine(dryer)
                  }
                >
                  <h3 className="font-semibold text-lg">
                    건조기 {dryer.machine_id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {dryer.machine_is_active ? "사용 가능" : "사용 불가능"}
                  </p>
                  {isMachineReserved(dryer.machine_id) && (
                    <div className="text-sm text-red-600 font-bold mt-2">
                      예약됨
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleReserve}
            disabled={!selectedWasher && !selectedDryer}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-colors
              ${
                !selectedWasher && !selectedDryer
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {selectedWasher && selectedDryer
              ? "세탁+건조 예약하기"
              : selectedWasher
              ? "세탁 예약하기"
              : selectedDryer
              ? "건조 예약하기"
              : "기기를 선택하세요"}
          </button>
        </div>
      </div>
      <WasherDryerDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        mode={dialogMode}
        washerId={selectedWasher ? selectedWasher.machine_id : null}
        dryerId={selectedDryer ? selectedDryer.machine_id : null}
        storeId={storeId!}
      />
    </div>
  );
}
