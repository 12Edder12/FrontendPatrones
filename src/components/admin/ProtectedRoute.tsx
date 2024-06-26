// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const router = useRouter();

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
