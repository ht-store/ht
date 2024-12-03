import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import axios from "axios";
import AddImportOrderForm from "../components/AddImportOrderForm";
import ImportOrderDetailModal from "../components/ImportOrderDetailModal";
const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedImportOrder, setSelectedImportOrder] = useState(null);
  const [importOrders, setImportOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImportOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8001/import-orders");
        console.log(response.data.data);
        setImportOrder(response.data.data);
      } catch (err) {
        setError("Failed to fetch ImportOrders");
      } finally {
        setLoading(false);
      }
    };

    fetchImportOrders();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImportOrder(null);
  };
  const handleViewDetails = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(
        `http://localhost:8001/import-orders/${id}/items`
      );
      console.log(response.data);
      setSelectedImportOrder(response.data.data);
    } catch (err) {
      setError("Failed to fetch ImportOrders");
    }
    setOpenModal(true);
  };
  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleAddImportOrder = async (formData) => {
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8001/import-orders",
        formData
      );
    } catch (error) {
      console.error("Failed to add user:", error);
      setError("Failed to add user");
    } finally {
      setOpenAddModal(false);
    }
  };
  const columns = [
    { name: "id", label: "ID" },
    { name: "supplierId", label: "supplierId" },
    {
      name: "orderDate",
      label: "Order Date",
      options: {
        customBodyRender: (value) => {
          if (!value) return "-";
          const date = new Date(value);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        },
      },
    },
    {
      name: "status",
      label: "status",
    },
    {
      name: "totalAmount",
      label: "totalAmount",
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const data = importOrders[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDetails(data.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: "none",
    responsive: "standard",
    download: true,
    print: true,
    pagination: true,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">ImportOrder Management</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-plus-circle mr-2"></i> Add ImportOrder
        </button>
      </div>

      {loading && <p>Loading ImportOrders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="ImportOrder List"
          columns={columns}
          data={importOrders || []}
          options={options}
        />
      )}
      {selectedImportOrder && (
        <ImportOrderDetailModal
          open={openModal}
          onClose={handleCloseModal}
          products={selectedImportOrder}
        />
      )}
      {openAddModal && (
        <AddImportOrderForm
          onSubmit={handleAddImportOrder}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
