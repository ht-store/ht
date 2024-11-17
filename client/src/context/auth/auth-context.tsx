import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IUser } from '@/lib/interfaces/user';
import { getToken, removeTokens } from '@/lib/utils/auth';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getCurrentUser } from '@/services/auth';

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const publicRoutes = ['/', '/auth/login', '/auth/register'];

interface IAuthContext {
  isLoading?: boolean;
  isAuthenticated?: boolean;
  user?: IUser;
  reset: () => void;
}

export const useAuthProvider = (): IAuthContext => {
  const [user, setUser] = useState<IUser>();
  const isAuthenticatedBefore = !!getToken();
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticatedBefore);

  const { data: userData, isLoading, isSuccess, isError } = useQuery({
    queryKey: [QUERY_KEYS.AUTH.CURRENT_USER],
    queryFn: getCurrentUser,
    enabled: isAuthenticatedBefore
  });

  const reset = () => {
    setUser(undefined);
    removeTokens();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if(isSuccess && userData) {
      setUser(userData.data.data);
      setIsAuthenticated(true);
    }
  }, [isSuccess, isError, userData]);

  return { isAuthenticated, user, reset, isLoading };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a provider');
  }
  return context;
};
