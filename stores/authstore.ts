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
        // document.cookie를 사용하여 accessToken 쿠키를 안전하게 제거
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        set({
          User: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 key
      storage: createJSONStorage(() => localStorage),
      // partialize 옵션을 사용해 필요한 상태만 저장할 수도 있습니다.
      // partialize: (state) => ({ currentUser: state.currentUser, isAuthenticated: state.isAuthenticated }),
    }
  )
);