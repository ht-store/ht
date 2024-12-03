import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateBrandForm = ({ initialData, onSubmit, onClose }) => {
  const BrandFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter Brand name",
    },
  ];

  return (
    <UpdateForm
      title="Update Brand"
      fields={BrandFields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateBrandForm;
