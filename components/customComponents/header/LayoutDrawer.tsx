'use client';

import { useRouter } from "next/navigation";

const menuItems = [

  { label: "세탁예약", path: "/laundry-reservation" },
  { label: "예상비용조회", path: "/price-estimator" },
  { label: "위치기반 매장안내", path: "/nearby-stores" },
  { label: "매장별 정보제공", path: "/store-info" },
];

export default function LayoutDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* 드로어 */}
      <nav
        className={`fixed top-0 left-0 bottom-0 h-full w-full md:w- bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-6 gap-4">
          <button className="self-end mb-4 text-gray-500" onClick={onClose}>
            닫기;
          </button>
          {menuItems.map((item) => (
            <button
              key={item.path}
              className="text-lg text-gray-800 text-left py-2 px-3 hover:bg-gray-100 rounded"
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
