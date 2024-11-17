import iPhoneLogo from '@/assets/svgs/iphone.svg';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import banner1 from '@/assets/banner/banner1.webp';
import banner2 from '@/assets/banner/banner2.webp';
import banner3 from '@/assets/banner/banner3.webp';
import slide1 from '@/assets/slide/slide1.webp';
import slide2 from '@/assets/slide/slide2.webp';
import slide3 from '@/assets/slide/slide3.webp';
import slide4 from '@/assets/slide/slide4.webp';

const hotPhones = [
  {
    name: 'iPhone 15 Pro Max',
    href: '/iphone-15-pro-max'
  },
  {
    name: 'Galaxy Z Fold6',
    href: '/galaxy-z-fold6'
  },
  {
    name: 'Galaxy Z Flip6',
    href: '/galaxy-z-flip6'
  },
  {
    name: 'Samsung Galaxy A35',
    href: '/samsung-galaxy-a35'
  },
  {
    name: 'Oppo reno12 5G',
    href: '/oppo-reno-12-5g'
  },
  {
    name: 'Oppo reno12 F',
    href: '/oppo-reno12-f'
  },
  {
    name: 'Xiaomi 14',
    href: '/xiaomi'
  },
]

const slides = [slide1, slide2, slide3, slide4]

export const HomeAds = () => {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-4 xl:grid-cols-5 gap-4 pt-[80px]">
      <div className="hidden md:flex flex-col rounded-xl shadow-lg xl:col-span-1">
        {
          hotPhones.map(phone => (
            <Link key={phone.href} to={phone.href} className='flex justify-between items-center p-2 hover:bg-gray-100'>
              <div className='flex items-center gap-3'>
                <img src={iPhoneLogo} width={30} height={30} />
                <span className='text-sm font-medium'>{phone.name}</span>
              </div>
              <ChevronRight size={20} />
            </Link>
          ))
        }
      </div>
      <div className='md:col-span-3 rounded-xl shadow-lg'>
        <Carousel
          opts={{
            loop: true,
            align: "center"
          }}
          className='h-full'
        >
          <CarouselContent className='h-full'>
            {slides.map(item => (
              <CarouselItem key={item} className='flex justify-center items-center'>
                <img src={item} className='w-full h-auto object-contain object-center' />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='ml-16' />
          <CarouselNext className='mr-16' />
        </Carousel>
      </div>
      <div className='hidden md:col-span-1 xl:flex xl:flex-col xl:gap-4'>
        <img src={banner1} className='rounded-md shadow-lg' />
        <img src={banner2} className='rounded-md shadow-lg' />
        <img src={banner3} className='rounded-md shadow-lg' />
      </div>
    </div>
  )
}