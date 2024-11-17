export enum OrderStatusEnum {
  PENDING = 'Đang chờ xử lý',
  PROCESSING = 'Đang xử lý',
  ACCEPT = 'Được xác nhận',
  DELIVERED = 'Đang vận chuyển',
  SHIPED = 'Đã giao hàng',
  CANCELLED = 'Đã hủy',
  RETURNED = 'Trả lại',
}

export enum PaymentType {
  ONLINE = 'online',
  CASH = 'Khi nhận hàng'
}