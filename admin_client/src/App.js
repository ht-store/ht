import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Brands from "./pages/Brands";
import Suppliers from "./pages/Suppliers";
import Warranties from "./pages/Warranties";
import Statistical from "./pages/Statistical";
function App() {
  return (
    <Router>
      <div className="flex ">
        <Sidebar />
        <div className="ml-64 p-6 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/warranties" element={<Warranties />} />
            <Route path="/statistical" element={<Statistical />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
