import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

    // 🔹[추가] 백엔드 응답 본문(JSON 파싱 실패 대비)
    const data = await backendRes.json();
    console.log("백엔드 응답:", data); // 디버깅용

    // 🔹[수정] 백엔드 응답을 그대로 전달 (토큰은 쿠키에서 관리)
    const res = NextResponse.json(
      data, // 백엔드 응답 그대로 전달 (message, userId, email)
      { status: backendRes.status }
    );

    // 🔹[추가] 백엔드가 내려준 액세스/리프레시 토큰 쿠키를 프론트로 전달
    // - Node/Next 런타임에 따라 getSetCookie()가 존재할 때가 있음 → 있으면 사용
    // - 없으면 단일 set-cookie 헤더만 전달 (폴백)
    const headers = backendRes.headers as Headers & { getSetCookie?: () => string[] };
    const setCookies: string[] =
      typeof headers.getSetCookie === "function"
        ? headers.getSetCookie()
        : backendRes.headers.get("set-cookie")
        ? [backendRes.headers.get("set-cookie")!]
        : [];

    for (const c of setCookies) {
      res.headers.append("set-cookie", c); // ✅ 브라우저가 쿠키 저장 가능
    }

    return res;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Login proxy error";
    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: 500 }
    );
  }
}
