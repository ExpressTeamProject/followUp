import { ReactNode } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { LoadingBox } from '@/components/loading-box';
import { useParams } from 'react-router';
import { strIdSchema } from '@/lib/validations/common';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSelf?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requireSelf, redirectTo }: ProtectedRouteProps) {
  const params = useParams();
  // Only parse the ID parameter if requireSelf is true
  const selfId = requireSelf ? strIdSchema.parse(params.id) : undefined;

  const { isAuthenticated } = useRequireAuth({ requireSelf, selfId, redirectTo });

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <LoadingBox />
      </div>
    );
  }

  return <>{children}</>;
}
