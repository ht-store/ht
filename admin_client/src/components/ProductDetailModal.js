import React from "react";
import DetailModal from "./DetailModal";

const ProductDetailModal = ({ open, onClose, product }) => {
  const fields = [
    { label: "originalPrice", value: product.originalPrice },
    { label: "brandId", value: product.brandId },
    { label: "screenSize", value: product.screenSize },
    { label: "battery", value: product.battery },
    { label: "camera", value: product.camera },
    { label: "processor", value: product.processor },
    { label: "os", value: product.os },
    { label: "warrantyPeriod", value: product.warrantyPeriod },
    { label: "warrantyConditions", value: product.warrantyConditions },
  ];

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="Product Details"
      fields={fields}
    />
  );
};

export default ProductDetailModal;
