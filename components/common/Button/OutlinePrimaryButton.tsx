import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 100%;
  max-width: 244px;
  flex: 1;
`

interface CommonOutlinePrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonOutlinePrimaryButton: React.FC<CommonOutlinePrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-block btn-outline btn-primary" {...props}>
      {children}
    </Button>
  )
}

export default CommonOutlinePrimaryButton
