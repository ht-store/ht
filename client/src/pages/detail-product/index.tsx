import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HomeFooter } from "@/components/home/footer";
import { HomeHeader } from "@/components/home/header";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { HttpStatusCode } from "axios";
import cartLogo from "@/assets/svgs/cart.svg";
import flashLogo from "@/assets/svgs/flash.svg";
import { formatMoneyVND } from "@/lib/utils/price";
import { addItemToCart, getMyCart } from "@/services/cart";
import { getProduct, getStorage } from "@/services/product";

interface Attribute {
  id: number;
  skuId: number;
  attributeId: number;
  type: string;
  value: string;
  colorImage: string;
  price: string;
}

interface ProductAttributes {
  Color: Attribute[];
  Storage: Attribute[];
}

interface ProductData {
  id: number;
  name: string;
  screenSize: string;
  battery: string;
  camera: string;
  processor: string;
  os: string;
  skuId: number;
  skuName: string;
  skuSlug: string;
  skuImage: string;
  price: string;
}

interface ProductResponse {
  product: ProductData;
  attributes: ProductAttributes;
}

const DetailProduct = () => {
  const { productId, skuId } = useParams();
  const navigate = useNavigate();
  const [cartId, setCartId] = useState<number | null>(null);
  const [productData, setProductData] = useState<ProductResponse | null>(null);
  const [selectedColor, setSelectedColor] = useState<Attribute | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<Attribute | null>(
    null
  );
  const [storageAttributes, setStorageAttributes] = useState<Attribute[]>([]);
  console.log("selectedColor", selectedColor);
  console.log("selectedStorage", selectedStorage);
  console.log("storageAttributes", storageAttributes);

  // Fetch Product and Attributes
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId && skuId) {
        try {
          const response = await getProduct(+productId, +skuId);
          if (response.data.success) {
            setProductData(response.data.data);
            // Set default color selection
            if (response.data.data.attributes.Color.length > 0) {
              const defaultColor = response.data.data.attributes.Color[0];
              setSelectedColor(defaultColor);
              fetchStorage(defaultColor); // Fetch storage for the default color
            }
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error("Không thể tải thông tin sản phẩm");
        }
      }
    };
    fetchProduct();
  }, [productId, skuId]);

  // Fetch Storage Attributes for the selected color
  const fetchStorage = async (color: Attribute) => {
    if (productId) {
      try {
        const response = await getStorage(+productId, color.value); // Pass color value to get storage
        if (response.data.success) {
          setStorageAttributes(response.data.data); // Assume the response is an array of Storage attributes
          // Set default storage selection
          if (response.data.data.length > 0) {
            setSelectedStorage(response.data.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching storage:", error);
        toast.error("Không thể tải thông tin dung lượng");
      }
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getMyCart();
        console.log(response.data);
        setCartId(response.data.data[0].cartId);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const handleAddItemToCart = async () => {
    if (!productData || !selectedColor || !selectedStorage) {
      toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }

    try {
      const response = await addItemToCart({
        cartId: cartId as number,
        skuId: selectedStorage.skuId, // Use selectedStorage's skuId
        quantity: 1,
      });

      if (response.status === HttpStatusCode.Ok) {
        toast.success("Thêm sản phẩm vào giỏ hàng thành công");
      }
    } catch (error) {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleBuyNow = async () => {
    if (!selectedColor || !selectedStorage) {
      toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }
    console.log("Buy now with:", { selectedColor, selectedStorage });
    // Add your logic for handling 'Buy Now'
  };

  if (!productData) {
    return (
      <>
        <HomeHeader />
        <div className="container pt-[80px] flex justify-center items-center min-h-[400px]">
          Đang tải thông tin sản phẩm...
        </div>
        <HomeFooter />
      </>
    );
  }

  const { product, attributes } = productData;

  return (
    <>
      <HomeHeader />
      <div className="container pt-[80px]">
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2">
            <div className="sticky top-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center w-full p-4 border rounded-md">
                  <img
                    className="w-[200px] h-auto"
                    src={product.skuImage || "placeholder-image.jpg"}
                    alt={product.skuName}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    onClick={handleAddItemToCart}
                    className="bg-yellow-500 w-[46%] hover:bg-yellow-400 flex gap-2 items-center"
                  >
                    <img className="w-[26px]" src={cartLogo} alt="cart" />
                    THÊM VÀO GIỎ HÀNG
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="bg-orange-500 w-[46%] hover:bg-orange-400 flex gap-2 items-center"
                  >
                    <img className="w-[26px]" src={flashLogo} alt="flash" />
                    MUA NGAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 pb-12">
            <h1 className="text-lg font-medium mb-2">{product.name}</h1>
            <span className="font-semibold text-3xl">
              {formatMoneyVND(
                parseInt(selectedStorage?.price || product.price)
              )}
            </span>

            <div className="flex flex-col gap-6 mt-8">
              {/* Product Specifications */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="font-medium mb-3">Thông số kỹ thuật:</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Màn hình: {product.screenSize}</div>
                  <div>Pin: {product.battery}</div>
                  <div>Camera: {product.camera}</div>
                  <div>CPU: {product.processor}</div>
                  <div>Hệ điều hành: {product.os}</div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="flex flex-col gap-2">
                <p className="font-medium">Màu sắc</p>
                <div className="flex items-center gap-4 flex-wrap">
                  {attributes.Color.map((color) => (
                    <div
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color);
                        fetchStorage(color); // Fetch storage when color is selected
                      }}
                      className={`cursor-pointer px-4 py-2 border-2 rounded-md transition-all ${
                        selectedColor?.id === color.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      {color.value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Selection */}
              <div className="flex flex-col gap-2">
                <p className="font-medium">Dung lượng</p>
                <div className="flex items-center gap-4 flex-wrap">
                  {storageAttributes.map((storage) => (
                    <div
                      key={storage.id}
                      onClick={() => setSelectedStorage(storage)}
                      className={`cursor-pointer px-4 py-2 border-2 rounded-md transition-all ${
                        selectedStorage?.id === storage.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      {storage.value}
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
