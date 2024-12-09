import React from "react";
import AddForm from "./AddForm";

const AddUserForm = ({ onSubmit, onClose }) => {
  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      required: true,
    },
    { name: "roleId", label: "Role ID", type: "number", required: true },
  ];

  return (
    <AddForm
      title="Add New User"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddUserForm;
