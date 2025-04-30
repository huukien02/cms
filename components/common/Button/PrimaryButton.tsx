import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 244px;
  // height: 44px;
  &:disabled {
    // background-color: #a3bcfd;
  }
`

interface CommonPrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonPrimaryButton: React.FC<CommonPrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-block btn-primary" {...props}>
      {children}
    </Button>
  )
}

export default CommonPrimaryButton
