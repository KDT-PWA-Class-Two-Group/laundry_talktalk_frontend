import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    // URL에서 userId 파라미터 추출
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    console.log('🔍 stores/list API 호출, userId:', userId);

    // 백엔드로 사용자별 매장 목록 요청
    const backendRes = await fetch(`${BACKEND}/api/users/me/favorites/stores/list/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 항상 최신 데이터
    });

    console.log('🔍 백엔드 응답 상태:', backendRes.status);

    if (!backendRes.ok) {
      console.log('❌ 백엔드 요청 실패:', backendRes.status);
      
      if (backendRes.status === 404) {
        return NextResponse.json(
          { message: "해당 사용자의 매장 정보를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { message: "매장 정보를 가져오는데 실패했습니다." },
        { status: backendRes.status }
      );
    }

    const storesData = await backendRes.json();
    console.log('✅ 매장 데이터 조회 성공, 매장 수:', storesData?.length || 0);

    // 백엔드에서 받은 매장 데이터를 그대로 반환
    return NextResponse.json(storesData);

  } catch (error: unknown) {
    console.error('❌ stores/list API 오류:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
