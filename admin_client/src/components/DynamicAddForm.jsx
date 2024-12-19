import React from "react";
import AddForm from "./AddForm";

const DynamicAddForm = ({ formType, onSubmit, onClose }) => {
  const formConfigs = {
    brand: {
      title: "Thêm thương hiệu",
      fields: [
        {
          name: "name",
          label: "Tên thương hiệu",
          type: "text",
          required: true,
        },
      ],
    },
    supplier: {
      title: "Thêm nhà cung cấp",
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
    warranty: {
      title: "Thêm bảo hành cho sản phẩm",
      fields: [
        {
          name: "warrantyPeriod",
          label: "Thời hạn bảo hành (tháng)",
          type: "number",
          required: true,
        },
        {
          name: "warrantyConditions",
          label: "Điều kiện bảo hành",
          type: "text",
          required: true,
        },
      ],
    },
    claim: {
      title: "Tạo đơn xử lí bảo hành",
      fields: [
        { name: "serial", label: "Số Seri", type: "text", required: true },
        {
          name: "issueDescription",
          label: "Mô tả vấn đề",
          type: "text",
          required: true,
        },
        { name: "repairCost", label: "Chi phí sửa chữa", type: "number" },
        { name: "partsCost", label: "Chi phí linh kiện", type: "number" },
        { name: "shippingCost", label: "Chi phí vận chuyển", type: "number" },
      ],
    },
  };

  const formConfig = formConfigs[formType];

  if (!formConfig) {
    return <p>Invalid form type</p>;
  }

  return (
    <AddForm
      title={formConfig.title}
      fields={formConfig.fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default DynamicAddForm;
