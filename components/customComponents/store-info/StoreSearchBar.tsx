"use client";
import { MapPin } from "iconoir-react";
import { useState } from "react";

export function StoreSearchBar() {
  const [search, setSearch] = useState("");

  const handleGeoClick = () => {};
  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full bg-blue-50 rounded px-4 py-2 text-sm outline-none"
      />
      <button
        type="button"
        className="bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200"
        onClick={handleGeoClick}
        aria-label="위치기반 검색"
      >
        <MapPin width={20} height={20} />
      </button>
    </div>
  );
}
