import { SearchMap } from "@/components/customComponents/nearby/searchmap";

export default function FavoritesStorePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">위치 기반 매장 안내</h1>
      <div>
        <p>
          {" "}
          현재 위치를 기반으로 가까운 세탁소를 찾아보세요.
          <br></br> ※ 위치 정보 접근 동의가 필요합니다.
        </p>
      </div>

      {/*검색창/검색버튼/좌표로 검색 버튼*/}
      <div className="searchContainer">
        <SearchMap />
      </div>
      <div>여기에 지도 추가</div>
    </div>
  );
}
