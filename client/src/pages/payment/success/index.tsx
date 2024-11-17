import SuccessLogo from '@/assets/svgs/success.svg';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SuccessPaymentPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  }

  return (
    <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-56 h-56 rounded-full bg-green-50"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-green-100"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-green-200"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-green-300"></div>
      </div>
      <div className='relative flex items-center justify-center'>
        <img className='w-[100px] h-[100px]' src={SuccessLogo} />
        <div className='absolute flex flex-col gap-4 top-[180px] w-[400px] text-center font-semibold text-lg'>
          Thanh toán thành công
          <Button onClick={handleGoHome} className='bg-main hover:bg-main hover:opacity-80'>Trang chủ</Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPaymentPage;