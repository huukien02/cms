import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 100%;
  max-width: 244px;
  flex: 1;
`

interface CommonOutlineAccentButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonOutlineAccentButton: React.FC<CommonOutlineAccentButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-outline btn-accent" {...props}>
      {children}
    </Button>
  )
}

export default CommonOutlineAccentButton
