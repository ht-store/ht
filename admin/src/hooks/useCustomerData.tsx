import { useState, useEffect } from "react";
import axios from "axios";
import { ApiResponse, TableData, User } from "../types";
import { ActionButtons } from "../components/ActionButton";
import { API_URL } from "../utils/constant";

// Define type for table data that can include JSX elements

export const useCustomerData = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [title, setTitle] = useState<string>("Người dùng");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get<ApiResponse<User[]>>(
        `${API_URL}/users/customers`
      );
      setColumns(["ID", "Tên", "SĐT", "Email", "Hành động"]);
      console.log(response);
      setData(
        response.data.data.map((customer) => [
          customer.id,
          customer.name,
          customer.phoneNumber,
          customer.email,
          <ActionButtons
            key={customer.id}
            item={customer}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />,
        ])
      );
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (customer: User) => {
    console.log("Viewing customer:", customer);
  };

  const handleEdit = (customer: User) => {
    console.log("Editing customer:", customer);
  };

  const handleDelete = (customer: User) => {
    console.log("Deleting customer:", customer);
  };

  return { title, columns, data, isLoading, fetchCustomers };
};
