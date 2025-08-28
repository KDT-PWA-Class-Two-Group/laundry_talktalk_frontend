import { StoreSearchBar } from "@/components/customComponents/store-info/StoreSearchBar";
import { verifyUser } from "@/lib/verifyUser";
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

// 사용자별 맞춤 매장 가져오기 (실제 API 연동 시 사용)
async function getUserStores(userId: string) {
  try {
    // 실제 API 호출 예시
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/user/${userId}`);
    // if (res.ok) {
    //   return await res.json();
    // }
    
    // 현재는 mock 데이터로 시뮬레이션
    return mockStores.map((store, i) => ({
      ...store,
      name: `${store.name} (맞춤)`,
      rating: (Math.random() * 1 + 4).toFixed(1), // 맞춤 매장은 평점이 더 높게
    }));
  } catch {
    return mockStores;
  }
}

export default async function StoreInfoPage() {
  // 서버에서 사용자 인증 정보 확인
  const user = await verifyUser();
  console.log(user)
  
  // 사용자별 매장 또는 기본 매장 가져오기
  const stores = user?.user_id 
    ? await getUserStores(user.user_id)
    : mockStores;

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h2 className="text-2xl font-bold text-center mb-4">매장 정보 및 리뷰</h2>
      
      {/* 로그인 상태에 따른 메시지 */}
      {user && (
        <div className="text-sm text-gray-600 mb-2 text-center">
          안녕하세요, {user.email}님! 맞춤 매장을 추천드립니다.
        </div>
      )}
      
      {/* 검색바 및 위치기반 아이콘: 클라이언트 컴포넌트 */}
      <StoreSearchBar />
      
      <div className="font-bold mb-2 text-sm">
        {user ? `${user.email}님을 위한 맞춤 매장` : "TOP 10 매장"}
      </div>
      
      <div className="flex flex-col gap-4">
        {stores.map(store => (
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
