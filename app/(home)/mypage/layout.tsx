import MyPageNavbar from "@/components/customComponents/mypage/MyPageNavbar";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* 왼쪽 고정 네비게이션 바 */}
      <div className="relative">
        <MyPageNavbar />
      </div>
      {/* 오른쪽 컨텐츠 영역 */}
      <div className="p-2 w-full">{children}</div>
    </div>
  );
}
