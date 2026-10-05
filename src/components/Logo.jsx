import { Link } from 'react-router-dom'

export default function Logo({ size = 'md', linkTo, className = '' }) {
  const sizes = {
    sm: { img: 'h-7', text: 'text-lg', sub: 'text-[8px]' },
    md: { img: 'h-9', text: 'text-xl', sub: 'text-[9px]' },
    lg: { img: 'h-14', text: 'text-3xl', sub: 'text-[10px]' },
    xl: { img: 'h-20', text: 'text-5xl', sub: 'text-xs' },
  }
  const s = sizes[size] || sizes.md

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo.png" alt="MediChain" className={`${s.img} w-auto object-contain`} />
    </div>
  )

  if (linkTo) {
    return <Link to={linkTo} className="inline-flex">{content}</Link>
  }
  return content
}
