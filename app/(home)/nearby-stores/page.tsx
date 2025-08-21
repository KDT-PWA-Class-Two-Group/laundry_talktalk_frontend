import { SearchMap } from "@/components/customComponents/nearby/searchmap";

export default function FavoritesStorePage() {
  return (
    <div className="max-w-md mx-auto py-8 px-4 font-nanum">
      {/* 제목 */}
      <h1 className="text-2xl font-bold text-center mb-8 border-b-2 border-sky-300 pb-2">
        위치 기반 매장 안내
      </h1>

      {/* 설명 */}
      <div className="text-center text-gray-700 mb-6">
        <p>현재 위치를 기반으로 가까운 세탁소를 찾아보세요.</p>
        <p>※ 위치 정보 접근 동의가 필요합니다.</p>
      </div>

      {/* 검색 영역 */}
      <div className="border rounded-lg p-4 mb-6 border-gray-200 bg-white shadow-sm">
        <SearchMap />
      </div>

      {/* 지도 영역 */}
      <div className="border rounded-lg p-4 border-gray-200 bg-white shadow-sm">
        <div className="text-center text-gray-500">여기에 지도가 표시됩니다.</div>
      </div>
    </div>
  );
}
