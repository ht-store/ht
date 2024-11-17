import { z, TypeOf } from "zod";
import { idParamsSchema } from "./userDto"; // Schema cho idParams

// Schema định nghĩa dữ liệu cho phần thân yêu cầu (body)
const cartBodySchema = z.object({
  customerId: z.number({
    required_error: "customerId is required",
  }),
  status: z.enum(["active", "inactive", "expired", "saved"], {
    required_error: "Cart status is required",
  }),
});

// Schema cho tạo giỏ hàng
export const createCartSchema = z.object({
  body: cartBodySchema,
});

// Định nghĩa kiểu dữ liệu cho DTO tạo giỏ hàng
export type CreateCartDto = TypeOf<typeof createCartSchema>["body"];

// Schema cho cập nhật giỏ hàng
export const updateCartSchema = z.object({
  params: idParamsSchema, // Xác nhận rằng `params` chứa `id` hợp lệ
  body: cartBodySchema.partial(), // Cho phép các trường trong body là tùy chọn
});

// Định nghĩa kiểu dữ liệu cho DTO cập nhật giỏ hàng
export type UpdateCartDto = TypeOf<typeof updateCartSchema>["body"];

export const addItemSchema = z.object({
  cartId: z.number({ required_error: "userId is required" }),
  skuId: z.number({ required_error: "skuId is required" }),
  quantity: z
    .number({ required_error: "quantity is required" })
    .min(1, "Quantity must be at least 1"),
});

export type AddItemDto = TypeOf<typeof addItemSchema>;
