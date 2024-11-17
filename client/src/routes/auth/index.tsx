import { lazy } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

const SignInPage = lazy(() => import('../../pages/auth/sign-in'));
const SignUpPage = lazy(() => import('../../pages/auth/sign-up'));

const AuthRoutes = () => {
  const [searchParams] = useSearchParams();
  return (
    <Routes>
      <Route index element={<Navigate to={`login?${searchParams.toString()}`} replace />} />
      <Route path="login" element={<SignInPage />} />
      <Route path="register" element={<SignUpPage />} />
    </Routes>
  );
};

export default AuthRoutes;
