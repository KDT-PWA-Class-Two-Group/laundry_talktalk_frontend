import { NextRequest, NextResponse } from "next/server";

// GET /api/auth/check-id/{userId}
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    // 백엔드에 userId 중복 확인 요청
    const backendRes = await fetch(
      `${process.env.BACKEND_URL}/api/auth/check-id/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("❌ check-id API error:", error);
    return NextResponse.json(
      { message: "백엔드 통신 오류" },
      { status: 500 }
    );
  }
}
