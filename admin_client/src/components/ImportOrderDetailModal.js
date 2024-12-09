import React from "react";

const ImportOrderDetailModal = ({ open, onClose, products }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-1/2">
        <h2 className="text-xl font-bold mb-4">Chi tiết sản phẩm nhập</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">SKU ID</th>
              <th className="border border-gray-300 px-4 py-2">Giá</th>
              <th className="border border-gray-300 px-4 py-2">Số lượng</th>
              <th className="border border-gray-300 px-4 py-2">Tổng giá</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.skuId}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.price}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.totalPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportOrderDetailModal;
