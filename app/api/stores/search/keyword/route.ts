import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // URL에서 검색어(keyword) 파라미터를 추출합니다.
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json(
        { message: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    // 환경 변수에서 백엔드 주소를 가져옵니다.
    // 사용자가 설정한 NEXT_PUBLIC_API_URL 변수를 사용합니다.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
    }

    // 실제 백엔드 서버로 요청을 전달합니다.
    const backendRes = await fetch(
      `${backendUrl}/api/stores/search/keyword?keyword=${encodeURIComponent(
        keyword
      )}`
    );

    // 백엔드 응답을 그대로 클라이언트에 반환합니다.
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "매장 검색 중 오류 발생";
    console.error("API 라우트 오류:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
