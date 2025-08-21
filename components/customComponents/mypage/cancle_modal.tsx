// src/features/mypage/UsageCancelModal.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UsageCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const UsageCancelModal: React.FC<UsageCancelModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white shadow-xl">
        <DialogHeader className="text-center">
          <DialogTitle>예약 취소 확인</DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-gray-700">예약을 정말 취소하시겠습니까?</p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-1/2"
          >
            취소
          </Button>
          <Button
            onClick={onConfirm}
            className="w-1/2 bg-[#74D4FF] hover:bg-[#5BBCE3] text-white"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
