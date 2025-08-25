"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginForm() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login_id: loginId, password }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        const msg = data?.message || data?.error || "로그인 실패";
        throw new Error(msg);
      }

      setResult(data);
      // router.push("/mypage");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-4 shadow-lg rounded-2xl border border-sky-100 bg-white">
      <CardContent>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 py-6">
          {/* ID */}
          <div className="grid gap-2">
            <Label htmlFor="loginId">아이디</Label>
            <Input
              id="loginId"
              placeholder="아이디 입력"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              className="focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* PW */}
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* 보조 링크 */}
          <div className="flex justify-between text-sm text-sky-600">
            <Link href="/auth/find-id" className="hover:underline">
              아이디 찾기
            </Link>
            <Link href="/auth/find-password" className="hover:underline">
              비밀번호 찾기
            </Link>
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>

          <Separator />

          {/* 회원가입 버튼 */}
          <Button
            variant="outline"
            asChild
            className="w-full border-sky-300 text-sky-600 hover:bg-sky-50"
          >
            <Link href="/auth/sign-up">회원가입</Link>
          </Button>

          {/* 에러/결과 */}
          {error && (
            <p className="text-center text-sm text-red-600 mt-2">{error}</p>
          )}
          {result && (
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto mt-2">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
