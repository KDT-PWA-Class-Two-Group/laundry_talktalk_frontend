// src/app/api/usage-history/cancel/[id]/route.ts
// 이 파일은 프론트엔드 서버(Next.js)에서 실행되며, 클라이언트의 예약 취소 요청을 처리합니다.
import { NextRequest, NextResponse } from "next/server";

// TODO: 여기에 실제 백엔드 API의 기본 URL을 입력하세요.
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ★ 실제 백엔드 서버 주소로 변경해야 합니다. ★

// PUT 요청 처리: 특정 이용 내역을 취소 상태로 변경하도록 백엔드에 요청합니다.
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // URL 경로에서 'id' 매개변수를 받습니다.
) {
  try {
    const { id } = params; // 취소할 이용 내역의 ID

    // 백엔드 서버의 예약 취소 API로 PUT 요청을 보냅니다.
    const backendResponse = await fetch(
      `${BACKEND_API_BASE_URL}/usage-history/cancel/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 필요한 경우, 사용자 인증 토큰 등을 여기에 추가합니다.
        },
        // 취소 요청은 보통 body가 필요 없지만, 백엔드 요구사항에 따라 추가 가능
        // body: JSON.stringify({})
        cache: "no-store", // 이 요청은 캐시하지 않도록 설정
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    // 백엔드로부터 성공 응답을 받았다면, 성공 메시지 반환
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error(
      `API 라우트 '/api/usage-history/cancel/[id]' (PUT)에서 에러 발생:`,
      error
    );
    return NextResponse.json(
      { message: "예약 취소 중 서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
