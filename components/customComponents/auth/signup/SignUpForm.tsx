"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoBack } from "@/lib/router-utils";
import { Undo } from "iconoir-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpForm() {
  const router = useRouter();
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
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const goBack = useGoBack();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // 입력 시 해당 필드 에러 제거
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setFieldErrors({});

    // 클라이언트 사이드 유효성 검사
    const errors: {[key: string]: string} = {};

    if (!form.id.trim()) {
      errors.id = "아이디를 입력해주세요.";
    }

    if (!form.password) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (form.password.length < 4) {
      errors.password = "비밀번호는 최소 4자 이상이어야 합니다.";
    }

    if (!form.passwordConfirm) {
      errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (form.password !== form.passwordConfirm) {
      errors.passwordConfirm = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
    }

    if (!form.email.trim()) {
      errors.email = "이메일을 입력해주세요.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        errors.email = "올바른 이메일 형식이 아닙니다.";
      }
    }

    if (!form.phone.trim()) {
      errors.phone = "전화번호를 입력해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          userId: form.id,
          password: form.password,
          passwordConfirm: form.passwordConfirm,
          email: form.email,
          phone: form.phone,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // 백엔드 에러 응답 처리
        if (res.status === 400) {
          // BadRequestException
          setError(data?.message || "입력값을 확인해주세요.");
        } else if (res.status === 409) {
          // ConflictException - 중복 에러
          if (data?.message?.includes('아이디')) {
            setFieldErrors({ id: data.message });
          } else if (data?.message?.includes('이메일')) {
            setFieldErrors({ email: data.message });
          } else {
            setError(data?.message || "중복된 정보가 있습니다.");
          }
        } else {
          setError(data?.message || "회원가입에 실패했습니다.");
        }
        return;
      }

      // 성공 처리
      setSuccess(true);
      
      // 성공 메시지를 잠시 보여준 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 1000);

    } catch (err: any) {
      console.error("회원가입 오류:", err);
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
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
          <Label htmlFor="id">아이디</Label>
          <Input
            id="id"
            name="id"
            placeholder="아이디 입력"
            value={form.id}
            onChange={handleChange}
            required
            className={`focus:ring-2 focus:ring-sky-400 ${fieldErrors.id ? 'border-red-500' : ''}`}
          />
          {fieldErrors.id && <p className="text-xs text-red-600">{fieldErrors.id}</p>}
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
            className={`focus:ring-2 focus:ring-sky-400 ${fieldErrors.password ? 'border-red-500' : ''}`}
          />
          {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
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
            className={`focus:ring-2 focus:ring-sky-400 ${fieldErrors.passwordConfirm ? 'border-red-500' : ''}`}
          />
          {fieldErrors.passwordConfirm && <p className="text-xs text-red-600">{fieldErrors.passwordConfirm}</p>}
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
            className={`focus:ring-2 focus:ring-sky-400 ${fieldErrors.email ? 'border-red-500' : ''}`}
          />
          {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
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
            className={`focus:ring-2 focus:ring-sky-400 ${fieldErrors.phone ? 'border-red-500' : ''}`}
          />
          {fieldErrors.phone && <p className="text-xs text-red-600">{fieldErrors.phone}</p>}
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
            회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
          </p>
        )}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
      </form>
    </CardContent>
  </Card>

  );
}
