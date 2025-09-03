import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    // 1. 서버 컴포넌트에서 온 쿠키 또는 브라우저에서 온 쿠키 처리
    let cookieStore;
    
    // 서버 컴포넌트에서 Cookie 헤더로 전달된 경우와 브라우저에서 직접 온 경우 모두 처리
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      console.log('🔍 Cookie 헤더로 받은 쿠키:', cookieHeader);
      // Cookie 헤더에서 accessToken 추출
      const accessTokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
      const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
      
      if (!accessToken) {
        return NextResponse.json(
          { message: "인증 토큰이 없습니다.", isAuthenticated: false },
          { status: 401 }
        );
      }

      console.log('🔍 추출된 accessToken:', accessToken.substring(0, 20) + '...');

      // 백엔드로 토큰 검증 요청
      const backendRes = await fetch(`${BACKEND}/api/auth/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
        cache: "no-store",
      });

      if (!backendRes.ok) {
        console.log('❌ 백엔드 검증 실패:', backendRes.status);
        return NextResponse.json(
          { message: "토큰이 유효하지 않습니다.", isAuthenticated: false },
          { status: 401 }
        );
      }

      const userData = await backendRes.json();
      console.log('✅ 백엔드 검증 성공:', userData);
      
      // 사용자 정보 반환 (토큰 제외)
      return NextResponse.json({
        user_id: userData.userId || userData.user_id,
        email: userData.email,
        isAuthenticated: true,
      });
    } else {
      // 브라우저에서 직접 온 경우 cookies() 함수 사용
      cookieStore = await cookies();
      const accessToken = cookieStore.get("accessToken")?.value;

      if (!accessToken) {
        return NextResponse.json(
          { message: "인증 토큰이 없습니다.", isAuthenticated: false },
          { status: 401 }
        );
      }

      // 백엔드로 토큰 검증 요청
      const backendRes = await fetch(`${BACKEND}/api/auth/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
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
    }

  } catch (error: unknown) {
    console.error('❌ Token verification failed:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "토큰 검증 실패",
        isAuthenticated: false 
      },
      { status: 500 }
    );
  }
}
