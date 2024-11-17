import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const SuccessPaymentPage = lazy(() => import('../../pages/payment/success'));
const FailedPaymentPage = lazy(() => import('../../pages/payment/failed'));
const HistoryPaymentPage = lazy(() => import('../../pages/payment/history'));

const PaymentRoutes = () => {
  return (
    <Routes>
      <Route path="history" element={<HistoryPaymentPage />} />
      <Route path="success" element={<SuccessPaymentPage />} />
      <Route path="failed" element={<FailedPaymentPage />} />
    </Routes>
  );
};

export default PaymentRoutes;
