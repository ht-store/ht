import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/orders/history"
        );
        const formattedOrders = response.data.data.map((order) => ({
          ...order,
          orderDate: formatDate(order.orderDate),
        }));
        setOrders(formattedOrders);
      } catch (err) {
        setError("Failed to fetch Orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const columns = [
    { name: "id", label: "ID" },
    { name: "totalPrice", label: "Total Price" },
    { name: "orderDate", label: "Order Date" },
    { name: "orderStatus", label: "Order Status" },
    { name: "paymentType", label: "Payment Type" },
    { name: "checkoutSessionId", label: "Checkout Session ID" },
    { name: "stripePaymentIntentId", label: "Stripe Payment Intent ID" },
  ];

  const options = {
    filter: true,
    selectableRows: "single",
    responsive: "standard",
    download: true,
    print: true,
    pagination: true,
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl">Order Management</h1>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Order List"
          columns={columns}
          data={orders || []}
          options={options}
        />
      )}
    </div>
  );
};

export default Orders;
