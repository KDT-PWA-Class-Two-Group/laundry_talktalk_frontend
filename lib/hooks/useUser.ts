'use client';

import { verifyUserClient, type VerifiedUser } from '@/lib/verifyUser';
import { useEffect, useState } from 'react';

/**
 * 클라이언트 컴포넌트에서 사용자 인증 상태를 관리하는 React Hook
 */
export function useUser() {
  const [user, setUser] = useState<VerifiedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const userData = await verifyUserClient();
    setUser(userData);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { 
    user, 
    loading, 
    refetch: fetchUser,
    isAuthenticated: user?.isAuthenticated || false,
    userId: user?.user_id || null,
    email: user?.email || null,
  };
}
