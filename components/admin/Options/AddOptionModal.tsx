"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import { Course, AddOn, Category, Target } from "@/types/admin";

export default function AddOptionModal({
  isModalOpen,
  onClose,
  onSave,
}: {
  isModalOpen: boolean;
  onClose: () => void;
  onSave: (v: { courses: Course[]; addOns: AddOn[] }) => void;
}) {
  const [optionName, setOptionName] = useState("");
  const [category, setCategory] = useState<Category>("코스");
  const [optionPrice, setOptionPrice] = useState<number | "">("");
  const [selectedDevices, setSelectedDevices] = useState<Set<Target>>(new Set());
  useEffect(() => {
    if (isModalOpen) {
      setOptionName("");
      setCategory("코스");
      setOptionPrice("");
      setSelectedDevices(new Set());
    }
  }, [isModalOpen]);
  const toggleDevice = (device: Target) =>
    setSelectedDevices((prevDevices) => {
      const newDevices = new Set(prevDevices);
      newDevices.has(device) ? newDevices.delete(device) : newDevices.add(device);
      return newDevices;
    });

  const generateUniqueId = (prefix = "id") =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  const save = () => {
    const trimmedOptionName = optionName.trim();
    if (!trimmedOptionName) return alert("옵션명을 입력하세요.");
    if (selectedDevices.size === 0) return alert("적용 가능한 기기를 1개 이상 선택하세요.");
    const finalOptionPrice = typeof optionPrice === "number" ? Math.max(0, Math.floor(optionPrice)) : 0;
    const courses: Course[] = [];
    const addOns: AddOn[] = [];
    selectedDevices.forEach((device) => {
      if (category === "코스") {
        courses.push({ id: generateUniqueId("c"), name: trimmedOptionName, price: finalOptionPrice, appliesTo: device });
      } else {
        addOns.push({ id: generateUniqueId("a"), name: trimmedOptionName, price: finalOptionPrice, appliesTo: device });
      }
    });
    onSave({ courses, addOns });
    onClose();
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      title="옵션추가"
      onClose={onClose}
      footer={
        <div className="flex justify-center">
          <Button onClick={save} className="px-8 rounded-full">
            저장
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="text-xl font-semibold">옵션명</div>
          <input
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            placeholder="예) 표준 세탁(60분)"
            value={optionName}
            onChange={(event) => setOptionName(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="text-xl font-semibold">카테고리</div>
          <select
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
          >
            <option value="코스">코스</option>
            <option value="옵션">옵션</option>
          </select>
        </div>
        <div className="grid gap-2">
          <div className="text-xl font-semibold">적용 가능한 기기</div>
          {(["세탁기", "건조기"] as Target[]).map((device) => (
            <label key={device} className="flex items-center gap-2 text-lg">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedDevices.has(device)}
                onChange={() => toggleDevice(device)}
              />
              {device}
            </label>
          ))}
        </div>
        <div className="grid gap-2">
          <div className="text-xl font-semibold">가격 (원)</div>
          <input
            type="number"
            min={0}
            step={100}
            className="h-12 w-full rounded-xl border bg-slate-100 px-3"
            placeholder="예) 5000"
            value={optionPrice}
            onChange={(event) =>
              setOptionPrice(event.target.value === "" ? "" : Number(event.target.value))
            }
          />
        </div>
      </div>
    </Modal>
  );
}
