import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import MobileShop from '@/assets/mobile-shop.png';

const AuthLayout = () => {
  return (
    <div className='w-full flex items-center justify-center gap-10 h-screen overflow-hidden'>
      <div className='hidden overflow-hidden lg:flex flex-col justify-center items-center'>
        <div className='flex flex-col gap-4 max-w-[300px]'>
          <span className='text-6xl font-bold'>Welcome<br /> to MPL</span>
          <span className='text-sm text-gray-600 mt-6'>MPL is here to streamline your online experience, let's get started!</span>
          <img src={MobileShop} className='w-[200px] h-auto object-contain object-center justify-self-start	' />
        </div>
      </div>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AuthLayout;
