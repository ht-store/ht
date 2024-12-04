import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { HomeFooter } from "@/components/home/footer";
import { HomeHeader } from "@/components/home/header";
import { Input } from "@/components/ui/input";
import { getProductItems } from "@/services/product";
import { formatMoneyVND } from "@/lib/utils/price";
import { Slider } from "@/components/ui/slider";

interface Price {
  id: number;
  skuId: number;
  price: string;
  effectiveDate: string;
  activate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Sku {
  id: number;
  productId: number;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  skus: Sku;
  prices: Price;
}

interface ProductProps {
  product: ProductItem;
}

const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"] as const;
const DEFAULT_PRICE_RANGE: [number, number] = [0, 100000000];

const FilterButton = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    className={`px-3 py-1 border rounded ${
      isSelected ? "bg-blue-500 text-white" : ""
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const Product = ({ product }: ProductProps) => {
  const nameParts = product.skus.name.split(" ");
  const storage = nameParts.at(-2) ?? "";
  const color = nameParts.at(-1) ?? "";
  const baseName = nameParts.slice(0, -2).join(" ");

  return (
    <Link
      to={`/mobile/${product.skus.productId}/${product.skus.id}`}
      className="grid grid-cols-6 border-b-[1px] pb-8 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="col-span-2 md:col-span-1 flex items-center justify-center p-2">
        <img
          className="h-[200px] object-contain"
          src={product.skus.image || "/api/placeholder/200/200"}
          alt={product.skus.name}
          // onError={(e) => {
          //   (e.target as HTMLImageElement).src = "/api/placeholder/200/200";
          // }}
        />
      </div>
      <div className="col-span-4 md:col-span-3 p-2">
        <h2 className="text-lg font-semibold mb-2">
          {`${baseName} (${color}, ${storage})`}
        </h2>
        <div className="flex flex-col gap-1 px-2">
          <div className="flex gap-1 text-gray-800 items-center">
            <span className="pr-2">•</span>
            <span className="text-sm">Giao hàng miễn phí toàn quốc</span>
          </div>
        </div>
      </div>
      <div className="col-span-6 md:col-span-2 flex flex-col gap-1 p-2">
        <span className="text-2xl font-bold">
          {formatMoneyVND(Number(product.prices?.price) || 0)}
        </span>
        <span className="text-xs text-gray-700">Giao hàng miễn phí</span>
        {product.prices.activate && (
          <span className="text-xs text-purple-500 font-semibold">
            Ưu đãi tiết kiệm
          </span>
        )}
      </div>
    </Link>
  );
};

const MobilesPage = () => {
  const { productId } = useParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceRange, setPriceRange] =
    useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productId) {
        setError("Product ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProductItems(productId);
        const productData = response.data.data;

        if (!Array.isArray(productData)) {
          throw new Error("Invalid data format received");
        }

        setProducts(productData);
        setFilteredProducts(productData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = products.filter((product) => {
        const price = Number(product.prices.price) || 0;
        const [minPrice, maxPrice] = priceRange;

        const matchesPrice = price >= minPrice && price <= maxPrice;

        const matchesStorage =
          selectedStorages.length === 0 ||
          selectedStorages.some((storage) =>
            product.skus.name.toLowerCase().includes(storage.toLowerCase())
          );

        return matchesPrice && matchesStorage;
      });

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [products, priceRange, selectedStorages]);

  const toggleFilter = (
    value: string,
    currentFilters: string[],
    setFilter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setFilter(
      currentFilters.includes(value)
        ? currentFilters.filter((item) => item !== value)
        : [...currentFilters, value]
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <HomeHeader />
      <div className="pt-[70px] bg-gray-200 px-2 pb-2 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {/* Filter Section */}
          <div className="hidden md:block md:col-span-1 bg-white rounded-md">
            <h3 className="text-lg font-semibold border-b-[1px] px-2 py-3">
              Bộ lọc
            </h3>

            {/* Price Filter */}
            <div className="px-4 py-4">
              <span className="font-semibold text-xs">GIÁ</span>
              <div className="px-4 py-2">
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={100000000}
                  min={0}
                  step={100000}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(value: number[]) => {
                    setPriceRange([value[0], value[1]]);
                  }}
                />
              </div>
              <div className="px-4 py-2 flex gap-4 items-center">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setPriceRange([value, Math.max(value, priceRange[1])]);
                  }}
                  className="focus-visible:ring-transparent h-[30px]"
                />
                <span>đến</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setPriceRange([Math.min(priceRange[0], value), value]);
                  }}
                  className="focus-visible:ring-transparent h-[30px]"
                />
              </div>
            </div>

            {/* Storage Filter */}
            <div className="px-4 py-4">
              <span className="font-semibold text-xs">LƯU TRỮ</span>
              <div className="px-4 py-2 flex flex-wrap gap-2">
                {STORAGE_OPTIONS.map((storage) => (
                  <FilterButton
                    key={storage}
                    label={storage}
                    isSelected={selectedStorages.includes(storage)}
                    onClick={() =>
                      toggleFilter(
                        storage,
                        selectedStorages,
                        setSelectedStorages
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="col-span-1 md:col-span-4 bg-white p-4 rounded-md">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Product
                  key={`${product.skus.id}-${product.prices.id}`}
                  product={product}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy sản phẩm
              </div>
            )}
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default MobilesPage;
