
import { ENDPOINTS } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 백엔드 로그인 API로 요청 전달
  const backendRes = await fetch(ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await backendRes.json();

  // 응답 반환
  return NextResponse.json(data, { status: backendRes.status });
}
