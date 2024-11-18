import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useImportOrderData } from "../hooks/useImportOrderData";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../utils/constant";
import { Item } from "../types";

const ImportOrderView: React.FC = () => {
  const { title, columns, data, isLoading, fetchImportOrders } =
    useImportOrderData();
  const [open, setOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([{ skuId: "", quantity: "", price: "" }]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Mở/đóng dialog form
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (
    index: number,
    field: keyof Item, // This ensures field is one of the keys in Item type
    value: string
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Thêm sản phẩm vào đơn nhập hàng
  const handleAddItem = () => {
    setItems([...items, { skuId: "", quantity: "", price: "" }]);
  };

  // Gửi thông tin đơn nhập hàng
  const handleSubmit = async () => {
    try {
      const payload = {
        supplierId: Number(supplierId),
        items: items.map((item) => ({
          skuId: Number(item.skuId),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      };
      // Gửi request đến API (tạo đơn nhập hàng mới)
      await axios.post(`${API_URL}/import-orders`, payload);
      fetchImportOrders(); // Tải lại danh sách đơn nhập hàng
      setOpen(false); // Đóng form
    } catch (error) {
      console.error("Error creating import order:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Thêm đơn nhập hàng
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm đơn nhập hàng</DialogTitle>
        <DialogContent>
          <TextField
            label="Nhà cung cấp"
            fullWidth
            margin="normal"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          />
          {items.map((item, index) => (
            <div key={index}>
              <TextField
                label="SKU ID"
                fullWidth
                margin="normal"
                value={item.skuId}
                onChange={(e) =>
                  handleInputChange(index, "skuId", e.target.value)
                }
              />
              <TextField
                label="Số lượng"
                fullWidth
                margin="normal"
                value={item.quantity}
                onChange={(e) =>
                  handleInputChange(index, "quantity", e.target.value)
                }
              />
              <TextField
                label="Giá"
                fullWidth
                margin="normal"
                value={item.price}
                onChange={(e) =>
                  handleInputChange(index, "price", e.target.value)
                }
              />
            </div>
          ))}
          <Button variant="outlined" color="primary" onClick={handleAddItem}>
            Thêm sản phẩm
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Thêm đơn nhập hàng
          </Button>
        </DialogActions>
      </Dialog>

      <MUIDataTable title={title} data={data} columns={columns} />
    </div>
  );
};

export default ImportOrderView;
