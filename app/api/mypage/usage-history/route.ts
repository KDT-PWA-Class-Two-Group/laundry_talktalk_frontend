import { NextRequest, NextResponse } from "next/server";


// 예약 내역 조회 API (GET /api/reservations/user/{userId})
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  
  //TODO : 현재 임시 아이디로 조회 중 -> 실제 로그인된 사용자 ID를 받아와야 함. (userId 값 변경 필요)
  const userId = 6;
  // const { userId } = params;
  
  try {

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
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
