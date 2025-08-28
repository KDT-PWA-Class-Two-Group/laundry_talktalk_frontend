'use client';
import { useRouter } from "next/navigation";

export function useRouterUtils() {
  const router = useRouter();
  
  const goBack = () => {
    router.back();
  };
  
  const refresh = () => {
    router.refresh();
  };
  
  return { goBack, refresh };
}