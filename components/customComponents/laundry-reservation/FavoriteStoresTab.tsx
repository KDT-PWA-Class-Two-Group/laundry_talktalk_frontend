// FavoriteStoresTab.tsx

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// API 응답 형식에 맞춰 데이터 타입을 정의합니다.
// 백엔드 API 명세에 따라 필드 이름(storeId, name, address 등)을 맞춰줍니다.
interface FavoriteStore {
  storeId: number;
  name: string;
  address: string;
  phone?: string;
}

export default function FavoriteStoresTab() {
  const [stores, setStores] = useState<FavoriteStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavoriteStores() {
      try {
        setLoading(true);
        // 백엔드 API 라우트로 요청을 보냅니다.
        const response = await fetch("/api/users/me/favorites/stores");

        if (!response.ok) {
          throw new Error("애착 매장 목록을 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        // 백엔드 API의 응답 형식에 맞춰 바로 setStores에 데이터를 할당합니다.
        setStores(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "애착 매장 조회 중 오류 발생"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteStores();
  }, []);

  if (loading) {
    return <p className="p-4 text-center">애착 매장 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">오류: {error}</p>;
  }

  if (stores.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500">애착 매장이 없습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {stores.map((store) => (
        <div
          key={store.storeId}
          className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-2"
        >
          <div>
            <div className="font-bold text-lg">{store.name}</div>
            <div className="text-gray-600 text-sm">{store.address}</div>
            {/* phone 필드가 있을 경우에만 표시합니다. */}
            {store.phone && (
              <div className="text-gray-600 text-sm">{store.phone}</div>
            )}
          </div>
          <Link
            href={`/laundry-reservation/${store.storeId}`}
            className="bg-blue-600 text-white px-4 py-2 rounded self-end md:self-auto"
          >
            예약하기
          </Link>
        </div>
      ))}
    </div>
  );
}
