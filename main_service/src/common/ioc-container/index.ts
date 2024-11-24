import { TYPES } from "src/shared/constants";
import {
  IAuthService,
  IBrandService,
  ICartService,
  ICategoryService,
  IImportOrderService,
  IOrderService,
  IProductService,
  ISupplierService,
  IUserService,
  IWarehouseService,
  IWarrantyService,
} from "src/shared/interfaces/services";
import {
  IUserRepository,
  IAttributeRepository,
  IBrandRepository,
  ICartItemRepository,
  ICartRepository,
  ICategoryRepository,
  IImportOrderItemRepository,
  IImportOrderRepository,
  IInventoryRepository,
  IOrderItemRepository,
  IOrderRepository,
  IPriceRepository,
  IProductRepository,
  IProductSerialRepository,
  ISkuAttributeRepository,
  ISkuRepository,
  IStockMovementRepository,
  ISupplierRepository,
  IWarehouseRepository,
  IWarrantyRepository,
  IWarrantyClaimRepository,
  IWarrantyClaimCostRepository,
  IProductSellWarrantyRepository,
} from "src/shared/interfaces/repositories";
import { Container } from "inversify";
import { UserController, UserRepository, UserService } from "src/modules/user";
import { AuthController, AuthService } from "src/modules/auth";
import {
  BrandController,
  BrandRepository,
  BrandService,
} from "src/modules/brand";
import {
  CategoryController,
  CategoryRepository,
  CategoryService,
} from "src/modules/category";
import {
  AttributeRepository,
  PriceRepository,
  ProductRepository,
  SkuAttributeRepository,
  SkuRepository,
} from "src/modules/product/repositories";
import { ProductController, ProductService } from "src/modules/product";
import {
  CartController,
  CartItemRepository,
  CartRepository,
  CartService,
} from "src/modules/cart";
import {
  WarehouseController,
  WarehouseRepository,
  WarehouseService,
} from "src/modules/warehouse";
import {
  SupplierController,
  SupplierRepository,
  SupplierService,
} from "src/modules/supplier";
import {
  ImportOrderController,
  ImportOrderItemRepository,
  ImportOrderRepository,
  ImportOrderService,
  InventoryRepository,
  ProductSerialRepository,
  StockMovementRepository,
} from "src/modules/import-order";
import {
  OrderController,
  OrderItemRepository,
  OrderRepository,
  OrderService,
} from "src/modules/order";
import {
  ProductSellWarrantyRepository,
  WarrantyClaimCostRepository,
  WarrantyClaimRepository,
  WarrantyController,
  WarrantyRepository,
  WarrantyService,
} from "src/modules/warranty";

const container = new Container();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind(TYPES.UserController).to(UserController);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind(TYPES.AuthController).to(AuthController);
container.bind<IBrandRepository>(TYPES.BrandRepository).to(BrandRepository);
container.bind<IBrandService>(TYPES.BrandService).to(BrandService);
container.bind(TYPES.BrandController).to(BrandController);
container
  .bind<ICategoryRepository>(TYPES.CategoryRepository)
  .to(CategoryRepository);
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind(TYPES.CategoryController).to(CategoryController);
// container
//   .bind<IRoleRepository>(INTERFACE_NAME.RoleRepository)
//   .to(RoleRepository);
// container.bind<IRoleService>(INTERFACE_NAME.RoleService).to(RoleService);
// container.bind(INTERFACE_NAME.RoleController).to(RoleController);
container
  .bind<IProductRepository>(TYPES.ProductRepository)
  .to(ProductRepository);
container.bind<IProductService>(TYPES.ProductService).to(ProductService);
container.bind(TYPES.ProductController).to(ProductController);
container.bind<ISkuRepository>(TYPES.SkuRepository).to(SkuRepository);
container
  .bind<IAttributeRepository>(TYPES.AttributeRepository)
  .to(AttributeRepository);
container
  .bind<ISkuAttributeRepository>(TYPES.SkuAttributeRepository)
  .to(SkuAttributeRepository);
container.bind<IPriceRepository>(TYPES.PriceRepository).to(PriceRepository);
container
  .bind<IWarehouseRepository>(TYPES.WarehouseRepository)
  .to(WarehouseRepository);
container.bind<IWarehouseService>(TYPES.WarehouseService).to(WarehouseService);
container.bind(TYPES.WarehouseController).to(WarehouseController);
container
  .bind<ISupplierRepository>(TYPES.SupplierRepository)
  .to(SupplierRepository);
container.bind<ISupplierService>(TYPES.SupplierService).to(SupplierService);
container.bind(TYPES.SupplierController).to(SupplierController);
container.bind<ICartRepository>(TYPES.CartRepository).to(CartRepository);
container.bind<ICartService>(TYPES.CartService).to(CartService);
container.bind(TYPES.CartController).to(CartController);
container
  .bind<ICartItemRepository>(TYPES.CartItemRepository)
  .to(CartItemRepository);
container
  .bind<IProductSerialRepository>(TYPES.ProductSerialRepository)
  .to(ProductSerialRepository);
container
  .bind<IInventoryRepository>(TYPES.InventoryRepository)
  .to(InventoryRepository);
container
  .bind<IStockMovementRepository>(TYPES.StockMovementRepository)
  .to(StockMovementRepository);
container
  .bind<IImportOrderItemRepository>(TYPES.ImportOrderItemRepository)
  .to(ImportOrderItemRepository);
container
  .bind<IImportOrderRepository>(TYPES.ImportOrderRepository)
  .to(ImportOrderRepository);
container
  .bind<IImportOrderService>(TYPES.ImportOrderService)
  .to(ImportOrderService);
container.bind(TYPES.ImportOrderController).to(ImportOrderController);
container
  .bind<IOrderItemRepository>(TYPES.OrderItemRepository)
  .to(OrderItemRepository);
container.bind<IOrderRepository>(TYPES.OrderRepository).to(OrderRepository);
container.bind<IOrderService>(TYPES.OrderService).to(OrderService);
container.bind(TYPES.OrderController).to(OrderController);
container
  .bind<IWarrantyClaimRepository>(TYPES.WarrantyClaimRepository)
  .to(WarrantyClaimRepository);
container
  .bind<IWarrantyRepository>(TYPES.WarrantyRepository)
  .to(WarrantyRepository);
container
  .bind<IWarrantyClaimCostRepository>(TYPES.WarrantyClaimCostRepository)
  .to(WarrantyClaimCostRepository);
container
  .bind<IProductSellWarrantyRepository>(TYPES.ProductSellWarrantyRepository)
  .to(ProductSellWarrantyRepository);
container.bind<IWarrantyService>(TYPES.WarrantyService).to(WarrantyService);
container.bind(TYPES.WarrantyController).to(WarrantyController);
export default container;
