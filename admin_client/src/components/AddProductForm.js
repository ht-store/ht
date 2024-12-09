import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProductForm = ({ onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    name: "",
    brandId: "",
    screenSize: "",
    battery: "",
    camera: "",
    processor: "",
    os: "",
    originalPrice: "",
  });

  const [brands, setBrands] = useState([]);
  const [details, setDetails] = useState([
    {
      storage: "",
      color: "",
      price: "",
      image: "",
    },
  ]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8001/brands");
        setBrands(response.data.data);
      } catch (error) {
        console.error("Không thể lấy dữ liệu thương hiệu:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleDetailChange = (index, name, value) => {
    const newDetails = [...details];
    newDetails[index][name] = value;
    setDetails(newDetails);
  };

  const handleFileChange = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await axios.post(
          "http://localhost:8001/products/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data);
        const uploadedImage = response.data.data.image_url;

        const newDetails = [...details];
        newDetails[index].image = uploadedImage;

        setDetails(newDetails);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  const formatValue = (key, value) => {
    if (key === "battery" && value) {
      return `${value} mAh`;
    }
    if (key === "screenSize" && value) {
      return `${value} inches`;
    }
    return value;
  };

  const addDetail = () => {
    setDetails([
      ...details,
      {
        storage: "",
        color: "",
        price: "",
        image: "",
      },
    ]);
  };

  const removeDetail = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedProduct = {
      ...product,
      battery: product.battery ? `${product.battery} mAh` : "",
      screenSize: product.screenSize ? `${product.screenSize} inches` : "",
    };

    const formattedDetails = details.map((detail, index) => {
      const name = `${product.name} ${detail.storage} ${detail.color}`;
      const slug = `${product.name
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        )}-${detail.storage.toLowerCase()}-${detail.color.toLowerCase()}`;

      const attributes = [
        { attributeId: 2, value: detail.storage },
        { attributeId: 1, value: detail.color },
      ];

      return {
        name,
        slug,
        attributes,
        price: detail.price,
        imageUrl: detail.image,
      };
    });

    const formData = {
      product: formattedProduct,
      details: formattedDetails,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Thêm Sản Phẩm</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Thông tin sản phẩm</h3>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Thương hiệu</label>
          <select
            name="brandId"
            value={product.brandId}
            onChange={handleProductChange}
            className="block w-full p-2 border rounded-md"
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {Object.keys(product).map(
          (key) =>
            key !== "brandId" && (
              <div key={key} className="mb-2">
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key === "screenSize"
                    ? "Kích thước màn hình"
                    : key === "battery"
                    ? "Pin"
                    : key === "name"
                    ? "Tên sản phẩm"
                    : key === "originalPrice"
                    ? "Giá gốc"
                    : key}
                </label>
                <input
                  type={
                    key === "battery" || key === "screenSize"
                      ? "number"
                      : "text"
                  }
                  name={key}
                  placeholder={key}
                  value={product[key]}
                  onChange={handleProductChange}
                  className="block w-full p-2 border rounded-md"
                />
              </div>
            )
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h3>
        {details.map((detail, index) => (
          <div
            key={index}
            className="mb-4 p-4 border rounded-md bg-white flex justify-center "
          >
            <div className="mb-2 w-1/3">
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>
              <div
                onClick={() =>
                  document.getElementById(`fileInput-${index}`).click()
                }
                className="w-full p-6 border border-dashed rounded-md text-center cursor-pointer"
              >
                {detail.image ? (
                  <img
                    src={detail.image}
                    alt="Product Image"
                    className="w-32 h-32 object-cover mx-auto"
                  />
                ) : (
                  <span className="text-gray-500">Chọn hình ảnh</span>
                )}
              </div>
              <input
                id={`fileInput-${index}`}
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Dung lượng
                </label>
                <input
                  type="text"
                  name="storage"
                  placeholder="Dung lượng"
                  value={detail.storage}
                  onChange={(e) =>
                    handleDetailChange(index, "storage", e.target.value)
                  }
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Màu sắc
                </label>
                <input
                  type="text"
                  name="color"
                  placeholder="Màu sắc"
                  value={detail.color}
                  onChange={(e) =>
                    handleDetailChange(index, "color", e.target.value)
                  }
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="text"
                  name="price"
                  placeholder="Giá"
                  value={detail.price}
                  onChange={(e) =>
                    handleDetailChange(index, "price", e.target.value)
                  }
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <button
                type="button"
                onClick={() => removeDetail(index)}
                className="mt-2 text-red-500"
              >
                Xóa chi tiết
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addDetail}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          + Thêm Chi tiết
        </button>
      </div>
      <button
        type="submit"
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md"
      >
        Thêm Sản Phẩm
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        Đóng
      </button>
    </form>
  );
};

export default AddProductForm;
