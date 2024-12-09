import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateBrandForm = ({ initialData, onSubmit, onClose }) => {
  const BrandFields = [
    {
      name: "name",
      label: "Tên thương hiệu",
      type: "text",
      placeholder: "Enter Brand name",
    },
  ];

  return (
    <UpdateForm
      title="Cập nhật thương hiệu"
      fields={BrandFields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateBrandForm;
