import React from "react";
import MUIDataTable from "mui-datatables";
import { useCustomerData } from "../hooks/useCustomerData";

const CustomerView: React.FC = () => {
  const { title, columns, data, isLoading } = useCustomerData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <MUIDataTable title={title} data={data} columns={columns} />;
};

export default CustomerView;
