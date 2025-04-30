interface ButtonProps {
  w?: string
  h?: string
  color?: string
  borderColor?: string
  bg?: string
  disabled?: boolean
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export default function Button({
  w = 'w-[64px]',
  h = 'h-[40px]',
  color = 'text-black',
  borderColor = 'border-black',
  bg = 'bg-transparent',
  type = 'button',
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`rounded-[8px] border px-[10px] text-[14px] font-[600] ${w} ${h} ${color} ${borderColor} ${bg}`}
    >
      {children}
    </button>
  )
}
