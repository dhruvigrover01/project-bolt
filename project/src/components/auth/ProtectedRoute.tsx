import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

// In demo mode, always allow access - no authentication required
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
