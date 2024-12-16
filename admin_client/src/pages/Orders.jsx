import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import axios from "axios";
import { toast } from "react-toastify";
import { MenuItem, Select, FormControl, Box, Button } from "@mui/material";
import DynamicDetailForm from "../components/DynamicDetailForm";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Status color mapping
  const statusColors = {
    "Đang chờ xử lý": "#FFA500", // Orange
    "Đang xử lý": "#1E90FF", // Dodger Blue
    "Được xác nhận": "#87CEEB", // Sky Blue
    "Đang vận chuyển": "#FFD700", // Gold
    "Đã giao hàng": "#2ECC71", // Emerald Green
    "Đã hủy": "#E74C3C", // Crimson Red
    "Trả lại": "#9400D3", // Violet
  };

  // Define the order of statuses (lower value is lower in the hierarchy)
  const statusOrder = [
    "Đang chờ xử lý", // 0
    "Đang xử lý", // 1
    "Được xác nhận", // 2
    "Đang vận chuyển", // 3
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
    return statusOrder.indexOf(status);
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8001/orders/all");
        const formattedOrders = response.data.data.map((order) => ({
          ...order,
          orderDate: formatDate(order.orderDate),
        }));
        setOrders(formattedOrders);
      } catch (err) {
        setError("Failed to fetch Orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/orders/${orderId}`
      );
      console.log(response);
      setSelectedOrder(response.data.data); // Set the fetched order data
      setOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpen = (orderId) => {
    fetchOrderDetails(orderId); // Fetch order details from API
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8001/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("Cập nhật thất bại");
    }
  };

  const columns = [
    { name: "id", label: "Id" },
    { name: "totalPrice", label: "Tổng tiền" },
    { name: "orderDate", label: "Ngày đặt hàng" },
    {
      name: "orderStatus",
      label: "Trạng thái",
    },
    { name: "paymentType", label: "Phương thức thanh toán" },
  ];
  const updatedColumns = columns.map((column) => {
    if (column.name === "orderStatus") {
      return {
        ...column,
        options: {
          ...column.options,
          customBodyRender: (value, tableMeta) => {
            const rowIndex = tableMeta.rowIndex;
            const orderId = orders[rowIndex]?.id;
            const currentStatus = Object.keys(statusColors).includes(value)
              ? value
              : "Đang chờ xử lý";

            return (
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(orderId, e.target.value)}
                  renderValue={(selected) => <StatusDot status={selected} />}
                  sx={{
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {statusOrder.map((status) => (
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
  // Add View Details button column
  const columnsWithDetails = [
    ...updatedColumns,
    {
      name: "action",
      label: "Action",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const orderId = orders[rowIndex]?.id;

          return (
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={() => handleOpen(orderId)}
              >
                Xem chi tiết
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
      <div>
        <h1 className="text-2xl">Quản lí đơn hàng</h1>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Danh sách đơn hàng"
          columns={columnsWithDetails}
          data={orders || []}
          options={options}
        />
      )}
      {selectedOrder && (
        <DynamicDetailForm
          formType="order"
          open={open}
          onClose={handleClose}
          data={selectedOrder}
        />
      )}
    </div>
  );
};

export default Orders;
