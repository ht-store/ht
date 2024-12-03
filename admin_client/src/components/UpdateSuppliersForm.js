import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateSuppliersForm = ({ initialData, onSubmit, onClose }) => {
  const Fields = [
    { name: "name", label: "Name", type: "text" },
    {
      name: "contactName",
      label: "contactName",
      type: "text",
    },
    {
      name: "phoneNumber",
      label: "phoneNumber",
      type: "text",
    },
    { name: "email", label: "Email", type: "email" },
    { name: "address", label: "Address", type: "text" },
  ];

  return (
    <UpdateForm
      title="Update Suppliers"
      fields={Fields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateSuppliersForm;
