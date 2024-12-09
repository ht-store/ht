import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateUserForm = ({ initialData, onSubmit, onClose }) => {
  const userFields = [
    {
      name: "name",
      label: "Tên",
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
      label: "Mật khẩu",
      type: "password",
      placeholder: "Enter password address",
    },
    {
      name: "phoneNumber",
      label: "Số điện thoại",
      type: "tel",
      placeholder: "Enter phone number",
    },
    {
      name: "roleId",
      label: "Vai trò",
      type: "number",
      placeholder: "Enter role (e.g., Admin, User)",
    },
  ];

  return (
    <UpdateForm
      title="Cập nhật người dùng"
      fields={userFields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateUserForm;
