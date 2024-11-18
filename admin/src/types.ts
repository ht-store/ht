// types.ts

export type TableData = (string | number | JSX.Element)[];
// User type

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
}

// Product type
export interface Product {
  id: number;
  productName: string;
  category: string;
  price: number;
  stock: number;
}

// Order type
export interface Order {
  orderId: string;
  customer: string;
  total: string;
  status: string;
}

// types.ts

export interface ProductResponse {
  skus: {
    id: number;
    productId: number;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
  prices: {
    id: number;
    skuId: number;
    price: string;
    effectiveDate: string;
    activate: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
