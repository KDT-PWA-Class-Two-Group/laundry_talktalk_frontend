import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store", // 로그인은 캐싱 금지
    });

    // 🔹[추가] 백엔드 응답 본문(JSON 파싱 실패 대비)
    const data = await backendRes
      .json()
      .catch(() => ({ message: "백엔드 응답 파싱 실패" }));

    // 🔹[추가] 기본 응답 JSON
    const res = NextResponse.json(
      { ok: backendRes.ok, data, message: data?.message },
      { status: backendRes.status }
    );

    // 🔹[추가] 백엔드가 내려준 액세스/리프레시 토큰 쿠키를 프론트로 전달
    // - Node/Next 런타임에 따라 getSetCookie()가 존재할 때가 있음 → 있으면 사용
    // - 없으면 단일 set-cookie 헤더만 전달 (폴백)
    const anyHeaders = backendRes.headers as any;
    const setCookies: string[] =
      typeof anyHeaders.getSetCookie === "function"
        ? anyHeaders.getSetCookie()
        : backendRes.headers.get("set-cookie")
        ? [backendRes.headers.get("set-cookie")!]
        : [];

    for (const c of setCookies) {
      res.headers.append("set-cookie", c); // ✅ 브라우저가 쿠키 저장 가능
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Login proxy error" },
      { status: 500 }
    );
  }
}
