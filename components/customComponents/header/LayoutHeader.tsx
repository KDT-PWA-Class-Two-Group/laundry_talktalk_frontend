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
        className="w-full md:w-3/5 flex items-center justify-between px-6 py-4 bg-white shadow"
        style={{ height: "70px" }}
      >
        {/* 좌측 메뉴 아이콘 */}
        <NavBarButton />
        {/* 중앙 타이틀 - 클릭 시 홈으로 이동 */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-gray-800 bg-transparent border-none cursor-pointer"
          style={{ textDecoration: "none" }}
        >
          세탁톡톡
        </Link>
        {/* 우측 버튼들 */}
        <LayoutButton />
      </div>
    </header>
  );
}
