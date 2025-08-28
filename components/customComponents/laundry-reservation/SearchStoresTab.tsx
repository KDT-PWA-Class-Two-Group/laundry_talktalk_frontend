// SearchStoresTab.tsx

"use client";
import Link from "next/link";
import { useState } from "react";

// 백엔드 Store 엔티티의 필드명과 정확히 일치하도록 수정합니다.
interface Store {
  store_id: number;
  store_name: string;
  store_address: string;
  store_number: string;
}

export default function SearchStoresTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(
        `/api/stores/search/keyword?keyword=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          setResults(data.data);
        } else {
          setResults([]);
          setError(
            "API 응답 형식이 올바르지 않습니다. 'data' 배열이 없습니다."
          );
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "매장 검색에 실패했습니다.");
      }
    } catch (err) {
      setError(
        "네트워크 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요."
      );
      console.error("Failed to fetch search results:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="매장명 검색"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </div>

      {loading && <p className="p-4 text-center">검색 중...</p>}
      {error && <p className="p-4 text-center text-red-500">오류: {error}</p>}

      {!loading && !error && results.length > 0 ? (
        <div className="flex flex-col gap-4">
          {results.map((store) => (
            <div
              key={store.store_id}
              className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div>
                <div className="font-bold text-lg">{store.store_name}</div>
                <div className="text-gray-600 text-sm">
                  {store.store_address}
                </div>
                <div className="text-gray-600 text-sm">
                  {store.store_number}
                </div>{" "}
                {/* <-- 이 부분도 store_number로 수정 */}
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
          <p className="p-4 text-center text-gray-500">검색 결과가 없습니다.</p>
        )
      )}
    </div>
  );
}
