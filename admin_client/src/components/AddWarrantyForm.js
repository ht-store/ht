import React from "react";
import AddForm from "./AddForm";

const AddWarrantyForm = ({ onSubmit, onClose }) => {
  const fields = [
    {
      name: "warrantyPeriod",
      label: "WarrantyPeriod",
      type: "number",
      required: true,
    },
    {
      name: "warrantyConditions",
      label: "WarrantyConditions",
      type: "text",
      required: true,
    },
  ];

  return (
    <AddForm
      title="Add New Warranty for product"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddWarrantyForm;
