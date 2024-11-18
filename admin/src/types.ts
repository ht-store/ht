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
// types.ts

// Define the table data type for general table usage
export type TableData = (string | number | JSX.Element)[];

// User type
export interface User {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
}

// Product type
export interface Product {
  name: string;
  brandId: number;
  categoryId: number;
  screenSize: string;
  battery: string;
  camera: string;
  processor: string;
  os: string;
  releaseDate: string;
  image: string;
  originalPrice: string;
  details: ProductDetail[];
}

export interface ProductDetail {
  name: string;
  slug: string;
  attributes: { attributeId: number; value: string }[]; // assuming attributes are an array of objects
  price: string | number;
  stock: number;
}

export interface NewProduct {
  name: string;
  brandId: number;
  categoryId: number;
  details: ProductDetail[];
}

// API response type for products
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Import order types
export interface ImportOrder {
  id: number;
  supplierId: number;
  orderDate: string;
  totalAmount: string;
  status: string;
}

export interface Item {
  skuId: string;
  quantity: string;
  price: string;
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

// types.ts

export interface ImportOrder {
  id: number;
  supplierId: number;
  orderDate: string;
  totalAmount: string;
  status: string;
}

export interface ImportOrderResponse {
  id: number;
  supplierId: number;
  orderDate: string;
  totalAmount: string;
  status: string;
}

export interface ApiResponse<T> {
  data: T;
}
