import { StoreSearchBar } from "@/components/customComponents/store-info/StoreSearchBar";
import { StarSolid } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";

const mockStores = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `세탁소 ${i + 1}`,
  phone: `010-1234-56${String(i).padStart(2, "0")}`,
  address: `서울시 강남구 테헤란로 ${10 + i}길`,
  rating: (Math.random() * 2 + 3).toFixed(1),
  image: "/images/store.jpg",
}));

export default function StoreInfoPage() {
  // 위치기반 아이콘 클릭 시 geo api 승인 요청 (실제 구현은 클라이언트 컴포넌트에서)
//   

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h2 className="text-2xl font-bold text-center mb-4">매장 정보 및 리뷰</h2>
      {/* 검색바 및 위치기반 아이콘: 클라이언트 컴포넌트 */}
      <StoreSearchBar />
      <div className="font-bold mb-2 text-sm">TOP 10 매장</div>
      <div className="flex flex-col gap-4">
        {mockStores.map(store => (
          <div key={store.id} className="bg-sky-400 rounded-xl p-4 flex gap-4 items-center shadow-md transition hover:scale-[1.01]">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
              <Image src={store.image} alt={store.name} width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="font-bold text-white text-sm">{store.name}</div>
              <div className="text-xs text-white">전화번호: {store.phone}</div>
              <div className="text-xs text-white">주소: {store.address}</div>
              <div className="flex items-center gap-1 text-xs text-white">
                <StarSolid width={14} height={14} className="text-yellow-300" />
                <span className="font-bold">{store.rating}</span>
              </div>
            </div>
            <Link href={`/store-info/${store.id}`} className="bg-white text-sky-700 px-4 py-2 rounded font-bold text-xs shadow hover:bg-sky-100">클릭</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
