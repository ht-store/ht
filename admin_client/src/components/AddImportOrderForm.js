import React, { useState, useEffect } from "react";
import axios from "axios";

const AddImportOrderForm = ({ onClose, onSubmit }) => {
  const [importOrder, setImportOrder] = useState({
    supplierId: 0,
    importDate: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [skus, setSkus] = useState([]);
  const [importOrderItems, setImportOrderItems] = useState([
    {
      skuId: "",
      quantity: "",
      unitPrice: "",
    },
  ]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:8001/suppliers");
        setSuppliers(response.data.data);
      } catch (error) {
        console.error("Không thể lấy dữ liệu nhà cung cấp:", error);
      }
    };

    const fetchSkus = async () => {
      try {
        const response = await axios.get("http://localhost:8001/products");
        setSkus(response.data.data);
      } catch (error) {
        console.error("Không thể lấy dữ liệu SKU:", error);
      }
    };

    fetchSuppliers();
    fetchSkus();
  }, []);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setImportOrder({
      ...importOrder,
      [name]: name === "supplierId" ? parseInt(value, 10) : value,
    });
  };

  const handleItemChange = (index, name, value) => {
    const newItems = [...importOrderItems];
    newItems[index][name] = value;
    setImportOrderItems(newItems);
  };

  const addOrderItem = () => {
    setImportOrderItems([
      ...importOrderItems,
      {
        skuId: "",
        quantity: "",
        unitPrice: "",
      },
    ]);
  };

  const removeOrderItem = (index) => {
    const newItems = [...importOrderItems];
    newItems.splice(index, 1);
    setImportOrderItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedOrder = {
      ...importOrder,
      importOrderItems: importOrderItems.map((item) => ({
        skuId: parseInt(item.skuId, 10),
        quantity: parseInt(item.quantity, 10),
        unitPrice: parseFloat(item.unitPrice),
      })),
    };

    onSubmit(formattedOrder);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Thêm Đơn Nhập Hàng</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Thông tin chính</h3>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
          <select
            name="supplierId"
            value={importOrder.supplierId}
            onChange={handleOrderChange}
            className="block w-full p-2 border rounded-md"
          >
            <option value="">Chọn nhà cung cấp</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Ngày nhập</label>
          <input
            type="date"
            name="importDate"
            value={importOrder.importDate}
            onChange={handleOrderChange}
            className="block w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
        {importOrderItems.map((item, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md bg-white">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">SKU</label>
              <select
                name="skuId"
                value={item.skuId}
                onChange={(e) =>
                  handleItemChange(index, "skuId", e.target.value)
                }
                className="block w-full p-2 border rounded-md"
              >
                <option value="">Chọn SKU</option>
                {skus.map((sku) => (
                  <option key={sku.skus.id} value={sku.skus.id}>
                    {sku.skus.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Số lượng</label>
              <input
                type="number"
                name="quantity"
                placeholder="Số lượng"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Đơn giá</label>
              <input
                type="number"
                name="unitPrice"
                placeholder="Đơn giá"
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(index, "unitPrice", e.target.value)
                }
                className="block w-full p-2 border rounded-md"
              />
            </div>

            <button
              type="button"
              onClick={() => removeOrderItem(index)}
              className="mt-2 text-red-500"
            >
              Xóa sản phẩm
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOrderItem}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          + Thêm Sản phẩm
        </button>
      </div>

      <button
        type="submit"
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md"
      >
        Thêm Phiếu Nhập
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        Đóng
      </button>
    </form>
  );
};

export default AddImportOrderForm;
