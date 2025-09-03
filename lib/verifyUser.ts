import { VerifiedUser } from "@/types/lib";
import { cookies } from "next/headers";

/**
 * 서버 컴포넌트에서 사용자 인증 정보를 가져오는 함수
 * BFF 패턴: 서버 컴포넌트 → API Route Handler → 백엔드
 */
export async function verifyUser(): Promise<VerifiedUser | null> {
  try {
    // 서버 컴포넌트에서는 쿠키를 명시적으로 전달해야 함
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    console.log("🔍 verifyUser 함수 실행");
    console.log("🔍 쿠키 헤더:", cookieHeader ? "존재함" : "없음");

    // API Route Handler로 요청 (쿠키 포함)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/auth/verify-user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader, // 서버에서 API Route로 쿠키 전달
      },
      cache: "no-store", // 항상 최신 인증 상태 확인
    });

    console.log("🔍 API Route 응답 상태:", response.status);

    if (!response.ok) {
      console.log("❌ 인증 실패:", response.status);
      return null;
    }

    const userData: VerifiedUser = await response.json();
    console.log("✅ 인증 성공:", userData);
    return userData;
  } catch (error) {
    console.error("❌ verifyUser 함수 오류:", error);
    return null;
  }
}

/**
 * 사용자 ID만 필요한 경우 사용하는 간편 함수
 */
export async function getUserId(): Promise<string | null> {
  const user = await verifyUser();
  return user?.user_id || null;
}

/**
 * 사용자 이메일만 필요한 경우 사용하는 간편 함수
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await verifyUser();
  return user?.email || null;
}

/**
 * 로그인 여부만 확인하는 함수
 */
export async function isUserAuthenticated(): Promise<boolean> {
  const user = await verifyUser();
  return user?.isAuthenticated || false;
}

/**
 * 클라이언트 컴포넌트에서 사용할 수 있는 verifyUser 함수
 * HttpOnly 쿠키는 같은 도메인에서 자동으로 포함됨
 */
export async function verifyUserClient(): Promise<VerifiedUser | null> {
  try {
    const res = await fetch("/api/auth/verify-user", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const userData: VerifiedUser = await res.json();
    return userData;
  } catch (error) {
    console.error("verifyUserClient 함수 오류:", error);
    return null;
  }
}
