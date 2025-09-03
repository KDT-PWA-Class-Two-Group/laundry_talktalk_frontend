"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoBack } from "@/lib/router-utils";
import { Undo } from "iconoir-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPwForm({ token: initialToken }: { token?: string }) {
  const searchParams = useSearchParams();
  const token = initialToken || searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const goBack = useGoBack();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "비밀번호 재설정 실패");

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "비밀번호 재설정 중 오류 발생";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
  <Card className="w-full max-w-md mx-4 shadow-lg rounded-2xl border border-sky-100 bg-white">
    <CardContent>
              <div className="flex justify-end w-full">
                <Undo width={24} height={24} className="text-gray-600 cursor-pointer hover:text-gray-800" onClick={goBack} />
              </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-6">
        <div className="grid gap-2">
          <Label htmlFor="newPassword">새 비밀번호</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "변경 중..." : "변경하기"}
        </Button>

        <Separator />

        {success && (
          <p className="text-center text-sky-600 font-semibold">
            비밀번호가 성공적으로 변경되었습니다.
          </p>
        )}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
      </form>
    </CardContent>
  </Card>

  );
}
