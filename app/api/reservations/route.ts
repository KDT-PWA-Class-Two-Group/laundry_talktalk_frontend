// app/api/reservations/route.ts

import { NextRequest, NextResponse } from "next/server";

const getBackendUrl = () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
  }
  return backendUrl;
};

// POST 핸들러 (기존 예약 생성 로직)
export async function POST(req: NextRequest) {
  try {
    const backendUrl = getBackendUrl();
    console.log("NEXT_PUBLIC_API_URL (POST):", backendUrl);

    if (!backendUrl) {
      console.error("환경 변수 NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
      return NextResponse.json(
        { message: "백엔드 API URL이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const requestBody = await req.json();
    console.log("프론트엔드에서 받은 예약 요청 본문 (POST):", requestBody);

    const backendApiUrl = `${backendUrl}/api/reservations`;
    console.log("백엔드에 POST 요청 전달 시도:", backendApiUrl);

    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(
      "백엔드 응답 상태 (POST):",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("백엔드에서 오류 응답 수신 (POST):", errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log("백엔드에서 받은 성공 응답 (POST):", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "예약 생성 중 알 수 없는 오류 발생";
    console.error("API 라우트 내부 오류 발생 (POST):", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

// GET 핸들러 (예약 정보 조회 로직 추가)
export async function GET(req: NextRequest) {
  try {
    const backendUrl = getBackendUrl();
    console.log("NEXT_PUBLIC_API_URL (GET):", backendUrl);

    if (!backendUrl) {
      console.error("환경 변수 NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
      return NextResponse.json(
        { message: "백엔드 API URL이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    const date = searchParams.get("date");

    if (!storeId || !date) {
      console.error("storeId 또는 date 파라미터가 누락되었습니다.");
      return NextResponse.json(
        { message: "storeId와 date는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const backendApiUrl = `${backendUrl}/api/reservations?storeId=${storeId}&date=${date}`;
    console.log("백엔드에 GET 요청 전달 시도:", backendApiUrl);

    const response = await fetch(backendApiUrl);

    console.log(
      "백엔드 응답 상태 (GET):",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("백엔드에서 오류 응답 수신 (GET):", errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log("백엔드에서 받은 성공 응답 (GET):", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "예약 조회 중 알 수 없는 오류 발생";
    console.error("API 라우트 내부 오류 발생 (GET):", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
