import { useState, useEffect } from "react";
import axios from "axios";
import {
  ApiResponse,
  ImportOrder,
  ImportOrderResponse,
  TableData,
} from "../types";
import { API_URL } from "../utils/constant";
import { ActionButtons } from "../components/ActionButton";

// Define type for table data that can include JSX elements
export const useImportOrderData = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [title, setTitle] = useState<string>("Danh sách đơn đặt hàng nhập kho");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImportOrders();
  }, []);

  const fetchImportOrders = async () => {
    try {
      const response = await axios.get<ApiResponse<ImportOrderResponse[]>>(
        `${API_URL}/import-orders`
      );
      setColumns([
        "ID",
        "Nhà cung cấp",
        "Ngày tạo",
        "Tổng giá trị",
        "Trạng thái",
        "Hành động",
      ]);
      setData(
        response.data.data.map((order) => [
          order.id,
          order.supplierId,
          new Date(order.orderDate).toLocaleDateString(),
          order.totalAmount,
          order.status,
          <ActionButtons
            key={order.id}
            item={order}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />,
        ])
      );
    } catch (error) {
      console.error("Error fetching import orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (order: ImportOrder) => {
    console.log("Viewing order:", order);
  };

  const handleEdit = (order: ImportOrder) => {
    console.log("Editing order:", order);
  };

  const handleDelete = (order: ImportOrder) => {
    console.log("Deleting order:", order);
  };

  return { title, columns, data, isLoading, fetchImportOrders };
};
