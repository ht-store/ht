import { HomeHeader } from "@/components/home/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth/auth-context";
import { formatMoneyVND } from "@/lib/utils/price";
import {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
  updateItemQuantity,
} from "@/services/cart";
import { orderCheckout } from "@/services/order";
import { HttpStatusCode } from "axios";
import { Minus, MoveLeft, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type CartItem = {
  cartId: number;
  skuId: number;
  cartItemId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: string; // price as string, it can be parsed when needed
  total: number; // total price for that cart item
  isSelect: boolean;
};

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number>();
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleGoHome = () => {
    navigate("/");
  };

  useEffect(() => {
    // Recalculate select all flag and total price
    const selectAll = cartItems.every((item) => item.isSelect);
    setIsSelectAll(selectAll);

    const total = cartItems
      .filter((item) => item.isSelect)
      .reduce((acc, cur) => acc + cur.total, 0);

    setTotalPrice(total);
  }, [cartItems]);

  const handleGetCart = async () => {
    const rsp = await getMyCart();
    console.log(rsp.data.data);
    setCartId(rsp.data.data[0].cartId); // Assuming all items share the same cartId
    setCartItems(
      rsp.data.data.map((item: any) => ({
        cartId: item.cartId,
        skuId: item.skuId,
        cartItemId: item.cartItemId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price, // Price as a string
        total: item.price * item.quantity, // Total price per item
        isSelect: false, // Initially not selected
      }))
    );
  };

  const handleCheckout = async () => {
    console.log(cartItems);
    if (cartId === undefined) {
      toast.error("Xin vui lòng đăng nhập mua sản phẩm");
      return;
    }
    const rs = await orderCheckout({
      cartId: cartId,
      items: cartItems
        .filter((cartItem) => cartItem.isSelect)
        .map((cartItem) => ({
          name: cartItem.productName,
          image: cartItem.productImage,
          skuId: cartItem.skuId,
          quantity: cartItem.quantity,
          price: cartItem.price,
        })),
    });

    if (rs.data.data) {
      window.open(rs.data.data, "_self");
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setCartItems((prev) => prev.map((e) => ({ ...e, isSelect: checked })));
    setIsSelectAll(checked);
  };

  useEffect(() => {
    handleGetCart();
  }, []);

  useEffect(() => {
    const selectAll = cartItems.every((e) => e.isSelect === true);
    setIsSelectAll(selectAll);
    const total = cartItems
      .filter((e) => e.isSelect)
      .reduce((acc: number, cur: CartItem) => {
        return acc + cur.total;
      }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Xin vui lòng đăng nhập");
      return;
    }
  }, [isAuthenticated]);
  console.log(cartItems)
  return (
    <>
      <HomeHeader />
      <div className="container w-[700px] py-6 flex flex-col pt-[80px] overflow-auto">
        <div className="flex gap-4 justify-center items-center relative w-full">
          <MoveLeft
            onClick={handleGoHome}
            className="absolute left-0 cursor-pointer"
          />
          <p className="font-bold text-base">Giỏ hàng của bạn</p>
        </div>
        {(cartItems.length === 0 || cartItems[0].skuId === undefined) && (
          <div className="flex flex-col justify-between items-center h-[560px]">
            <div className="flex flex-col justify-center items-center mt-[230px]">
              <p>Giỏ hàng của bạn đang trống.</p>
              <p>Hãy chọn thêm sản phẩm để mua sắm nhé.</p>
            </div>
            <div className="flex w-full justify-center mt-auto">
              <Button
                onClick={handleGoHome}
                className="bg-main hover:bg-main hover:opacity-80 w-[400px]"
              >
                Quay lại trang chủ
              </Button>
            </div>
          </div>
        )}
        {(cartItems.length > 0 && cartItems[0].skuId !== undefined) && (
          <>
            <div className="flex flex-col gap-4 items-center w-full pt-8">
              <div className="flex w-full justify-between items-center border-b-[1px]">
                <div className="flex justify-center items-center gap-2">
                  <Input
                    checked={isSelectAll}
                    onChange={handleSelectAll}
                    className="w-[14px] accent-main cursor-pointer"
                    type="checkbox"
                  />
                  <span>{isSelectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}</span>
                </div>
                <div className="italic text-gray-600 text-sm cursor-pointer">
                  Xóa sản phẩm đã chọn
                </div>
              </div>
              <div className="flex flex-col gap-8 w-full pb-[120px]">
                  {cartItems.map((cartItem) => (
                  <CartItem
                    setCartItems={setCartItems}
                    cartId={cartId!}
                    cartItem={cartItem}
                    handleGetCart={handleGetCart}
                    key={cartItem.skuId}
                  />
                ))}
              </div>
            </div>
            <div className="fixed flex justify-between items-center w-[650px] h-[100px] bottom-0 bg-white z-10">
              <div className="text-lg">
                Tạm tính:{" "}
                <span className="text-main font-semibold">
                  {formatMoneyVND(totalPrice)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="bg-main hover:bg-main hover:opacity-85 "
              >
                Mua ngay
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const CartItem = ({
  cartId,
  cartItem,
  setCartItems,
  handleGetCart,
}: {
  cartId: number;
  cartItem: CartItem;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleGetCart: () => void;
}) => {
  console.log(cartId, cartItem);
  const handlePlusOrMinusItemInCart = async (isPlus: boolean = true) => {
    const newQuantity = isPlus ? cartItem.quantity + 1 : cartItem.quantity - 1;
    if (newQuantity <= 0) {
      await removeItemFromCart(cartItem.cartItemId);
      setCartItems((prev) =>
        prev.filter((item) => item.skuId !== cartItem.skuId)
      );
      return;
    }
    const rs = await updateItemQuantity(cartItem.cartItemId, {
      quantity: newQuantity, // Sử dụng số lượng mới
    });

    if (rs.status !== HttpStatusCode.Ok) {
      toast.error("Đã có lỗi xảy ra, xin vui lòng thử lại");
      return;
    }

    // Cập nhật lại cartItems sau khi API thành công
    setCartItems((prev) => {
      return prev.map((item) =>
        item.skuId === cartItem.skuId
          ? { ...item, quantity: newQuantity, total: +item.price * newQuantity }
          : item
      );
    });
  };

  const handleRemoveItemFromCart = async () => {
    const rs = await removeItemFromCart(cartItem.cartItemId);

    if (rs.status !== HttpStatusCode.Ok) {
      toast.error("Đã có lỗi xảy ra, xin vui lòng thử lại");
      return;
    }

    // Cập nhật lại cartItems sau khi sản phẩm bị xóa
    setCartItems((prev) =>
      prev.filter((item) => item.skuId !== cartItem.skuId)
    );
  };

  const handleSelectItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCartItems((prev) => {
      const newItems = prev.map((e) => {
        if (e.skuId === cartItem.skuId) {
          return { ...e, isSelect: event.target.checked };
        }
        return e;
      });
      return newItems;
    });
  };

  return (
    <div className="flex gap-4 pb-2 border-b-[1px]">
      <Input
        checked={cartItem.isSelect}
        onChange={(e) => handleSelectItem(e)}
        className="w-[14px] accent-main"
        type="checkbox"
      />
      <div className="w-[100px] h-[100px] overflow-hidden">
        <img
          src={cartItem.productImage || "/path/to/default/image.jpg"}
          alt={cartItem.productName}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col w-full justify-between items-start">
        <span className="text-base">{cartItem.productName}</span>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <Minus
              className="cursor-pointer"
              onClick={() => handlePlusOrMinusItemInCart(false)}
            />
            <span>{cartItem.quantity}</span>
            <Plus
              className="cursor-pointer"
              onClick={() => handlePlusOrMinusItemInCart(true)}
            />
          </div>
          <span className="font-semibold">
            {formatMoneyVND(cartItem.total)}
          </span>
        </div>
      </div>
      <Trash2 className="cursor-pointer" onClick={handleRemoveItemFromCart} />
    </div>
  );
};

export default CartPage;
