import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import ProductDetailModal from "../components/ProductDetailModal";
import AddProductForm from "../components/AddProductForm";
import axios from "axios";
import UpdateProductForm from "../components/UpdateProductForm";
import AddWarrantyForm from "../components/AddWarrantyForm";
const Products = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openWarrantyModal, setOpenWarrantyModal] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8001/products");
        const skus = response.data.data.map((item) => ({
          ...item.skus,
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

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const fetchProductDetails = async (productId, skuId) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/products/details/${productId}/${skuId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  };

  const handleUpdateProduct = async (id) => {
    const product = products.find((product) => product.id === id);

    const data = await fetchProductDetails(product.productId, product.id);
    console.log(data);
    // setSelectedProduct(data.product);
    // setOpenUpdateModal(true);
  };
  const handleAddWarranty = (id) => {
    const product = products.find((product) => product.id === id);
    setSelectedProduct(product);
    setOpenWarrantyModal(true);
  };
  const handleUpdateSubmit = async (updatedData) => {
    const data = { name: updatedData.name };
    try {
      const response = await axios.patch(
        `http://localhost:8001/products/${selectedProduct.id}`,
        data
      );
      setProduct((prevProducts) =>
        prevProducts.map((Product) =>
          Product.id === selectedProduct.id
            ? { ...Product, ...updatedData }
            : Product
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
  const handleViewDetails = async (productId, skusId) => {
    console.log(productId, skusId);
    console.log(5);
    try {
      const response = await axios.get(
        `http://localhost:8001/products/${productId}`
      );
      console.log(response.data);
      const data = {
        ...response.data.data,
      };
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
      const result = await axios.get(
        `http://localhost:8001/warranties/warranty/${id}`
      );
      await axios.delete(
        `http://localhost:8001/warranties/warranty/${result.data.id}`
      );
    } catch (err) {
      setError("Failed to fetch Products");
    }
  };
  const handleUpdateWarranty = async (id) => {
    try {
      const result = await axios.get(
        `http://localhost:8001/warranties/warranty/${id}`
      );
      console.log(result.data.id);
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
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDetails(data.productId, data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Xem chi tiết
              </button>
              <button
                onClick={() => handleUpdateProduct(data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Cập nhật
              </button>
              <button
                onClick={() => handleAddWarranty(data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Tạo bảo hành
              </button>
              <button
                onClick={() => handleUpdateWarranty(data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Cập nhật bảo hành
              </button>
              <button
                onClick={() => handleDeleteWarranty(data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
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
        <ProductDetailModal
          open={openModal}
          onClose={handleCloseModal}
          product={selectedProduct}
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
          initialData={selectedProduct}
          onSubmit={handleUpdateSubmit}
          onClose={() => {
            setOpenUpdateModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
      {openWarrantyModal && selectedProduct && (
        <AddWarrantyForm
          product={selectedProduct}
          onClose={() => setOpenWarrantyModal(false)}
          onSubmit={handleWarrantySubmit}
        />
      )}
    </div>
  );
};

export default Products;
