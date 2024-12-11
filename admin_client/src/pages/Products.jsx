import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import DynamicDetailForm from "../components/DynamicDetailForm";
import AddProductForm from "../components/AddProductForm";
import axios from "axios";
import UpdateProductForm from "../components/UpdateProductForm";
import DynamicAddForm from "../components/DynamicAddForm";
import DynamicUpdateForm from "../components/DynamicUpdateForm";
const Products = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openWarrantyModal, setOpenWarrantyModal] = useState(false);
  const [openWarrantyUpdateModal, setOpenWarrantyUpdateModal] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8001/products");
        const skus = response.data.data.map((item) => ({
          ...item.skus,
          warranties: item.warranties,
          details: item.products,
        }));
        setProduct(skus);
      } catch (err) {
        setError("Failed to fetch Products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdateProduct = async (productId, skuId) => {
    const product = products.find((product) => product.id === skuId);
    setSelectedProduct(product);
    setOpenUpdateModal(true);
  };
  const handleAddWarranty = (id) => {
    console.log(products);
    const product = products.find((product) => product.id === id);
    setSelectedProduct(product);
    setOpenWarrantyModal(true);
  };
  const handleUpdateSubmit = async (updatedData, productId, skuId) => {
    try {
      const response = await axios.put(
        `http://localhost:8001/products/${productId}/skus/${skuId}`,
        updatedData
      );
      setProduct((prevProducts) =>
        prevProducts.map((Product) =>
          Product.id === skuId ? { ...Product, ...updatedData } : Product
        )
      );
    } catch (error) {
      console.error("Failed to update Product:", error);
      setError("Failed to update Product");
    } finally {
      setOpenUpdateModal(false);
      setSelectedProduct(null);
    }
  };
  const handleWarrantySubmit = async (warranty) => {
    const data = { ...warranty, skuId: selectedProduct.id };
    console.log(data);
    try {
      const response = await axios.post(
        `http://localhost:8001/warranties/warranty`,
        data
      );
    } catch (error) {
      console.error("Failed to create warranty:", error);
      setError("Failed to create warranty");
    } finally {
      setOpenWarrantyModal(false);
      setSelectedProduct(null);
    }
  };
  const handleViewDetails = async (productId, skuId) => {
    const product = products.find((product) => product.id === skuId);
    try {
      const response = await axios.get(
        `http://localhost:8001/products/${productId}`
      );
      console.log(response.data);
      const data = {
        ...product.warranties,
        ...response.data.data,
      };
      console.log(data);
      setSelectedProduct(data);
    } catch (err) {
      setError("Failed to fetch Products");
    }
    setOpenModal(true);
  };
  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleAddProduct = async (formData) => {
    const data = {
      ...formData,
      product: { ...formData.product, categoryId: 1, image: "" },
    };
    console.log(data);
    try {
      const response = await axios.post("http://localhost:8001/products", data);
    } catch (error) {
      console.error("Failed to add user:", error);
      setError("Failed to add user");
    } finally {
      setOpenAddModal(false);
    }
  };

  const handleDelete = async (rowsDeleted) => {
    const indexes = rowsDeleted.data.map((d) => d.dataIndex);
    const idsToDelete = indexes.map((index) => products[index].id);
    console.log(idsToDelete);
    try {
      await axios.delete(
        `http://localhost:8001/products/sku/${idsToDelete[0]}`
      );
      const updatedProducts = Products.filter(
        (_, index) => !indexes.includes(index)
      );
      setProduct(updatedProducts);
    } catch (error) {
      console.error("Failed to delete Products:", error);
      setError("Failed to delete Products");
    }
  };
  const handleDeleteWarranty = async (id) => {
    try {
      await axios.delete(`http://localhost:8001/warranties/warranty/${id}`);
    } catch (err) {
      setError("Failed to fetch Products");
    }
  };
  const handleUpdateWarranty = async (id) => {
    const product = products.find((product) => product.warranties.id === id);
    setSelectedWarranty(product.warranties);
    setOpenWarrantyUpdateModal(true);
  };
  const handleWarrantyUpdateSubmit = async (data) => {
    console.log(data);
    const formattedData = {
      warrantyId: data.id,
      warrantyConditions: data.warrantyConditions,
    };
    try {
      await axios.put(
        `http://localhost:8001/warranties/warranty/conditions`,
        formattedData
      );
      setSelectedWarranty(null);
      setOpenWarrantyUpdateModal(false);
    } catch (err) {
      setError("Failed to fetch Products");
    }
  };

  const columns = [
    { name: "id", label: "Id" },
    { name: "name", label: "Tên" },
    {
      name: "image",
      label: "Ảnh",
      options: {
        customBodyRender: (value) => (
          <img
            src={value}
            alt="A thumbnail of the product"
            className="w-20 h-20 rounded-md object-cover"
          />
        ),
      },
    },
    {
      name: "actions",
      label: "Khác",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const data = products[tableMeta.rowIndex];

          const hasWarranty =
            data.warranties && Object.keys(data.warranties).length > 0;

          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDetails(data.productId, data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Xem chi tiết
              </button>
              <button
                onClick={() => handleUpdateProduct(data.productId, data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Cập nhật
              </button>
              <button
                onClick={() => handleAddWarranty(data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md "
                disabled={hasWarranty}
              >
                Tạo bảo hành
              </button>
              <button
                onClick={() => handleUpdateWarranty(data.warranties.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md "
                disabled={!hasWarranty}
              >
                Cập nhật bảo hành
              </button>
              <button
                onClick={() => handleDeleteWarranty(data.warranties.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md "
                disabled={!hasWarranty}
              >
                Xóa bảo hành
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: "single",
    responsive: "standard",
    download: true,
    print: true,
    pagination: true,
    onRowsDelete: handleDelete,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Quản lí sản phẩm</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-plus-circle mr-2"></i> Thêm sản phẩm
        </button>
      </div>

      {loading && <p>Loading Products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Danh sách sản phẩm"
          columns={columns}
          data={products || []}
          options={options}
        />
      )}
      {selectedProduct && (
        <DynamicDetailForm
          formType="product"
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          data={selectedProduct}
        />
      )}
      {openAddModal && (
        <AddProductForm
          onSubmit={handleAddProduct}
          onClose={() => setOpenAddModal(false)}
        />
      )}
      {openUpdateModal && selectedProduct && (
        <UpdateProductForm
          initialProduct={selectedProduct}
          onSubmit={handleUpdateSubmit}
          onClose={() => {
            setOpenUpdateModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
      {openWarrantyModal && selectedProduct && (
        <DynamicAddForm
          formType="warranty"
          onClose={() => setOpenWarrantyModal(false)}
          onSubmit={handleWarrantySubmit}
        />
      )}
      {openWarrantyUpdateModal && selectedWarranty && (
        <DynamicUpdateForm
          formType="warranty"
          onClose={() => setOpenWarrantyUpdateModal(false)}
          onSubmit={handleWarrantyUpdateSubmit}
          initialData={selectedWarranty}
        />
      )}
    </div>
  );
};

export default Products;
