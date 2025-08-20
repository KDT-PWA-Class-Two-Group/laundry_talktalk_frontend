"use client";
import Link from "next/link";
import { useState } from "react";

// 임시 데이터
const allStores = [
  { id: 3, name: "세탁소C", address: "서울시 송파구 789", phone: "010-3456-7890" },
  { id: 4, name: "세탁소D", address: "서울시 관악구 101", phone: "010-4567-8901" },
];

export default function SearchStoresTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof allStores>([]);

  const handleSearch = () => {
    setResults(allStores.filter(store => store.name.includes(query)));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="매장명 검색"
          className="border px-3 py-2 rounded w-full"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">검색</button>
      </div>
      <div className="flex flex-col gap-4">
        {results.map(store => (
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
