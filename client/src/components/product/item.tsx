import React from "react";
import { Link } from "react-router-dom";

type ProductItemProps = {
  product: {
    productId: string;
    skuId: string;
    name: string;
    image: string;
    price: number;
    slug: string;
  };
};

export const ProductItem = ({ product }: ProductItemProps) => {
  // Format price to VND currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Link
      to={`/mobiles/${product.productId}`}
      className="product-item border p-4 rounded-lg hover:shadow-lg transition-shadow duration-300"
    >
      {/* If image is empty, show a placeholder */}
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}

      <h3 className="text-lg font-semibold mt-3 line-clamp-2 min-h-[3.5rem]">
        {product.name}
      </h3>

      <div className="mt-2">
        {product.price > 0 ? (
          <p className="text-lg font-bold text-red-600">
            {formatPrice(product.price)}
          </p>
        ) : (
          <p className="text-gray-500 italic">Liên hệ</p>
        )}
      </div>
    </Link>
  );
};
