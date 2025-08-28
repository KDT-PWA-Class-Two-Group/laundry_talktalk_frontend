// src/stores/authStore.ts
import { User } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthStore = {
  User: User | null;
  isAuthenticated: boolean;
  setAuthenticated: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      User: null,
      isAuthenticated: false,
      setAuthenticated: (user: User) =>
        set({
          User: user,
          isAuthenticated: true,
        }),
      logout: () => {
        // 백엔드 로그아웃 API 호출하여 HttpOnly 쿠키 삭제
        fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        }).catch(console.error);
        
        set({
          User: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 key
      storage: createJSONStorage(() => localStorage),
      // 사용자 정보와 인증 상태만 localStorage에 저장 (토큰은 HttpOnly 쿠키에서 관리)
      partialize: (state) => ({ 
        User: state.User, 
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);