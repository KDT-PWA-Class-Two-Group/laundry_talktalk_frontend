// src/stores/authStore.ts
import { User } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthStore = {
  User: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setAuthenticated: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      User: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      setAuthenticated: (user: User, accessToken: string, refreshToken: string) =>
        set({
          User: user,
          isAuthenticated: true,
          accessToken,
          refreshToken,
        }),
      logout: () => {
        // document.cookie를 사용하여 accessToken 쿠키를 안전하게 제거
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        set({
          User: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 key
      storage: createJSONStorage(() => localStorage),
      // 중요한 인증 정보만 localStorage에 저장
      partialize: (state) => ({ 
        User: state.User, 
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken 
      }),
    }
  )
);