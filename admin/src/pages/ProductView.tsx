import React from "react";
import MUIDataTable from "mui-datatables";
import { useProductData } from "../hooks/useProductData";

const ProductView: React.FC = () => {
  const { title, columns, data, isLoading } = useProductData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <MUIDataTable title={title} data={data} columns={columns} />;
};

export default ProductView;
