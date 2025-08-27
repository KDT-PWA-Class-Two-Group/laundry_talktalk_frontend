"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

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
        cache: "no-store",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "비밀번호 찾기 실패");

      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "비밀번호 찾기 요청 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg rounded-2xl border border-sky-100 bg-white">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-6">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "발송 중..." : "확인"}
          </Button>

          <Separator />

          {sent && (
            <p className="text-center text-green-600 font-semibold">
              이메일로 비밀번호 재설정 링크가 발송되었습니다.
            </p>
          )}
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
