import { useRouter } from "next/navigation";

// Custom hook for router navigation
export function useGoBack() {
  const router = useRouter();
  
  const goBack = () => {
    router.back();
  };
  
  return goBack;
}