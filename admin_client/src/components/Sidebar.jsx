import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed">
      <ul className="space-y-2 p-4">
        <li>
          <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
            Nhập hàng
          </Link>
        </li>
        <li>
          <Link to="/users" className="block p-2 hover:bg-gray-700 rounded">
            Người dùng
          </Link>
        </li>
        <li>
          <Link to="/products" className="block p-2 hover:bg-gray-700 rounded">
            Sản phẩm
          </Link>
        </li>
        <li>
          <Link to="/orders" className="block p-2 hover:bg-gray-700 rounded">
            Đơn hàng
          </Link>
        </li>
        <li>
          <Link to="/brands" className="block p-2 hover:bg-gray-700 rounded">
            Thương hiệu
          </Link>
        </li>
        <li>
          <Link to="/suppliers" className="block p-2 hover:bg-gray-700 rounded">
            Nhà cung cấp
          </Link>
        </li>
        <li>
          <Link
            to="/warranties"
            className="block p-2 hover:bg-gray-700 rounded"
          >
            Xử lí bảo hành
          </Link>
        </li>
        {/* <li>
          <Link
            to="/statistical"
            className="block p-2 hover:bg-gray-700 rounded"
          >
            Thống kê
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
