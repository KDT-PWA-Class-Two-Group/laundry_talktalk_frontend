// app/api/store/route.ts
// 단일 매장 상세 정보를 백엔드 API로부터 가져오는 프록시 API

import { NextRequest, NextResponse } from "next/server";

const getBackendUrl = () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
  }
  return backendUrl;
};

/**
 * @method GET
 * @description 단일 매장 상세 정보 조회 (백엔드 프록시)
 */
export async function GET(req: NextRequest) {
  try {
    const backendUrl = getBackendUrl();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      console.error("storeId 파라미터가 누락되었습니다.");
      return NextResponse.json(
        { message: "storeId는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const backendApiUrl = `${backendUrl}/api/store?storeId=${storeId}`; // 백엔드 API의 단일 매장 상세 정보 엔드포인트
    console.log(`백엔드 단일 매장 상세 정보 요청 시도: ${backendApiUrl}`);

    const response = await fetch(backendApiUrl);

    console.log(
      "백엔드 응답 상태 (GET /api/store):",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "백엔드에서 단일 매장 상세 정보 오류 응답 수신:",
        errorData
      );
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log("백엔드에서 단일 매장 상세 정보 성공 응답 수신:", data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API 라우트 내부 오류 발생 (GET /api/store):", error);
    const message =
      error instanceof Error
        ? error.message
        : "단일 매장 상세 정보를 불러오는 중 오류 발생";
    return NextResponse.json({ message }, { status: 500 });
  }
}
