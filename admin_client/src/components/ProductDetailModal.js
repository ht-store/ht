import React from "react";
import DetailModal from "./DetailModal";

const ProductDetailModal = ({ open, onClose, product }) => {
  const fields = [
    { label: "Giá gốc", value: product.originalPrice },
    { label: "Thương hiệu", value: product.brandId },
    { label: "kích thước màn hình", value: product.screenSize },
    { label: "Pin", value: product.battery },
    { label: "Camera", value: product.camera },
    { label: "Processor", value: product.processor },
    { label: "Os", value: product.os },
  ];

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="Chi tiết sản phẩm"
      fields={fields}
    />
  );
};

export default ProductDetailModal;
