import React from "react";
import DetailModal from "./DetailModal";
const DynamicDetailForm = ({ formType, open, onClose, data }) => {
  console.log(data);
  const formConfigs = {
    order: {
      title: "Chi tiết đơn hàng",
      fields: [
        { label: "Thông tin khách hàng:", value: "" },
        { label: "Email", value: data.email },
        { label: "Số điện thoại", value: data.phoneNumber },
        { label: "Tổng giá trị đơn hàng:", value: data.totalPrice },
        { label: "Trạng thái:", value: data.orderStatus },
        {
          label: "Ngày đặt hàng:",
          value: new Date(data.orderDate).toLocaleString(),
        },
        { label: "Phương thức thanh toán:", value: data.paymentType },
        { label: "Địa chỉ giao hàng ID:", value: data.shippingAddressId },
      ],
      subdata: data.items || [],
    },
    product: {
      title: "Chi tiết sản phẩm",
      fields: [
        { label: "Giá gốc", value: data.price },
        { label: "Thương hiệu", value: data.brandId },
        { label: "Kích thước màn hình", value: data.screenSize },
        { label: "Pin", value: data.battery },
        { label: "Camera", value: data.camera },
        { label: "Processor", value: data.processor },
        { label: "Os", value: data.os },
        {
          label: "Điều kiện bảo hành",
          value: data.warrantyConditions || "Chưa có bảo hành",
        },
        {
          label: "Thời hạn bảo hành",
          value: data.warrantyPeriod || "Chưa có bảo hành",
        },
      ],
    },
    claim: {
      title: "Chi tiết phiếu xử lý bảo hành",
      fields: [
        { label: "Vấn đề", value: data.issueDescription },
        { label: "Giá linh kiện", value: data.partsCost },
        { label: "Giá sửa chữa", value: data.repairCost },
        { label: "Phí vận chuyển", value: data.shippingCost },
      ],
    },
  };

  const formConfig = formConfigs[formType];
  console.log(formConfig);
  if (!formConfig) {
    return <p>Invalid form type</p>;
  }
  return (
    <DetailModal
      subdata={formConfig.subdata}
      title={formConfig.title}
      fields={formConfig.fields}
      open={open}
      onClose={onClose}
    />
  );
};

export default DynamicDetailForm;
