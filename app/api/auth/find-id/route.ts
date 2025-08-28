import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    // 🔹 백엔드 API 호출 (아이디 찾기)
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/find-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store", // 개인정보 요청은 캐싱 금지
    });

    // 🔹 백엔드 응답 본문 파싱 (실패 대비)
    const data = await backendRes
      .json()
      .catch(() => ({ message: "백엔드 응답 파싱 실패" }));

    // 🔹 프론트로 전달할 응답 구성
    return NextResponse.json(
      { ok: backendRes.ok, data, message: data?.message },
      { status: backendRes.status }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Find ID proxy error";
    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: 500 }
    );
  }
}
