import Link from "next/link";

const menuItems = [
  { label: "정보수정", path: "/mypage/edit-profile" },
  { label: "이용내역", path: "/mypage/usage-history" },
  { label: "즐겨찾기", path: "/mypage/favorites-store" },
];

export default function MyPageNavbar() {
  return (
    <nav className="sticky top-[70px] left-0 h-[calc(100vh-70px)] w-48 bg-white shadow flex flex-col pt-8 gap-4 z-40">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className="px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 rounded transition"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
