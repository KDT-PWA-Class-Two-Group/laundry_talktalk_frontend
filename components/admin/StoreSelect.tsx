"use client";

import { useState } from "react";
import { StoreSelectProps } from "@/types/admin";
import { Button } from "@/components/ui/button";
import RegionSelect from "@/components/admin/RegionSelect";

export default function StoreSelect({ value, stores, onChange }: StoreSelectProps) {
  const [open, setOpen] = useState(false);
  // 선택된 매장명 상태
  const selectedStoreName = stores.find((s) => s.id === value)?.name || "";
  const [storeName, setStoreName] = useState<string>(selectedStoreName);

  return (
    <div className="relative ml-auto">
      <Button
        variant="outline"
        onClick={() => setOpen((open) => !open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="whitespace-nowrap"
      >
        매장 선택: {storeName}
        <svg
          className="ml-1"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </Button>

      {open && (
        <RegionSelect
          value={{ store: storeName }}
          onClose={() => setOpen(false)}
          onApply={({ store }) => {
            setStoreName(store);
            const found = stores.find((s) => s.name === store);
            if (found) onChange(found.id);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
