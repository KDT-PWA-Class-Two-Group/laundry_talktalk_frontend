// src/app/api/usage-history/review/[id]/route.ts
// 이 파일은 프론트엔드 서버(Next.js)에서 실행되며, 클라이언트의 리뷰 제출 요청을 처리합니다.
import { NextRequest, NextResponse } from "next/server";

// TODO: 여기에 실제 백엔드 API의 기본 URL을 입력하세요.
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ★ 실제 백엔드 서버 주소로 변경해야 합니다. ★

// POST 요청 처리: 특정 이용 내역에 대한 리뷰를 백엔드에 제출합니다.
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // URL 경로에서 'id' 매개변수를 받습니다.
) {
  try {
    const { id } = params; // 리뷰를 제출할 이용 내역의 ID
    const { rating, reviewText } = await request.json(); // 클라이언트에서 전송된 별점과 리뷰 텍스트

    // 백엔드 서버의 리뷰 제출 API로 POST 요청을 보냅니다.
    const backendResponse = await fetch(
      `${BACKEND_API_BASE_URL}/usage-history/review/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 필요한 경우, 사용자 인증 토큰 등을 여기에 추가합니다.
        },
        body: JSON.stringify({ rating, reviewText }), // 클라이언트로부터 받은 데이터를 그대로 백엔드로 전달
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
      `API 라우트 '/api/usage-history/review/[id]' (POST)에서 에러 발생:`,
      error
    );
    return NextResponse.json(
      { message: "리뷰 제출 중 서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
