import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuthStore from '@/store/useAuthStore';
import { ROUTES } from '@/lib/router/routes';

interface UseRequireAuthOptions {
  requireSelf?: boolean;
  selfId?: string;
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { requireSelf = false, selfId, redirectTo = ROUTES.AUTH.LOGIN } = options;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return;
    }

    if (requireSelf && selfId && user?.id !== selfId) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate, redirectTo, requireSelf, selfId, user?.id]);

  return { isAuthenticated, user };
}
