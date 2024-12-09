import React from "react";
import AddForm from "./AddForm";

const AddSuppliersForm = ({ onSubmit, onClose }) => {
  const fields = [
    { name: "name", label: "Tên", type: "text", required: true },
    {
      name: "contactName",
      label: "Tên liên hệ",
      type: "text",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Số điện thoại",
      type: "text",
      required: true,
    },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "address", label: "Địa chỉ", type: "text", required: true },
  ];

  return (
    <AddForm
      title="Thêm nhà cung cấp"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddSuppliersForm;
