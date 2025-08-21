"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function FindPwForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

      try {
        const res = await fetch("/api/auth/find-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store", // 🔹 캐시 방지
          body: JSON.stringify({ email }),
        });

        const data = await res.json().catch(() => ({} as any));

        if (!res.ok) {
          throw new Error(data?.message || data?.error || "비밀번호 찾기 실패");
        }

        setSent(true); // 성공 시 알림 표시
      } catch (err: any) {
        setError(err?.message ?? "비밀번호 찾기 요청 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <div className="mt-12 mb-2" />
      <h1 className="text-3xl font-bold text-center mb-4">PW 찾기</h1>
      <div className="grid gap-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Separator />
      <Button type="submit" className="w-full rounded-full py-3 text-lg font-bold" disabled={loading}>
        {loading ? "발송 중..." : "확인"}
      </Button>
      {sent && (
        <div className="mt-8 text-center text-lg font-bold text-green-600">
          이메일로 비밀번호 재설정 링크가 발송되었습니다.
        </div>
      )}
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </form>
  );
}
