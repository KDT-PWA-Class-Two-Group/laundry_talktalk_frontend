import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    // ✅ 나중에 백엔드 붙으면 여기서 호출
    /*
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/price-estimator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json(
      { ok: backendRes.ok, data, message: data?.message },
      { status: backendRes.status }
    );
    */

    // ✅ 지금은 프론트에서도 확인할 수 있도록 mock 계산
    const { washCourse, washOption, useDry, dryTime, dryOption } = body;

    let washPrice =
      washCourse === "표준" ? 4000 : washCourse === "이불" ? 6000 : 5000;
    if (washOption === "헹굼 1회 추가") washPrice += 500;
    if (washOption === "헹굼 2회 추가") washPrice += 1000;

    let dryPrice = 0;
    let dryMinutes = dryTime || 0;
    if (useDry && dryTime) {
      dryPrice = dryMinutes * 200;
      if (dryOption === "고온") dryPrice += 500;
      if (dryOption === "저온") dryPrice -= 300;
    }

    const result = {
      wash: washPrice,
      dry: dryPrice,
      total: washPrice + dryPrice,
      time: 60 + dryMinutes,
    };

    return NextResponse.json({ ok: true, data: result }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Estimate error" },
      { status: 500 }
    );
  }
}
