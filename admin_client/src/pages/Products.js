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
          image:
            "https://cdn-v2.didongviet.vn/files/products/2024/8/10/1/1725964014451_2_iphone_16_pro_sa_mac_didongviet.jpg",
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

  const handleUpdateProduct = (id) => {
    const product = products.find((product) => product.id === id);
    setSelectedProduct(product);
    setOpenUpdateModal(true);
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
  const handleViewDetails = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(`http://localhost:8001/products/${id}`);
      console.log(response.data);
      setSelectedProduct(response.data.data);
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
      product: { ...formData.product, categoryId: 1 },
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

  const columns = [
    { name: "id", label: "ID" },
    { name: "name", label: "Name" },
    {
      name: "image",
      label: "Image",
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
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const data = products[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDetails(data.productId)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View Details
              </button>
              <button
                onClick={() => handleUpdateProduct(data.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => handleAddWarranty(data.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Create warranty
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
        <h1 className="text-2xl">Product Management</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-plus-circle mr-2"></i> Add Product
        </button>
      </div>

      {loading && <p>Loading Products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Product List"
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
