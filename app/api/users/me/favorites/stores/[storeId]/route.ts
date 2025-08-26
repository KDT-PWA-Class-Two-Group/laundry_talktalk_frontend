// src/app/api/favorites/[id]/route.ts
// 이 파일은 프론트엔드 서버(Next.js)에서 실행되며, 클라이언트의 즐겨찾기 제거 요청을 처리합니다.
import { NextRequest, NextResponse } from "next/server";

// TODO: 여기에 실제 백엔드 API의 기본 URL을 입력하세요.
// 예시: "http://your-actual-backend-api.com" 또는 "http://localhost:8080"
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ★ 실제 백엔드 서버 주소로 변경해야 합니다. ★

// DELETE 요청 처리: 특정 즐겨찾기 매장을 백엔드로부터 제거합니다.
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // URL 경로에서 'id' 매개변수를 받습니다.
) {
  try {
    const { id } = params; // 삭제할 즐겨찾기 매장의 ID

    // 백엔드 서버의 즐겨찾기 제거 API로 DELETE 요청을 보냅니다.
    const backendResponse = await fetch(
      `${BACKEND_API_BASE_URL}/favorite/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 필요한 경우, 사용자 인증 토큰 등을 여기에 추가합니다.
        },
        cache: "no-store", // 이 요청은 캐시하지 않도록 설정
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    // 백엔드로부터 성공 응답을 받았다면, 성공 메시지 반환
    return NextResponse.json(
      { message: "즐겨찾기가 성공적으로 제거되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `API 라우트 '/api/favorites/[id]' (DELETE)에서 에러 발생:`,
      error
    );
    return NextResponse.json(
      { message: "즐겨찾기 제거 중 서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
