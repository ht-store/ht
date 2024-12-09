import React from "react";
import AddForm from "./AddForm";

const AddBrandForm = ({ onSubmit, onClose }) => {
  const fields = [
    { name: "name", label: "Tên thương hiệu", type: "text", required: true },
  ];

  return (
    <AddForm
      title="Thêm thương hiệu mới"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddBrandForm;
