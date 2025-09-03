"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/authstore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const { setAuthenticated } = useAuthStore();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setFieldErrors({});

    // 클라이언트 사이드 유효성 검사
    const errors: {[key: string]: string} = {};

    if (!loginId.trim()) {
      errors.loginId = "아이디를 입력해주세요.";
    }

    if (!password) {
      errors.password = "비밀번호를 입력해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: loginId, password }),
      });

      const data = await res.json();
      console.log("로그인 응답:", data); // 디버깅용
      
      if (!res.ok) {
        // 백엔드 에러 응답 처리
        if (res.status === 401) {
          // 인증 실패
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else if (res.status === 400) {
          // BadRequestException
          setError(data?.message || "입력값을 확인해주세요.");
        } else {
          setError(data?.message || "로그인에 실패했습니다.");
        }
        return;
      }

      // 로그인 성공 - 백엔드 응답 구조 처리
      const userId = data.userId;
      const email = data.email;

      console.log("백엔드 응답 데이터:", { userId, email, message: data.message }); // 디버깅용

      if (userId && email) {
        // User 인터페이스에 맞게 사용자 정보 생성
        const user = {
          user_id: userId,
          email: email
        };

        console.log("사용자 정보:", user); // 디버깅용

        // authStore에 사용자 정보만 저장 (토큰은 HttpOnly 쿠키에서 관리)
        setAuthenticated(user);

        console.log("로그인 성공! 홈으로 이동합니다."); // 디버깅용
        // 홈페이지로 이동
        router.push("/");
      } else {
        console.error("사용자 정보 누락:", { userId, email }); // 디버깅용
        setError("로그인 응답 데이터가 올바르지 않습니다.");
      }

    } catch (err: unknown) {
      console.error("로그인 오류:", err);
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
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
              className={`focus:ring-2 focus:ring-sky-400 ${fieldErrors.loginId ? 'border-red-500' : ''}`}
            />
            {fieldErrors.loginId && <p className="text-xs text-red-600">{fieldErrors.loginId}</p>}
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
              className={`focus:ring-2 focus:ring-sky-400 ${fieldErrors.password ? 'border-red-500' : ''}`}
            />
            {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
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

          {/* 에러 */}
          {error && (
            <p className="text-center text-sm text-red-600 mt-2">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
