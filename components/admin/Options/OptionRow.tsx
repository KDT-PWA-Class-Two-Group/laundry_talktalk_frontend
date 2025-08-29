"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course, AddOn } from "@/types/admin";

const deleteButtonClass =
  "rounded-full bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500";

const formatPrice = (price: number) => new Intl.NumberFormat("ko-KR").format(price);

export default function OptionRow({ item, onDelete }: { item: Course | AddOn; onDelete: () => void }) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  return (
    <div
      onClick={() => setActiveId(item.id)}
      className={`flex items-center justify-between rounded-2xl border bg-white px-5 py-3 transition-shadow ${activeId === item.id ? "ring-2 ring-sky-500 border-sky-500" : ""}`}
    >
      <div className="min-w-0">
        <div className="truncate text-base font-semibold">{item.name}</div>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <span>적용 가능:</span>
          <Badge variant="secondary" className="shrink-0">
            {item.appliesTo}
          </Badge>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <div className="whitespace-nowrap text-base font-medium">
          {formatPrice(item.price)}원
        </div>
        <Button
          size="sm"
          className={deleteButtonClass}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
