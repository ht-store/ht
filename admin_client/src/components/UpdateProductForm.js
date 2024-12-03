import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateProductForm = ({ initialData, onSubmit, onClose }) => {
  const userFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter user name",
    },
  ];

  return (
    <UpdateForm
      title="Update User"
      fields={userFields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateProductForm;
