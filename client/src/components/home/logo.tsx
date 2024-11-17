import { useNavigate } from "react-router-dom"

export const Logo = (props?: { className?: string, shopText?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate('/')} className={props?.className + ' cursor-pointer font-bold text-xl text-main tracking-widest flex items-center'}>
      MPL {props?.shopText && ' Shop'}
    </div>
  )
}