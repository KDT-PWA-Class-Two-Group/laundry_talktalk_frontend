import { NextResponse } from "next/server";

// 매장 데이터의 타입을 정의합니다.
// 이 타입은 API 명세에 따라 필요한 속성들을 포함해야 합니다.
interface Store {
  storeId: number;
  name: string;
  address: string;
  // 필요한 경우 다른 속성도 추가
}

/**
 * @method GET
 * @description 위도/경도를 기반으로 주변 매장 검색
 * @query lat=37.5665&lng=126.9780
 * @returns [{ "storeId": 1, "name": "명동점", "address": "서울시 중구" }]
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
        { message: "위치 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // TODO:
    // 1. 데이터베이스에 연결하여 `lat`과 `lng`를 기준으로 가까운 매장들을 검색합니다.
    //    (예: 지리 정보 쿼리, Haversine 공식 등 활용)
    // 2. 검색 결과를 배열 형태로 반환합니다.

    // 이제 'nearbyStores' 변수에 Store[] 타입을 명시적으로 지정합니다.
    const nearbyStores: Store[] = []; // 여기에 DB에서 조회한 객체 배열

    return NextResponse.json(nearbyStores, { status: 200 });
  } catch (error) {
    console.error("주변 매장 검색 중 서버 오류 발생:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
