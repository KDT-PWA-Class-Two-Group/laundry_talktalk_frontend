"use client";
import { ArrowDownCircle } from "iconoir-react";
import { useState } from "react";

export default function EventDropdown({ events }: { events: any[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("진행중 이벤트");
  const now = new Date();

  const filteredEvents = events.filter((e) => {
    const end = new Date(e.endDate);
    return filter === "진행중 이벤트" ? end >= now : end < now;
  });

  return (
    <div className="mb-4">
      <div className="relative inline-block">
        <button
          className="flex items-center gap-1 px-2 py-1 text-blue-600 font-bold text-sm hover:bg-blue-50 rounded"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {filter}
          <ArrowDownCircle width={16} height={16} className="ml-1" />
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 mt-2 w-36 bg-white border rounded shadow z-10">
            {["진행중 이벤트", "종료된 이벤트"].map((opt) => (
              <button
                key={opt}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${filter === opt ? "bg-blue-100 font-bold" : ""}`}
                onClick={() => { setFilter(opt); setMenuOpen(false); }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        {filteredEvents.length === 0 ? (
          <div className="text-gray-400 text-sm">이벤트가 없습니다.</div>
        ) : (
          filteredEvents.map((e) => (
            <div key={e.id} className="bg-blue-100 rounded-lg p-4 mb-4 shadow">
              <div className="font-bold mb-2">{e.title}</div>
              <div className="text-xs text-gray-400 mb-1">
                {e.startDate} ~ {e.endDate}
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">{e.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
