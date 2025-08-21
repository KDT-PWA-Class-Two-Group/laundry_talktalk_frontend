// src/app/api/mypage/auth/route.ts
// 이 파일은 프론트엔드 서버(Next.js)에서 실행되며, 클라이언트의 요청을 받아 실제 백엔드로 전달합니다.
import { NextRequest, NextResponse } from "next/server";

// TODO: 여기에 실제 백엔드 API의 기본 URL을 입력하세요.
// 예시: "http://your-actual-backend-api.com" 또는 "http://localhost:8080"
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ★ 실제 백엔드 서버 주소로 변경해야 합니다. ★

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json(); // 클라이언트에서 전송된 비밀번호를 파싱

    // 프론트엔드 서버가 실제 백엔드 서버의 인증 API로 POST 요청을 보냅니다.
    const backendResponse = await fetch(
      `${BACKEND_API_BASE_URL}/profile/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 백엔드에 필요한 추가 인증 헤더(예: JWT 토큰)가 있다면 여기에 추가합니다.
          // 예시: "Authorization": `Bearer ${request.headers.get("Authorization")}`
        },
        body: JSON.stringify({ password }), // 백엔드로 비밀번호 데이터 전송
        cache: "no-store", // 이 요청은 캐시하지 않도록 설정 (인증 관련 요청이므로 중요)
      }
    );

    // 백엔드로부터 받은 응답 상태를 그대로 클라이언트(브라우저)로 전달합니다.
    if (!backendResponse.ok) {
      // 백엔드에서 에러 응답(예: 401 Unauthorized, 400 Bad Request)을 보냈다면 해당 에러를 그대로 전달
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    // 백엔드 응답이 성공적이라면, 데이터를 JSON으로 변환하여 클라이언트로 전달
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status }); // 백엔드의 성공 상태 코드도 함께 전달
  } catch (error) {
    // 요청 처리 중 서버 내부 에러 발생 시 (네트워크 문제, JSON 파싱 오류 등)
    console.error("API 라우트 '/api/profile/auth'에서 에러 발생:", error);
    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
