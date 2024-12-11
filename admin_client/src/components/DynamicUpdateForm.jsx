import React from "react";
import UpdateForm from "./UpdateForm";

const DynamicUpdateForm = ({ formType, onSubmit, onClose, initialData }) => {
  const formConfigs = {
    warranty: {
      title: "Cập nhật điều kiện bảo hành",
      fields: [
        {
          name: "warrantyConditions",
          label: "Điều kiện bảo hành",
          type: "text",
          required: true,
        },
      ],
    },
    brand: {
      fields: [
        {
          name: "name",
          label: "Tên thương hiệu",
          type: "text",
          required: true,
        },
      ],
    },
    user: {
      fields: [
        {
          name: "name",
          label: "Tên",
          type: "text",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
        },

        {
          name: "phoneNumber",
          label: "Số điện thoại",
          type: "tel",
          required: true,
        },
        {
          name: "roleId",
          label: "Vai trò",
          type: "number",
          required: true,
        },
      ],
    },
    supplier: {
      fields: [
        { name: "name", label: "Tên", type: "text", required: true },
        {
          name: "contactName",
          label: "Tên liên hệ",
          type: "text",
          required: true,
        },
        {
          name: "phoneNumber",
          label: "Số điện thoại",
          type: "text",
          required: true,
        },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "address", label: "Địa chỉ", type: "text", required: true },
      ],
    },
  };
  const formConfig = formConfigs[formType];
  if (!formConfig) {
    return <p>Invalid form type</p>;
  }
  return (
    <UpdateForm
      title={formConfig.title}
      fields={formConfig.fields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default DynamicUpdateForm;
