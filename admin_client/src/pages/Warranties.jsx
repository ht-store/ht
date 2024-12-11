import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import DynamicAddForm from "../components/DynamicAddForm";
import axios from "axios";

import { MenuItem, Select, FormControl, Box, Button } from "@mui/material";
import DynamicDetailForm from "../components/DynamicDetailForm";
const Warranties = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claims, setClaim] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statusColors = {
    "Đang chờ xử lý": "#FFA500", // Orange
    "Đang xử lý": "#1E90FF", // Dodger Blue
    "Được xác nhận": "#87CEEB", // Sky Blue
    "Đang sửa chữa": "#FFD700", // Gold
    "Đã giao hàng": "#2ECC71", // Emerald Green
    "Đã hủy": "#E74C3C", // Crimson Red
    "Trả lại": "#9400D3", // Violet
  };

  // Define the order of statuses (lower value is lower in the hierarchy)
  const statusClaim = [
    "Đang chờ xử lý", // 0
    "Đang xử lý", // 1
    "Được xác nhận", // 2
    "Đang sửa chữa", // 3
    "Đã giao hàng", // 4
    "Đã hủy", // 5
    "Trả lại", // 6
  ];
  const StatusDot = ({ status }) => (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        marginRight: "8px",
      }}
    >
      <Box
        sx={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: statusColors[status] || "#808080",
          marginRight: "6px",
        }}
      />
      {status}
    </Box>
  );
  // Function to get the index of the current status in the statusOrder
  const getStatusLevel = (status) => {
    return statusClaim.indexOf(status);
  };
  const handleStatusChange = async (claimId, newStatus) => {
    try {
      await axios.put(`http://localhost:8001/warranties/claim/status`, {
        claimId,
        status: newStatus,
      });
      setClaim((Pre) =>
        Pre.map((claim) =>
          claim.id === claimId ? { ...claim, claimStatus: newStatus } : claim
        )
      );
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update order status");
    }
  };
  const columns = [
    { name: "id", label: "Id" },
    { name: "claimDate", label: "Ngày tạo" },
    { name: "claimStatus", label: "Trạng thái" },
  ];
  const updatedColumns = columns.map((column) => {
    if (column.name === "claimStatus") {
      return {
        ...column,
        options: {
          ...column.options,
          customBodyRender: (value, tableMeta) => {
            const rowIndex = tableMeta.rowIndex;
            const claimId = claims[rowIndex]?.id;
            const currentStatus = Object.keys(statusColors).includes(value)
              ? value
              : "Đang chờ xử lý";

            return (
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(claimId, e.target.value)}
                  renderValue={(selected) => <StatusDot status={selected} />}
                  sx={{
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {statusClaim.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      disabled={
                        getStatusLevel(currentStatus) >= getStatusLevel(status)
                      }
                    >
                      <StatusDot status={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          },
        },
      };
    }
    return column;
  });
  const columnsWithDetails = [
    ...updatedColumns,
    {
      name: "action",
      label: "Khác",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const claimId = claims[rowIndex]?.id;

          return (
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={() => handleViewDetails(claimId)}
              >
                Xem chi tiết
              </button>
            </div>
          );
        },
      },
    },
  ];
  const handleViewDetails = async (id) => {
    console.log(1);
    const claim = claims.find((Claim) => Claim.id === id);
    try {
      const response = await axios.get(
        `http://localhost:8001/warranties//claim/cost/${id}`
      );
      console.log(response.data);
      const claimDetail = {
        ...response.data[0],
        issueDescription: claim.issueDescription,
      };
      setSelectedClaim(claimDetail);
    } catch (error) {
      console.error("Failed to add claim:", error);
      setError("Failed to add claim");
    } finally {
      setOpen(true);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/warranties/claims"
        );
        const formattedClaims = response.data.map((claim) => ({
          ...claim,
          claimDate: formatDate(claim.claimDate),
        }));
        console.log(formattedClaims);
        setClaim(formattedClaims);
      } catch (err) {
        setError("Failed to fetch Claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleAddClaim = async (formData) => {
    console.log(formData);
    const updatedData = {
      ...formData,
      repairCost: parseFloat(formData.repairCost),
      partsCost: parseFloat(formData.partsCost),
      shippingCost: parseFloat(formData.shippingCost),
    };
    try {
      const response = await axios.post(
        "http://localhost:8001/warranties/claim",
        updatedData
      );
      setClaim((prevClaims) => [...prevClaims, response.data.data]);
    } catch (error) {
      console.error("Failed to add claim:", error);
      setError("Failed to add claim");
    } finally {
      setOpenAddModal(false);
    }
  };

  const handleDelete = async (rowsDeleted) => {
    const indexes = rowsDeleted.data.map((d) => d.dataIndex);
    const idsToDelete = indexes.map((index) => claims[index].id);
    try {
      await axios.delete(
        `http://localhost:8001/warranties/claim/${idsToDelete[0]}`
      );
      const updatedClaims = claims.filter(
        (_, index) => !indexes.includes(index)
      );
      setClaim(updatedClaims);
    } catch (error) {
      console.error("Failed to delete claims:", error);
      setError("Failed to delete claims");
    }
  };
  const handleOpenUpdateStatus = (id, currentStatus) => {
    if (["completed", "reject"].includes(currentStatus)) {
      alert("Cannot update status once it's completed or rejected.");
      return;
    }

    const claim = claims.find((Claim) => Claim.id === id);
    setSelectedClaim(claim);
    setOpenUpdateStatusModal(true);
  };

  const handleUpdateStatusSubmit = async (updatedData) => {
    console.log(updatedData);
    try {
      const response = await axios.put(
        `http://localhost:8001/warranties/claim/status`,
        updatedData
      );
      setClaim((prevClaims) =>
        prevClaims.map((claim) =>
          claim.id === selectedClaim.id
            ? { ...claim, claimStatus: updatedData.status }
            : claim
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status.");
    } finally {
      setOpenUpdateStatusModal(false);
      setSelectedClaim(null);
    }
  };

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
        <h1 className="text-2xl">Quản lí xử lí bảo hành</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-plus-circle mr-2"></i> Thêm đơn xử lí bảo hành
        </button>
      </div>

      {loading && <p>Loading Claims...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Danh sách đơn xử lý bảo hành"
          columns={columnsWithDetails}
          data={claims || []}
          options={options}
        />
      )}

      {openAddModal && (
        <DynamicAddForm
          formType="claim"
          onSubmit={handleAddClaim}
          onClose={() => setOpenAddModal(false)}
        />
      )}
      {open && selectedClaim && (
        <DynamicDetailForm
          formType="claim"
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedClaim(null);
          }}
          data={selectedClaim}
        />
      )}
    </div>
  );
};

export default Warranties;
