"use client";
import React from "react";
import { X } from "lucide-react";

export default function Modal({
  isModalOpen,
  title,
  onClose,
  children,
  footer,
}: {
  isModalOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[min(880px,92vw)] rounded-2xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button
            aria-label="닫기"
            className="rounded-md p-1 hover:bg-slate-100"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="border-t px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}
