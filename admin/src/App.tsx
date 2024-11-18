import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CustomerView from "./pages/CustomerView";
import ImportOrderView from "./pages/ImportOrderView";
import ProductView from "./pages/ProductView";

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <div className="w-2/12 text-white">
        <Sidebar />
      </div>
      {/* Main Content Section */}
      <div className="w-10/12 p-4">
        <Routes>
          <Route path="/customers" element={<CustomerView />} />
          <Route path="/import-orders" element={<ImportOrderView />} />
          <Route path="/products" element={<ProductView />} />
          <Route path="/" element={<Navigate to="/customers" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
