import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 100%;
  max-width: 244px;
  flex: 1;
`

interface CommonOutlineSecondaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonOutlineSecondaryButton: React.FC<
  CommonOutlineSecondaryButtonProps
> = ({ children, ...props }) => {
  return (
    <Button className="btn btn-outline btn-secondary" {...props}>
      {children}
    </Button>
  )
}

export default CommonOutlineSecondaryButton
