import { useState, useEffect } from "react";
import axios from "axios";
import { ApiResponse, Product, ProductResponse, TableData } from "../types";
import { ActionButtons } from "../components/ActionButton";
import { API_URL } from "../utils/constant";

// Define type for table data
export const useProductData = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [title, setTitle] = useState<string>("Quản lý sản phẩm");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<ApiResponse<ProductResponse[]>>(
        `${API_URL}/products`
      );
      setColumns([
        "ID",
        "Tên sản phẩm",
        "Slug",
        "Giá",
        "Ngày hiệu lực",
        "Hành động",
      ]);
      setData(
        response.data.data.map((product) => [
          product.skus.id,
          product.skus.name,
          product.skus.slug,
          product.prices.price,
          new Date(product.skus.createdAt).toLocaleDateString(),
          <ActionButtons
            key={product.skus.id}
            item={product}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />,
        ])
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (product: Product) => {
    console.log("Viewing product:", product);
  };

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product);
  };

  const handleDelete = (product: Product) => {
    console.log("Deleting product:", product);
  };

  return { title, columns, data, isLoading, fetchProducts };
};
