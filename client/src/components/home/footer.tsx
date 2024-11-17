export const HomeFooter = () => {
  return (
    <div className="container border-t-[1px] border-gray-200 mt-10 pt-6 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        <div className="flex flex-col">
          <span className="font-medium mb-6">Tổng đài hỗ trợ miễn phí</span>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-mono">Gọi mua hàng 1800.2097 (7h30 - 22h00)</span>
            <span className="text-sm font-mono">Gọi khiếu nại 1800.2063 (8h00 - 21h30)</span>
            <span className="text-sm font-mono">Gọi bảo hành 1800.2064 (8h00 - 21h00)</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium mb-6">Thông tin và chính sách</span>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-mono">Mua hàng và thanh toán Online</span>
            <span className="text-sm font-mono">Mua hàng trả góp Online</span>
            <span className="text-sm font-mono">Mua hàng trả góp bằng thẻ tín dụng</span>
            <span className="text-sm font-mono">Chính sách giao hàng</span>
            <span className="text-sm font-mono">Tra thông tin bảo hành</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium mb-6">Dịch vụ và thông tin khác</span>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-mono">Khách hàng doanh nghiệp (B2B)</span>
            <span className="text-sm font-mono">Ưu đãi thanh toán</span>
            <span className="text-sm font-mono">Quy chế hoạt động</span>
            <span className="text-sm font-mono">Chính sách bảo mật thông tin cá nhân</span>
            <span className="text-sm font-mono">Chính sách Bảo hành</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium mb-6">Kết nối với MPL</span>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-mono">Hệ thống bảo hành sửa chữa Điện thoại</span>
          </div>
        </div>
      </div>
    </div>
  )
}