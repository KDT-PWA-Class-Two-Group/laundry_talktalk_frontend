import { StoreSearchBar } from "@/components/customComponents/store-info/StoreSearchBar";
import { verifyUser } from "@/lib/verifyUser";
import { VerifiedUser } from "@/types/lib";
import { StoreResponse } from "@/types/store";
import { StarSolid } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";

export default async function StoreInfoPage() {
  // verifyUser로 사용자 정보 가져오기 (email, user_id 포함)
  const user: VerifiedUser | null = await verifyUser();

  let stores: StoreResponse[] | null = null; // null로 초기화
  console.log(stores)

  // user가 있을 때만 매장 데이터 요청
  if (user) {
    try {
      // BFF 패턴: 자체 API Route를 통해 백엔드에 요청
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const res = await fetch(
        `${baseUrl}/api/users/me/favorites/stores/list?userId=${user.user_id}`,
        {
          cache: "no-store", // 항상 최신 데이터
        }
      );

      if (res.ok) {
        const storeResponse = await res.json();
        stores = storeResponse;
      } else {
        console.log("Failed to fetch user stores");
        stores = []; // 빈 배열로 설정
      }
    } catch (error) {
      console.error("Error fetching user stores:", error);
      stores = []; // 빈 배열로 설정
    }
  }

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

      {user && (
        <div className="font-bold mb-2 text-sm">
          {user.email}님을 위한 맞춤 매장
        </div>
      )}

      {/* user가 없으면 로그인 유도 메시지 */}
      {!user && (
        <div className="text-center py-8 text-gray-500">
          로그인하시면 맞춤 매장을 추천해드립니다.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {user && stores &&
          stores.map((store, i) => (
            <div
              key={i}
              className="bg-sky-400 rounded-xl p-4 flex gap-4 items-center shadow-md transition hover:scale-[1.01]"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <Image
                  src={'/images/store.jpg'}
                  alt={store.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="font-bold text-white text-sm">{store.name}</div>
                <div className="text-xs text-white">
                  전화번호: {store.phone}
                </div>
                <div className="text-xs text-white">주소: {store.address}</div>
                <div className="flex items-center gap-1 text-xs text-white">
                  <StarSolid
                    width={14}
                    height={14}
                    className="text-yellow-300"
                  />
                  <span className="font-bold">{store.rating}</span>
                </div>
              </div>
              <Link
                href={`/store-info/${store.id}`}
                className="bg-white text-sky-700 px-4 py-2 rounded font-bold text-xs shadow hover:bg-sky-100"
              >
                클릭
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}