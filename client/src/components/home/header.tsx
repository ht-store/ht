import { Input } from "../ui/input"
import { Logo } from "./logo"
import cartLogo from '@/assets/svgs/cart.svg';
import profileLogo from '@/assets/svgs/profile.svg';
import phoneLogo from '@/assets/svgs/phone.svg';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const headerListItem = [
  {
    logo: phoneLogo,
    name: 'Gọi mua hàng',
    href: '#'
  },
  {
    logo: cartLogo,
    name: 'Giỏ hàng',
    href: '/cart'
  },
]

export const HomeHeader = () => {
  const { user, reset } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed w-full bg-main z-10">
      <div className="container flex items-center justify-between h-[64px]">
        <div className="relative flex items-center gap-6">
          <Logo className="text-white text-4xl relative -top-1" />
          <Input className="w-[260px] h-[34px] rounded-lg focus-visible:ring-transparent focus-visible:ring-offset-0 border-none" placeholder="Bạn cần tìm gì?" />
        </div>
        <div className="flex">
          {
            headerListItem.map(item => (
              <HeaderItem key={item.href} logo={item.logo} name={item.name} href={item.href} />
            ))
          }
          {
            user ? (
              <DropdownMenu key='/auth/login'>
                <DropdownMenuTrigger className="border-none outline-none ring-0">
                  <HeaderItem
                    logo={profileLogo}
                    name={`${user ? user.name : 'Đăng nhập'}`}
                    href={`${user ? '#' : '/auth/login'}`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { navigate('/payment/history') }}>Lịch sử thanh toán</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { reset(); navigate('/auth/login'); }} className="text-destructive">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <HeaderItem
                key={'/auth/login'}
                logo={profileLogo}
                name='Đăng nhập'
                href='/auth/login'
              />
            )
          }
        </div>
      </div>
    </header>
  )
}

const HeaderItem = ({ logo, name, href }: { logo: string, name: string, href: string }) => {
  return (
    <Link to={href} className="flex flex-col gap-1 items-center px-4 py-2 hover:opacity-80 cursor-pointer">
      <img src={logo} width={30} height={30} />
      <p className="text-xs text-white">{name}</p>
    </Link>
  )
}