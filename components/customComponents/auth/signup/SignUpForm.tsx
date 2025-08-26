"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUpForm() {
  const [form, setForm] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          login_id: form.id,
          password: form.password,
          passwordConfirm: form.passwordConfirm,
          email: form.email,
          phone: form.phone,
        }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.message || "회원가입 실패");

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? "회원가입 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Card className="w-full max-w-md mx-4 shadow-lg rounded-2xl border border-sky-100 bg-white">
    <CardContent>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-6">
        <div className="grid gap-2">
          <Label htmlFor="id">아이디</Label>
          <Input
            id="id"
            name="id"
            placeholder="아이디 입력"
            value={form.id}
            onChange={handleChange}
            required
            className="focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호 입력"
            value={form.password}
            onChange={handleChange}
            required
            className="focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
            className="focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
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
          {loading ? "가입 중..." : "회원가입"}
        </Button>

        <Separator />

        {success && (
          <p className="text-center text-sky-600 font-semibold">
            회원가입이 완료되었습니다! 로그인해주세요.
          </p>
        )}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
      </form>
    </CardContent>
  </Card>

  );
}
