import { TYPES } from "src/shared/constants";
import {
  IAuthService,
  IBrandService,
  ICartService,
  ICategoryService,
  IProductService,
  ISupplierService,
  IUserService,
  IWarehouseService,
} from "src/shared/interfaces/services";
import {
  IAttributeRepository,
  IBrandRepository,
  ICartItemRepository,
  ICartRepository,
  ICategoryRepository,
  IPriceRepository,
  IProductRepository,
  ISkuAttributeRepository,
  ISkuRepository,
  ISupplierRepository,
  IUserRepository,
  IWarehouseRepository,
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
container;
//   .bind<IInventoryRepository>(INTERFACE_NAME.InventoryRepository)
//   .to(InventoryRepository);
// container
//   .bind<IInventoryService>(INTERFACE_NAME.InventoryService)
//   .to(InventoryService);
// container.bind(INTERFACE_NAME.InventoryController).to(InventoryController);
// container
//   .bind<IStockMovementRepository>(INTERFACE_NAME.StockMovementRepository)
//   .to(StockMovementRepository);
// container
//   .bind<IImportOrderRepository>(INTERFACE_NAME.ImportOrderRepository)
//   .to(ImportOrderRepository);
// container
//   .bind<IImportOrderService>(INTERFACE_NAME.ImportOrderService)
//   .to(ImportOrderService);
// container
//   .bind<IImportOrderItemRepository>(INTERFACE_NAME.ImportOrderItemRepository)
//   .to(ImportOrderItemRepository);
export default container;
