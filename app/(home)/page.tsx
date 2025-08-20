import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 메인 제목 */}
      <h1 className="text-2xl font-bold mt-12 mb-2">편리한 세탁서비스</h1>
      {/* 소제목 */}
      <p className="mb-8 text-gray-600">
        빨래 톡톡과 함께 더 깨끗하고 편리한 세탁경험을 만나보세요.
      </p>

      {/* 서비스 안내 카드 */}
      <div className="flex gap-6 mb-8 w-full max-w-xl justify-center">
        <div className="bg-white rounded-lg shadow-md w-1/2 p-2 flex flex-col items-center relative">
          <div className="z-10 flex items-center justify-end flex-col h-full">
            <div className="font-semibold mb-1 text-sky-800">세탁 예약</div>
            <div className="text-xs text-sky-800 mb-2 font-bold">
              원하는 매장과 시간에 세탁 서비스 예약이 가능합니다.
            </div>
            <Link href={'/laundry-reservation'} className="flex justify-center w-full">
              <Button className="w-full bg-sky-50 shadow-sky-50 h-5 text-[10px]">지금 예약하기</Button>
            </Link>
          </div>
          <Image
            src="/images/wash1.jpg"
            alt="세탁 예약"
            fill
            className="w-full object-cover rounded mb-2 opacity-50"
          />
        </div>
        <div className="bg-white rounded-lg shadow-md w-1/2 p-4 flex flex-col items-center relative">
          <div className="z-10 flex items-center justify-end flex-col h-full">
            <div className="font-semibold mb-1 text-sky-800">매장별 정보제공</div>
            <div className="text-xs text-sky-800 mb-2 font-bold">
              가까운 매장과 다양한 세탁기 정보를 확인하세요.
            </div>
            <Link href={'/store-info'} className="flex justify-center w-full">
              <Button className="w-full bg-sky-50 shadow-sky-50 h-5 text-[10px]">매장정보 보기</Button>
            </Link>
          </div>
          <Image
            src="/images/wash2.jpg"
            alt="매장 안내"
            fill
            className="w-full object-cover rounded mb-2 opacity-50"
          />
        </div>
      </div>

      {/* 공지사항 박스 */}
      <div className="w-full max-w-xl bg-blue-50 rounded-lg shadow p-4 mt-2">
        <div className="font-bold mb-2">📢 공지사항</div>
        <ul className="text-sm text-gray-700">
          <li className="flex justify-between border-b py-1">
            <span>위치기반 매장 안내 서비스 오픈</span>
            <span className="text-xs text-gray-400">2025.08.18</span>
          </li>
          <li className="flex justify-between border-b py-1">
            <span>세탁 예약 기능 업데이트</span>
            <span className="text-xs text-gray-400">2025.08.10</span>
          </li>
          <li className="flex justify-between py-1">
            <span>빨래톡톡 서비스 정식 런칭</span>
            <span className="text-xs text-gray-400">2025.08.01</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
