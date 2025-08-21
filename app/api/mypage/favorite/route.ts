// src/app/api/favorites/route.ts
// 이 파일은 프론트엔드 서버(Next.js)에서 실행되며, 클라이언트의 즐겨찾기 목록 조회 및 추가 요청을 처리합니다.
import { NextRequest, NextResponse } from "next/server";

// TODO: 여기에 실제 백엔드 API의 기본 URL을 입력하세요.
// 예시: "http://your-actual-backend-api.com" 또는 "http://localhost:8080"
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ★ 실제 백엔드 서버 주소로 변경해야 합니다. ★

// GET 요청 처리: 즐겨찾기 목록을 백엔드로부터 가져옵니다.
export async function GET(request: NextRequest) {
  try {
    // 백엔드 서버의 즐겨찾기 목록 API로 GET 요청을 보냅니다.
    const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/favorites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 필요한 경우, 사용자 인증 토큰 등을 여기에 추가합니다.
        // 예시: "Authorization": `Bearer ${request.headers.get("Authorization")}`
      },
      cache: "no-store", // 데이터가 자주 변경될 수 있으므로 캐시하지 않도록 설정
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("API 라우트 '/api/favorites' (GET)에서 에러 발생:", error);
    return NextResponse.json(
      { message: "즐겨찾기 목록을 불러오는 중 서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST 요청 처리: 새로운 즐겨찾기 매장을 백엔드에 추가합니다.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // 클라이언트에서 전송된 즐겨찾기 매장 데이터

    // 백엔드 서버의 즐겨찾기 추가 API로 POST 요청을 보냅니다.
    const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 필요한 경우, 사용자 인증 토큰 등을 여기에 추가합니다.
      },
      body: JSON.stringify(body), // 클라이언트로부터 받은 데이터를 그대로 백엔드로 전달
      cache: "no-store", // 이 요청은 캐시하지 않도록 설정
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("API 라우트 '/api/favorites' (POST)에서 에러 발생:", error);
    return NextResponse.json(
      { message: "즐겨찾기 추가 중 서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
