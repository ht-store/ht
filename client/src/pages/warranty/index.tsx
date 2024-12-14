import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HomeHeader } from '@/components/home/header';
import { getWarranty, WarrantyResponse } from '@/services/warranty';
import { HttpStatusCode } from 'axios';

const WarrantyPage = () => {
  const navigate = useNavigate();
  const [warrantyCode, setWarrantyCode] = useState('');
  const [error, setError] = useState('');
  const [warrantyData, setWarrantyData] = useState<WarrantyResponse | null>(null);

  const handleSearch = async () => {
    if (!warrantyCode.trim()) {
      setError('Mã số bảo hành không được để trống.');
      return;
    }

    try {
      setError(''); // Clear previous error
      const response = await getWarranty(+warrantyCode);
      console.log(response.status)
      if (!response.data || response.status !== HttpStatusCode.Ok) {
        throw new Error('Không tìm thấy thông tin đơn bảo hành.');
      }

      setWarrantyData(response.data);
    } catch (err: any ) {
      setError('Không tìm thấy thông tin đơn bảo hành.');
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
        <div className="relative flex flex-col items-center justify-center gap-6">
          <div className="w-[400px] text-center font-semibold text-lg">
            Tìm kiếm thông tin đơn bảo hành
          </div>
          <div className="flex flex-col gap-4 w-[400px]">
            <input
              type="text"
              placeholder="Nhập mã số bảo hành"
              value={warrantyCode}
              onChange={(e) => setWarrantyCode(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSearch}
              className="bg-main hover:bg-main hover:opacity-80 w-full px-4 py-2 text-white rounded"
            >
              Tìm kiếm
            </button>
          </div>
          {warrantyData && (
            <div className="mt-6 w-[400px] p-4 border rounded-md bg-white shadow">
              <h3 className="font-semibold text-lg mb-2">Thông tin đơn bảo hành</h3>
              <p><strong>ID:</strong> {warrantyData.id}</p>
              <p><strong>Mã bảo hành:</strong> {warrantyData.productWarrantyId}</p>
              <p><strong>Ngày yêu cầu:</strong> {new Date(warrantyData.claimDate).toLocaleString()}</p>
              <p><strong>Mô tả vấn đề:</strong> {warrantyData.issueDescription}</p>
              <p><strong>Trạng thái:</strong> {warrantyData.claimStatus}</p>
              <p><strong>Chi phí linh kiện:</strong> {warrantyData.partsCost} VND</p>
              <p><strong>Chi phí sửa chữa:</strong> {warrantyData.repairCost} VND</p>
              <p><strong>Chi phí vận chuyển:</strong> {warrantyData.shippingCost} VND</p>
              <p><strong>Tổng chi phí:</strong> {warrantyData.totalCost} VND</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WarrantyPage;
