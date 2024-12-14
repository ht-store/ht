import { HomeFooter } from "@/components/home/footer";
import { HomeHeader } from "@/components/home/header";
import { formatMoneyVND } from "@/lib/utils/price";
import { orderHistory } from "@/services/order";
import { useEffect, useState } from "react";
import { date } from "zod";

const HistoryPaymentPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchOrderHistory = async () => {
      try {
        const response = await orderHistory(); // Hàm gọi API
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          console.error("Failed to fetch order history");
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    // Gọi lần đầu tiên
    fetchOrderHistory();

    // Thiết lập interval để gọi API mỗi phút
    intervalId = setInterval(() => {
      fetchOrderHistory();
    }, 60000); // 60000ms = 1 phút

    // Dọn dẹp interval khi component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); 

  return (
    <>
      <HomeHeader />
      <div className="pt-[80px]">
        <div className="container w-[800px] flex flex-col gap-8">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">Lịch sử đặt hàng</span>
            <p className="text-gray-600 text-sm">
              Kiểm tra trạng thái của đơn hàng.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {orders.length > 0 ? (
              orders.map((order) => <OrderItem key={order.id} order={order} />)
            ) : (
              <p className="text-gray-600 text-center">Không có đơn hàng nào.</p>
            )}
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

const OrderItem = ({ order }) => {
  return (
    <div className="flex flex-col pb-4 gap-4">
      {/* Order Info */}
      <div className="flex border-2 border-gray-400 p-4 rounded-lg items-center justify-between">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Mã đơn hàng</span>
            <p className="text-gray-600 text-sm">{order.id}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Ngày thanh toán</span>
            <p className="text-gray-600 text-sm">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Trạng thái</span>
            <p className="text-gray-600 text-sm">{order.orderStatus}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Tổng số tiền</span>
          <p className="text-sm text-main font-bold">
            {formatMoneyVND(order.totalPrice)}
          </p>
        </div>
      </div>
      {/* Items */}
      <div className="flex flex-col gap-12">
        {order.items.length > 0 ? (
          order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 pb-4 border-b-[1px] items-center"
            >
              <img
                className="w-[100px] h-[100px]"
                src={item.sku.image || "https://via.placeholder.com/100"}
                alt={item.sku.name}
              />
              <div className="flex flex-col gap-2">
                <span className="font-bold">{item.sku.name}</span>
                <span className="text-main font-bold">
                  {formatMoneyVND(item.price)}
                </span>
                <span className="text-gray-600">Số lượng: {item.quantity}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Không có sản phẩm nào trong đơn hàng.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPaymentPage;
