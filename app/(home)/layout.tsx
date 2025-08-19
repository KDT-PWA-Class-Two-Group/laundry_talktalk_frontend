import LayoutHeader from "@/components/customComponents/header/LayoutHeader";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  // 햄버거 버튼 클릭 핸들러를 LayoutHeader에 prop으로 전달
  return (
    <>
      <LayoutHeader />
      <main className="pt-[70px] md:w-3/5 mx-auto w-full">{children}</main>
    </>
  );
}
