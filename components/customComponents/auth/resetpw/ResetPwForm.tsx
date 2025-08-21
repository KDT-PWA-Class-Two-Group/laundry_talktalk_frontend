"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

export default function ResetPwForm({ token: initialToken }: { token?: string }) {
  const searchParams = useSearchParams();
  const token = initialToken || searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "비밀번호 재설정 실패");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? "비밀번호 재설정 중 오류 발생");
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
      <h1 className="text-3xl font-bold text-center mb-4">PW 재설정</h1>
      <div className="grid gap-2">
        <Label htmlFor="newPassword">새 비밀번호</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Separator />
      <Button type="submit" className="w-full text-lg font-bold" disabled={loading}>
        {loading ? "변경 중..." : "변경하기"}
      </Button>
      {success && (
        <div className="mt-8 text-center text-lg font-bold text-green-600">
          비밀번호가 성공적으로 변경되었습니다.
        </div>
      )}
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </form>
  );
}