"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Course, AddOn, Category, Target } from "@/types/admin";
import AddOptionModal from "./Options/AddOptionModal";
import OptionRow from "./Options/OptionRow";

// 숫자 포맷 함수
const formatPrice = (price: number) =>
  new Intl.NumberFormat("ko-KR").format(price);
// 고유 id 생성 함수
const generateUniqueId = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
// 클래스명 합치기
const classNames = (...args: (string | false | undefined)[]) =>
  args.filter(Boolean).join(" ");

export default function OptionsManagementPanel() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: generateUniqueId("c"),
      name: "표준 세탁(60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
    {
      id: generateUniqueId("c"),
      name: "이불 세탁(60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
    {
      id: generateUniqueId("c"),
      name: "이불 건조 (60분)",
      durationMin: 60,
      price: 5000,
      appliesTo: "세탁기",
    },
  ]);
  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: generateUniqueId("a"),
      name: "헹굼 추가(10분)",
      price: 1000,
      appliesTo: "세탁기",
    },
    {
      id: generateUniqueId("a"),
      name: "건조 10분 추가(10분)",
      price: 5000,
      appliesTo: "건조기",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">옵션 관리</h1>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" /> 옵션 추가
        </Button>
      </div>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">코스</h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <OptionRow
              key={course.id}
              item={course}
              onDelete={() =>
                setCourses((prevCourses) =>
                  prevCourses.filter((prevCourse) => prevCourse.id !== course.id)
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">옵션</h2>
        <div className="space-y-4">
          {addOns.map((addOn) => (
            <OptionRow
              key={addOn.id}
              item={addOn}
              onDelete={() =>
                setAddOns((prevAddOns) =>
                  prevAddOns.filter((prevAddOn) => prevAddOn.id !== addOn.id)
                )
              }
            />
          ))}
        </div>
      </section>

      <AddOptionModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={({ courses: newCourses, addOns: newAddOns }) => {
          if (newCourses.length)
            setCourses((prevCourses) => [...prevCourses, ...newCourses]);
          if (newAddOns.length)
            setAddOns((prevAddOns) => [...prevAddOns, ...newAddOns]);
        }}
      />
    </div>
  );
}
