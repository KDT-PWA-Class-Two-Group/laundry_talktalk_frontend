import Link from "next/link";
import LayoutButton from "./LayoutButton";
import NavBarButton from "./NavBarButton";

type LayoutHeaderProps = {
  onMenuClick?: () => void;
};


export default function LayoutHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 flex justify-center z-50"
      style={{ height: "70px" }}
    >
      <div
        className="w-full md:w-3/5 px-6 py-4 bg-white shadow grid grid-cols-12 items-center"
        style={{ height: "70px" }}
      >
        {/* 좌측 메뉴 아이콘 */}
        <div className="col-span-3 flex items-center">
          <NavBarButton />
        </div>
        {/* 중앙 타이틀 - 클릭 시 홈으로 이동 */}
        <div className="col-span-6 flex justify-center">
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-gray-800 bg-transparent border-none cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            세탁톡톡
          </Link>
        </div>
        {/* 우측 버튼들 */}
        <div className="col-span-3 flex justify-end items-center">
          <LayoutButton />
        </div>
      </div>
    </header>
  );
}
