import { HomeFooter } from "@/components/home/footer";
import { HomeHeader } from "@/components/home/header";
import { formatMoneyVND } from "@/lib/utils/price";
import { orderHistory } from "@/services/order";
import { useEffect } from "react";

const HistoryPaymentPage = () => {
  

  useEffect(() => {
    const handleOrderHistory = async () => {
      const rs = await orderHistory();
      console.log(rs.data);
    }

    handleOrderHistory()
  }, [])
  return (
    <>
      <HomeHeader />
      <div className="pt-[80px]">
        <div className="container w-[800px] flex flex-col gap-8">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">Lịch sử thanh toán</span>
            <p className="text-gray-600 text-sm">Kiểm tra trạng thái của đơn hàng, </p>
          </div>
          <div className="flex flex-col gap-4">
            <OrderItem />
            <OrderItem />
            <OrderItem />
            <OrderItem />
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  )
}

const OrderItem = () => {
  return (
    <div className="flex flex-col pb-4 gap-4">
      <div className="flex border-2 border-gray-400 p-4 rounded-lg items-center justify-between">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Mã đơn hàng</span>
            <p className="text-gray-600 text-sm">ABC123456789</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Ngày thanh toán</span>
            <p className="text-gray-600 text-sm">ABC123456789</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Tổng số tiền</span>
          <p className="text-sm text-main font-bold">{formatMoneyVND(123456789)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <div className="flex gap-6 pb-4 border-b-[1px]">
          <img className="w-[100px] h-[100px]" src="https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/a/b/0/-original-imaghx9qnhzxegu2.jpeg?q=70&crop=false" />
          <div className="flex flex-col gap-2">
            <span className="font-bold">iPhone 11 (Đen, 8GB, 256GB)</span>
            <span className="text-main font-bold">{formatMoneyVND(99999)}</span>
          </div>
        </div>
        <div className="flex gap-6 pb-4 border-b-[1px]">
          <img className="w-[100px] h-[100px]" src="https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/a/b/0/-original-imaghx9qnhzxegu2.jpeg?q=70&crop=false" />
          <div className="flex flex-col gap-2">
            <span className="font-bold">iPhone 11 (Đen, 8GB, 256GB)</span>
            <span className="text-main font-bold">{formatMoneyVND(99999)}</span>
          </div>
        </div>
        <div className="flex gap-6 pb-4 border-b-[1px]">
          <img className="w-[100px] h-[100px]" src="https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/a/b/0/-original-imaghx9qnhzxegu2.jpeg?q=70&crop=false" />
          <div className="flex flex-col gap-2">
            <span className="font-bold">iPhone 11 (Đen, 8GB, 256GB)</span>
            <span className="text-main font-bold">{formatMoneyVND(99999)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPaymentPage;