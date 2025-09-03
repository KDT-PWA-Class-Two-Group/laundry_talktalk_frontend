"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Store {
  store_id: number;
  store_name: string;
  store_address: string;
  store_phone?: string;
}

export default function NearbyStoresTab() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });

          try {
            // 백엔드 API에 위치 정보를 전송하여 주변 매장 검색
            const response = await fetch(
              `/api/stores/search/nearby?lat=${latitude}&lng=${longitude}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data.data && Array.isArray(data.data)) {
                setStores(data.data);
              } else {
                setError("API 응답 형식이 올바르지 않습니다.");
              }
            } else {
              const errorData = await response.json();
              setError(errorData.message || "주변 매장 검색에 실패했습니다.");
            }
          } catch (err) {
            setError(
              "네트워크 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요."
            );
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError("위치 정보를 가져올 수 없습니다.");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("브라우저가 위치 정보를 지원하지 않습니다.");
      setLoading(false);
    }
  }, []);

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && (
        <p className="text-center p-4">주변 매장 정보를 불러오는 중...</p>
      )}
      {location && !loading && !error && (
        <p className="mb-2 text-sm text-gray-600">
          내 위치: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
      {!loading && !error && stores.length > 0 ? (
        <div className="flex flex-col gap-4">
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div>
                <div className="font-bold text-lg">{store.store_name}</div>
                <div className="text-gray-600 text-sm">
                  {store.store_address}
                </div>
                <div className="text-gray-600 text-sm">{store.store_phone}</div>
              </div>
              <Link
                href={`/laundry-reservation/${store.store_id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded self-end md:self-auto"
              >
                예약하기
              </Link>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="p-4 text-center text-gray-500">
            주변에 매장이 없습니다.
          </p>
        )
      )}
    </div>
  );
}
