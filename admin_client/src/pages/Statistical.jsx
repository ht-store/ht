import React, { useState } from "react";
import axios from "axios";
import ReusableTable from "../components/ReusableTable";

const Statistic = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  const columns = [
    { name: "period", label: "Thời gian" },
    { name: "totalOrderRevenue", label: "Doanh thu đơn hàng" },
    { name: "orderCount", label: "Số lượng đơn hàng" },
    { name: "totalWarrantyRevenue", label: "Doanh thu bảo hành" },
    { name: "warrantyCount", label: "Số lượng bảo hành" },
    { name: "totalRevenue", label: "Tổng" },
  ];

  const options = {
    filter: true,
    selectableRows: "none",
    responsive: "standard",
    download: true,
    pagination: true,
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8001/statistic", {
        params: filters,
      });
      const { orderRevenue, warrantyRevenue } = response.data;
      function mergeRevenues(orderRevenue, warrantyRevenue) {
        const mergedData = {};

        orderRevenue.forEach((order) => {
          const { period, totalRevenue, count } = order;
          if (!mergedData[period]) {
            mergedData[period] = {
              period,
              totalOrderRevenue: 0,
              orderCount: 0,
              totalWarrantyRevenue: 0,
              warrantyCount: 0,
              totalRevenue: 0,
            };
          }
          mergedData[period].totalOrderRevenue = totalRevenue;
          mergedData[period].orderCount = count;
          mergedData[period].totalRevenue += totalRevenue;
        });

        warrantyRevenue.forEach((warranty) => {
          const { period, totalRevenue, count } = warranty;
          if (!mergedData[period]) {
            mergedData[period] = {
              period,
              totalOrderRevenue: 0,
              orderCount: 0,
              totalWarrantyRevenue: 0,
              warrantyCount: 0,
              totalRevenue: 0,
            };
          }
          mergedData[period].totalWarrantyRevenue = totalRevenue;
          mergedData[period].warrantyCount = count;
          mergedData[period].totalRevenue += totalRevenue;
        });

        return Object.values(mergedData);
      }

      const customData = mergeRevenues(orderRevenue, warrantyRevenue);

      console.log(customData);
      setData(customData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilter = () => {
    fetchData();
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Thống kê doanh thu</h1>

      <div className="flex items-center space-x-4 mb-6">
        <h2 className="">Lọc theo : </h2>
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">-- Loại --</option>
          <option value="DAILY">Ngày</option>
          <option value="WEEKLY">Tuần</option>
          <option value="MONTHLY">Tháng</option>
          <option value="YEARLY">Năm</option>
        </select>
        <h2 className=" ">Từ ngày : </h2>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 border rounded"
          placeholder="Từ ngày"
        />
        <h2 className="">Đến ngày : </h2>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="p-2 border rounded"
          placeholder="Đến ngày"
        />
        <button
          onClick={handleApplyFilter}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Lọc
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      ) : (
        <ReusableTable
          title="Bảng Thống Kê"
          columns={columns}
          data={data}
          options={options}
        />
      )}
    </div>
  );
};

export default Statistic;
