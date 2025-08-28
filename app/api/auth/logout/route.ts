import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": req.headers.get("cookie") || ""
      },
      cache: "no-store",
    });

    const data = await backendRes.json();
    console.log("로그아웃 백엔드 응답:", data); // 디버깅용

    const res = NextResponse.json(
      data,
      { status: backendRes.status }
    );

    // 백엔드에서 쿠키 삭제 헤더를 전달
    const anyHeaders = backendRes.headers as any;
    const setCookies: string[] =
      typeof anyHeaders.getSetCookie === "function"
        ? anyHeaders.getSetCookie()
        : backendRes.headers.get("set-cookie")
        ? [backendRes.headers.get("set-cookie")!]
        : [];

    for (const c of setCookies) {
      res.headers.append("set-cookie", c);
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Logout proxy error" },
      { status: 500 }
    );
  }
}
