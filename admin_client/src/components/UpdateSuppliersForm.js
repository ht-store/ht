import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateSuppliersForm = ({ initialData, onSubmit, onClose }) => {
  const Fields = [
    { name: "name", label: "Tên", type: "text" },
    {
      name: "contactName",
      label: "Tên liên hệ",
      type: "text",
    },
    {
      name: "phoneNumber",
      label: "Số điện thoại",
      type: "text",
    },
    { name: "email", label: "Email", type: "email" },
    { name: "address", label: "Địa chỉ", type: "text" },
  ];

  return (
    <UpdateForm
      title="Cập nhật nhà cung cấp"
      fields={Fields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateSuppliersForm;
