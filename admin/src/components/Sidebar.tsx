import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-gray-800 h-full p-4">
      <nav>
        <ul>
          <li
            className={`mb-2 ${
              location.pathname === "/customers" ? "text-blue-500" : ""
            }`}
          >
            <Link to="/customers">Khách hàng</Link>
          </li>
          <li
            className={`mb-2 ${
              location.pathname === "/products" ? "text-blue-500" : ""
            }`}
          >
            <Link to="/products">Sản phẩm</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
