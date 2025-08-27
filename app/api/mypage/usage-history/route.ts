import { NextRequest, NextResponse } from "next/server";


// 예약 내역 조회 API (백엔드 프록시)
export async function GET(req: NextRequest) {
  try {
    // 실제 로그인된 사용자 ID를 세션 등에서 받아와야 함. 예시로 userId=1
    const userId = 6;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const url = `${backendUrl}/api/reservations/user/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: "예약 내역 조회 중 오류 발생", error: String(error) }, { status: 500 });
  }
}
