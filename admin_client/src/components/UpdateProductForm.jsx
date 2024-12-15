import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const UpdateProductForm = ({ initialProduct, onSubmit, onClose }) => {
  console.log(initialProduct);
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };
  const [sku, setSku] = useState({
    id: initialProduct.id,
    name: initialProduct.name,
    image: initialProduct.image || "",
    slug: initialProduct.slug,
    color:
      initialProduct.name.split(" ")[
        initialProduct.name.split(" ").length - 1
      ] || "",
    storage:
      initialProduct.name.split(" ")[
        initialProduct.name.split(" ").length - 2
      ] || "",
    productId: initialProduct.productId,
    price: initialProduct.price,
  });

  const [productDetails, setProductDetails] = useState(initialProduct.details);
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8001/brands");
      setBrands(response.data.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("images", file);
      const response = await axios.post(
        "http://localhost:8001/products/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const uploadedImage = response.data.data.image_url;
      setSku((prevSku) => ({
        ...prevSku,
        image: uploadedImage,
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleProductDetailsChange = (field, value) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));

    if (field === "name") {
      setSku((prevSku) => ({
        ...prevSku,
        name: `${value} ${prevSku.storage || ""} ${prevSku.color || ""}`.trim(),
      }));
    }
  };

  const handleSkuChange = (field, value) => {
    setSku((prevSku) => {
      const updatedSku = { ...prevSku, [field]: value };

      if (field === "color" || field === "storage") {
        updatedSku.name = `${productDetails.name} ${updatedSku.storage || ""} ${
          updatedSku.color || ""
        }`.trim();
        updatedSku.slug = updatedSku.name.toLowerCase().replace(/\s+/g, "-");
      }

      return updatedSku;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      product: {
        name: productDetails.name,
        brandId: productDetails.brandId,
        categoryId: productDetails.categoryId,
        screenSize: productDetails.screenSize,
        battery: productDetails.battery,
        camera: productDetails.camera,
        processor: productDetails.processor,
        os: productDetails.os,
        image: productDetails.image,
        originalPrice: productDetails.originalPrice,
      },
      details: [
        {
          name: sku.name,
          slug: sku.slug,
          image: sku.image,
          attributes: [
            { attributeId: 2, value: sku.storage },
            { attributeId: 1, value: sku.color },
          ],
          price: sku.price,
        },
      ],
    };
    console.log(formattedData);
    onSubmit(formattedData, initialProduct.productId, initialProduct.id);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="p-5  bg-white rounded-lg shadow-lg w-full max-w-5xl"
      >
        <h2 className="text-2xl font-bold text-gray-800">Cập nhật sản phẩm</h2>

        <div className="flex justify-around items-center gap-2">
          <div className=" border border-gray-200 rounded-md w-1/2 p-3 ">
            <h3 className="text-xl font-semibold text-gray-700 py-2">
              Cập nhật Sku
            </h3>

            <div className="flex flex-wrap gap-2 ">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Tên Sku:
                </label>
                <input
                  type="text"
                  value={sku.name}
                  readOnly
                  className="input-field w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Màu sắc:
                </label>
                <input
                  type="text"
                  value={sku.color}
                  onChange={(e) => handleSkuChange("color", e.target.value)}
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Dung lượng:
                </label>
                <input
                  type="text"
                  value={sku.storage}
                  onChange={(e) => handleSkuChange("storage", e.target.value)}
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Giá:
                </label>
                <input
                  type="text"
                  value={sku.price}
                  onChange={(e) => handleSkuChange("price", e.target.value)}
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Chọn ảnh:
                </label>
                <div
                  onClick={handleDivClick}
                  className="border-2 border-dashed border-gray-300 p-4 rounded-md cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => uploadImage(e.target.files[0])}
                    className="hidden"
                  />
                  {!sku.image && (
                    <p className="text-gray-500 text-sm">Nhấn để chọn ảnh</p>
                  )}
                  {sku.image && (
                    <div className="mt-2">
                      <img
                        src={sku.image}
                        alt="Uploaded SKU"
                        className="w-20 h-20 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-md w-1/2">
            <h3 className="text-xl font-semibold text-gray-700 py-2">
              Thông tin sản phẩm
            </h3>

            <div className="flex flex-wrap gap-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Tên sản phẩm:
                </label>
                <input
                  type="text"
                  value={productDetails.name}
                  onChange={(e) =>
                    handleProductDetailsChange("name", e.target.value)
                  }
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Thương hiệu:
                </label>
                <select
                  value={productDetails.brandId}
                  onChange={(e) =>
                    handleProductDetailsChange("brandId", e.target.value)
                  }
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Pin:
                </label>
                <input
                  type="text"
                  value={productDetails.battery}
                  onChange={(e) =>
                    handleProductDetailsChange("battery", e.target.value)
                  }
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Camera:
                </label>
                <input
                  type="text"
                  value={productDetails.camera}
                  onChange={(e) =>
                    handleProductDetailsChange("camera", e.target.value)
                  }
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Operating System (OS):
                </label>
                <input
                  type="text"
                  value={productDetails.os}
                  onChange={(e) =>
                    handleProductDetailsChange("os", e.target.value)
                  }
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Processor:
                </label>
                <input
                  type="text"
                  value={productDetails.processor}
                  onChange={(e) =>
                    handleProductDetailsChange("processor", e.target.value)
                  }
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Kích thước màn hình:
                </label>
                <input
                  type="text"
                  value={productDetails.screenSize}
                  onChange={(e) =>
                    handleProductDetailsChange("screenSize", e.target.value)
                  }
                  className="input-field w-full p-3 border border-gray-300 rounded-md text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Đóng
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
