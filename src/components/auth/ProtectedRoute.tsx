// src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/user_store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, checkSession } = useUserStore();

  useEffect(() => {
    if (user) checkSession();
  }, []);

  if (!user) {
    // If no user is logged in, redirect to the /login page
    // 'replace' prevents the user from navigating back to the protected route
    return <Navigate to='/login' replace />;
  }

  // If a user is logged in, render the child component
  return <>{children}</>;
};

export default ProtectedRoute;
