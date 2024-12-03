import React from "react";
import DetailModal from "./DetailModal";

const UserDetailModal = ({ open, onClose, user }) => {
  const fields = [
    { label: "ID", value: user.id },
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Role", value: user.roleId },
    { label: "Rt", value: user.rt },
    { label: "StripeId", value: user.stripeId },
    { label: "PhoneNumber", value: user.phoneNumber },
  ];

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="User Details"
      fields={fields}
    />
  );
};

export default UserDetailModal;
