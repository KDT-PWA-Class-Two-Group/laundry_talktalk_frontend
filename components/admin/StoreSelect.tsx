"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RegionSelect from "@/components/admin/RegionSelect";

export default function StoreSelect({
  value,
  onChange,
}: {
  value: string; // storeId
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  // 라벨만 고정하고 내부 상태로 지역 표현 (데모)
  const [region, setRegion] = useState<{ city: string; districts: string[] }>({
    city: "서울",
    districts: ["강남구"],
  });

  return (
    <div className="relative ml-auto">
      <Button
        variant="outline"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="whitespace-nowrap"
      >
        매장 선택: {region.city} {region.districts[0]}
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
          value={region}
          onClose={() => setOpen(false)}
          onApply={(val) => {
            setRegion(val);
            onChange(value); // 데모: 항상 동일 매장 id 유지
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
