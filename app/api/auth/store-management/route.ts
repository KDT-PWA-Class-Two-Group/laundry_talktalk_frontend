// app/api/auth/store-management/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL!; // 예: https://api.my-backend.com
export const runtime = "nodejs"; // Vercel/Node 런타임 강제(선택)

function fwdHeaders(req: NextRequest) {
  const h = new Headers();
  h.set("content-type", "application/json");
  const auth = req.headers.get("authorization");
  const cookie = req.headers.get("cookie");
  if (auth) h.set("authorization", auth);
  if (cookie) h.set("cookie", cookie);
  return h;
}

/** GET: 쿼리로 리소스 분기 */
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const resource = u.searchParams.get("resource"); // "devices" | "options" | "notices" | "reviews"
  const storeId = u.searchParams.get("storeId");
  if (!resource || !storeId) {
    return NextResponse.json(
      { message: "resource, storeId 필요" },
      { status: 400 }
    );
  }

  const pathMap: Record<string, string> = {
    devices: `/api/stores/${storeId}/devices`,
    options: `/api/stores/${storeId}/options`,
    notices: `/api/stores/${storeId}/notices`,
    reviews: `/api/stores/${storeId}/reviews`,
  };
  const target = `${BACKEND}${pathMap[resource]}${u.search}`;

  const res = await fetch(target, {
    method: "GET",
    headers: fwdHeaders(req),
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

/** PATCH: 바디로 리소스/ID 분기 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    // { resource: "device"|"option"|"notice"|"review", storeId: "s001", entityId: "xxx", data: {...} }
    const map = {
      device: "devices",
      option: "options",
      notice: "notices",
      review: "reviews",
    } as const;
    const seg = map[body.resource as keyof typeof map];
    if (!seg) throw new Error("지원하지 않는 resource");

    const target = `${BACKEND}/api/stores/${body.storeId}/${seg}/${body.entityId}`;
    const res = await fetch(target, {
      method: "PATCH",
      headers: fwdHeaders(req),
      body: JSON.stringify(body.data),
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (err:unknown) {

    return NextResponse.json(
      { message: err instanceof Error ? err.message : "PATCH 실패" },
      { status: 400 }
    );
  }
}
