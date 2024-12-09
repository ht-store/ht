import React from "react";
import UpdateForm from "./UpdateForm";

const UpdateProductForm = ({ initialData, onSubmit, onClose }) => {
  console.log(initialData);
  const productFields = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
    },
    {
      name: "screenSize",
      label: "Screen Size",
      type: "text",
      placeholder: "Enter screen size",
    },
    {
      name: "battery",
      label: "Battery",
      type: "text",
      placeholder: "Enter battery capacity",
    },
    {
      name: "camera",
      label: "Camera",
      type: "text",
      placeholder: "Enter camera details",
    },
    {
      name: "processor",
      label: "Processor",
      type: "text",
      placeholder: "Enter processor details",
    },
    {
      name: "os",
      label: "Operating System",
      type: "text",
      placeholder: "Enter OS version",
    },
    {
      name: "skuName",
      label: "SKU Name",
      type: "text",
      placeholder: "Enter SKU name",
    },
    {
      name: "skuSlug",
      label: "SKU Slug",
      type: "text",
      placeholder: "Enter SKU slug",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter price",
    },
  ];

 

  return (
    <UpdateForm
      title="Cập nhật sản phẩm"
      fields={productFields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateProductForm;