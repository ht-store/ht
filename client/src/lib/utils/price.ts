export const formatMoneyVND = (vnd: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vnd);
}