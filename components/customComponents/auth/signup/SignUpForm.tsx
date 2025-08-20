"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO: 회원가입 API 연동
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <div className="mt-12 mb-2" />
      <h1 className="text-3xl font-bold text-center mb-4">회원가입</h1>

      {/* ID */}
      <div className="grid gap-2">
        <Label htmlFor="id">ID</Label>
        <div className="relative">
          <Input
            id="id"
            name="id"
            placeholder="아이디"
            value={form.id}
            onChange={handleChange}
            required
            className="pr-28"
          />
          <Button type="button" variant="outline" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs">중복확인</Button>
        </div>
      </div>

      {/* PW */}
      <div className="grid gap-2">
        <Label htmlFor="password">PW</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* PW 확인 */}
      <div className="grid gap-2">
        <Label htmlFor="passwordConfirm">PW확인</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          placeholder="비밀번호 확인"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
        />
      </div>

      {/* 이메일 */}
      <div className="grid gap-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* 전화번호 */}
      <div className="grid gap-2">
        <Label htmlFor="phone">전화번호</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="전화번호"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <Separator />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "가입 중..." : "제출"}
      </Button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </form>
  );
}
