import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateUserForm = ({ initialData, onSubmit, onClose }) => {
  const userFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter user name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      placeholder: "Enter password address",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number",
    },
    {
      name: "roleId",
      label: "Role",
      type: "number",
      placeholder: "Enter role (e.g., Admin, User)",
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

export default UpdateUserForm;
