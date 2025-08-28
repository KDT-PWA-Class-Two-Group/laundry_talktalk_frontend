import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    // 환경 변수에서 백엔드 주소를 가져옵니다.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
    }

    // 백엔드 서버로 요청을 전달합니다.
    const backendRes = await fetch(
      `${backendUrl}/api/stores/${storeId}/machines`
    );

    // 백엔드 응답을 그대로 클라이언트에 반환합니다.
    if (!backendRes.ok) {
      const errorData = await backendRes.json();
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "API 라우트 오류 발생";
    console.error("API 라우트 오류:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
