import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log(body);

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-up`, // ✅ 백엔드 회원가입 API
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await backendRes
      .json()
      .catch(() => ({ message: "백엔드 응답 파싱 실패" }));

    return NextResponse.json(
      { ok: backendRes.ok, data, message: data?.message },
      { status: backendRes.status }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Sign-up proxy error" },
      { status: 500 }
    );
  }
}
