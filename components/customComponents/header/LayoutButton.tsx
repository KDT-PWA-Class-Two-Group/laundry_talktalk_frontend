"use client";
import { HomeUser, User, UserCircle } from "iconoir-react";
import { useRouter } from "next/navigation";

export default function LayoutButton() {
  const router = useRouter();

  const adminPageRouter = () => {
    router.push("/admin");
  };

  const myPageRouter = () => {
    router.push("/mypage/edit-profile");
  };
  const loginPageRouter = () => {
    router.push("/auth/sign-in");
  };

  return (
    <div className="flex gap-2">
      {/* md 이상: 텍스트 버튼 */}
      <button
        className="bg-sky-900 text-white px-3 py-2 rounded text-[8px] hidden md:block"
        onClick={adminPageRouter}
      >
        관리자페이지
      </button>
      <button
        className="bg-sky-900 text-white px-3 py-2 rounded text-[8px] hidden md:block"
        onClick={myPageRouter}
      >
        마이페이지
      </button>
      <button
        className="bg-sky-900 text-white px-3 py-2 rounded text-[8px] hidden md:block"
        onClick={loginPageRouter}
      >
        로그인
      </button>

      {/* md 이하: 아이콘 버튼 */}
      <button
        className="bg-sky-900 text-white p-2 rounded text-[16px] md:hidden flex items-center justify-center"
        onClick={adminPageRouter}
        aria-label="관리자페이지"
      >
        <HomeUser width={20} height={20} />
      </button>
      <button
        className="bg-sky-900 text-white p-2 rounded text-[16px] md:hidden flex items-center justify-center"
        onClick={myPageRouter}
        aria-label="마이페이지"
      >
        <UserCircle width={20} height={20} />
      </button>
      <button
        className="bg-sky-900 text-white p-2 rounded text-[16px] md:hidden flex items-center justify-center"
        onClick={loginPageRouter}
        aria-label="로그인"
      >
        <User width={20} height={20} />
      </button>
    </div>
  );
}
