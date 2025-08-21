"use client";

import { ENDPOINTS } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// shadcn/ui 컴포넌트
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "로그인 실패");

      setResult(data);
      // 로그인 성공 시 라우팅 예시 (필요 시 팀장과 협의)
      // router.push("/mypage");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      {/* ID */}
      <div className="grid gap-2">
        <Label htmlFor="loginId">ID</Label>
        <Input
          id="loginId"
          placeholder="아이디"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
      </div>

      {/* PW */}
      <div className="grid gap-2">
        <Label htmlFor="password">PW</Label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* 보조 링크 */}
      <div className="flex justify-center gap-8 text-sm text-muted-foreground">
        <Link href="/auth/find-id" className="hover:underline">
          ID 찾기
        </Link>
        <Link href="/auth/find-password" className="hover:underline">
          PW 찾기
        </Link>
      </div>

      {/* 로그인 버튼 */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>

      <Separator />

      {/* 회원가입 버튼 */}
      <Button variant="outline" asChild className="w-full">
        <Link href="/auth/sign-up">회원가입</Link>
      </Button>

      {/* 에러/결과 */}
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      {result && (
        <pre className="bg-muted p-3 rounde`d text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </form>
  );
}
