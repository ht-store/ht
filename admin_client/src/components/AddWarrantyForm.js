import React from "react";
import AddForm from "./AddForm";

const AddWarrantyForm = ({ onSubmit, onClose }) => {
  const fields = [
    {
      name: "warrantyPeriod",
      label: "Thời hạn bảo hành",
      type: "number",
      required: true,
    },
    {
      name: "warrantyConditions",
      label: "Điều kiện bảo hành",
      type: "text",
      required: true,
    },
  ];

  return (
    <AddForm
      title="Thêm bảo hành cho sản phẩm"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddWarrantyForm;
