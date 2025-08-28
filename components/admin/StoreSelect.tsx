"use client";

import { useState } from "react";
import { StoreSelectProps } from "@/types/admin";
import { Button } from "@/components/ui/button";
import RegionSelect from "@/components/admin/RegionSelect";

export default function StoreSelect({
  value,
  stores,
  onChange,
}: StoreSelectProps) {
  const [open, setOpen] = useState(false);

  // 매장 목록에서 첫 번째 매장 기준으로 지역 정보 추출
  const [region, setRegion] = useState<{ city: string; districts: string[] }>(
    () => {
      const address = stores[0]?.address || "";
      const [city = "", district = ""] = address.split(" ");
      return { city, districts: [district] };
    }
  );

  return (
    <div className="relative ml-auto">
      <Button
        variant="outline"
        onClick={() => setOpen(open => !open)}
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
          onApply={(newRegion) => {
            setRegion(newRegion);
            onChange(value); // 데모: 항상 동일 매장 id 유지
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
