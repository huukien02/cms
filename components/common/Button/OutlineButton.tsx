import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 100%;
  max-width: 244px;
  flex: 1;
`

interface CommonOutlineButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonOutlineButton: React.FC<CommonOutlineButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-outline" {...props}>
      {children}
    </Button>
  )
}

export default CommonOutlineButton
