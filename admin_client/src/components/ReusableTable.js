import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuItem, Select, FormControl, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import axios from "axios"; // Import axios for API calls

const ReusableTable = ({ title, columns, data, options, onStatusChange }) => {
  const theme = createTheme({
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            borderCollapse: "separate",
            borderSpacing: "0",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderBottom: "2px solid #e5e7eb",
            padding: "12px 16px",
            textAlign: "left",
            verticalAlign: "middle",
          },
          head: {
            fontWeight: "600",
            fontSize: "24px",
            textTransform: "uppercase",
            verticalAlign: "middle",
            backgroundColor: "#1f2937",
            color: "#ffffff",
          },
          body: {
            fontSize: "14px",
            color: "#374151",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(even)": {
              backgroundColor: "#f9fafb",
            },
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
          },
        },
      },
    },
  });

  // Status color mapping
  const statusColors = {
    "Đang chờ xử lý": "#FFA500",     // Orange
    "Đang xử lý": "#1E90FF",          // Dodger Blue
    "Được xác nhận": "#87CEEB",       // Sky Blue
    "Đang vận chuyển": "#FFD700",     // Gold
    "Đã giao hàng": "#2ECC71",        // Emerald Green
    "Đã hủy": "#E74C3C",              // Crimson Red
    "Trả lại": "#9400D3"              // Violet
  };

  // Define the order of statuses (lower value is lower in the hierarchy)
  const statusOrder = [
    "Đang chờ xử lý", // 0
    "Đang xử lý", // 1
    "Được xác nhận", // 2
    "Đang vận chuyển", // 3
    "Đã giao hàng", // 4
    "Đã hủy", // 5
    "Trả lại" // 6
  ];

  // StatusDot component for status display
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

  // State for modal and order data
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);  // To handle loading state

  // Fetch order details from API
  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8001/orders/${orderId}`);
      console.log(response)
      setSelectedOrder(response.data.data);  // Set the fetched order data
      setOpen(true);  // Open the modal
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal open with order details
  const handleOpen = (orderId) => {
    fetchOrderDetails(orderId);  // Fetch order details from API
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const updatedColumns = columns.map((column) => {
    if (column.name === "orderStatus") {
      return {
        ...column,
        options: {
          ...column.options,
          customBodyRender: (value, tableMeta) => {
            const rowIndex = tableMeta.rowIndex;
            const orderId = data[rowIndex]?.id;
            const currentStatus = Object.keys(statusColors).includes(value)
              ? value
              : "Đang chờ xử lý";

            return (
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={currentStatus}
                  onChange={(e) => onStatusChange(orderId, e.target.value)}
                  renderValue={(selected) => (
                    <StatusDot status={selected} />
                  )}
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
                      disabled={getStatusLevel(currentStatus) >= getStatusLevel(status)}
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
          const orderId = data[rowIndex]?.id;

          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen(orderId)}  // Open modal and fetch order details
            >
              Xem chi tiết
            </Button>
          );
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="p-6 bg-gray-100 rounded-lg shadow-xl">
        <MUIDataTable
          title={<h1 className="text-xl font-bold text-gray-800">{title}</h1>}
          data={data}
          columns={columnsWithDetails}
          options={{
            ...options,
            responsive: "standard",
            rowsPerPage: 10,
          }}
        />
      </div>

      {/* Modal to show order details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography variant="h6">Đang tải...</Typography>  // Show loading state
          ) : selectedOrder ? (
            <div>
              <Typography variant="h6">Thông tin khách hàng:</Typography>
              <Typography>Email: {selectedOrder.email}</Typography>
              <Typography>Số điện thoại: {selectedOrder.phoneNumber}</Typography>
              <Typography>Tổng giá trị đơn hàng: {selectedOrder.totalPrice} VND</Typography>
              <Typography>Trạng thái: {selectedOrder.orderStatus}</Typography>
              <Typography>Ngày đặt hàng: {new Date(selectedOrder.orderDate).toLocaleString()}</Typography>
              <Typography>Phương thức thanh toán: {selectedOrder.paymentType}</Typography>
              <Typography>Địa chỉ giao hàng ID: {selectedOrder.shippingAddressId}</Typography>

              <Typography variant="h6" mt={2}>Sản phẩm:</Typography>
              {selectedOrder.items.map((item, index) => (
                <div key={index}>
                  <Typography>SKU: {item.skuId}</Typography>
                  <Typography>Tên: {item.name}</Typography>
                  {/* <Typography>Giá: {item.price} VND</Typography> */}
                  <Typography>Số lượng: {item.quantity}</Typography>
                  <Typography>Giá: {item.price} VND</Typography>

                </div>
              ))}
            </div>
          ) : (
            <Typography variant="h6">Không có dữ liệu</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Đóng</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ReusableTable;
