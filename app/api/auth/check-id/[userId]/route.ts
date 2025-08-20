import { NextRequest, NextResponse } from "next/server";

// GET /api/auth/check-id/{userId}
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  // 백엔드에 userId 중복 확인 요청
  const backendRes = await fetch(`https://${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-id/${userId}`);
  const data = await backendRes.json();

  // 결과 반환
  return NextResponse.json(data, { status: backendRes.status });
}
