"use client";
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
    router.push("/login");
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          className="bg-sky-900 text-white px-3 py-1 rounded"
          onClick={adminPageRouter}
        >
          관리자페이지
        </button>
        <button
          className="bg-sky-900 text-white px-3 py-1 rounded"
          onClick={myPageRouter}
        >
          마이페이지
        </button>
        <button
          className="bg-sky-900 text-white px-3 py-1 rounded"
          onClick={loginPageRouter}
        >
          로그인
        </button>
      </div>
    </>
  );
}
