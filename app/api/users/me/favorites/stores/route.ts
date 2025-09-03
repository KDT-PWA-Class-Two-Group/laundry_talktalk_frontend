import { NextResponse } from "next/server"; // NextRequest를 더 이상 사용하지 않으므로 제거

// 방법 1: `req` 변수 제거
export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL 환경 변수가 설정되지 않았습니다."
      );
    }

    const backendApiUrl = `${backendUrl}/api/users/me/favorites/stores`;
    const response = await fetch(backendApiUrl);

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "애착 매장 조회 중 오류 발생";
    console.error("API 라우트 오류:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
