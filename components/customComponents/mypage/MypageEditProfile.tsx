// src/app/mypage/edit-profile/page.tsx
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ProfileUpdateModal from "./profile_modal"; // 새로 분리한 모달 컴포넌트를 불러옵니다.

// 가정된 API 엔드포인트
const API_URLS = {
  AUTH: "/api/mypage/auth",
  UPDATE: "/api//mypage/profile",
};

// 기존 목 데이터를 유지 (API가 작동하지 않을 경우 대비)
const MOCK_EMAIL = "KDT123@gmail.com";
const MOCK_PHONE = "010-1234-5678";
//const MOCK_PASSWORD = "1234"; // 임시 비밀번호

export default function MyPageEditProfile() {
  const [step, setStep] = useState<"auth" | "edit" | "done">("auth");

  // 인증 단계 상태
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // 수정 단계 상태
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [email, setEmail] = useState(MOCK_EMAIL);
  const [phone, setPhone] = useState(MOCK_PHONE);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 인증 확인 (fetch로 변경)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    try {
      // API 호출을 통해 비밀번호를 검증합니다.
      const response = await fetch(API_URLS.AUTH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // 인증 성공 시
        setStep("edit");
      } else {
        // 인증 실패 시
        const errorData = await response.json();
        setAuthError(errorData.message || "비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("인증 실패:", error);
      setAuthError("네트워크 오류 또는 서버에 연결할 수 없습니다.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 정보 저장 (fetch로 변경)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // 클라이언트 측 유효성 검사
    if (newPassword && newPassword !== newPasswordCheck) {
      setFormError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSaving(true);

    try {
      // API 호출을 통해 프로필 정보를 업데이트합니다.
      const response = await fetch(API_URLS.UPDATE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword,
          email,
          phone,
        }),
      });

      if (response.ok) {
        // 업데이트 성공 시
        console.log("프로필 업데이트 성공");
        setStep("done");
        setShowModal(true);
      } else {
        // 업데이트 실패 시
        const errorData = await response.json();
        setFormError(errorData.message || "정보 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("정보 저장 실패:", error);
      setFormError("네트워크 오류 또는 서버에 연결할 수 없습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 모달 닫기: 정보수정 폼으로 바로 복귀
  const handleModalClose = () => {
    setShowModal(false);
    setNewPassword("");
    setNewPasswordCheck("");
    setPassword("");
    setAuthError("");
    setFormError("");
    setStep("edit"); // 정보수정 폼으로 복귀
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* 1. 상단에 위치할 '정보 수정' 제목 부분 */}
        <div className="pt-8 pb-8 pl-8 w-full">
          <h1 className="text-2xl font-bold mb-1">정보 수정</h1>
        </div>

        {/* 2. 화면 중앙에 위치할 폼 부분 */}
        <div className="flex flex-grow justify-center items-start">
          <div className="w-full max-w-xl p-8">
            <div className="flex flex-col gap-4">
              {step === "auth" && (
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="auth-password">비밀번호 입력</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      disabled={isAuthenticating}
                    />
                  </div>
                  {authError && (
                    <div className="text-red-500 text-xs">{authError}</div>
                  )}
                  <Button
                    onClick={handleAuth}
                    disabled={isAuthenticating}
                    className="bg-[#0069A8] text-white"
                  >
                    {isAuthenticating ? "확인 중..." : "확인"}
                  </Button>
                </div>
              )}

              {step === "edit" && (
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">새 비밀번호</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호를 입력하세요"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password-check">새 비밀번호 확인</Label>
                    <Input
                      id="new-password-check"
                      type="password"
                      value={newPasswordCheck}
                      onChange={(e) => setNewPasswordCheck(e.target.value)}
                      placeholder="새 비밀번호를 다시 입력하세요"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="전화번호를 입력하세요"
                      disabled={isSaving}
                    />
                  </div>
                  {formError && (
                    <div className="text-red-500 text-xs">{formError}</div>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#0069A8] text-white"
                  >
                    {isSaving ? "저장 중..." : "저장"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 분리된 모달 컴포넌트를 사용합니다. */}
      <ProfileUpdateModal
        open={showModal}
        onOpenChange={setShowModal}
        onClose={handleModalClose}
      />
    </>
  );
}
