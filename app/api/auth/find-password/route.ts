import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/reset-request`, // 🔹 백엔드 API 호출
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await backendRes.json();

    return NextResponse.json(
      { ok: backendRes.ok, data, message: data?.message },
      { status: backendRes.status }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Find-password proxy error";
    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: 500 }
    );
  }
}
