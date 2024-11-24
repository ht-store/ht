export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

export const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  UserService: Symbol.for("UserService"),
  UserController: Symbol.for("UserController"),
  RoleRepository: Symbol.for("RoleRepository"),
  RoleService: Symbol.for("RoleService"),
  RoleController: Symbol.for("RoleController"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  ProductRepository: Symbol.for("ProductRepository"),
  ProductService: Symbol.for("ProductService"),
  ProductController: Symbol.for("ProductController"),
  BrandRepository: Symbol.for("BrandRepository"),
  BrandService: Symbol.for("BrandService"),
  BrandController: Symbol.for("BrandController"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  CategoryService: Symbol.for("CategoryService"),
  CategoryController: Symbol.for("CategoryController"),
  CartRepository: Symbol.for("CartRepository"),
  CartService: Symbol.for("CartService"),
  CartController: Symbol.for("CartController"),
  CartItemRepository: Symbol.for("CartItemRepository"),
  CartItemService: Symbol.for("CartItemService"),
  CartItemController: Symbol.for("CartItemController"),
  OrderRepository: Symbol.for("OrderRepository"),
  OrderService: Symbol.for("OrderService"),
  OrderController: Symbol.for("OrderController"),
  OrderItemRepository: Symbol.for("OrderItemRepository"),
  OrderDetailService: Symbol.for("OrderDetailService"),
  SkuRepository: Symbol.for("SkuRepository"),
  AttributeRepository: Symbol.for("AttributeRepository"),
  SkuAttributeRepository: Symbol.for("SkuAttributeRepository"),
  PriceRepository: Symbol.for("PriceRepository"),
  SupplierRepository: Symbol.for("SupplierRepository"),
  SupplierService: Symbol.for("SupplierService"),
  SupplierController: Symbol.for("SupplierController"),
  WarehouseRepository: Symbol.for("WarehouseRepository"),
  WarehouseService: Symbol.for("WarehouseService"),
  WarehouseController: Symbol.for("WarehouseController"),
  WarrantyRepository: Symbol.for("WarrantyRepository"),
  ProductSellWarrantyRepository: Symbol.for("ProductSellWarrantyRepository"),
  WarrantyClaimRepository: Symbol.for("WarrantyClaimRepository"),
  WarrantyClaimCostRepository: Symbol.for("WarrantyClaimCostRepository"),
  WarrantyService: Symbol.for("WarrantyService"),
  WarrantyController: Symbol.for("WarrantyController"),
  InventoryRepository: Symbol.for("InventoryRepository"),
  InventoryService: Symbol.for("InventoryService"),
  InventoryController: Symbol.for("InventoryController"),
  ImportOrderRepository: Symbol.for("ImportOrderRepository"),
  ImportOrderItemRepository: Symbol.for("ImportOrderItemRepository"),
  StockMovementRepository: Symbol.for("StockMovementRepository"),
  ProductSerialRepository: Symbol.for("ProductSerialRepository"),
  ImportOrderService: Symbol.for("ImportOrderService"),
  ImportOrderController: Symbol.for("ImportOrderController"),
  ProductSerialService: Symbol.for("ProductSerialService"),
  ProductSerialController: Symbol.for("ProductSerialController"),
};
