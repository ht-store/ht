import LoadingPage from '@/components/shared/loading';
import { useAuth } from '@/context/auth/auth-context';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/auth/login?redirect=${encodeURIComponent(pathname + search)}`, {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, pathname, search]);

  return isLoading || !isAuthenticated ? (
    <LoadingPage />
  ) : (
    <Outlet />
  );
};

export default AuthGuard;
