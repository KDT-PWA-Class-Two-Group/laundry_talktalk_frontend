import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    // 쿠키에서 accessToken 가져오기
    const cookies = req.headers.get('cookie');
    
    if (!cookies) {
      return NextResponse.json(
        { message: "인증 토큰이 없습니다.", isAuthenticated: false },
        { status: 401 }
      );
    }

    // 백엔드로 토큰 검증 요청
    const backendRes = await fetch(`${BACKEND}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies, // HttpOnly 쿠키 전달
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: "토큰이 유효하지 않습니다.", isAuthenticated: false },
        { status: 401 }
      );
    }

    const userData = await backendRes.json();
    
    // 사용자 정보 반환 (토큰 제외)
    return NextResponse.json({
      user_id: userData.userId || userData.user_id,
      email: userData.email,
      isAuthenticated: true,
    });

  } catch (error: unknown) {
    console.error('Token verification failed:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "토큰 검증 실패",
        isAuthenticated: false 
      },
      { status: 500 }
    );
  }
}
