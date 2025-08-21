import { NextRequest, NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // body에는 { id, name, address, phone, ... } 또는 { latitude, longitude } 등이 올 수 있음

    // 백엔드로 전달
    const backendRes = await fetch(ENDPOINTS.STORES.SEARCH_NEARBY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ message: "서버 오류", error: String(error) }, { status: 500 });
  }
}
