import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";

import AddBrandForm from "../components/AddBrandForm";
import axios from "axios";
import UpdateBrandForm from "../components/UpdateBrandForm";
const Brands = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8001/brands");
        setBrand(response.data.data);
      } catch (err) {
        setError("Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBrand(null);
  };

  const handleUpdateBrand = (id) => {
    const brand = brands.find((brand) => brand.id === id);
    setSelectedBrand(brand);
    setOpenUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    const data = { name: updatedData.name };
    try {
      const response = await axios.patch(
        `http://localhost:8001/brands/${selectedBrand.id}`,
        data
      );
      setBrand((prevBrands) =>
        prevBrands.map((brand) =>
          brand.id === selectedBrand.id ? { ...brand, ...updatedData } : brand
        )
      );
    } catch (error) {
      console.error("Failed to update brand:", error);
      setError("Failed to update brand");
    } finally {
      setOpenUpdateModal(false);
      setSelectedBrand(null);
    }
  };

  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleAddBrand = async (formData) => {
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8001/brands",
        formData
      );
      setBrand((prevBrands) => [...prevBrands, response.data.data]);
    } catch (error) {
      console.error("Failed to add user:", error);
      setError("Failed to add user");
    } finally {
      setOpenAddModal(false);
    }
  };

  const handleDelete = async (rowsDeleted) => {
    const indexes = rowsDeleted.data.map((d) => d.dataIndex);
    const idsToDelete = indexes.map((index) => brands[index].id);
    try {
      await axios.delete(`http://localhost:8001/brands/${idsToDelete[0]}`);
      const updatedBrands = brands.filter(
        (_, index) => !indexes.includes(index)
      );
      setBrand(updatedBrands);
    } catch (error) {
      console.error("Failed to delete brands:", error);
      setError("Failed to delete brands");
    }
  };

  const columns = [
    { name: "id", label: "Id" },
    { name: "name", label: "Tên thương hiệu" },

    {
      name: "actions",
      label: "Khác",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const id = tableMeta.rowData[0];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateBrand(id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Cập nhật
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
        <h1 className="text-2xl">Quản lí thương hiệu</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-plus-circle mr-2"></i> Thêm thương hiệu
        </button>
      </div>

      {loading && <p>Loading brands...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Danh sách thương hiệu"
          columns={columns}
          data={brands || []}
          options={options}
        />
      )}
      {openAddModal && (
        <AddBrandForm
          onSubmit={handleAddBrand}
          onClose={() => setOpenAddModal(false)}
        />
      )}
      {openUpdateModal && selectedBrand && (
        <UpdateBrandForm
          initialData={selectedBrand}
          onSubmit={handleUpdateSubmit}
          onClose={() => {
            setOpenUpdateModal(false);
            setSelectedBrand(null);
          }}
        />
      )}
    </div>
  );
};

export default Brands;
