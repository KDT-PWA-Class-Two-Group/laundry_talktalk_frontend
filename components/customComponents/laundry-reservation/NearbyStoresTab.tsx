"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// 임시 데이터
const nearbyStores = [
  { id: 5, name: "세탁소E", address: "서울시 동작구 202", phone: "010-5678-9012" },
  { id: 6, name: "세탁소F", address: "서울시 영등포구 303", phone: "010-6789-0123" },
];

export default function NearbyStoresTab() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stores, setStores] = useState<typeof nearbyStores>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          // 실제 API 요청 대신 임시 데이터 사용
          setStores(nearbyStores);
        },
        err => setError("위치 정보를 가져올 수 없습니다."),
        { enableHighAccuracy: true }
      );
    } else {
      setError("브라우저가 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {location && (
        <p className="mb-2 text-sm text-gray-600">내 위치: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
      )}
      <div className="flex flex-col gap-4">
        {stores.map(store => (
          <div key={store.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="font-bold text-lg">{store.name}</div>
              <div className="text-gray-600 text-sm">{store.address}</div>
              <div className="text-gray-600 text-sm">{store.phone}</div>
            </div>
            <Link href={`/laundry-reservation/${store.id}`} className="bg-blue-600 text-white px-4 py-2 rounded self-end md:self-auto">예약하기</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
