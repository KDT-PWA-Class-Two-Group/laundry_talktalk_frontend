"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MOCK_EMAIL = "KDT123@gmail.com";
const MOCK_PHONE = "010-1234-5678";
const MOCK_PASSWORD = "1234"; // 임시 비밀번호

export default function MyPageEditProfile() {
  const [step, setStep] = useState<"auth" | "edit" | "done">("auth");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // 수정 폼 상태
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [email, setEmail] = useState(MOCK_EMAIL);
  const [phone, setPhone] = useState(MOCK_PHONE);
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 인증 확인
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === MOCK_PASSWORD) {
      setStep("edit");
      setAuthError("");
    } else {
      setAuthError("비밀번호가 올바르지 않습니다.");
    }
  };

  // 정보 저장
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (newPassword && newPassword !== newPasswordCheck) {
      setFormError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    // 실제 저장 로직 대신 상태만 변경
    setStep("done");
    setShowModal(true);
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
        <div className="pt-8 pb-8 pl-8  w-full">
          <h1 className="text-2xl font-bold mb-1">정보 수정</h1>
        </div>

        {/* 2. 화면 중앙에 위치할 폼 부분 */}
        <div className="flex flex-grow ">
          <div className="w-full max-w-xl  p-8">
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
                    />
                  </div>
                  {authError && (
                    <div className="text-red-500 text-xs">{authError}</div>
                  )}
                  <Button
                    onClick={handleAuth}
                    className="bg-[#0069A8] text-white"
                  >
                    확인
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
                    />
                  </div>
                  {formError && (
                    <div className="text-red-500 text-xs">{formError}</div>
                  )}
                  <Button
                    onClick={handleSave}
                    className="bg-[#0069A8] text-white"
                  >
                    저장
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showModal}>
        <DialogContent className="bg-white shadow-xl">
          <DialogHeader>
            <DialogTitle>정보 수정 완료</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-white-500">
              정보 수정이 완료되었습니다.
            </p>
          </div>
          <Button
            onClick={handleModalClose}
            className="bg-[#0069A8] text-white"
          >
            확인
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
