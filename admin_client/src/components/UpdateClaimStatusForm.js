import React, { useState, useEffect } from "react";
import UpdateForm from "./UpdateForm";

const UpdateClaimStatusForm = ({ initialData, onSubmit, onClose }) => {
  const [options, setOptions] = useState([]);

  const getAvailableOptions = (currentStatus) => {
    console.log("currentStatus:", currentStatus);
    switch (currentStatus) {
      case "pending":
        return [
          { value: "", label: "" },
          { value: "progress", label: "In Progress" },
          { value: "completed", label: "Completed" },
          { value: "reject", label: "Rejected" },
        ];
      case "progress":
        return [
          { value: "", label: "" },
          { value: "completed", label: "Completed" },
          { value: "reject", label: "Rejected" },
        ];
      case "completed":
      case "reject":
        return [];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (initialData?.status) {
      setOptions(getAvailableOptions(initialData.status));
    }
  }, [initialData?.status]); // Set options whenever initialData.status changes

  const ClaimStatusFields = [
    {
      name: "status",
      label: "Claim Status",
      type: "select",
      options: options,
      placeholder: "Select claim status",
    },
  ];

  return (
    <UpdateForm
      title="Update Claim Status"
      fields={ClaimStatusFields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdateClaimStatusForm;
