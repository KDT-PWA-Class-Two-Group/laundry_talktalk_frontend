"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoBack } from "@/lib/router-utils";
import { Undo } from "iconoir-react";
import Link from "next/link";
import { useState } from "react";

export default function FindIdForm() {
  const [form, setForm] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [foundId, setFoundId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const goBack = useGoBack();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFoundId(null);

    try {
      const res = await fetch("/api/auth/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "아이디 찾기 실패");

      const idFromData =
        data?.data?.login_id ??
        data?.data?.id ??
        data?.login_id ??
        data?.id ??
        null;

      if (!idFromData) throw new Error("조회 결과에 ID가 없습니다.");
      setFoundId(String(idFromData));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "아이디 찾기 중 오류 발생";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-4 shadow-lg rounded-2xl border border-sky-100 bg-white">
      <CardContent>
      <div className="flex justify-end w-full">
        <Undo
          width={24}
          height={24}
          className="text-gray-600 cursor-pointer hover:text-gray-800"
          onClick={goBack}
        />
      </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-6">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              placeholder="이메일 입력"
              value={form.email}
              onChange={handleChange}
              required
              className="focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="전화번호 입력"
              value={form.phone}
              onChange={handleChange}
              required
              className="focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "찾는 중..." : "아이디 찾기"}
          </Button>

          <Separator />

          {foundId && (
            <p className="text-center text-sky-600 font-semibold">
              고객님의 ID는 <span className="underline">{foundId}</span> 입니다.
            </p>
          )}
          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          {foundId && (
            <Button
              asChild
              variant="outline"
              className="w-full border-sky-300 text-sky-600 hover:bg-sky-50 mt-3"
            >
              <Link href="/auth/sign-in">로그인</Link>
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
