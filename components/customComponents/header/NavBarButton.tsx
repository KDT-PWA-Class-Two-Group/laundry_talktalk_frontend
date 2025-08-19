"use client";

import { useState } from "react";
import LayoutDrawer from "./LayoutDrawer";

export default function NavBarButton() {
  const [drawerOpen, setDrawerOpen] = useState(false);


  return (
    <>
      <button
        className="flex flex-col gap-1 focus:outline-none cursor-pointer"
        aria-label="메뉴 열기"
        onClick={() => setDrawerOpen(true)}
      >
        <span className="block w-6 h-0.5 bg-gray-700"></span>
        <span className="block w-6 h-0.5 bg-gray-700"></span>
        <span className="block w-6 h-0.5 bg-gray-700"></span>
      </button>
      <LayoutDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
