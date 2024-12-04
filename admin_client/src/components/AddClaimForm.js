import React from "react";
import AddForm from "./AddForm";

const AddClaimForm = ({ onSubmit, onClose }) => {
  const fields = [
    { name: "serial", label: "Serial", type: "text", required: true },
    {
      name: "issueDescription",
      label: "IssueDescription",
      type: "text",
      required: true,
    },
    { name: "resolution", label: "Resolution", type: "text" },
  ];

  return (
    <AddForm
      title="Add New Claim"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default AddClaimForm;
