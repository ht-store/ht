import axios from "axios";
import { API_URL } from "../utils/constant";

// Fetch all inventories
export const getInventories = async () => {
  const response = await axios.get(`${API_URL}/inventories`);
  return response.data;
};

// Update inventory
export const updateInventory = async (id: number, data: any) => {
  const response = await axios.put(`${API_URL}/inventories/${id}`, data);
  return response.data;
};
