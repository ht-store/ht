import { HomeFooter } from "@/components/home/footer";
import { HomeHeader } from "@/components/home/header";
import { Button } from "@/components/ui/button";
import cartLogo from "@/assets/svgs/cart.svg";
import flashLogo from "@/assets/svgs/flash.svg";
import { TagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductItems } from "@/services/product";
import { formatMoneyVND } from "@/lib/utils/price";
import { addItemToCart, getMyCart } from "@/services/cart";
import { toast } from "react-toastify";
import { HttpStatusCode } from "axios";
import { orderCheckout } from "@/services/order";

const DetailProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [cartId, setCartId] = useState<number>();
  const [product, setProduct] = useState<any>();
  const [colors, setColors] = useState<string[]>([]);
  const [storages, setStorages] = useState<string[]>([]);

  const handleChooseProductItem = ({
    type,
    value,
  }: {
    type: string;
    value: string;
  }) => {
    const filters = {
      color: product?.color,
      storage: product?.storage,
      [type]: value,
    };

    const newProduct = product?.skus.find(
      (sku: any) =>
        sku.attributes?.find(
          (attr: any) => attr.type === "Color" && attr.value === filters.color
        ) &&
        sku.attributes?.find(
          (attr: any) =>
            attr.type === "Storage" && attr.value === filters.storage
        )
    );

    if (newProduct) {
      navigate(`/mobile/${productId}/${newProduct.id}`);
    }
  };

  const handleAddItemToCart = async () => {
    if (cartId === undefined) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    if (product) {
      const rs = await addItemToCart({
        price: product.originalPrice.toString(),
        cartId,
        productItemId: product.id,
        quantity: 1,
      });

      if (rs.status === HttpStatusCode.Ok) {
        toast.success("Thêm sản phẩm vào giỏ hàng thành công");
      }
    }
  };

  const handleBuyNow = async () => {
    if (cartId === undefined) {
      toast.error("Vui lòng đăng nhập để mua sản phẩm");
      return;
    }

    if (product) {
      const rs = await orderCheckout({
        productItems: [
          {
            image: product.image,
            name: product.name,
            price: product.originalPrice.toString(),
            productItemId: 0,
            quantity: 1,
            SKU: product.skus[0].slug,
          },
        ],
      });

      if (rs.data.data) {
        window.open(rs.data.data, "_blank");
      }
    }
  };

  useEffect(() => {
    const handleGetCart = async () => {
      const rsp = await getMyCart();
      setCartId(rsp.data.data.cartId);
    };

    handleGetCart();
  }, []);

  useEffect(() => {
    const handleGetProduct = async () => {
      if (productId) {
        const rsp = await getProductItems(productId);

        if (rsp.data.success) {
          setProduct(rsp.data.data);

          const mColors = new Set<string>();
          const mStorages = new Set<string>();

          rsp.data.data.skus.forEach((sku: any) => {
            sku.attributes.forEach((attr: any) => {
              if (attr.attribute.type === "Color") {
                mColors.add(attr.value);
              }
              if (attr.attribute.type === "Storage") {
                mStorages.add(attr.value);
              }
            });
          });

          setColors(Array.from(mColors));
          setStorages(Array.from(mStorages));
        }
      }
    };

    handleGetProduct();
  }, [productId]);

  return (
    <>
      <HomeHeader />
      <div className="container pt-[80px]">
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2">
            <div className="sticky top-4 bottom-0">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center w-full p-4 border-[1px] rounded-md">
                  <img className="w-[200px] h-auto" src={product?.image} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    onClick={handleAddItemToCart}
                    className="bg-yellow-500 w-[46%] hover:bg-yellow-400 flex gap-2 items-center"
                  >
                    <img className="w-[26px]" src={cartLogo} />
                    THÊM VÀO GIỎ HÀNG
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="bg-orange-500 w-[46%] hover:bg-orange-400 flex gap-2 items-center"
                  >
                    <img className="w-[26px]" src={flashLogo} />
                    MUA NGAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 pb-12">
            <div className="text-lg font-medium mb-2">{product?.name}</div>
            <span className="font-semibold text-3xl">
              {formatMoneyVND(product?.originalPrice || 0)}
            </span>

            <div className="flex flex-col gap-4 mt-12">
              <div className="flex items-center gap-4">
                <p>Màu sắc</p>
                <div className="flex items-center gap-4">
                  {colors.map((color) => (
                    <div
                      key={color}
                      onClick={() =>
                        handleChooseProductItem({ type: "color", value: color })
                      }
                      className={`cursor-pointer px-4 py-1 border-2 rounded-sm ${
                        product?.skus.find((sku: any) =>
                          sku.attributes.some(
                            (attr: any) =>
                              attr.type === "Color" && attr.value === color
                          )
                        )
                          ? " border-blue-500"
                          : ""
                      }`}
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p>Bộ nhớ</p>
                <div className="flex items-center gap-4">
                  {storages.map((storage) => (
                    <div
                      key={storage}
                      onClick={() =>
                        handleChooseProductItem({
                          type: "storage",
                          value: storage,
                        })
                      }
                      className={`cursor-pointer px-4 py-1 font-medium border-2 rounded-sm ${
                        product?.skus.find((sku: any) =>
                          sku.attributes.some(
                            (attr: any) =>
                              attr.type === "Storage" && attr.value === storage
                          )
                        )
                          ? " border-blue-500"
                          : ""
                      }`}
                    >
                      {storage}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default DetailProduct;
