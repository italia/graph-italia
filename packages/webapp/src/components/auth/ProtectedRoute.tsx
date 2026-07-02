// src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore, useAuthGate } from '../../lib/store/user_store';
import AuthLoading from './AuthLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const checkSession = useUserStore((s) => s.checkSession);
  const gate = useAuthGate();

  // Local expiry sweep; cookie hydration/interceptor handle the authoritative case.
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Wait for cookie hydration before deciding — otherwise the first render would
  // redirect a valid (cookie-authenticated) tab to /login before getUser resolves.
  if (gate === 'loading') return <AuthLoading />;

  if (gate === 'anon') {
    // 'replace' prevents navigating back into the protected route.
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
