import React from "react";
import AddForm from "./AddForm";

const AddBrandForm = ({ onSubmit, onClose }) => {
  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
  ];

  return (
    <AddForm
      title="Add New Brand"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddBrandForm;
