import React from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ReusableTable = ({ title, columns, data, options }) => {
  const theme = createTheme({
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            borderCollapse: "separate",
            borderSpacing: "0",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderBottom: "2px solid #e5e7eb",
            padding: "12px 16px",
            textAlign: "center",
          },
          head: {
            fontWeight: "600",
            fontSize: "24px",
            textTransform: "uppercase",
          },
          body: {
            fontSize: "14px",
            color: "#374151",
            textAlign: "left",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              textAlign: "center",
            },
            backgroundColor: "#1f2937",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(even)": {
              backgroundColor: "#d9b38c",
            },
            "&:hover": {
              backgroundColor: "#c68c53",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="p-6 bg-gray-100 rounded-lg shadow-xl">
        <MUIDataTable
          title={<h1 className="text-xl font-bold text-gray-800">{title}</h1>}
          data={data}
          columns={columns}
          options={{
            ...options,
            responsive: "standard",
            rowsPerPage: 10,
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default ReusableTable;
