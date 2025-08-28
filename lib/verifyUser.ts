// 사용자 정보 타입 정의
export interface VerifiedUser {
  user_id: string;
  email: string;
  isAuthenticated: boolean;
}

/**
 * 서버 컴포넌트에서 사용자 인증 정보를 가져오는 함수
 * HttpOnly 쿠키가 자동으로 포함되어 백엔드에서 사용자 정보를 검증
 */
export async function verifyUser(): Promise<VerifiedUser | null> {
  try {
    // verifyUser API 엔드포인트 호출 (쿠키 자동 포함)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/verify-user`, {
      method: "GET",
      cache: "no-store", // 항상 최신 인증 상태 확인
    });

    if (!res.ok) {
      // 인증 실패 시 null 반환
      return null;
    }

    const userData: VerifiedUser = await res.json();
    return userData;

  } catch (error) {
    console.error('verifyUser 함수 오류:', error);
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
    const res = await fetch('/api/auth/verify-user', {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const userData: VerifiedUser = await res.json();
    return userData;

  } catch (error) {
    console.error('verifyUserClient 함수 오류:', error);
    return null;
  }
}
