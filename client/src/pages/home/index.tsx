import { HomeHeader } from "@/components/home/header";
import { HomeAds } from "./ads";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductItem } from "@/components/product/item";
import { HomeFooter } from "@/components/home/footer";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/product";
import { getBrands } from "@/services/brand";
import { HttpStatusCode } from "axios";
import { v4 as uuid } from "uuid";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

// Types
export type SkuType = {
  id: number;
  productId: number;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type PriceType = {
  id: number;
  skuId: number;
  price: string;
  effectiveDate: string;
  activate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductDataType = {
  skus: SkuType;
  prices: PriceType | null;
};

export type BrandType = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// Brand Component
const BrandButtons = ({
  brands,
  activeBrand,
  onBrandSelect,
  onSearch,
}: {
  brands: BrandType[];
  activeBrand: string;
  onBrandSelect: (brandId: number) => void;
  onSearch: (searchTerm: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-xl font-bold">ĐIỆN THOẠI NỔI BẬT NHẤT</span>
      <div className="flex gap-4">
        {brands.map((brand) => (
          <Button
            key={brand.id}
            variant={activeBrand === brand.name ? "default" : "outline"}
            onClick={() => onBrandSelect(brand.id)}
            className="capitalize"
          >
            {brand.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          className="w-[400px] h-[34px] rounded-lg focus-visible:ring-transparent focus-visible:ring-offset-0 border-none"
          placeholder="Bạn cần tìm gì?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          className="h-[34px] px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleSearchClick}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState<ProductDataType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const brandId = searchParams.get("brandId") || "";
  const searchTerm = searchParams.get("search") || "";
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrands();
        if (response.data.success) {
          setBrands(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  // Fetch products
  useEffect(() => {
    const handleGetProducts = async () => {
      try {
        const rsp = await getProducts({
          name: searchTerm,
          pageSize: 18,
          page: parseInt(page),
          brandId: brandId ? parseInt(brandId) : undefined,
        });

        if (rsp.status === HttpStatusCode.Ok) {
          setProducts(rsp.data.data);
          setTotalPages(rsp.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    handleGetProducts();
  }, [searchParams]);

  const handleBrandSelect = (selectedBrandId: number) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("brandId", selectedBrandId.toString());
      newParams.set("search", searchTerm);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleSearch = (search: string) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("brandId", brandId);
      newParams.set("search", search);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const getProductPrice = (product: ProductDataType) => {
    return product.prices ? parseFloat(product.prices.price) : 0;
  };

  return (
    <>
      <HomeHeader />
      <HomeAds />
      <div className="container pt-10">
        <div className="flex flex-col justify-center gap-4">
          {/* Brand Selection */}
          <BrandButtons
            brands={brands}
            activeBrand={brandId}
            onBrandSelect={handleBrandSelect}
            onSearch={handleSearch}
          />

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductItem
                key={`${product.skus.id}-${uuid()}`}
                product={{
                  productId: product.skus.productId.toString(),
                  skuId: product.skus.id.toString(),
                  name: product.skus.name,
                  image: product.skus.image,
                  price: getProductPrice(product),
                  slug: product.skus.slug,
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={`${parseInt(page) <= 1 ? "hidden" : ""}`}
                  href={`?${new URLSearchParams({
                    page: String(parseInt(page) - 1),
                    brandId: brandId,
                    search: searchTerm,
                  })}`}
                />
              </PaginationItem>
              {[-3, -2, -1, 0, 1, 2, 3].map((e) => {
                const curPage = parseInt(page);
                if (curPage + e < 1 || curPage + e > totalPages) return null;
                return (
                  <PaginationItem
                    key={e}
                    className={`${e === 0 ? "text-main" : ""}`}
                  >
                    <PaginationLink
                      href={`?${new URLSearchParams({
                        page: String(curPage + e),
                        brandId: brandId,
                        search: searchTerm,
                      })}`}
                    >
                      {curPage + e}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext

                  className={`${parseInt(page) >= totalPages ? "hidden" : ""}`}
                  href={`?${new URLSearchParams({
                    page: String(parseInt(page) + 1),
                    brandId: brandId,
                    search: searchTerm,
                  })}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default HomePage;
