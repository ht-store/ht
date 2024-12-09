import React from "react";
import AddForm from "./AddForm";

const AddCostForm = ({ onSubmit, onClose }) => {
  const fields = [
    { name: "repairCost", label: "repairCost", type: "number", required: true },
    {
      name: "partsCost",
      label: "partsCost",
      type: "number",
      required: true,
    },
    { name: "shippingCost", label: "shippingCost", type: "number" },
    { name: "currency", label: "currency", type: "text" },
  ];

  return (
    <AddForm
      title="Add Cost"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddCostForm;
