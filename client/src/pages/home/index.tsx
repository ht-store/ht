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

// Separate Brand Component
const BrandButtons = ({
  brands,
  activeBrand,
  onBrandSelect,
}: {
  brands: BrandType[];
  activeBrand: string;
  onBrandSelect: (brandId: number) => void;
}) => {
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
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState<ProductDataType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const phoneType = searchParams.get("phone_type") || "";
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
          name: phoneType,
          pageSize: 18,
          page: parseInt(page),
        });

        if (rsp.status === HttpStatusCode.Ok) {
          setProducts(rsp.data.data);
          // You might want to update how totalPages is calculated based on your API response
          setTotalPages(totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    handleGetProducts();
  }, [searchParams]);

  const handleBrandSelect = (brandId: number) => {
    navigate(`?${new URLSearchParams({ phone_type: brandId.toString() })}`);
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
            activeBrand={phoneType}
            onBrandSelect={handleBrandSelect}
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
                    phone_type: phoneType,
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
                        phone_type: phoneType,
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
                    phone_type: phoneType,
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
