"use client";
import { useState } from "react";
import FavoriteStoresTab from "./FavoriteStoresTab";
import NearbyStoresTab from "./NearbyStoresTab";
import SearchStoresTab from "./SearchStoresTab";

const TABS = [
  { label: "애착매장", key: "favorite" },
  { label: "검색으로 매장찾기", key: "search" },
  { label: "내위치로 매장찾기", key: "nearby" },
];

export default function LaundryReservationTabs() {
  const [activeTab, setActiveTab] = useState("favorite");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-t border-b-2 font-semibold transition-all ${activeTab === tab.key ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 bg-gray-100"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-b shadow p-4 min-h-[300px]">
        {activeTab === "favorite" && <FavoriteStoresTab />}
        {activeTab === "search" && <SearchStoresTab />}
        {activeTab === "nearby" && <NearbyStoresTab />}
      </div>
    </div>
  );
}
