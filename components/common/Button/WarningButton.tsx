import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 244px;
`

interface CommonWarningButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonWarningButton: React.FC<CommonWarningButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-warning" {...props}>
      {children}
    </Button>
  )
}

export default CommonWarningButton
