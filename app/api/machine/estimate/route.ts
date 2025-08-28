// app/api/machine/estimate/route.ts
// 예상 비용/시간 계산을 위한 프록시 API

import { NextRequest, NextResponse } from "next/server";

// 환경 변수에서 백엔드 URL을 안전하게 가져오는 함수
const getBackendUrl = () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
  }
  return backendUrl;
};

// POST 요청을 처리하는 핸들러
export async function POST(req: NextRequest) {
  try {
    const backendUrl = getBackendUrl();
    const requestBody = await req.json();

    // 백엔드 API의 엔드포인트 URL을 완성합니다.
    const backendApiUrl = `${backendUrl}/api/machine/estimate`;

    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API 라우트 오류:", error);
    const message =
      error instanceof Error ? error.message : "API 요청 중 오류 발생";
    return NextResponse.json({ message }, { status: 500 });
  }
}
