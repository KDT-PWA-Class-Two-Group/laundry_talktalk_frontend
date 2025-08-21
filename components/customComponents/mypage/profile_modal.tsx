"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  open,
  onOpenChange,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle>정보 수정 완료</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">정보 수정이 완료되었습니다.</p>
        </div>
        <Button onClick={onClose} className="bg-[#0069A8] text-white">
          확인
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpdateModal;
