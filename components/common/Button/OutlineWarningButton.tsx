import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  width: 100%;
  max-width: 244px;
  flex: 1;
`

interface CommonOutlineWarningButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const CommonOutlineWarningButton: React.FC<CommonOutlineWarningButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button className="btn btn-outline btn-warning" {...props}>
      {children}
    </Button>
  )
}

export default CommonOutlineWarningButton
