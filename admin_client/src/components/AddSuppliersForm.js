import React from "react";
import AddForm from "./AddForm";

const AddSuppliersForm = ({ onSubmit, onClose }) => {
  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "contactName",
      label: "contactName",
      type: "text",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "phoneNumber",
      type: "text",
      required: true,
    },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "address", label: "Address", type: "text", required: true },
  ];

  return (
    <AddForm
      title="Add New Suppliers"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddSuppliersForm;
