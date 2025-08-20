"use client";
import Link from "next/link";

// 임시 데이터
const stores = [
  { id: 1, name: "세탁소A", address: "서울시 강남구 123", phone: "010-1234-5678" },
  { id: 2, name: "세탁소B", address: "서울시 서초구 456", phone: "010-2345-6789" },
];

export default function FavoriteStoresTab() {
  return (
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
  );
}
