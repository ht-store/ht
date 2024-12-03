import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";

import AddSuppliersForm from "../components/AddSuppliersForm";
import axios from "axios";
import UpdateSuppliersForm from "../components/UpdateSuppliersForm";
const Suppliers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplierss = async () => {
      try {
        const response = await axios.get("http://localhost:8001/suppliers");
        setSuppliers(response.data.data);
      } catch (err) {
        setError("Failed to fetch Supplierss");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierss();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSuppliers(null);
  };

  const handleUpdateSuppliers = (id) => {
    const supplierss = suppliers.find((suppliers) => suppliers.id === id);
    setSelectedSuppliers(supplierss);
    setOpenUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    const { createdAt, updatedAt, ...newData } = updatedData;
    console.log(newData);
    try {
      const response = await axios.patch(
        `http://localhost:8001/suppliers/${selectedSuppliers.id}`,
        newData
      );
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((Suppliers) =>
          Suppliers.id === selectedSuppliers.id
            ? { ...Suppliers, ...updatedData }
            : Suppliers
        )
      );
    } catch (error) {
      console.error("Failed to update Suppliers:", error);
      setError("Failed to update Suppliers");
    } finally {
      setOpenUpdateModal(false);
      setSelectedSuppliers(null);
    }
  };

  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleAddSuppliers = async (formData) => {
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8001/suppliers",
        formData
      );
      console.log(response);
      setSuppliers((prevSuppliers) => [...prevSuppliers, response.data.data]);
    } catch (error) {
      console.error("Failed to add user:", error);
      setError("Failed to add user");
    } finally {
      setOpenAddModal(false);
    }
  };

  const handleDelete = async (rowsDeleted) => {
    const indexes = rowsDeleted.data.map((d) => d.dataIndex);
    const idsToDelete = indexes.map((index) => suppliers[index].id);
    try {
      await axios.delete(`http://localhost:8001/suppliers/${idsToDelete[0]}`);
      const updatedSuppliers = suppliers.filter(
        (_, index) => !indexes.includes(index)
      );
      setSuppliers(updatedSuppliers);
    } catch (error) {
      console.error("Failed to delete Supplierss:", error);
      setError("Failed to delete Supplierss");
    }
  };

  const columns = [
    { name: "id", label: "ID" },
    { name: "name", label: "Name" },
    { name: "contactName", label: "contactName" },
    { name: "phoneNumber", label: "phoneNumber" },
    { name: "email", label: "Email" },
    { name: "address", label: "Address" },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const id = tableMeta.rowData[0];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateSuppliers(id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Update
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
        <h1 className="text-2xl">Suppliers Management</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-plus-circle mr-2"></i> Add Suppliers
        </button>
      </div>

      {loading && <p>Loading Supplierss...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Suppliers List"
          columns={columns}
          data={suppliers || []}
          options={options}
        />
      )}
      {openAddModal && (
        <AddSuppliersForm
          onSubmit={handleAddSuppliers}
          onClose={() => setOpenAddModal(false)}
        />
      )}
      {openUpdateModal && selectedSuppliers && (
        <UpdateSuppliersForm
          initialData={selectedSuppliers}
          onSubmit={handleUpdateSubmit}
          onClose={() => {
            setOpenUpdateModal(false);
            setSelectedSuppliers(null);
          }}
        />
      )}
    </div>
  );
};

export default Suppliers;
